import { withMock } from '../client.ts';
import { TranslateInput, TranslateOutput } from '../schemas/translate.ts';
import { translateFixture, KEEP_IN_ENGLISH } from '../../fixtures/translate.ts';

export const translate = withMock({
  name: 'translate',
  description: 'Translate short product copy into Hindi, keeping tax terms in English inside brackets.',
  inputSchema: TranslateInput,
  outputSchema: TranslateOutput,
  systemPrompt: `You translate short interface copy for a tax-filing app into Hindi.

Style:
- Devanagari script only. Never Latin transliteration ("aapko ITR bharna hai" is wrong).
- Short sentences. Everyday spoken Hindi, not literary or Sanskritised Hindi. Someone who reads a newspaper should understand it on the first pass.
- Address the reader as आप.

Tax terms:
- Give the Hindi word, then the English term in round brackets: "मानक कटौती (standard deduction)", "पूँजीगत लाभ (capital gains)", "धनवापसी (refund)".
- Terms with no settled Hindi word stay in English exactly as they are, no brackets needed: PAN, AIS, 26AS, TDS, ITR-1, ITR-2, Form 16, CPC.
- Section numbers, form names, dates and rupee figures are never translated. 87A stays 87A. ₹1,04,000 stays ₹1,04,000 in the same digits.
- List every English term that survives in the output in termsKeptInEnglish.

Do not add, remove or soften meaning. If the English is ambiguous, translate the most literal reading and set uncertain to true with a note. Do not answer the content — only translate it.

Standard vocabulary to keep in English: ${KEEP_IN_ENGLISH.join(', ')}.`,
  buildUserPrompt: (input) =>
    `Target language: ${input.target}
Register: ${input.register}
Also keep in English: ${input.keepTermsInEnglish.length ? input.keepTermsInEnglish.join(', ') : '(nothing extra)'}

Text to translate:
---
${input.text}
---`,
  fixture: (input) => translateFixture(input),
});
