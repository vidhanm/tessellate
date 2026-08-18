import { z } from 'zod';
import { Bilingual, RuleCitation, Rupees, uncertaintyFields } from './common.ts';

/**
 * Everything numeric here is produced by DETERMINISTIC CODE (tax engine +
 * form-selection rules). The model receives it and explains it. It must not
 * recompute, adjust or second-guess a single rupee.
 */
export const RecommendInput = z.object({
  facts: z.object({
    assessmentYear: z.string().default('2026-27'),
    residentialStatus: z.enum(['resident', 'rnor', 'non_resident']).default('resident'),
    age: z.number().default(30),
    incomeByHead: z.object({
      salary: Rupees.default(0),
      houseProperty: Rupees.default(0),
      businessProfession: Rupees.default(0),
      capitalGainsShortTerm111A: Rupees.default(0),
      capitalGainsLongTerm112A: Rupees.default(0),
      capitalGainsOther: Rupees.default(0),
      otherSources: Rupees.default(0),
      vda: Rupees.default(0),
      agricultural: Rupees.default(0),
    }),
    deductions: z
      .record(z.string(), z.number())
      .default({})
      .describe('claimed chapter VI-A etc., keyed by section: {"80C": 150000, "80D": 25000}'),
    flags: z
      .object({
        presumptive44AD: z.boolean().default(false),
        presumptive44ADA: z.boolean().default(false),
        multipleHouseProperties: z.boolean().default(false),
        foreignAssetsOrIncome: z.boolean().default(false),
        directorInCompany: z.boolean().default(false),
        unlistedShares: z.boolean().default(false),
        carryForwardLoss: z.boolean().default(false),
        tds194N: z.boolean().default(false),
        esopDeferral: z.boolean().default(false),
        multipleEmployers: z.boolean().default(false),
      })
      .default({}),
  }),
  deterministic: z
    .object({
      chosenForm: z.enum(['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4']).describe('decided by code from RULES.md §1'),
      formTriggerFacts: z.array(z.string()).describe('the facts that fired the rule, in code order'),
      totalIncome: Rupees,
      newRegime: z.object({
        taxableIncome: Rupees,
        taxBeforeRebate: Rupees,
        rebate87A: Rupees,
        surcharge: Rupees,
        cess: Rupees,
        totalTax: Rupees,
      }),
      oldRegime: z.object({
        taxableIncome: Rupees,
        taxBeforeRebate: Rupees,
        rebate87A: Rupees,
        surcharge: Rupees,
        cess: Rupees,
        totalTax: Rupees,
      }),
      recommendedRegime: z.enum(['new', 'old']).describe('decided by code: the cheaper one'),
      savingsVsAlternative: Rupees.describe('absolute rupee difference between the two regimes'),
      requiresForm10IEA: z.boolean(),
    })
    .describe('TRUST THESE NUMBERS. Never recompute them.'),
  language: z.array(z.enum(['en', 'hi'])).default(['en', 'hi']),
});
export type RecommendInput = z.infer<typeof RecommendInput>;

export const Reason = z.object({
  fact: z.string().describe('the user fact this reason rests on, e.g. "you sold mutual fund units in Nov 2025"'),
  consequence: Bilingual.describe('what that fact means for the form or regime, one short sentence each'),
  citation: RuleCitation,
});

export const RecommendOutput = z.object({
  form: z.object({
    value: z.enum(['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4']).describe('MUST equal deterministic.chosenForm'),
    headline: Bilingual.describe('≤ 20 words each, e.g. "You should file ITR-2"'),
    explanation: Bilingual.describe('≤ 80 words each, plain words, no jargon without a gloss'),
    reasons: z.array(Reason).describe('at least one, each citing a rule'),
    whatWouldChangeIt: Bilingual.describe('one sentence: what fact would move you to a different form'),
  }),
  regime: z.object({
    value: z.enum(['new', 'old']).describe('MUST equal deterministic.recommendedRegime'),
    headline: Bilingual.describe('state the rupee saving using the number you were given, verbatim'),
    explanation: Bilingual.describe('≤ 80 words each'),
    reasons: z.array(Reason),
    deductionsLostIfSwitching: z.array(z.string()).describe('sections that stop being allowed under the recommended regime'),
    deadlineNote: Bilingual.describe('regime choice is tied to filing on time; mention Form 10-IEA only when requiresForm10IEA is true'),
  }),
  confidence: z.number().describe('0 to 1; below 0.6 means a human should look at it'),
  ...uncertaintyFields,
});
export type RecommendOutput = z.infer<typeof RecommendOutput>;
