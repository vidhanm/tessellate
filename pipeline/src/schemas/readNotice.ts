import { z } from 'zod';
import { Bilingual, Rupees, uncertaintyFields } from './common.ts';

export const NoticeInput = z.object({
  noticeText: z.string().min(1).describe('full text of the notice — 139(9) defective, or 143(1) intimation'),
  filedReturn: z
    .object({
      acknowledgementNumber: z.string().nullable().default(null),
      form: z.string().nullable().default(null),
      assessmentYear: z.string().default('2026-27'),
      filedOn: z.string().nullable().default(null).describe('ISO date'),
      regime: z.enum(['new', 'old']).nullable().default(null),
      summary: z
        .record(z.string(), z.number())
        .default({})
        .describe('what the taxpayer filed, keyed by line item: {"grossSalary": 1200000, "totalTds": 45000}'),
    })
    .describe('the return as WE filed it — the other side of the diff'),
  todayIso: z.string().nullable().default(null).describe('used only to describe the deadline; do not compute new dates if null'),
});
export type NoticeInput = z.infer<typeof NoticeInput>;

export const DifferenceRow = z.object({
  item: z.string().describe('line item name as the notice calls it, e.g. "Gross Total Income", "TDS credit"'),
  cpc: Rupees.describe('the figure "as computed under section 143(1)" / as per department'),
  taxpayer: Rupees.describe('the figure "as provided by taxpayer in return of income"'),
  delta: Rupees.describe('cpc minus taxpayer; copy the notice\'s own difference column when it prints one'),
  note: z.string().nullable().describe('one short sentence on what caused this row, or null'),
});
export type DifferenceRow = z.infer<typeof DifferenceRow>;

export const NoticeOutput = z.object({
  type: z.enum(['139(9)', '143(1)', '154', '245', 'other', 'unclear']),
  din: z.string().nullable().describe('Document Identification Number exactly as printed'),
  assessmentYear: z.string().nullable(),
  noticeDate: z.string().nullable().describe('ISO YYYY-MM-DD'),
  dueDate: z.string().nullable().describe('ISO YYYY-MM-DD — the response deadline printed on the notice'),
  errorCodes: z.array(z.string()).describe('defect / error codes the notice lists, verbatim'),
  netOutcome: z.object({
    kind: z.enum(['demand', 'refund', 'no_change', 'defect', 'unclear']),
    amount: Rupees.describe('0 when kind is no_change / defect / unclear'),
  }),
  differences: z.array(DifferenceRow),
  rootCause: Bilingual.describe('≤ 60 words each: the single underlying mistake, in plain words'),
  recommendedAction: z.enum([
    'respond_139_9',
    'rectification_154',
    'revised_139_5',
    'agree_and_pay',
    'disagree',
  ]),
  actionRationale: Bilingual.describe('≤ 60 words each; say why the other options are worse'),
  draftedResponse: z
    .string()
    .describe('ready-to-paste response text for the portal, in English, formal, referencing DIN and AY. No invented figures.'),
  summary: Bilingual.describe('≤ 80 words each: what the letter says and what happens next'),
  deadlineWarning: Bilingual.describe('the response window, e.g. 15 days for 139(9)'),
  confidence: z.number().describe('0 to 1'),
  ...uncertaintyFields,
});
export type NoticeOutput = z.infer<typeof NoticeOutput>;
