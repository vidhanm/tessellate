/**
 * Turns a persona (or a set of interview answers) into the shapes the tax
 * engine and the form selector expect. One place, so review, preflight and
 * submit can never disagree about the numbers they show.
 */
import type { Persona } from "@/lib/schemas";
import { compareRegimes, computeTax } from "@/lib/tax/compute";
import { selectForm, type FormDecision } from "@/lib/tax/formSelector";

export function deriveFor(persona: Persona) {
  const comparison = compareRegimes(persona.taxInput);
  const chosen = comparison.recommended === "new" ? comparison.new : comparison.old;
  const decision: FormDecision = selectForm({
    ...persona.sources,
    totalIncome: chosen.grossTotalIncome,
  });
  return { comparison, chosen, decision };
}

export function incomeByHead(persona: Persona) {
  const t = persona.taxInput;
  return [
    { head: "Salary", amount: t.grossSalary, note: "Gross, before deductions" },
    { head: "House property", amount: t.housePropertyIncome, note: "Negative means a home-loan interest loss" },
    { head: "Business or profession", amount: t.businessIncome, note: "Presumptive or actual profit" },
    {
      head: "Capital gains",
      amount: t.shortTermCapitalGains + t.longTermCapitalGains,
      note: "Taxed at their own rates, not your slab",
    },
    {
      head: "Other sources",
      amount: t.interestIncome + t.dividendIncome + t.otherIncome,
      note: "Bank interest and dividends",
    },
  ].filter((row) => row.amount !== 0);
}

export { computeTax, compareRegimes, selectForm };
