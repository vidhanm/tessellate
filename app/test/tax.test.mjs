import test from "node:test";
import assert from "node:assert/strict";

// The library is TypeScript; node's type stripping handles it, but the "@/"
// alias does not resolve on its own. Tests import via relative paths instead.
const { computeTax, compareRegimes, applySlabs, NEW_REGIME_SLABS, OLD_REGIME_SLABS } =
  await import("../lib/tax/compute.ts");
const { selectForm } = await import("../lib/tax/formSelector.ts");

/** Fill in the zero-value defaults the schema would otherwise supply. */
function input(overrides) {
  return {
    grossSalary: 0,
    exemptAllowances: 0,
    housePropertyIncome: 0,
    interestIncome: 0,
    dividendIncome: 0,
    otherIncome: 0,
    shortTermCapitalGains: 0,
    longTermCapitalGains: 0,
    businessIncome: 0,
    deduction80C: 0,
    deduction80D: 0,
    deduction80TTA: 0,
    professionalTax: 0,
    tdsPaid: 0,
    advanceTaxPaid: 0,
    age: 30,
    ...overrides,
  };
}

test("₹9L salary pays no tax under the new regime (87A rebate)", () => {
  const r = computeTax(input({ grossSalary: 900_000 }), "new");
  assert.equal(r.totalTaxableIncome, 825_000);
  assert.ok(r.rebate87A > 0, "rebate should apply below ₹12L");
  assert.equal(r.totalTaxLiability, 0);
});

test("₹18L salary, new regime: slabs, cess and no rebate", () => {
  const r = computeTax(input({ grossSalary: 1_800_000 }), "new");
  // Taxable 17,25,000 => 20k (4-8L) + 40k (8-12L) + 60k (12-16L) + 25k (16-17.25L)
  assert.equal(r.totalTaxableIncome, 1_725_000);
  assert.equal(r.taxOnSlabIncome, 145_000);
  assert.equal(r.rebate87A, 0);
  assert.equal(r.cess, 5_800);
  assert.equal(r.totalTaxLiability, 150_800);
});

test("old regime deductions are capped and 80C excess is ignored", () => {
  const r = computeTax(
    input({ grossSalary: 1_200_000, deduction80C: 200_000, deduction80D: 40_000 }),
    "old",
  );
  // 12L - 50k std - 1.5L (80C cap) - 25k (80D cap) = 9,75,000
  assert.equal(r.totalTaxableIncome, 975_000);
  assert.ok(r.notes.some((n) => n.includes("80C is capped")));
});

test("capital gains are taxed at special rates outside the slabs", () => {
  const r = computeTax(
    input({ grossSalary: 600_000, longTermCapitalGains: 325_000 }),
    "new",
  );
  // (3,25,000 - 1,25,000) * 12.5% = 25,000
  assert.equal(r.taxOnSpecialRates, 25_000);
  assert.equal(r.slabIncome, 525_000);
});

test("compareRegimes picks the cheaper regime and quantifies it", () => {
  const c = compareRegimes(input({ grossSalary: 1_500_000, deduction80C: 150_000 }));
  assert.ok(["old", "new"].includes(c.recommended));
  assert.equal(
    c.savings,
    Math.abs(c.old.totalTaxLiability - c.new.totalTaxLiability),
  );
  const cheaper = c.recommended === "new" ? c.new : c.old;
  const dearer = c.recommended === "new" ? c.old : c.new;
  assert.ok(cheaper.totalTaxLiability <= dearer.totalTaxLiability);
});

test("slab ladder is continuous and never double-counts", () => {
  const { tax, breakup } = applySlabs(1_000_000, NEW_REGIME_SLABS);
  const summed = breakup.reduce((a, b) => a + b.taxableInSlab, 0);
  assert.equal(summed, 1_000_000);
  assert.equal(tax, 20_000 + 20_000);
  assert.equal(applySlabs(0, OLD_REGIME_SLABS).tax, 0);
});

test("form selector routes capital gains to ITR-2 and business to ITR-3", () => {
  const base = {
    salary: true,
    housePropertyCount: 0,
    housePropertyLoss: false,
    otherSources: true,
    capitalGains: false,
    business: false,
    presumptiveBusiness: false,
    agriculturalIncome: 0,
    foreignAssetsOrIncome: false,
    directorInCompany: false,
    unlistedShares: false,
    cryptoVDA: false,
  };
  assert.equal(selectForm(base).form, "ITR-1");
  assert.equal(selectForm({ ...base, capitalGains: true }).form, "ITR-2");
  assert.equal(selectForm({ ...base, business: true }).form, "ITR-3");
  assert.equal(selectForm({ ...base, presumptiveBusiness: true }).form, "ITR-4");
  assert.equal(selectForm({ ...base, agriculturalIncome: 20_000 }).form, "ITR-2");
  const cg = selectForm({ ...base, capitalGains: true });
  assert.ok(cg.reasons.join(" ").includes("capital gains"));
});
