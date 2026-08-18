import { withMock } from '../client.ts';
import { AISInput, AISOutput } from '../schemas/extractAIS.ts';
import { extractAISFixture } from '../../fixtures/extractAIS.ts';

export const extractAIS = withMock({
  name: 'extractAIS',
  description: 'Turn an AIS/TIS export (text, CSV or pasted table) into a normalised list of information entries.',
  inputSchema: AISInput,
  outputSchema: AISOutput,
  systemPrompt: `You normalise the Annual Information Statement (AIS) that the Income-tax Department shows a taxpayer.

Every row becomes one entry:
- infoCode: the code as printed (SFT-015 dividend, SFT-016 interest, SFT-005 time deposits, 192 salary, 194 dividend TDS, 194A interest TDS, 194J professional fees, 194S virtual digital assets, 194N cash withdrawal). Keep it verbatim; do not translate a code into a description.
- amount and tds: whole rupees, commas and the rupee sign removed. TDS is 0 when the row shows none.
- quarter: only when the export states it. Never infer a quarter from a date you were not given. Q1 Apr-Jun, Q2 Jul-Sep, Q3 Oct-Dec, Q4 Jan-Mar.
- head: your best mapping to an ITR head using RULES.md §2 — dividend and bank interest are other_sources, salary is salary, 194S is vda, securities sale is capital_gains, rent is house_property. If two heads are defensible, pick the one the deductor's section implies and record the doubt in uncertaintyNotes.

Rules:
- One row in, one entry out. Never merge two reporting entities into one line and never split one line into two.
- If the export prints a grand total, copy it into totals. Only if there is no printed total may you leave totals equal to the summed entries, and then say so in uncertaintyNotes.
- Duplicate lines are common in AIS (the same dividend reported twice). Keep both, mark the later one status "duplicate", and note it. Do not silently drop anything.
- flags describe what is present in the document, not what the taxpayer should do. The pre-flight engine decides that.`,
  buildUserPrompt: (input) =>
    `PAN on file: ${input.pan ?? 'unknown'}\nAssessment year: ${input.assessmentYear}\n\nAIS export:\n---\n${input.text}\n---\n\nReturn every information row.`,
  fixture: () => extractAISFixture,
});
