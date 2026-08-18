import type { RecommendInput, RecommendOutput } from '../src/schemas/recommendFormAndRegime.ts';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/**
 * Echoes the deterministic numbers it was handed — exactly the behaviour the
 * prompt demands of the live model, so mock and live demos read the same.
 */
export function recommendFormAndRegimeFixture(input: RecommendInput): RecommendOutput {
  const { chosenForm, recommendedRegime, savingsVsAlternative, formTriggerFacts, requiresForm10IEA } =
    input.deterministic;
  const trigger = formTriggerFacts[0] ?? 'your income is only salary, interest and dividend';
  const regimeWord = recommendedRegime === 'new' ? 'new regime' : 'old regime';
  const regimeHi = recommendedRegime === 'new' ? 'नई कर व्यवस्था (new regime)' : 'पुरानी कर व्यवस्था (old regime)';

  return {
    form: {
      value: chosenForm,
      headline: {
        en: `You should file ${chosenForm}.`,
        hi: `आपको ${chosenForm} भरना चाहिए।`,
      },
      explanation: {
        en: `${chosenForm} is the form that matches what you earned this year — ${trigger}. Filing a different form is the most common reason a return comes back as "defective" a few weeks later, so we picked this one for you from the rules and showed our working below.`,
        hi: `इस साल आपकी जो कमाई है, उसके लिए ${chosenForm} सही फॉर्म है — ${trigger}. गलत फॉर्म भरने पर कुछ हफ्तों बाद रिटर्न "दोषपूर्ण (defective)" हो जाता है। इसीलिए हमने नियम देखकर यह फॉर्म चुना है।`,
      },
      reasons: [
        {
          fact: trigger,
          consequence: {
            en: `This fact is what decides the form, so ${chosenForm} is the first rule that matches.`,
            hi: `यही बात फॉर्म तय करती है, इसलिए सबसे पहले ${chosenForm} का नियम लागू होता है।`,
          },
          citation: {
            ruleId: 'RULES.md#1-which-itr-form',
            ruleText:
              'Evaluate the form conditions in order; the first match wins. Reasons must cite the triggering fact.',
          },
        },
      ],
      whatWouldChangeIt: {
        en: 'If you sell shares or mutual funds, own more than one house, or hold anything abroad, the form changes.',
        hi: 'अगर आप शेयर या म्यूचुअल फंड बेचते हैं, एक से ज्यादा घर रखते हैं, या विदेश में कुछ है, तो फॉर्म बदल जाएगा।',
      },
    },
    regime: {
      value: recommendedRegime,
      headline: {
        en: `The ${regimeWord} saves you ${inr(savingsVsAlternative)}.`,
        hi: `${regimeHi} से आपको ${inr(savingsVsAlternative)} की बचत होती है।`,
      },
      explanation: {
        en: `We calculated your tax both ways with the same income and compared them. Under the ${regimeWord} your total tax comes to ${inr(
          recommendedRegime === 'new' ? input.deterministic.newRegime.totalTax : input.deterministic.oldRegime.totalTax,
        )}, which is ${inr(savingsVsAlternative)} less than the other option. Nothing about your income changes — only which set of rules is applied.`,
        hi: `हमने आपकी वही आय लेकर दोनों तरीकों से कर निकाला और तुलना की। ${regimeHi} में आपका कुल कर ${inr(
          recommendedRegime === 'new' ? input.deterministic.newRegime.totalTax : input.deterministic.oldRegime.totalTax,
        )} बनता है, जो दूसरे विकल्प से ${inr(savingsVsAlternative)} कम है। आपकी आय में कोई बदलाव नहीं होता, सिर्फ नियम बदलते हैं।`,
      },
      reasons: [
        {
          fact: `Total tax under new regime ${inr(input.deterministic.newRegime.totalTax)} vs old regime ${inr(
            input.deterministic.oldRegime.totalTax,
          )}`,
          consequence: {
            en: 'The cheaper of the two is the one we recommend; the difference is the saving shown above.',
            hi: 'दोनों में जो सस्ता है वही हम सुझाते हैं; ऊपर दिखाया अंतर ही आपकी बचत है।',
          },
          citation: {
            ruleId: 'RULES.md#3-regime-comparison',
            ruleText:
              'New regime: standard deduction 75k, 87A rebate to zero tax up to 12L. Old regime: standard deduction 50k, all Chapter VI-A deductions, HRA, 24(b).',
          },
        },
        {
          fact: 'Deduction rules differ between the two regimes',
          consequence: {
            en: 'Under the new regime 80C, 80D, HRA and 80TTA are not allowed; only 80CCD(2) and a few others survive.',
            hi: 'नई व्यवस्था में 80C, 80D, HRA और 80TTA नहीं मिलते; सिर्फ 80CCD(2) जैसे कुछ ही बचते हैं।',
          },
          citation: {
            ruleId: 'RULES.md#3-regime-comparison',
            ruleText: 'NOT allowed under new regime: 80C, 80D, HRA, LTA, 80TTA/TTB, home-loan interest on self-occupied.',
          },
        },
      ],
      deductionsLostIfSwitching: recommendedRegime === 'new' ? ['80C', '80D', '80TTA', 'HRA 10(13A)', '24(b)'] : [],
      deadlineNote: requiresForm10IEA
        ? {
            en: 'Because you have business income, choosing the old regime needs Form 10-IEA filed before the due date, 31 July 2026.',
            hi: 'आपके पास व्यापार से आय है, इसलिए पुरानी व्यवस्था चुनने के लिए नियत तारीख 31 जुलाई 2026 से पहले फॉर्म 10-IEA भरना होगा।',
          }
        : {
            en: 'You can switch regime each year, but only if you file by the due date, 31 July 2026. File late and the choice is lost.',
            hi: 'आप हर साल व्यवस्था बदल सकते हैं, लेकिन तभी जब 31 जुलाई 2026 तक रिटर्न भर दें। देर हुई तो यह विकल्प खत्म हो जाता है।',
          },
    },
    confidence: 0.92,
    uncertain: false,
    uncertaintyNotes: [],
  };
}
