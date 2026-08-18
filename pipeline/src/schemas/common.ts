import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/** Languages the product ships today. Extendable via Bhashini later. */
export const Language = z.enum(['en', 'hi']);
export type Language = z.infer<typeof Language>;

/** A bilingual string pair. Hindi must be Devanagari, simple words. */
export const Bilingual = z.object({
  en: z.string(),
  hi: z.string(),
});
export type Bilingual = z.infer<typeof Bilingual>;

/**
 * Every task output carries these. `uncertain` is how the model says
 * "I'm not sure" instead of inventing a number.
 */
export const uncertaintyFields = {
  uncertain: z
    .boolean()
    .describe('true when the input is ambiguous, incomplete or contradictory'),
  uncertaintyNotes: z
    .array(z.string())
    .describe('one short note per thing you were unsure about; empty array when uncertain is false'),
};

/** A citation back to docs/RULES.md — every recommendation must carry one. */
export const RuleCitation = z.object({
  ruleId: z
    .string()
    .describe('stable id from docs/RULES.md, e.g. "RULES.md#1-form-selection" or a check code like "AIS_INCOME_NOT_DECLARED"'),
  ruleText: z.string().describe('the exact clause being relied on, quoted or tightly paraphrased'),
});
export type RuleCitation = z.infer<typeof RuleCitation>;

/** Money in whole rupees. The model never derives these — it copies them. */
export const Rupees = z.number().describe('amount in whole Indian rupees (no paise, no commas, no "₹")');

export const Quarter = z.enum(['Q1', 'Q2', 'Q3', 'Q4']);
export type Quarter = z.infer<typeof Quarter>;

const STRIP_KEYWORDS = new Set([
  '$schema',
  'default',
  'format',
  'pattern',
  'minLength',
  'maxLength',
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'multipleOf',
  'minItems',
  'maxItems',
  'uniqueItems',
  'additionalItems',
]);

/**
 * OpenAI structured outputs (strict:true) only accept a subset of JSON Schema:
 * every object needs `additionalProperties:false` and must list every property in
 * `required`, and numeric/string constraint keywords are rejected.
 *
 * We therefore relax the JSON Schema (the wire contract) and keep the *real*
 * constraints in zod, which validates the parsed response afterwards. A schema
 * violation triggers exactly one repair retry (see client.ts).
 */
export function strictify(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(strictify);
  if (node === null || typeof node !== 'object') return node;

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (STRIP_KEYWORDS.has(key)) continue;
    out[key] = strictify(value);
  }

  if (out.type === 'object' || (out.properties && !out.type)) {
    out.type = 'object';
    out.additionalProperties = false;
    out.required = Object.keys((out.properties as Record<string, unknown>) ?? {});
  }
  return out;
}

/** zod schema -> OpenAI-ready strict JSON schema. */
export function toJsonSchema(schema: z.ZodTypeAny, name: string): Record<string, unknown> {
  const raw = zodToJsonSchema(schema, {
    name,
    $refStrategy: 'none',
    target: 'jsonSchema7',
  }) as Record<string, unknown>;

  // zodToJsonSchema with `name` wraps the schema under definitions/<name>.
  const definitions = raw.definitions as Record<string, unknown> | undefined;
  const body = definitions?.[name] ?? raw;
  return strictify(body) as Record<string, unknown>;
}

/** Word-count guard used where the product has a hard UI budget. */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function maxWords(schema: z.ZodString, limit: number) {
  return schema.refine((value) => countWords(value) <= limit, {
    message: `must be ${limit} words or fewer`,
  });
}
