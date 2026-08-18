import type { NoticeInput, NoticeOutput } from '../src/schemas/readNotice.ts';

/**
 * Persona 5: filed ITR-1, forgot the dividend and one FD interest line.
 * CPC issued a 143(1) with a small demand.
 */
const BASE_143_1: NoticeOutput = {
  type: '143(1)',
  din: 'CPC/2627/A1/2610445123',
  assessmentYear: '2026-27',
  noticeDate: '2026-10-14',
  dueDate: '2026-11-13',
  errorCodes: [],
  netOutcome: { kind: 'demand', amount: 6180 },
  differences: [
    { item: 'Income from Other Sources', cpc: 24260, taxpayer: 4820, delta: 19440, note: 'Dividend and FD interest reported in AIS were not declared.' },
    { item: 'Gross Total Income', cpc: 1129260, taxpayer: 1109820, delta: 19440, note: null },
    { item: 'Total Tax Payable', cpc: 51991, taxpayer: 45811, delta: 6180, note: null },
    { item: 'TDS credit allowed', cpc: 45811, taxpayer: 45811, delta: 0, note: 'No difference in TDS.' },
  ],
  rootCause: {
    en: 'Dividend of ₹1,040 and fixed-deposit interest of ₹18,400 were already in your AIS but were left out of Income from Other Sources, so CPC added them back.',
    hi: '₹1,040 का लाभांश (dividend) और ₹18,400 का सावधि जमा ब्याज आपके AIS में पहले से थे, पर "अन्य स्रोतों से आय" में नहीं लिखे गए, इसलिए CPC ने उन्हें जोड़ दिया।',
  },
  recommendedAction: 'revised_139_5',
  actionRationale: {
    en: 'The figures CPC added are correct, so disagreeing would fail. This is an omission, not an arithmetic mistake, so rectification under 154 does not apply. File a revised return under 139(5) before 31 December 2026 and pay the difference.',
    hi: 'CPC ने जो आँकड़े जोड़े वे सही हैं, इसलिए असहमति काम नहीं आएगी। यह गणना की भूल नहीं बल्कि छूट गई आय है, इसलिए 154 का सुधार लागू नहीं होता। 31 दिसंबर 2026 से पहले 139(5) में संशोधित रिटर्न भरें और अंतर चुकाएँ।',
  },
  draftedResponse:
    'To, The Assessing Officer, CPC Bengaluru\n\nSub: Response to intimation under section 143(1), DIN CPC/2627/A1/2610445123, AY 2026-27\n\nSir/Madam,\n\nI have examined the intimation dated 14 October 2026. I accept the addition of Rs. 19,440 to Income from Other Sources, being dividend of Rs. 1,040 and interest on fixed deposits of Rs. 18,400 reflected in my Annual Information Statement, which were inadvertently omitted from my original return.\n\nI am filing a revised return under section 139(5) for AY 2026-27 incorporating this income, and will pay the resulting demand of Rs. 6,180 along with applicable interest. I request that the revised return be taken on record.\n\nYours faithfully,\n[Name]\nPAN: [PAN]',
  summary: {
    en: 'The department checked your return against what banks and companies reported. It found ₹19,440 of interest and dividend you did not declare and has asked for ₹6,180 more tax. The fix is to file a revised return with that income included and pay the difference.',
    hi: 'विभाग ने आपके रिटर्न की तुलना बैंक और कंपनियों की सूचना से की। ₹19,440 का ब्याज और लाभांश आपने नहीं बताया था, इसलिए ₹6,180 कर और माँगा गया है। हल यह है कि वह आय जोड़कर संशोधित रिटर्न भरें और अंतर चुका दें।',
  },
  deadlineWarning: {
    en: 'Respond within 30 days of 14 October 2026. A revised return can be filed up to 31 December 2026.',
    hi: '14 अक्टूबर 2026 से 30 दिन के भीतर जवाब दें। संशोधित रिटर्न 31 दिसंबर 2026 तक भरा जा सकता है।',
  },
  confidence: 0.88,
  uncertain: false,
  uncertaintyNotes: [],
};

const BASE_139_9: NoticeOutput = {
  type: '139(9)',
  din: 'CPC/2627/D9/2607781904',
  assessmentYear: '2026-27',
  noticeDate: '2026-09-02',
  dueDate: '2026-09-17',
  errorCodes: ['31', 'RULE_11B'],
  netOutcome: { kind: 'defect', amount: 0 },
  differences: [
    { item: 'Form used', cpc: 2, taxpayer: 1, delta: 1, note: 'Capital gains were declared in a form that does not allow them.' },
    { item: 'Capital gains declared', cpc: 18800, taxpayer: 18800, delta: 0, note: 'The amount itself is not disputed.' },
  ],
  rootCause: {
    en: 'You sold shares during the year, which is capital gains income. ITR-1 cannot carry capital gains beyond the small 112A carve-out, so the return was marked defective.',
    hi: 'आपने साल में शेयर बेचे, जो पूँजीगत लाभ (capital gains) है। ITR-1 में इतनी पूँजीगत आय नहीं दिखाई जा सकती, इसलिए रिटर्न दोषपूर्ण घोषित हुआ।',
  },
  recommendedAction: 'respond_139_9',
  actionRationale: {
    en: 'A defective return must be corrected through the 139(9) response itself, within 15 days. Filing a fresh revised return instead leaves the defect open and the original return can be treated as never filed.',
    hi: 'दोषपूर्ण रिटर्न को 139(9) के जवाब से ही, 15 दिन के भीतर ठीक करना होता है। इसके बदले नया संशोधित रिटर्न भरने पर दोष बना रहता है और मूल रिटर्न न भरा हुआ माना जा सकता है।',
  },
  draftedResponse:
    'To, The Assessing Officer, CPC Bengaluru\n\nSub: Response to notice under section 139(9), DIN CPC/2627/D9/2607781904, AY 2026-27\n\nSir/Madam,\n\nI have received the notice dated 2 September 2026 identifying error code 31, namely that capital gains have been reported in a return form that does not permit them. I agree with the defect.\n\nI am filing the corrected return in Form ITR-2 in response to this notice under section 139(9), reporting the capital gains of Rs. 18,800 under Schedule CG with all other particulars unchanged from the original return.\n\nYours faithfully,\n[Name]\nPAN: [PAN]',
  summary: {
    en: 'Your return was not rejected for its numbers but for its form. Because you sold shares, the return has to be ITR-2. Refile the same details in ITR-2 as a response to this notice within 15 days.',
    hi: 'आपका रिटर्न आँकड़ों की वजह से नहीं, फॉर्म की वजह से रुका है। शेयर बेचे हैं इसलिए ITR-2 भरना होगा। वही जानकारी ITR-2 में डालकर 15 दिन के भीतर इस नोटिस का जवाब दें।',
  },
  deadlineWarning: {
    en: 'You have 15 days from 2 September 2026. If you miss it, the return is treated as never filed.',
    hi: '2 सितंबर 2026 से 15 दिन का समय है। चूक गए तो रिटर्न न भरा हुआ माना जाएगा।',
  },
  confidence: 0.9,
  uncertain: false,
  uncertaintyNotes: [],
};

export function readNoticeFixture(input: NoticeInput): NoticeOutput {
  const text = input.noticeText.toLowerCase();
  const is139_9 = text.includes('139(9)') || text.includes('defective');
  const base = is139_9 ? BASE_139_9 : BASE_143_1;
  return {
    ...base,
    assessmentYear: input.filedReturn.assessmentYear || base.assessmentYear,
  };
}

export { BASE_143_1 as readNotice143_1Fixture, BASE_139_9 as readNotice139_9Fixture };
