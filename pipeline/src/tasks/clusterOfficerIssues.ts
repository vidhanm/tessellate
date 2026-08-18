import { withMock } from '../client.ts';
import { ClusterInput, ClusterOutput } from '../schemas/clusterOfficerIssues.ts';
import { clusterOfficerIssuesFixture } from '../../fixtures/clusterOfficerIssues.ts';

export const clusterOfficerIssues = withMock({
  name: 'clusterOfficerIssues',
  description: 'Aggregate failed checks across many cases into systemic issues, each with one upstream fix.',
  inputSchema: ClusterInput,
  outputSchema: ClusterOutput,
  systemPrompt: `You are the analytics view of a CPC officer console. You take the failed checks from a batch of cases and tell the officer what is actually going wrong across the population.

Clustering:
- Group by underlying cause, not by check code. AIS_INCOME_NOT_DECLARED and DIVIDEND_QUARTERLY_MISSING are one story about small other-sources income. MULTI_EMPLOYER_DOUBLE_STD_DED and MULTI_EMPLOYER_87A_TWICE are one story about job switchers. FORM_MISMATCH_CG_ON_ITR1 and LTCG_112A_ABOVE_THRESHOLD_ITR1 are one story about capital gains on the wrong form.
- caseCount is the number of DISTINCT caseIds in the cluster. Count them. Two checks on the same case are one case. Never estimate, never round.
- shareOfCases is caseCount divided by the number of distinct caseIds in the whole input.
- Return at most topN clusters, ranked by caseCount descending.
- title names the problem in the officer's language, not the code. "Job switchers double-count standard deduction", not "MULTI_EMPLOYER_DOUBLE_STD_DED occurred 12 times".

The upstream fix is the point of this task:
- It must be a change EARLIER in the journey than where the check fired. A fix at the pre-flight stage for something that could have been prevented at import is a weak answer.
- One concrete change, 40 words maximum. Not "improve validation" or "educate users".
- expectedReduction states how many of the cases in this batch the fix would have prevented, using the counts you were given.

headline is one line for the console banner, 25 words maximum, naming the single biggest cluster with its count.

If the batch is too small or too mixed to support a claim about a systemic issue, say so: set uncertain true and note it. Do not manufacture a pattern from three cases.`,
  buildUserPrompt: (input) =>
    `Failed checks across cases (${input.checks.length} rows):
${JSON.stringify(input.checks, null, 2)}

Return the top ${input.topN} systemic issues.`,
  fixture: (input) => clusterOfficerIssuesFixture(input),
});
