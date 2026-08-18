import { z } from 'zod';
import { uncertaintyFields } from './common.ts';

export const ClusterInput = z.object({
  checks: z
    .array(
      z.object({
        caseId: z.string(),
        code: z.string().describe('pre-flight / CPC check code'),
        severity: z.enum(['fail', 'warn', 'info']),
        form: z.string().nullable().default(null),
        regime: z.enum(['new', 'old']).nullable().default(null),
        personaTag: z.string().nullable().default(null).describe('e.g. "intern-194J", "pensioner-FD", "equity-investor"'),
        detail: z.string().nullable().default(null),
      }),
    )
    .min(1),
  topN: z.number().default(5).describe('how many systemic issues to return'),
});
export type ClusterInput = z.infer<typeof ClusterInput>;

export const SystemicIssue = z.object({
  rank: z.number(),
  title: z.string().describe('≤ 12 words, names the systemic problem not the check code'),
  codes: z.array(z.string()).describe('check codes rolled into this cluster'),
  caseCount: z.number().describe('number of distinct caseIds affected — count them, do not estimate'),
  shareOfCases: z.number().describe('caseCount divided by total distinct cases in the input, 0 to 1'),
  affectedPersonas: z.array(z.string()),
  pattern: z.string().describe('≤ 50 words: what these cases have in common'),
  upstreamFix: z.object({
    suggestion: z.string().describe('≤ 40 words: one change EARLIER in the journey that would stop this'),
    stage: z.enum(['import', 'interview', 'computation', 'preflight', 'submission', 'post_filing']),
    effort: z.enum(['low', 'medium', 'high']),
    expectedReduction: z.string().describe('e.g. "would clear ~30 of 41 cases"'),
  }),
});
export type SystemicIssue = z.infer<typeof SystemicIssue>;

export const ClusterOutput = z.object({
  totalCases: z.number(),
  totalChecks: z.number(),
  issues: z.array(SystemicIssue),
  headline: z.string().describe('≤ 25 words for the officer console banner'),
  ...uncertaintyFields,
});
export type ClusterOutput = z.infer<typeof ClusterOutput>;
