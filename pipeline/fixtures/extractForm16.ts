import type { Form16Output } from '../src/schemas/extractForm16.ts';

/**
 * Canned output for persona 1 (Ananya, 24, first job, new regime, single employer).
 * Numbers are internally consistent so the tax engine can consume them in demos.
 */
export const extractForm16Fixture: Form16Output = {
  employer: {
    name: 'Nimbus Software Services Private Limited',
    tan: 'BLRN02931E',
    address: 'Level 6, Prestige Tech Park, Outer Ring Road, Bengaluru 560103',
    pan: 'AAECN4412K',
  },
  employee: { name: 'Ananya R Nair', pan: 'BQZPN1234F' },
  assessmentYear: '2026-27',
  period: { from: '2025-04-01', to: '2026-03-31' },
  grossSalary: {
    section17_1: 1180000,
    section17_2: 0,
    section17_3: 0,
    total: 1180000,
  },
  exemptionsUnderSection10: [],
  standardDeduction: 75000,
  professionalTax: 0,
  entertainmentAllowance: 0,
  incomeChargeableUnderSalary: 1105000,
  otherIncomeReportedByEmployee: 0,
  chapterVIA: [
    {
      section: '80CCD(2)',
      label: "Employer's contribution to NPS",
      grossAmount: 47200,
      deductibleAmount: 47200,
    },
  ],
  totalChapterVIADeduction: 47200,
  totalTaxableIncome: 1057800,
  taxPayable: 45811,
  reliefUnderSection89: 0,
  tdsByQuarter: [
    { quarter: 'Q1', receiptNumber: 'QQAB1234', amountPaidCredited: 295000, taxDeducted: 11450, taxDeposited: 11450 },
    { quarter: 'Q2', receiptNumber: 'QQAB2291', amountPaidCredited: 295000, taxDeducted: 11450, taxDeposited: 11450 },
    { quarter: 'Q3', receiptNumber: 'QQAB3374', amountPaidCredited: 295000, taxDeducted: 11450, taxDeposited: 11450 },
    { quarter: 'Q4', receiptNumber: 'QQAB4488', amountPaidCredited: 295000, taxDeducted: 11461, taxDeposited: 11461 },
  ],
  totalTdsDeducted: 45811,
  regimeIndicated: 'new',
  regimeEvidence:
    'Standard deduction is printed as 75,000 and the only Chapter VI-A claim is 80CCD(2), both of which are the new-regime pattern.',
  uncertain: false,
  uncertaintyNotes: [],
};
