import { z } from 'zod';
import { uncertaintyFields } from './common.ts';

export const TranslateInput = z.object({
  text: z.string().min(1),
  target: z.enum(['hi']).default('hi').describe('only Hindi today; Bhashini languages later'),
  register: z
    .enum(['simple', 'formal'])
    .default('simple')
    .describe('"simple" = class-8 reading level, the product default'),
  keepTermsInEnglish: z
    .array(z.string())
    .default([])
    .describe('extra terms to leave in English beyond the standard tax vocabulary'),
});
export type TranslateInput = z.infer<typeof TranslateInput>;

export const TranslateOutput = z.object({
  text: z.string().describe('Devanagari Hindi; tax terms kept in English inside round brackets'),
  termsKeptInEnglish: z.array(z.string()).describe('the English terms that survived in the output'),
  ...uncertaintyFields,
});
export type TranslateOutput = z.infer<typeof TranslateOutput>;
