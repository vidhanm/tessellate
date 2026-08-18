/**
 * Every LLM call in Saral goes through here. One adapter, one place to swap
 * models, and a mock mode so the app runs end-to-end with no API key at all.
 *
 * Set MOCK_LLM=1 (the default in .env.example) to use the canned responses.
 */
import "server-only";
import OpenAI from "openai";
import { z } from "zod";

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

export function isMockMode(): boolean {
  return process.env.MOCK_LLM === "1" || !process.env.OPENAI_API_KEY;
}

let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export type LLMTask =
  | "explain_term"
  | "explain_notice"
  | "summarise_return"
  | "answer_question";

export type LLMResult<T> = {
  data: T;
  mocked: boolean;
  model: string;
};

/** The shape every task returns: prose a first-time filer can act on. */
export const ExplanationSchema = z.object({
  headline: z.string(),
  plainEnglish: z.string(),
  whyItMatters: z.string(),
  nextSteps: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
});
export type Explanation = z.infer<typeof ExplanationSchema>;

const EXPLANATION_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "plainEnglish", "whyItMatters", "nextSteps", "confidence"],
  properties: {
    headline: { type: "string" },
    plainEnglish: { type: "string" },
    whyItMatters: { type: "string" },
    nextSteps: { type: "array", items: { type: "string" } },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
  },
} as const;

const SYSTEM_PROMPT = `You are Saral, a guide for people filing an Indian income-tax return for the very first time.
Rules you never break:
- Explain in plain language. No section numbers without a plain-English gloss beside them.
- Never invent a figure. If a number is not in the input, say what the user needs to look up.
- Be short. A nervous first-time filer reads three sentences, not thirty.
- Never promise a refund or an outcome. Say what the department is likely to do and why.
- You are not a chartered accountant and you say so when the question needs one.`;

const MOCK_RESPONSES: Record<LLMTask, Explanation> = {
  explain_term: {
    headline: "Standard deduction is a flat discount on your salary",
    plainEnglish:
      "Before any tax is worked out, the government knocks a fixed amount off your salary — ₹75,000 under the new regime, ₹50,000 under the old one. You do not need a receipt or proof for it. It is automatic for anyone with salary income.",
    whyItMatters:
      "It is the single largest deduction most salaried first-time filers get, and it applies whether or not you invested anything during the year.",
    nextSteps: [
      "Check that your Form 16 already shows the standard deduction.",
      "Do not try to claim it twice — it applies once across all your employers.",
    ],
    confidence: "high",
  },
  explain_notice: {
    headline: "This is an intimation under section 143(1), not an audit",
    plainEnglish:
      "The department's computer compared your return against its own records and found the numbers do not agree. It is an automated letter, sent to a very large number of people every year. It is not an accusation and nobody is coming to your door.",
    whyItMatters:
      "You have a limited window to respond. If you agree with the department, you pay the difference. If you disagree, you file a rectification with your proof and the matter usually ends there.",
    nextSteps: [
      "Open the notice and find the line marked 'variance' — that is the only number in dispute.",
      "Compare it against your Form 26AS and AIS on the income-tax portal.",
      "Respond through the e-proceedings tab before the deadline printed at the top.",
    ],
    confidence: "medium",
  },
  summarise_return: {
    headline: "Your return is a salary return with a refund due",
    plainEnglish:
      "Your employer deducted more tax during the year than you actually owe, so the department will send the difference back to the bank account you nominated. Everything else in your return is straightforward salary and bank interest.",
    whyItMatters:
      "A refund return is checked slightly more carefully than a nil return, so the bank account and the interest figure are worth a second look before you submit.",
    nextSteps: [
      "Confirm your bank account is pre-validated on the portal, or the refund will fail.",
      "E-verify within 30 days, otherwise the return is treated as never filed.",
    ],
    confidence: "high",
  },
  answer_question: {
    headline: "Here is the short answer",
    plainEnglish:
      "This is a canned response because Saral is running in mock mode (MOCK_LLM=1). With an OpenAI key set, this text comes from the model, grounded in the figures already in your return.",
    whyItMatters:
      "It lets the whole app be demonstrated end to end without a key, a bill, or a network round trip.",
    nextSteps: ["Set OPENAI_API_KEY and remove MOCK_LLM=1 to get real answers."],
    confidence: "low",
  },
};

/**
 * Ask the model for a structured explanation. Falls back to canned JSON in mock
 * mode, and also falls back if the live call fails — a tax app should never
 * show a first-time filer a stack trace.
 */
export async function explain(
  task: LLMTask,
  userInput: string,
  context?: Record<string, unknown>,
): Promise<LLMResult<Explanation>> {
  if (isMockMode()) {
    return { data: MOCK_RESPONSES[task], mocked: true, model: "mock" };
  }

  const contextBlock = context
    ? `\n\nThe taxpayer's figures (use only these, invent nothing):\n${JSON.stringify(context, null, 2)}`
    : "";

  try {
    const response = await getClient().chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Task: ${task}\n\n${userInput}${contextBlock}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "explanation",
          strict: true,
          schema: EXPLANATION_JSON_SCHEMA as unknown as Record<string, unknown>,
        },
      },
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    const parsed = ExplanationSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return { data: MOCK_RESPONSES[task], mocked: true, model: "mock-fallback" };
    }
    return { data: parsed.data, mocked: false, model: DEFAULT_MODEL };
  } catch {
    return { data: MOCK_RESPONSES[task], mocked: true, model: "mock-fallback" };
  }
}
