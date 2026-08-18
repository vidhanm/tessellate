import { withMock } from '../client.ts';
import { RecommendInput, RecommendOutput } from '../schemas/recommendFormAndRegime.ts';
import { recommendFormAndRegimeFixture } from '../../fixtures/recommendFormAndRegime.ts';

export const recommendFormAndRegime = withMock({
  name: 'recommendFormAndRegime',
  description:
    'Explain, in English and Hindi, the ITR form and tax regime that deterministic code already chose — with rule citations.',
  inputSchema: RecommendInput,
  outputSchema: RecommendOutput,
  systemPrompt: `You explain a decision that has already been made. You are not making it.

The "deterministic" block was produced by tested code: the form-selection rules of RULES.md §1 and the FY 2025-26 tax engine. Treat every figure in it as settled fact.

Absolute constraints:
- form.value MUST equal deterministic.chosenForm, character for character.
- regime.value MUST equal deterministic.recommendedRegime.
- Every rupee figure you write MUST appear in the input. Do not add, subtract, round, convert to lakhs, or restate a number in a different unit. If you want to mention the saving, use deterministic.savingsVsAlternative exactly.
- Never say "you will save roughly", "about", or "approximately". The numbers are exact.
- If you believe the deterministic numbers are wrong, do not correct them. Set uncertain to true, say why in uncertaintyNotes, and lower confidence.

Every reason must carry a citation:
- Form reasons cite RULES.md#1-which-itr-form and quote the condition row that fired.
- Regime reasons cite RULES.md#3-regime-comparison.
- ruleText is the clause itself, not a paraphrase of your own sentence.

Writing:
- Speak to one person, second person, present tense. "You sold mutual fund units, so you have capital gains."
- Lead with the fact, then the consequence. Never lead with the section number.
- Hindi is Devanagari, short sentences, everyday words, tax terms in English in round brackets: "पूँजीगत लाभ (capital gains)". Form names stay as ITR-1 / ITR-2. Rupee amounts stay in digits with the ₹ sign.
- Headlines are at most 20 words, explanations at most 80 words, in each language.

confidence: 0.9 or above when the facts and the deterministic block agree cleanly; below 0.6 when the facts look incomplete (for example capital gains present but no flag set) — and then uncertain must be true.`,
  buildUserPrompt: (input) => {
    const income = Object.entries(input.facts.incomeByHead)
      .filter(([, value]) => value !== 0)
      .map(([head, value]) => `  ${head}: ${value}`)
      .join('\n');
    const deductions = Object.entries(input.facts.deductions)
      .map(([section, value]) => `  ${section}: ${value}`)
      .join('\n');
    const flags = Object.entries(input.facts.flags)
      .filter(([, value]) => value)
      .map(([flag]) => `  ${flag}`)
      .join('\n');

    return `TAXPAYER FACTS
Assessment year: ${input.facts.assessmentYear}
Residential status: ${input.facts.residentialStatus}
Age: ${input.facts.age}
Income by head (₹):
${income || '  (none)'}
Deductions claimed (₹):
${deductions || '  (none)'}
Flags set:
${flags || '  (none)'}

DETERMINISTIC OUTPUT FROM CODE — TRUST THESE, DO NOT RECOMPUTE
${JSON.stringify(input.deterministic, null, 2)}

Write the explanation in ${input.language.join(' and ')}. Both "en" and "hi" fields are always required.`;
  },
  fixture: (input) => recommendFormAndRegimeFixture(input),
});
