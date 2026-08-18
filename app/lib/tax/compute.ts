/**
 * Simplified income-tax computation for FY 2025-26 (AY 2026-27).
 *
 * Scope, stated honestly: resident individual, below 60, no surcharge edge cases
 * beyond the flat bands below, no relief u/s 89, no set-off of brought-forward
 * losses. Enough to be *correct for the common salaried case* and to be worth
 * arguing with — not a substitute for the department's own calculator.
 */
import type { Regime, TaxComputation, TaxInput } from "@/lib/schemas";

export const AY = "2026-27";
export const FY = "2025-26";

export type Slab = { upto: number; rate: number };

/** Budget 2025 slabs, default (new) regime. */
export const NEW_REGIME_SLABS: Slab[] = [
  { upto: 400_000, rate: 0 },
  { upto: 800_000, rate: 0.05 },
  { upto: 1_200_000, rate: 0.1 },
  { upto: 1_600_000, rate: 0.15 },
  { upto: 2_000_000, rate: 0.2 },
  { upto: 2_400_000, rate: 0.25 },
  { upto: Infinity, rate: 0.3 },
];

/** Old regime slabs, individual below 60. */
export const OLD_REGIME_SLABS: Slab[] = [
  { upto: 250_000, rate: 0.05 * 0 },
  { upto: 500_000, rate: 0.05 },
  { upto: 1_000_000, rate: 0.2 },
  { upto: Infinity, rate: 0.3 },
];

export const STANDARD_DEDUCTION = { new: 75_000, old: 50_000 } as const;
export const CESS_RATE = 0.04;

/** s.111A — short-term gains on listed equity. */
export const STCG_RATE = 0.2;
/** s.112A — long-term gains on listed equity, above the exempt slice. */
export const LTCG_RATE = 0.125;
export const LTCG_EXEMPT = 125_000;

export const LIMITS = {
  s80C: 150_000,
  s80D: 25_000,
  s80TTA: 10_000,
} as const;

export function round(n: number): number {
  return Math.round(n);
}

export function clampDeduction(claimed: number, limit: number): number {
  return Math.max(0, Math.min(claimed, limit));
}

/** Walk the slab ladder. Pure; the whole engine leans on this. */
export function applySlabs(income: number, slabs: Slab[]) {
  const breakup: TaxComputation["slabBreakup"] = [];
  let lower = 0;
  let tax = 0;
  for (const slab of slabs) {
    if (income <= lower) break;
    const taxableInSlab = Math.min(income, slab.upto) - lower;
    const slabTax = taxableInSlab * slab.rate;
    tax += slabTax;
    breakup.push({
      label:
        slab.upto === Infinity
          ? `Above ${formatLakh(lower)}`
          : `${formatLakh(lower)} – ${formatLakh(slab.upto)}`,
      rate: slab.rate,
      taxableInSlab: round(taxableInSlab),
      tax: round(slabTax),
    });
    lower = slab.upto;
  }
  return { tax, breakup };
}

function formatLakh(n: number): string {
  if (n === 0) return "₹0";
  return `₹${(n / 100_000).toFixed(n % 100_000 === 0 ? 0 : 1)}L`;
}

/**
 * s.87A rebate. New regime: full rebate up to ₹12L of taxable income, capped at
 * ₹60,000, plus marginal relief just above the threshold. Old regime: ₹12,500
 * up to ₹5L. In both cases the rebate is computed on slab income only — special
 * -rate capital gains do not get the benefit.
 */
export function rebate87A(
  regime: Regime,
  totalTaxableIncome: number,
  taxOnSlabIncome: number,
): number {
  if (regime === "old") {
    return totalTaxableIncome <= 500_000 ? Math.min(taxOnSlabIncome, 12_500) : 0;
  }
  if (totalTaxableIncome <= 1_200_000) {
    return Math.min(taxOnSlabIncome, 60_000);
  }
  // Marginal relief: tax can never exceed income earned beyond the threshold.
  const excessIncome = totalTaxableIncome - 1_200_000;
  if (taxOnSlabIncome > excessIncome) {
    return taxOnSlabIncome - excessIncome;
  }
  return 0;
}

/** Flat surcharge bands, simplified (no marginal relief at band edges). */
export function surcharge(regime: Regime, totalIncome: number, tax: number): number {
  if (totalIncome <= 5_000_000) return 0;
  if (totalIncome <= 10_000_000) return tax * 0.1;
  if (totalIncome <= 20_000_000) return tax * 0.15;
  if (regime === "new") return tax * 0.25;
  return totalIncome <= 50_000_000 ? tax * 0.25 : tax * 0.37;
}

export function computeTax(input: TaxInput, regime: Regime): TaxComputation {
  const notes: string[] = [];

  // Under the new regime the s.10 exemptions (HRA, LTA) are not available.
  const salaryAfterExemptions =
    regime === "old"
      ? Math.max(0, input.grossSalary - input.exemptAllowances)
      : input.grossSalary;
  if (regime === "new" && input.exemptAllowances > 0) {
    notes.push(
      `HRA/LTA of ₹${input.exemptAllowances.toLocaleString("en-IN")} is not exempt under the new regime, so it is taxed here.`,
    );
  }

  const standardDeduction =
    input.grossSalary > 0
      ? Math.min(STANDARD_DEDUCTION[regime], salaryAfterExemptions)
      : 0;

  const professionalTax = regime === "old" ? input.professionalTax : 0;
  if (regime === "new" && input.professionalTax > 0) {
    notes.push("Professional tax is not deductible under the new regime.");
  }

  const netSalary = Math.max(
    0,
    salaryAfterExemptions - standardDeduction - professionalTax,
  );

  const otherHeads =
    input.housePropertyIncome +
    input.interestIncome +
    input.dividendIncome +
    input.otherIncome +
    input.businessIncome;

  const specialIncome = input.shortTermCapitalGains + input.longTermCapitalGains;
  const grossTotalIncome = netSalary + otherHeads + specialIncome;

  // Chapter VI-A: old regime only (80CCD(2) aside, which we do not model).
  let chapterVIA = 0;
  if (regime === "old") {
    const c80C = clampDeduction(input.deduction80C, LIMITS.s80C);
    const c80D = clampDeduction(input.deduction80D, LIMITS.s80D);
    const c80TTA = clampDeduction(
      Math.min(input.deduction80TTA, input.interestIncome),
      LIMITS.s80TTA,
    );
    chapterVIA = c80C + c80D + c80TTA;
    if (input.deduction80C > LIMITS.s80C) {
      notes.push(
        `80C is capped at ₹1,50,000 — ₹${(input.deduction80C - LIMITS.s80C).toLocaleString("en-IN")} of your claim does not count.`,
      );
    }
  } else if (input.deduction80C + input.deduction80D + input.deduction80TTA > 0) {
    notes.push(
      "80C / 80D / 80TTA are not available under the new regime — your investments do not reduce tax here.",
    );
  }

  // Chapter VI-A cannot be set against special-rate capital gains.
  const slabIncomeBeforeDeductions = Math.max(0, netSalary + otherHeads);
  const usableDeductions = Math.min(chapterVIA, slabIncomeBeforeDeductions);
  const slabIncome = slabIncomeBeforeDeductions - usableDeductions;
  const totalTaxableIncome = slabIncome + specialIncome;

  const slabs = regime === "new" ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  const { tax: taxOnSlabIncome, breakup } = applySlabs(slabIncome, slabs);

  const ltcgTaxable = Math.max(0, input.longTermCapitalGains - LTCG_EXEMPT);
  const taxOnSpecialRates =
    input.shortTermCapitalGains * STCG_RATE + ltcgTaxable * LTCG_RATE;
  if (input.longTermCapitalGains > 0) {
    notes.push(
      `First ₹1,25,000 of long-term equity gains is exempt; ₹${round(ltcgTaxable).toLocaleString("en-IN")} is taxed at 12.5%.`,
    );
  }

  const taxBeforeRebate = taxOnSlabIncome + taxOnSpecialRates;
  const rebate = rebate87A(regime, totalTaxableIncome, taxOnSlabIncome);
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate);
  const withSurcharge =
    taxAfterRebate + surcharge(regime, totalTaxableIncome, taxAfterRebate);
  const cess = withSurcharge * CESS_RATE;
  const totalTaxLiability = round(withSurcharge + cess);

  const taxesAlreadyPaid = round(input.tdsPaid + input.advanceTaxPaid);
  const balance = totalTaxLiability - taxesAlreadyPaid;

  if (rebate > 0) {
    notes.push(
      `Section 87A rebate of ₹${round(rebate).toLocaleString("en-IN")} applied.`,
    );
  }

  return {
    regime,
    grossTotalIncome: round(grossTotalIncome),
    standardDeduction: round(standardDeduction),
    totalDeductions: round(usableDeductions + standardDeduction + professionalTax),
    totalTaxableIncome: round(totalTaxableIncome),
    slabIncome: round(slabIncome),
    slabBreakup: breakup,
    taxOnSlabIncome: round(taxOnSlabIncome),
    taxOnSpecialRates: round(taxOnSpecialRates),
    taxBeforeRebate: round(taxBeforeRebate),
    rebate87A: round(rebate),
    taxAfterRebate: round(taxAfterRebate),
    cess: round(cess),
    totalTaxLiability,
    taxesAlreadyPaid,
    balance: round(balance),
    refundDue: balance < 0 ? round(-balance) : 0,
    notes,
  };
}

export type RegimeComparison = {
  old: TaxComputation;
  new: TaxComputation;
  recommended: Regime;
  savings: number;
  reason: string;
};

export function compareRegimes(input: TaxInput): RegimeComparison {
  const oldR = computeTax(input, "old");
  const newR = computeTax(input, "new");
  const recommended: Regime =
    newR.totalTaxLiability <= oldR.totalTaxLiability ? "new" : "old";
  const savings = Math.abs(oldR.totalTaxLiability - newR.totalTaxLiability);

  let reason: string;
  if (savings === 0) {
    reason = "Both regimes cost you exactly the same. The new regime needs less paperwork, so take it.";
  } else if (recommended === "new") {
    reason = `The new regime saves you ₹${savings.toLocaleString("en-IN")}. Its ₹75,000 standard deduction and wider slabs beat the deductions you can claim.`;
  } else {
    reason = `The old regime saves you ₹${savings.toLocaleString("en-IN")} because your 80C/80D claims and exempt allowances are worth more than the new regime's wider slabs.`;
  }
  return { old: oldR, new: newR, recommended, savings, reason };
}
