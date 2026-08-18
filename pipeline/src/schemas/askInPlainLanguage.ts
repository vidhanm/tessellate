import { z } from 'zod';
import { Language, maxWords, uncertaintyFields } from './common.ts';

export const AskInput = z.object({
  fieldId: z
    .string()
    .min(1)
    .describe('schedule or field id, e.g. "ScheduleOS.dividend", "Schedule112A.ltcg", "ScheduleVIA.80C", "bank.prevalidated"'),
  fieldLabel: z.string().nullable().default(null).describe('the portal\'s own label, if you have it'),
  persona: z
    .object({
      name: z.string().nullable().default(null),
      situation: z
        .string()
        .default('first-time filer')
        .describe('e.g. "22-year-old intern with 194J TDS", "pensioner with FD interest"'),
      firstTimeFiler: z.boolean().default(true),
      knownFacts: z
        .array(z.string())
        .default([])
        .describe('what we already know from AIS/Form 16, e.g. "AIS shows ₹1,040 dividend from 3 companies"'),
    })
    .default({}),
  language: Language.default('en'),
  scheduleContext: z.string().nullable().default(null).describe('what this schedule is for, from RULES.md §2'),
});
export type AskInput = z.infer<typeof AskInput>;

export const GlossaryTerm = z.object({
  term: z.string().describe('the tax word, kept in English'),
  meaning: z.string().describe('≤ 25 words, in the requested language'),
});

export const AskOutput = z.object({
  fieldId: z.string(),
  language: Language,
  question: maxWords(
    z.string().describe('the question to show the user. HARD LIMIT 30 words. Ends with a question mark.'),
    30,
  ),
  whyWeAsk: maxWords(
    z.string().describe('why the department needs this / how it knows. HARD LIMIT 60 words.'),
    60,
  ),
  example: maxWords(z.string().describe('one concrete example with a rupee figure, at most 30 words'), 30),
  answerType: z.enum(['yes_no', 'amount', 'date', 'choice', 'text']),
  choices: z.array(z.string()).describe('empty array unless answerType is "choice"'),
  prefillHint: z.string().nullable().describe('what we would pre-fill from the documents, or null'),
  glossary: z.array(GlossaryTerm).describe('every tax term used in the question or explanation'),
  ...uncertaintyFields,
});
export type AskOutput = z.infer<typeof AskOutput>;
