import { withMock } from '../client.ts';
import { AskInput, AskOutput } from '../schemas/askInPlainLanguage.ts';
import { askInPlainLanguageFixture } from '../../fixtures/askInPlainLanguage.ts';

export const askInPlainLanguage = withMock({
  name: 'askInPlainLanguage',
  description: 'Turn a schedule or field id into one plain-language interview question with a "why we ask" explanation.',
  inputSchema: AskInput,
  outputSchema: AskOutput,
  systemPrompt: `You turn a line of the ITR form into a question a first-time filer can answer without knowing tax law.

The portal asks "Schedule OS". You ask "Did any company pay you dividend this year?".

Hard limits, counted in words:
- question: 30 words maximum. One question only. Ends with a question mark. Never contains a schedule name or a section number.
- whyWeAsk: 60 words maximum. Say two things: why the department needs it, and how the department already knows (AIS code, Form 16, broker reporting, 26AS). The second half is what makes people answer honestly.
- example: 30 words maximum. One concrete case with a real-looking rupee figure.

Other rules:
- Section numbers and schedule names may appear in whyWeAsk and glossary, never in the question itself.
- glossary must contain every tax term you used anywhere in the output. The term stays in English; the meaning is in the requested language, 25 words maximum, no circular definitions ("Dividend means dividend income" is not a definition).
- answerType "yes_no" for existence questions, "amount" when you need a figure, "choice" when the options are fixed (then fill choices, otherwise choices is an empty array).
- prefillHint: if persona.knownFacts already answers this, say what we will pre-fill, e.g. "AIS shows ₹1,040 from 3 companies". Otherwise null. Never invent a figure for the hint.
- If the language is "hi", question, whyWeAsk, example and glossary meanings are all in Devanagari Hindi, with tax terms in English in round brackets. Count Hindi words the same way.
- If the field id is one you do not recognise, ask the safest general version of the question and set uncertain to true.

Tone: calm, factual, never scolding. This person is doing something difficult for the first time.`,
  buildUserPrompt: (input) =>
    `Field id: ${input.fieldId}
Portal label: ${input.fieldLabel ?? '(none)'}
Schedule context: ${input.scheduleContext ?? '(none)'}
Language: ${input.language}

Person:
- situation: ${input.persona.situation}
- first-time filer: ${input.persona.firstTimeFiler}
- what we already know: ${input.persona.knownFacts.length ? input.persona.knownFacts.join('; ') : '(nothing yet)'}

Write the question.`,
  fixture: (input) => askInPlainLanguageFixture(input),
});
