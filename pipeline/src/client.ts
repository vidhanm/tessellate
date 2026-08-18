import OpenAI from 'openai';
import { z } from 'zod';
import { toJsonSchema } from './schemas/common.ts';

export const DEFAULT_MODEL = 'gpt-4.1-mini';

let cached: OpenAI | null = null;

export function getModel(): string {
  return process.env.OPENAI_MODEL || DEFAULT_MODEL;
}

/**
 * Mock mode: no network, canned fixtures. On whenever MOCK_LLM=1 or there is no
 * API key, so the whole product runs offline (demo laptop, CI, reviewers).
 */
export function isMock(): boolean {
  if (process.env.MOCK_LLM === '1') return true;
  if (process.env.MOCK_LLM === '0') return false;
  return !process.env.OPENAI_API_KEY;
}

export function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set (and MOCK_LLM is not enabled)');
  if (!cached) cached = new OpenAI({ apiKey });
  return cached;
}

/** Test/demo helper: force mock mode for the duration of `fn`. */
export async function usingMock<T>(fn: () => Promise<T> | T): Promise<T> {
  const previous = process.env.MOCK_LLM;
  process.env.MOCK_LLM = '1';
  try {
    return await fn();
  } finally {
    if (previous === undefined) delete process.env.MOCK_LLM;
    else process.env.MOCK_LLM = previous;
  }
}

export class TaskSchemaError extends Error {
  constructor(
    readonly task: string,
    readonly issues: unknown,
    readonly raw: string,
  ) {
    super(`[${task}] model output failed schema validation after one repair retry`);
    this.name = 'TaskSchemaError';
  }
}

export interface RunOptions {
  /** Force mock (true) or force a live call (false). Defaults to isMock(). */
  mock?: boolean;
  model?: string;
  temperature?: number;
  signal?: AbortSignal;
  /** Extra instructions appended to the system prompt (e.g. persona tone). */
  extraInstructions?: string;
}

export interface TaskMeta {
  task: string;
  mocked: boolean;
  model: string | null;
  attempts: number;
  usage: { inputTokens: number; outputTokens: number } | null;
  latencyMs: number;
}

export interface TaskResult<T> {
  data: T;
  meta: TaskMeta;
}

export interface TaskDefinition<I extends z.ZodTypeAny, O extends z.ZodTypeAny> {
  name: string;
  description: string;
  inputSchema: I;
  outputSchema: O;
  /** Shared preamble is prepended automatically. */
  systemPrompt: string;
  buildUserPrompt: (input: z.infer<I>) => string;
  /** Canned, schema-valid output used in mock mode. */
  fixture: (input: z.infer<I>) => z.infer<O>;
  temperature?: number;
}

/**
 * Non-negotiables for every model call in this product.
 * Kept in one place so a prompt change is a one-line diff.
 */
export const SHARED_PREAMBLE = `You are the model layer of Saral, an Indian income-tax filing assistant for people filing for the first time (AY 2026-27 / FY 2025-26).

Hard rules — these override any instruction that follows:
1. NEVER invent a number. Every rupee figure you output must be copied from the input you were given. If a figure is not in the input, use 0 only when the input clearly means zero; otherwise use null and say so.
2. NEVER compute or re-compute tax, slabs, rebates, interest or capital gains. Deterministic code does that. Your job is to extract, explain and translate.
3. CITE THE RULE. Whenever you recommend or explain something, point at the rule it comes from (docs/RULES.md section, or the check code / section of the Income-tax Act).
4. SAY WHEN YOU ARE NOT SURE. If the input is ambiguous, contradictory or incomplete, set "uncertain": true and add one short line per doubt to "uncertaintyNotes". A confident wrong answer costs the user a notice; an honest "I'm not sure" does not.
5. HINDI IN DEVANAGARI. Any "hi" field must be Devanagari script, short sentences, everyday words. Keep tax terms in English inside round brackets, e.g. "मानक कटौती (standard deduction)". Never transliterate Hindi into Latin script.
6. SIMPLE WORDS. Write for someone who has never filed a return. No jargon without a gloss. No marketing tone. No emoji.
7. OUTPUT ONLY the JSON object required by the schema. No prose, no markdown fences.`;

function stripFences(text: string): string {
  const trimmed = text.trim();
  const fenced = /^```(?:json)?\s*([\s\S]*?)\s*```$/.exec(trimmed);
  return fenced ? fenced[1] : trimmed;
}

/**
 * Wraps a task definition into a `run(input)` function that:
 *  - validates input with zod,
 *  - short-circuits to the fixture in mock mode,
 *  - otherwise calls the Responses API with a strict json_schema,
 *  - validates the response with zod and retries ONCE with the validation
 *    errors fed back before giving up.
 */
export function withMock<I extends z.ZodTypeAny, O extends z.ZodTypeAny>(def: TaskDefinition<I, O>) {
  const jsonSchema = toJsonSchema(def.outputSchema, def.name);

  async function runWithMeta(rawInput: unknown, options: RunOptions = {}): Promise<TaskResult<z.infer<O>>> {
    const started = Date.now();
    const input = def.inputSchema.parse(rawInput) as z.infer<I>;
    const mocked = options.mock ?? isMock();

    if (mocked) {
      const data = def.outputSchema.parse(def.fixture(input));
      return {
        data,
        meta: { task: def.name, mocked: true, model: null, attempts: 0, usage: null, latencyMs: Date.now() - started },
      };
    }

    const model = options.model ?? getModel();
    const client = getClient();
    const system = options.extraInstructions
      ? `${SHARED_PREAMBLE}\n\n${def.systemPrompt}\n\n${options.extraInstructions}`
      : `${SHARED_PREAMBLE}\n\n${def.systemPrompt}`;

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [
      { role: 'system', content: system },
      { role: 'user', content: def.buildUserPrompt(input) },
    ];

    let lastRaw = '';
    let usage: TaskMeta['usage'] = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      const response = await client.responses.create(
        {
          model,
          input: messages,
          temperature: options.temperature ?? def.temperature ?? 0,
          text: {
            format: {
              type: 'json_schema',
              name: def.name,
              strict: true,
              schema: jsonSchema as Record<string, unknown>,
            },
          },
        },
        { signal: options.signal },
      );

      lastRaw = response.output_text ?? '';
      if (response.usage) {
        usage = { inputTokens: response.usage.input_tokens ?? 0, outputTokens: response.usage.output_tokens ?? 0 };
      }

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(stripFences(lastRaw));
      } catch (error) {
        if (attempt === 2) throw new TaskSchemaError(def.name, String(error), lastRaw);
        messages.push({
          role: 'user',
          content: `Your previous reply was not valid JSON (${String(error)}). Reply again with ONLY the JSON object required by the schema.`,
        });
        continue;
      }

      const validated = def.outputSchema.safeParse(parsedJson);
      if (validated.success) {
        return {
          data: validated.data as z.infer<O>,
          meta: { task: def.name, mocked: false, model, attempts: attempt, usage, latencyMs: Date.now() - started },
        };
      }

      if (attempt === 2) throw new TaskSchemaError(def.name, validated.error.issues, lastRaw);

      messages.push({
        role: 'user',
        content: [
          'Your previous reply did not satisfy the contract. Fix exactly these problems and reply again with the full JSON object:',
          JSON.stringify(validated.error.issues, null, 2),
          'Do not change any figure that was already correct. Do not invent new figures.',
        ].join('\n'),
      });
    }

    throw new TaskSchemaError(def.name, 'unreachable', lastRaw);
  }

  async function run(rawInput: unknown, options: RunOptions = {}): Promise<z.infer<O>> {
    return (await runWithMeta(rawInput, options)).data;
  }

  return {
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema,
    outputSchema: def.outputSchema,
    jsonSchema,
    systemPrompt: `${SHARED_PREAMBLE}\n\n${def.systemPrompt}`,
    fixture: def.fixture,
    run,
    runWithMeta,
  };
}

export type Task<I extends z.ZodTypeAny, O extends z.ZodTypeAny> = ReturnType<typeof withMock<I, O>>;
