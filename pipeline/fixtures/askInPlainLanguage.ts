import type { AskInput, AskOutput } from '../src/schemas/askInPlainLanguage.ts';

type Canned = Pick<AskOutput, 'question' | 'whyWeAsk' | 'example' | 'answerType' | 'choices' | 'glossary'>;

const LIBRARY: Record<string, { en: Canned; hi: Canned }> = {
  'ScheduleOS.dividend': {
    en: {
      question: 'Did any company or mutual fund pay you dividend between April 2025 and March 2026?',
      whyWeAsk:
        'Companies report every dividend they pay you to the tax department under code SFT-015, so it is already in your AIS. If you leave it out, the department sees the gap and sends a notice. It belongs under Income from Other Sources.',
      example: 'Infosys paid you ₹620 in August 2025 and ITC paid ₹310 in November 2025. Total ₹930.',
      answerType: 'yes_no',
      choices: [],
      glossary: [
        { term: 'Dividend', meaning: 'A share of profit a company pays you for holding its shares.' },
        { term: 'Income from Other Sources', meaning: 'The bucket for income that is not salary, house rent or business.' },
        { term: 'AIS', meaning: 'Annual Information Statement — the list of your money the department already has.' },
      ],
    },
    hi: {
      question: 'क्या अप्रैल 2025 से मार्च 2026 के बीच किसी कंपनी या म्यूचुअल फंड ने आपको लाभांश (dividend) दिया?',
      whyWeAsk:
        'कंपनियाँ हर लाभांश (dividend) की जानकारी कोड SFT-015 से विभाग को भेजती हैं, इसलिए यह आपके AIS में पहले से है। न लिखने पर विभाग को अंतर दिखता है और नोटिस आता है। यह "अन्य स्रोतों से आय (Income from Other Sources)" में जाता है।',
      example: 'इंफोसिस ने अगस्त 2025 में ₹620 और ITC ने नवंबर 2025 में ₹310 दिए। कुल ₹930।',
      answerType: 'yes_no',
      choices: [],
      glossary: [
        { term: 'Dividend', meaning: 'कंपनी अपने मुनाफे का जो हिस्सा शेयरधारक को देती है।' },
        { term: 'Income from Other Sources', meaning: 'वह खाना जिसमें वेतन, मकान और व्यापार के अलावा की आय आती है।' },
        { term: 'AIS', meaning: 'वार्षिक सूचना विवरण — आपके पैसे की वह सूची जो विभाग के पास पहले से है।' },
      ],
    },
  },
  'Schedule112A.ltcg': {
    en: {
      question: 'Did you sell any shares or equity mutual funds that you had held for more than one year?',
      whyWeAsk:
        'Long-term gains on listed shares and equity funds are taxed under section 112A at 12.5% above ₹1.25 lakh. Your broker reports each sale, so the department can match it. Capital gains also mean you cannot file ITR-1.',
      example: 'You bought Infosys shares for ₹52,800 in 2023 and sold them for ₹71,600 in November 2025.',
      answerType: 'yes_no',
      choices: [],
      glossary: [
        { term: 'Long Term Capital Gain', meaning: 'Profit on something you held long enough to get a lower tax rate.' },
        { term: 'Section 112A', meaning: 'The rule for tax on long-term profit from listed shares and equity funds.' },
      ],
    },
    hi: {
      question: 'क्या आपने ऐसे शेयर या इक्विटी म्यूचुअल फंड बेचे जो आपके पास एक साल से ज्यादा थे?',
      whyWeAsk:
        'सूचीबद्ध शेयरों पर लंबी अवधि का लाभ धारा 112A में ₹1.25 लाख से ऊपर 12.5% कर लगता है। आपका ब्रोकर हर बिक्री की सूचना देता है, इसलिए विभाग मिलान कर सकता है। पूँजीगत लाभ होने पर ITR-1 नहीं भर सकते।',
      example: 'आपने 2023 में ₹52,800 के इंफोसिस शेयर खरीदे और नवंबर 2025 में ₹71,600 में बेचे।',
      answerType: 'yes_no',
      choices: [],
      glossary: [
        { term: 'Long Term Capital Gain', meaning: 'लंबे समय तक रखी चीज़ बेचने पर हुआ मुनाफा, जिस पर कर कम लगता है।' },
        { term: 'Section 112A', meaning: 'सूचीबद्ध शेयर और इक्विटी फंड के लंबी अवधि के मुनाफे पर कर का नियम।' },
      ],
    },
  },
  'bank.prevalidated': {
    en: {
      question: 'Which bank account should your refund go to, and have you pre-validated it on the portal?',
      whyWeAsk:
        'Refunds are paid only into a bank account that is pre-validated and linked to your PAN. If it is not, the refund fails and the return sits unprocessed even though everything else is correct.',
      example: 'HDFC Bank savings account ending 4471, pre-validated on 2 June 2026.',
      answerType: 'choice',
      choices: ['Yes, already pre-validated', 'No, not yet', 'I do not know'],
      glossary: [
        { term: 'Pre-validation', meaning: 'A one-time check that the account number and PAN belong to the same person.' },
      ],
    },
    hi: {
      question: 'आपका रिफंड किस बैंक खाते में आना चाहिए, और क्या वह पोर्टल पर पूर्व-सत्यापित (pre-validated) है?',
      whyWeAsk:
        'रिफंड केवल उसी बैंक खाते में आता है जो पूर्व-सत्यापित (pre-validated) हो और आपके PAN से जुड़ा हो। ऐसा न होने पर रिफंड लौट जाता है और बाकी सब सही होने पर भी रिटर्न अटका रहता है।',
      example: 'HDFC बैंक बचत खाता, अंतिम अंक 4471, 2 जून 2026 को पूर्व-सत्यापित।',
      answerType: 'choice',
      choices: ['हाँ, पहले से पूर्व-सत्यापित है', 'नहीं, अभी नहीं', 'मुझे नहीं पता'],
      glossary: [
        { term: 'Pre-validation', meaning: 'एक बार की जाँच कि खाता संख्या और PAN एक ही व्यक्ति के हैं।' },
      ],
    },
  },
};

const GENERIC: { en: Canned; hi: Canned } = {
  en: {
    question: 'Did you have any income or claim of this kind during the year April 2025 to March 2026?',
    whyWeAsk:
      'The department already receives this information from banks, employers and brokers. We ask so that what you file matches what it has, because a mismatch is what turns into a notice weeks after filing.',
    example: 'For instance, ₹4,820 of savings bank interest credited across the year.',
    answerType: 'yes_no',
    choices: [],
    glossary: [{ term: 'Schedule', meaning: 'A section of the return form for one specific kind of income or claim.' }],
  },
  hi: {
    question: 'क्या अप्रैल 2025 से मार्च 2026 के बीच आपकी इस तरह की कोई आय या दावा था?',
    whyWeAsk:
      'यह जानकारी विभाग को बैंक, नियोक्ता और ब्रोकर पहले ही भेज चुके हैं। हम इसलिए पूछते हैं ताकि आपका रिटर्न उनसे मेल खाए, क्योंकि अंतर रहने पर कुछ हफ्तों बाद नोटिस आता है।',
    example: 'जैसे, साल भर में बचत खाते का ब्याज ₹4,820।',
    answerType: 'yes_no',
    choices: [],
    glossary: [{ term: 'Schedule', meaning: 'रिटर्न फॉर्म का वह हिस्सा जो एक खास तरह की आय या दावे के लिए है।' }],
  },
};

export function askInPlainLanguageFixture(input: AskInput): AskOutput {
  const entry = LIBRARY[input.fieldId] ?? GENERIC;
  const canned = entry[input.language];
  const prefill = input.persona.knownFacts[0] ?? null;
  return {
    fieldId: input.fieldId,
    language: input.language,
    ...canned,
    prefillHint: prefill,
    uncertain: false,
    uncertaintyNotes: [],
  };
}
