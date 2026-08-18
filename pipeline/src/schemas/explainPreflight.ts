import { z } from 'zod';
import { Bilingual, RuleCitation, uncertaintyFields } from './common.ts';

/** The 20 codes from RULES.md §4. Kept open-ended so new checks don't break the schema. */
export const PreflightCode = z.string().describe('check code from RULES.md §4, e.g. AIS_INCOME_NOT_DECLARED');

export const PreflightInput = z.object({
  check: z.object({
    code: PreflightCode,
    severity: z.enum(['fail', 'warn', 'info']),
    facts: z
      .record(z.string(), z.unknown())
      .describe('the numbers the check engine compared, e.g. {"aisDividend": 1040, "declaredDividend": 0}'),
    ruleText: z.string().nullable().default(null).describe('the row from RULES.md §4, when the caller has it'),
  }),
  personaSituation: z.string().default('first-time filer'),
});
export type PreflightInput = z.infer<typeof PreflightInput>;

export const RemedyStep = z.object({
  order: z.number(),
  action: Bilingual.describe('one imperative sentence, ≤ 25 words each'),
  whereInApp: z.string().nullable().describe('screen or schedule the user should go to, e.g. "Schedule OS → Dividend"'),
  automatable: z.boolean().describe('true when the app can apply this fix for the user with one tap'),
});

export const PreflightOutput = z.object({
  code: z.string(),
  severity: z.enum(['fail', 'warn', 'info']),
  title: Bilingual.describe('≤ 10 words each'),
  whatHappened: Bilingual.describe('≤ 60 words each; quote the numbers you were given, never new ones'),
  whyCpcWouldFlag: Bilingual.describe('≤ 60 words each; what the back-office engine compares and what notice follows'),
  consequenceIfIgnored: Bilingual.describe('e.g. defective return 139(9) within 15 days, or 143(1) demand'),
  remedy: z.array(RemedyStep).describe('ordered, smallest number of steps that actually fixes it'),
  citation: RuleCitation,
  blocksSubmission: z.boolean().describe('true for severity "fail"'),
  ...uncertaintyFields,
});
export type PreflightOutput = z.infer<typeof PreflightOutput>;
