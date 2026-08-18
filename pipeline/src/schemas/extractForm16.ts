import { z } from 'zod';
import { Quarter, Rupees, uncertaintyFields } from './common.ts';

export const Form16Input = z.object({
  text: z.string().min(1).describe('raw text of the Form 16 (Part A and Part B), OCR or PDF text layer'),
  assessmentYear: z.string().default('2026-27').describe('AY the document is expected to belong to'),
  hints: z
    .object({
      employeeName: z.string().nullable().default(null),
      pan: z.string().nullable().default(null),
    })
    .default({ employeeName: null, pan: null }),
});
export type Form16Input = z.infer<typeof Form16Input>;

export const ChapterVIAItem = z.object({
  section: z
    .string()
    .describe('e.g. 80C, 80D, 80CCD(1B), 80CCD(2), 80TTA, 80TTB, 80G'),
  label: z.string().describe('what the employee actually claimed, in the words of the document'),
  grossAmount: Rupees,
  deductibleAmount: Rupees.describe('amount allowed by the employer after the section cap'),
});

export const TdsByQuarter = z.object({
  quarter: Quarter,
  receiptNumber: z.string().nullable(),
  amountPaidCredited: Rupees,
  taxDeducted: Rupees,
  taxDeposited: Rupees,
});

export const Form16Output = z.object({
  employer: z.object({
    name: z.string(),
    tan: z.string().describe('10-character TAN exactly as printed, e.g. BLRA12345F'),
    address: z.string().nullable(),
    pan: z.string().nullable(),
  }),
  employee: z.object({
    name: z.string().nullable(),
    pan: z.string().nullable(),
  }),
  assessmentYear: z.string().describe('as printed on the form, e.g. 2026-27'),
  period: z.object({ from: z.string().nullable(), to: z.string().nullable() }).describe('ISO dates YYYY-MM-DD'),
  grossSalary: z.object({
    section17_1: Rupees.describe('salary as per section 17(1)'),
    section17_2: Rupees.describe('value of perquisites u/s 17(2)'),
    section17_3: Rupees.describe('profits in lieu of salary u/s 17(3)'),
    total: Rupees,
  }),
  exemptionsUnderSection10: z
    .array(
      z.object({
        clause: z.string().describe('e.g. 10(13A) HRA, 10(5) LTA, 10(14) transport'),
        amount: Rupees,
      }),
    )
    .describe('empty array when the new regime was used'),
  standardDeduction: Rupees.describe('50000 under old regime, 75000 under new regime — copy what is printed'),
  professionalTax: Rupees,
  entertainmentAllowance: Rupees,
  incomeChargeableUnderSalary: Rupees,
  otherIncomeReportedByEmployee: Rupees,
  chapterVIA: z.array(ChapterVIAItem),
  totalChapterVIADeduction: Rupees,
  totalTaxableIncome: Rupees,
  taxPayable: Rupees,
  reliefUnderSection89: Rupees,
  tdsByQuarter: z.array(TdsByQuarter),
  totalTdsDeducted: Rupees,
  regimeIndicated: z
    .enum(['new', 'old', 'unclear'])
    .describe('"new" if std deduction is 75000 / no chapter VI-A beyond 80CCD(2); "old" if HRA or 80C present; "unclear" otherwise'),
  regimeEvidence: z.string().describe('one sentence quoting the line that told you the regime'),
  ...uncertaintyFields,
});
export type Form16Output = z.infer<typeof Form16Output>;
