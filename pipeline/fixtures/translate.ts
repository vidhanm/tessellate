import type { TranslateInput, TranslateOutput } from '../src/schemas/translate.ts';

/** Tax vocabulary that always stays in English, in brackets, after the Hindi word. */
export const KEEP_IN_ENGLISH = [
  'standard deduction',
  'capital gains',
  'dividend',
  'refund',
  'assessment year',
  'gross total income',
  'TDS',
  'AIS',
  '26AS',
  'PAN',
  'ITR-1',
  'ITR-2',
  'ITR-3',
  'ITR-4',
  'new regime',
  'old regime',
  'rebate',
  'Form 16',
  'pre-validation',
];

const PHRASES: Record<string, { text: string; terms: string[] }> = {
  'you should file itr-2.': {
    text: 'आपको ITR-2 भरना चाहिए।',
    terms: ['ITR-2'],
  },
  'the new regime saves you more tax.': {
    text: 'नई कर व्यवस्था (new regime) में आपका कर कम लगता है।',
    terms: ['new regime'],
  },
  'your refund will come to your bank account.': {
    text: 'आपका धनवापसी (refund) आपके बैंक खाते में आएगा।',
    terms: ['refund'],
  },
  'we found dividend income in your ais that is not in your return.': {
    text: 'हमें आपके AIS में लाभांश (dividend) की आय मिली है जो आपके रिटर्न में नहीं है।',
    terms: ['dividend', 'AIS'],
  },
  'standard deduction is allowed only once, not once per employer.': {
    text: 'मानक कटौती (standard deduction) केवल एक बार मिलती है, हर नियोक्ता से नहीं।',
    terms: ['standard deduction'],
  },
};

export function translateFixture(input: TranslateInput): TranslateOutput {
  const key = input.text.trim().toLowerCase();
  const hit = PHRASES[key];
  if (hit) {
    return { text: hit.text, termsKeptInEnglish: hit.terms, uncertain: false, uncertaintyNotes: [] };
  }

  const terms = [...KEEP_IN_ENGLISH, ...input.keepTermsInEnglish].filter((term) =>
    key.includes(term.toLowerCase()),
  );

  return {
    text: `[मॉक अनुवाद — mock translation] ${input.text}`,
    termsKeptInEnglish: terms,
    uncertain: true,
    uncertaintyNotes: [
      'Mock mode has no canned Hindi for this exact string; the English text is returned unchanged. Set OPENAI_API_KEY for a real translation.',
    ],
  };
}
