import type { PreflightInput, PreflightOutput } from '../src/schemas/explainPreflight.ts';

type Canned = Pick<PreflightOutput, 'title' | 'whatHappened' | 'whyCpcWouldFlag' | 'consequenceIfIgnored' | 'remedy' | 'citation'>;

const money = (value: unknown): string =>
  typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : String(value ?? 'the amount shown');

const LIBRARY: Record<string, (facts: Record<string, unknown>) => Canned> = {
  AIS_INCOME_NOT_DECLARED: (facts) => ({
    title: { en: 'Income in AIS is missing from your return', hi: 'AIS की आय आपके रिटर्न में नहीं है' },
    whatHappened: {
      en: `Your AIS shows ${money(facts.aisAmount)} of ${String(facts.incomeType ?? 'income')} but your return declares ${money(
        facts.declaredAmount,
      )}. That is a gap of ${money(facts.difference)}.`,
      hi: `आपके AIS में ${money(facts.aisAmount)} की ${String(facts.incomeType ?? 'आय')} दिख रही है, पर रिटर्न में ${money(
        facts.declaredAmount,
      )} लिखा है। ${money(facts.difference)} का अंतर है।`,
    },
    whyCpcWouldFlag: {
      en: 'CPC matches every AIS line against your return automatically. Anything reported by a bank, company or broker but not declared by you shows up as under-reported income.',
      hi: 'CPC हर AIS पंक्ति का मिलान आपके रिटर्न से अपने आप करता है। बैंक, कंपनी या ब्रोकर ने जो बताया और आपने नहीं लिखा, वह कम बताई गई आय बन जाती है।',
    },
    consequenceIfIgnored: {
      en: 'A 143(1) intimation with extra tax and interest, or the return held for risk-management confirmation.',
      hi: '143(1) की सूचना के साथ अतिरिक्त कर और ब्याज, या रिटर्न जाँच के लिए रोक लिया जाना।',
    },
    remedy: [
      {
        order: 1,
        action: {
          en: `Add ${money(facts.difference)} under Income from Other Sources so the total matches AIS.`,
          hi: `${money(facts.difference)} को "अन्य स्रोतों से आय (Other Sources)" में जोड़ें ताकि कुल AIS से मिल जाए।`,
        },
        whereInApp: 'Schedule OS → Other Sources',
        automatable: true,
      },
      {
        order: 2,
        action: {
          en: 'If the AIS entry is genuinely wrong, submit AIS feedback marking it incorrect before you file.',
          hi: 'अगर AIS की प्रविष्टि सचमुच गलत है, तो फाइल करने से पहले AIS फीडबैक में उसे गलत बताएँ।',
        },
        whereInApp: 'AIS → Feedback',
        automatable: false,
      },
    ],
    citation: {
      ruleId: 'AIS_INCOME_NOT_DECLARED',
      ruleText: 'AIS dividend/interest/other > declared by >₹100 → fail. Remedy: add to Other Sources, or give AIS feedback.',
    },
  }),
  BANK_NOT_PREVALIDATED: () => ({
    title: { en: 'Refund account is not pre-validated', hi: 'रिफंड वाला खाता पूर्व-सत्यापित नहीं है' },
    whatHappened: {
      en: 'A refund is due to you, but none of the bank accounts on your profile is pre-validated, so there is nowhere to send the money.',
      hi: 'आपका रिफंड बनता है, पर आपके किसी भी बैंक खाते का पूर्व-सत्यापन (pre-validation) नहीं है, इसलिए पैसा भेजने की जगह नहीं है।',
    },
    whyCpcWouldFlag: {
      en: 'CPC pays refunds only into an account pre-validated against your PAN. Without one the refund fails and the return sits in processing with no reason shown.',
      hi: 'CPC रिफंड केवल उसी खाते में भेजता है जो आपके PAN से पूर्व-सत्यापित हो। ऐसा न होने पर रिफंड अटक जाता है और कारण भी नहीं दिखता।',
    },
    consequenceIfIgnored: {
      en: 'Refund failure; the return stays "under processing" and you have to raise a refund reissue request later.',
      hi: 'रिफंड विफल; रिटर्न "प्रोसेसिंग में" पड़ा रहता है और बाद में रिफंड दोबारा जारी कराने का अनुरोध करना पड़ता है।',
    },
    remedy: [
      {
        order: 1,
        action: {
          en: 'Pre-validate your bank account on the portal using the account number and IFSC.',
          hi: 'खाता संख्या और IFSC देकर पोर्टल पर अपने बैंक खाते का पूर्व-सत्यापन कराएँ।',
        },
        whereInApp: 'Profile → My Bank Accounts',
        automatable: false,
      },
      {
        order: 2,
        action: {
          en: 'Mark it as the account to receive the refund, then run the pre-flight again.',
          hi: 'उसे रिफंड पाने वाला खाता चुनें, फिर जाँच दोबारा चलाएँ।',
        },
        whereInApp: 'Profile → My Bank Accounts',
        automatable: true,
      },
    ],
    citation: {
      ruleId: 'BANK_NOT_PREVALIDATED',
      ruleText: 'Refund due, no prevalidated account → fail. Remedy: pre-validate account.',
    },
  }),
  MULTI_EMPLOYER_DOUBLE_STD_DED: (facts) => ({
    title: { en: 'Standard deduction taken twice', hi: 'मानक कटौती दो बार ली गई है' },
    whatHappened: {
      en: `You have two Form 16s and each employer already gave you the standard deduction, so ${money(
        facts.claimed,
      )} was claimed where only ${money(facts.allowed)} is allowed.`,
      hi: `आपके पास दो फॉर्म 16 हैं और दोनों नियोक्ताओं ने मानक कटौती (standard deduction) दे दी, इसलिए ${money(
        facts.claimed,
      )} का दावा हुआ जबकि केवल ${money(facts.allowed)} ही मिलता है।`,
    },
    whyCpcWouldFlag: {
      en: 'Standard deduction is once per person, not once per employer. CPC adds both Form 16s together and recomputes, so the extra deduction becomes a demand.',
      hi: 'मानक कटौती हर व्यक्ति को एक बार मिलती है, हर नियोक्ता से नहीं। CPC दोनों फॉर्म 16 जोड़कर दोबारा गणना करता है, इसलिए अतिरिक्त कटौती माँग बन जाती है।',
    },
    consequenceIfIgnored: {
      en: 'A 143(1) demand for the extra tax, plus interest under 234B and 234C.',
      hi: '143(1) के तहत अतिरिक्त कर की माँग, साथ में 234B और 234C का ब्याज।',
    },
    remedy: [
      {
        order: 1,
        action: {
          en: 'Add both salaries together and apply the standard deduction only once.',
          hi: 'दोनों वेतन जोड़ें और मानक कटौती केवल एक बार लगाएँ।',
        },
        whereInApp: 'Salary → Employers',
        automatable: true,
      },
      {
        order: 2,
        action: {
          en: 'Check whether both employers also gave the 87A rebate; if so, expect tax payable.',
          hi: 'देखें कि क्या दोनों नियोक्ताओं ने 87A छूट भी दी; अगर हाँ, तो कर देना पड़ सकता है।',
        },
        whereInApp: 'Tax summary',
        automatable: false,
      },
    ],
    citation: {
      ruleId: 'MULTI_EMPLOYER_DOUBLE_STD_DED',
      ruleText: '2 Form 16s, std ded applied twice → fail. Remedy: aggregate salary, single std ded/rebate.',
    },
  }),
};

const GENERIC = (code: string, facts: Record<string, unknown>): Canned => ({
  title: { en: `Check ${code} did not pass`, hi: `जाँच ${code} पास नहीं हुई` },
  whatHappened: {
    en: `The pre-flight check ${code} compared ${Object.keys(facts).join(', ') || 'your entries'} and found a mismatch.`,
    hi: `जाँच ${code} ने ${Object.keys(facts).join(', ') || 'आपकी प्रविष्टियों'} की तुलना की और अंतर पाया।`,
  },
  whyCpcWouldFlag: {
    en: 'The back-office runs the same comparison after you file. What we catch now would otherwise come back as a notice weeks later.',
    hi: 'फाइल करने के बाद विभाग यही तुलना करता है। जो हम अभी पकड़ रहे हैं, वही कुछ हफ्तों बाद नोटिस बनकर आता।',
  },
  consequenceIfIgnored: {
    en: 'A defective return under 139(9) or an intimation under 143(1), with a short window to reply.',
    hi: '139(9) में दोषपूर्ण रिटर्न या 143(1) की सूचना, और जवाब देने के लिए बहुत कम समय।',
  },
  remedy: [
    {
      order: 1,
      action: {
        en: 'Open the flagged entry, compare it with your documents, and correct the figure.',
        hi: 'चिह्नित प्रविष्टि खोलें, अपने दस्तावेज़ों से मिलाएँ और आंकड़ा ठीक करें।',
      },
      whereInApp: null,
      automatable: false,
    },
  ],
  citation: { ruleId: code, ruleText: `See docs/RULES.md §4, row ${code}.` },
});

export function explainPreflightFixture(input: PreflightInput): PreflightOutput {
  const facts = input.check.facts as Record<string, unknown>;
  const builder = LIBRARY[input.check.code];
  const canned = builder ? builder(facts) : GENERIC(input.check.code, facts);
  return {
    code: input.check.code,
    severity: input.check.severity,
    ...canned,
    blocksSubmission: input.check.severity === 'fail',
    uncertain: false,
    uncertaintyNotes: [],
  };
}
