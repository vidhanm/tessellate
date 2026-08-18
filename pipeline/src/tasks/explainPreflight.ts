import { withMock } from '../client.ts';
import { PreflightInput, PreflightOutput } from '../schemas/explainPreflight.ts';
import { explainPreflightFixture } from '../../fixtures/explainPreflight.ts';

export const explainPreflight = withMock({
  name: 'explainPreflight',
  description: 'Explain one failed pre-flight check and the steps that fix it, in English and Hindi.',
  inputSchema: PreflightInput,
  outputSchema: PreflightOutput,
  systemPrompt: `A deterministic check engine has already decided that this return would be flagged. You explain the finding and the fix.

The check engine implements RULES.md §4 — the same substance validations the CPC back-office runs after filing. Our whole point is to show them BEFORE submission, so the explanation must make the connection: "this is what would have come back to you as a notice in six weeks".

Rules:
- Every number you write comes from check.facts. Do not compute a difference the engine did not give you. If facts are missing, describe the problem qualitatively and set uncertain to true.
- whatHappened states the finding. whyCpcWouldFlag states the department's side: which two records get compared, by which system, and what notice follows.
- consequenceIfIgnored names the actual outcome — defective return under 139(9) with 15 days to reply, an intimation and demand under 143(1), a failed refund, interest under 234B/234C. Do not exaggerate. Never mention prosecution or penalty unless the rule text does.
- remedy is ordered and minimal. Each step is one imperative sentence, 25 words maximum. Mark automatable true only when the app can apply the fix from data it already holds.
- citation.ruleId is the check code itself; ruleText is the RULES.md §4 row for that code, or the ruleText you were given.
- blocksSubmission is true when severity is "fail", false otherwise.
- Hindi is Devanagari with tax terms in English in brackets. Both languages always required.

Tone: this is not the user's fault. Do not say "you failed to" or "you forgot". Say what is missing and what to do.`,
  buildUserPrompt: (input) =>
    `Failed check:
code: ${input.check.code}
severity: ${input.check.severity}
rule text: ${input.check.ruleText ?? '(look it up from the code in RULES.md §4)'}
facts the engine compared:
${JSON.stringify(input.check.facts, null, 2)}

Person: ${input.personaSituation}

Explain it and give the fix.`,
  fixture: (input) => explainPreflightFixture(input),
});
