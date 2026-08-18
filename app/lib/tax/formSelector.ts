/**
 * Which ITR form? This is the question that stops first-time filers cold, and
 * the department's own guidance answers it with a wall of eligibility prose.
 * Here it is rules, and every rule that fires explains itself.
 */
import type { IncomeSources } from "@/lib/schemas";

export type ITRForm = "ITR-1" | "ITR-2" | "ITR-3" | "ITR-4";

export type FormDecision = {
  form: ITRForm;
  /** Why we landed here, in words a first-timer can check. */
  reasons: string[];
  /** Forms ruled out, and what ruled them out. */
  ruledOut: { form: ITRForm; because: string }[];
  confidence: "high" | "medium";
};

const ITR1_INCOME_CEILING = 5_000_000;
const ITR1_AGRI_CEILING = 5_000;
const ITR4_TURNOVER_CEILING = 20_000_000;

export type FormSelectorInput = IncomeSources & {
  totalIncome?: number;
};

export function selectForm(input: FormSelectorInput): FormDecision {
  const reasons: string[] = [];
  const ruledOut: FormDecision["ruledOut"] = [];
  const totalIncome = input.totalIncome ?? 0;

  const ruleOut = (form: ITRForm, because: string) => {
    if (!ruledOut.some((r) => r.form === form && r.because === because)) {
      ruledOut.push({ form, because });
    }
  };

  // --- Disqualifiers for the simple forms (ITR-1 and ITR-4 share most of these).
  const simpleFormBlockers: string[] = [];
  if (input.capitalGains) {
    simpleFormBlockers.push("you sold shares, mutual funds or property, so you have capital gains");
  }
  if (input.housePropertyCount > 1) {
    simpleFormBlockers.push(`you own ${input.housePropertyCount} house properties (the simple forms allow only one)`);
  }
  if (input.agriculturalIncome > ITR1_AGRI_CEILING) {
    simpleFormBlockers.push(`your agricultural income of ₹${input.agriculturalIncome.toLocaleString("en-IN")} is above the ₹5,000 limit`);
  }
  if (input.foreignAssetsOrIncome) {
    simpleFormBlockers.push("you hold foreign assets or earned foreign income");
  }
  if (input.directorInCompany) {
    simpleFormBlockers.push("you are a director in a company");
  }
  if (input.unlistedShares) {
    simpleFormBlockers.push("you held unlisted equity shares during the year");
  }
  if (input.cryptoVDA) {
    simpleFormBlockers.push("you traded virtual digital assets (crypto), which need Schedule VDA");
  }
  if (totalIncome > ITR1_INCOME_CEILING) {
    simpleFormBlockers.push(`your total income of ₹${totalIncome.toLocaleString("en-IN")} is above ₹50 lakh`);
  }

  // --- ITR-3: any real business or profession beats everything else.
  if (input.business && !input.presumptiveBusiness) {
    reasons.push("You have income from a business or profession with regular books, which only ITR-3 can carry.");
    if (input.capitalGains) reasons.push("ITR-3 also carries your capital gains, so nothing gets left out.");
    ruleOut("ITR-1", "ITR-1 has no place to report business income.");
    ruleOut("ITR-2", "ITR-2 covers capital gains but not business income.");
    ruleOut("ITR-4", "ITR-4 is only for presumptive business income declared under 44AD/44ADA/44AE.");
    return { form: "ITR-3", reasons, ruledOut, confidence: "high" };
  }

  // --- ITR-4 (Sugam): presumptive business, but only if nothing complex is present.
  if (input.presumptiveBusiness) {
    if (simpleFormBlockers.length === 0 && totalIncome <= ITR4_TURNOVER_CEILING) {
      reasons.push("You declare business or professional income on a presumptive basis (44AD/44ADA/44AE), which is exactly what ITR-4 Sugam is for.");
      if (input.salary) reasons.push("ITR-4 also accommodates your salary income alongside the presumptive business.");
      ruleOut("ITR-1", "ITR-1 cannot report presumptive business income.");
      ruleOut("ITR-3", "ITR-3 would work but demands full books of account you do not need to keep.");
      return { form: "ITR-4", reasons, ruledOut, confidence: "high" };
    }
    reasons.push("You have presumptive business income, but ITR-4 is closed to you because " + simpleFormBlockers[0] + ".");
    reasons.push("ITR-3 is the fallback that can report presumptive income together with everything else.");
    ruleOut("ITR-4", simpleFormBlockers[0]);
    ruleOut("ITR-1", "ITR-1 cannot report business income at all.");
    return { form: "ITR-3", reasons, ruledOut, confidence: "medium" };
  }

  // --- ITR-2: salary/house/other sources plus anything ITR-1 cannot hold.
  if (simpleFormBlockers.length > 0) {
    reasons.push("You need ITR-2 because " + simpleFormBlockers[0] + ".");
    for (const extra of simpleFormBlockers.slice(1)) {
      reasons.push("Also: " + extra + ".");
    }
    reasons.push("ITR-2 covers salary, house property, other sources and capital gains — everything you have, with no business income involved.");
    for (const blocker of simpleFormBlockers) ruleOut("ITR-1", blocker);
    ruleOut("ITR-4", "You have no presumptive business income to declare.");
    ruleOut("ITR-3", "You have no business or professional income, so ITR-3's extra schedules are unnecessary.");
    return { form: "ITR-2", reasons, ruledOut, confidence: "high" };
  }

  // --- ITR-1 (Sahaj): the default for a plain salaried first-timer.
  if (input.salary) reasons.push("Your income is salary, which ITR-1 Sahaj handles.");
  if (input.housePropertyCount === 1) {
    reasons.push(
      input.housePropertyLoss
        ? "You have one house property with a loss (home-loan interest), and ITR-1 allows a loss of up to ₹2 lakh under this head."
        : "You have one house property, which is the most ITR-1 allows.",
    );
  }
  if (input.otherSources) reasons.push("Your bank interest and dividends go under 'income from other sources', which ITR-1 includes.");
  if (input.agriculturalIncome > 0) reasons.push(`Your agricultural income of ₹${input.agriculturalIncome.toLocaleString("en-IN")} is within the ₹5,000 that ITR-1 permits.`);
  if (reasons.length === 0) reasons.push("Nothing in your answers needs a more complex form, so ITR-1 Sahaj is the shortest route.");

  ruleOut("ITR-2", "You have no capital gains, second property or foreign assets, so ITR-2's extra schedules would sit empty.");
  ruleOut("ITR-3", "You have no business or professional income.");
  ruleOut("ITR-4", "You have no presumptive business income.");

  return { form: "ITR-1", reasons, ruledOut, confidence: "high" };
}

export const FORM_DESCRIPTIONS: Record<ITRForm, string> = {
  "ITR-1": "Sahaj — for a resident with salary, one house property, other sources and total income up to ₹50 lakh.",
  "ITR-2": "For individuals with capital gains, more than one house property, foreign assets or income above ₹50 lakh — but no business income.",
  "ITR-3": "For individuals with income from a business or profession, with full books of account.",
  "ITR-4": "Sugam — for presumptive business or professional income under sections 44AD, 44ADA or 44AE.",
};
