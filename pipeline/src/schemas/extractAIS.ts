import { z } from 'zod';
import { Quarter, Rupees, uncertaintyFields } from './common.ts';

export const AISInput = z.object({
  text: z.string().min(1).describe('AIS / TIS export as text, CSV or pasted table'),
  assessmentYear: z.string().default('2026-27'),
  pan: z.string().nullable().default(null),
});
export type AISInput = z.infer<typeof AISInput>;

export const AISEntry = z.object({
  infoCode: z
    .string()
    .describe('AIS information code as printed, e.g. SFT-015, SFT-016, 194, 194A, 192, 194J, 194S, SFT-005'),
  description: z.string().describe('the information description, e.g. "Dividend", "Interest from savings bank"'),
  source: z.string().describe('reporting entity / deductor name'),
  sourceTan: z.string().nullable(),
  amount: Rupees,
  tds: Rupees.describe('tax deducted on this entry; 0 when none'),
  quarter: Quarter.nullable().describe('null when the export does not break the entry by quarter'),
  head: z
    .enum(['salary', 'other_sources', 'capital_gains', 'house_property', 'business', 'vda', 'other'])
    .describe('which ITR head this entry most likely belongs to (RULES.md §2)'),
  status: z.enum(['active', 'reported_by_taxpayer', 'duplicate', 'feedback_pending']).describe('use "active" unless the export says otherwise'),
});
export type AISEntry = z.infer<typeof AISEntry>;

export const AISOutput = z.object({
  pan: z.string().nullable(),
  assessmentYear: z.string(),
  entries: z.array(AISEntry),
  totals: z.object({
    amount: Rupees.describe('sum of entry amounts, copied from the document total when one is printed'),
    tds: Rupees,
  }),
  flags: z
    .object({
      foreignRemittance: z.boolean().describe('any SFT-/Form 15CC style foreign remittance line (Schedule FA hint)'),
      vdaTransactions: z.boolean().describe('any 194S / virtual digital asset line'),
      section194N: z.boolean().describe('cash withdrawal TDS present'),
    })
    .describe('hints for the pre-flight engine; the engine, not you, decides what to do with them'),
  ...uncertaintyFields,
});
export type AISOutput = z.infer<typeof AISOutput>;
