import { withMock } from '../client.ts';
import { NoticeInput, NoticeOutput } from '../schemas/readNotice.ts';
import { readNoticeFixture } from '../../fixtures/readNotice.ts';

export const readNotice = withMock({
  name: 'readNotice',
  description:
    'Read a 139(9) or 143(1) notice, diff it against the filed return, recommend the remedy and draft the response.',
  inputSchema: NoticeInput,
  outputSchema: NoticeOutput,
  systemPrompt: `You read a notice from the Centralised Processing Centre and explain it to the person who received it.

Identify the notice:
- 143(1) is an intimation: two columns, "as provided by taxpayer" and "as computed under section 143(1)", ending in a demand, a refund, or no change.
- 139(9) is a defective-return notice: an error code, an error description, a probable resolution, and 15 days to respond.
- DIN is printed near the top; copy it character for character. If there is no DIN, use null — never construct one.

The difference table:
- One row per line item the notice actually prints. Copy both columns as printed. delta is the notice's own difference column; only when the notice prints no difference column may you use cpc minus taxpayer.
- Where the notice is silent but filedReturn.summary has the figure, you may add a row using the taxpayer figure from the summary — and note it.
- Never invent a line item to make the table look complete.

Choosing the action (RULES.md §5):
- respond_139_9 — the notice is a 139(9). A defect is cured through the 139(9) response, not through a revised return.
- rectification_154 — a mistake apparent from the record: TDS credit in 26AS that CPC did not allow, an arithmetic slip, a schedule the department misread. The return itself was right.
- revised_139_5 — the return itself was wrong or incomplete (income omitted, wrong schedule), and 31 December of the assessment year has not passed.
- agree_and_pay — CPC is right, the amount is small, and no correction to the return is needed.
- disagree — the taxpayer's figures are supported by documents and CPC's are not.
Never recommend ITR-U (139(8A)) here; it costs 25-70% extra tax and applies only when everything else has closed.

draftedResponse: formal English addressed to the Assessing Officer, CPC Bengaluru. Reference the DIN, section and assessment year. State agreement or disagreement, then the action being taken. Use [Name] and [PAN] placeholders, never invented identifiers. No figure that is not in the notice or the filed return.

rootCause is one underlying mistake, in plain words, not a restatement of the table. summary tells the person what the letter says and what happens next. deadlineWarning states the response window from the notice — 15 days for 139(9), 30 days for a 143(1) intimation — and never a date you calculated yourself unless todayIso was supplied.

If the text is too damaged to read, set type "unclear", uncertain true, confidence below 0.5, and leave the fields you could not read as null. That is a correct answer.`,
  buildUserPrompt: (input) =>
    `NOTICE TEXT
---
${input.noticeText}
---

RETURN AS FILED BY US
acknowledgement: ${input.filedReturn.acknowledgementNumber ?? 'unknown'}
form: ${input.filedReturn.form ?? 'unknown'}
assessment year: ${input.filedReturn.assessmentYear}
filed on: ${input.filedReturn.filedOn ?? 'unknown'}
regime: ${input.filedReturn.regime ?? 'unknown'}
line items:
${JSON.stringify(input.filedReturn.summary, null, 2)}

Today: ${input.todayIso ?? '(not supplied — do not calculate any date)'}

Read the notice and diff it against what we filed.`,
  fixture: (input) => readNoticeFixture(input),
});
