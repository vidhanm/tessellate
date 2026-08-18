import { withMock } from '../client.ts';
import { Form16Input, Form16Output } from '../schemas/extractForm16.ts';
import { extractForm16Fixture } from '../../fixtures/extractForm16.ts';

export const extractForm16 = withMock({
  name: 'extractForm16',
  description: 'Read a Form 16 (Part A + Part B) and return its fields as structured JSON.',
  inputSchema: Form16Input,
  outputSchema: Form16Output,
  systemPrompt: `You read Indian Form 16 salary certificates and return their fields exactly as printed.

How to read the document:
- Part A carries the employer name, PAN, TAN, the certificate period and the quarter-wise TDS table. Part B carries the salary break-up, exemptions, deductions and tax.
- Copy every figure exactly as printed. Strip commas, the rupee sign and paise. 11,05,000.00 becomes 1105000.
- Do NOT add up numbers yourself. If the document prints a total, use the printed total. If a line is genuinely absent, use 0 for money and null for text or dates.
- Dates become ISO YYYY-MM-DD. "01-04-2025" is 2025-04-01.
- The quarter table sometimes prints Q1..Q4 as "Quarter 1" or by month range; map it to Q1 (Apr-Jun), Q2 (Jul-Sep), Q3 (Oct-Dec), Q4 (Jan-Mar).

Regime:
- "new" when the standard deduction is 75,000, or the form mentions section 115BAC(1A), or there are no Chapter VI-A claims other than 80CCD(2)/80CCH.
- "old" when the standard deduction is 50,000, or there are section 10(13A) HRA / LTA exemptions, or 80C / 80D style claims.
- "unclear" when the evidence conflicts. Then set uncertain to true and explain in uncertaintyNotes. Never guess the regime from the salary level.

Common traps:
- Perquisites (17(2)) are part of gross salary, not a separate income.
- Professional tax and entertainment allowance are section 16 deductions, not Chapter VI-A.
- An OCR'd form may split a number across lines; if a figure is unreadable, set uncertain and say which field.`,
  buildUserPrompt: (input) => {
    const hints = [
      input.hints.employeeName ? `Expected employee name: ${input.hints.employeeName}` : null,
      input.hints.pan ? `Expected employee PAN: ${input.hints.pan}` : null,
      `Expected assessment year: ${input.assessmentYear}`,
    ]
      .filter(Boolean)
      .join('\n');
    return `${hints}\n\nForm 16 text:\n---\n${input.text}\n---\n\nReturn the structured fields.`;
  },
  fixture: () => extractForm16Fixture,
});
