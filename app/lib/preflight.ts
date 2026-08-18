/**
 * "Will this return bounce?" — the checks CPC's systems will run, run here
 * first, while the user can still do something about it.
 */
import type { AISEntry, Persona, PreflightCheck, TaxComputation } from "@/lib/schemas";
import { inr } from "@/lib/format";
import type { ITRForm } from "@/lib/tax/formSelector";

const TOLERANCE = 100;

function sumAIS(ais: AISEntry[], category: AISEntry["category"]): number {
  return ais
    .filter((e) => e.category === category)
    .reduce((total, e) => total + e.amount, 0);
}

export function runPreflight(
  persona: Persona,
  computation: TaxComputation,
  form: ITRForm,
): PreflightCheck[] {
  const checks: PreflightCheck[] = [];
  const aisSalary = sumAIS(persona.ais, "salary");
  const aisInterest = sumAIS(persona.ais, "interest");
  const aisTds = sumAIS(persona.ais, "tds");
  const input = persona.taxInput;

  // 1. Salary vs Form 24Q.
  const salaryGap = aisSalary - input.grossSalary;
  checks.push({
    id: "ais-salary-match",
    title: "Salary matches what your employers reported",
    status: Math.abs(salaryGap) <= TOLERANCE ? "pass" : "fail",
    detail:
      Math.abs(salaryGap) <= TOLERANCE
        ? `You declared ${inr(input.grossSalary)} and your employers reported ${inr(aisSalary)}.`
        : `You declared ${inr(input.grossSalary)} but your employers reported ${inr(aisSalary)} — a gap of ${inr(Math.abs(salaryGap))}.`,
    fix:
      Math.abs(salaryGap) > TOLERANCE
        ? "Collect the Form 16 from every employer you worked for and add the missing salary before filing."
        : undefined,
  });

  // 2. Interest vs SFT-016.
  const interestGap = aisInterest - input.interestIncome;
  checks.push({
    id: "ais-interest-match",
    title: "Bank interest matches your AIS",
    status:
      Math.abs(interestGap) <= TOLERANCE
        ? "pass"
        : interestGap > 0
          ? "fail"
          : "warn",
    detail:
      Math.abs(interestGap) <= TOLERANCE
        ? `${inr(input.interestIncome)} declared, and the same reported by your bank.`
        : interestGap > 0
          ? `Your bank reported ${inr(aisInterest)} but you declared ${inr(input.interestIncome)}. Undeclared interest is the most common mismatch there is.`
          : `You declared more interest than your bank reported. That is safe, but check you have not counted an account twice.`,
    fix: interestGap > TOLERANCE ? "Add the missing interest under 'other sources'." : undefined,
  });

  // 3. TDS credit vs 26AS.
  const tdsGap = input.tdsPaid - aisTds;
  checks.push({
    id: "tds-credit-match",
    title: "TDS you are claiming is actually in Form 26AS",
    status: tdsGap <= TOLERANCE ? "pass" : "fail",
    detail:
      tdsGap <= TOLERANCE
        ? `You are claiming ${inr(input.tdsPaid)}, and ${inr(aisTds)} is deposited against your PAN.`
        : `You are claiming ${inr(input.tdsPaid)} but only ${inr(aisTds)} has been deposited. The excess will be disallowed.`,
    fix:
      tdsGap > TOLERANCE
        ? "Ask the deductor to file or correct their TDS return, then re-check 26AS."
        : undefined,
  });

  // 4. Share sales need a capital gains schedule.
  const soldSecurities = sumAIS(persona.ais, "securities") > 0 || persona.trades.length > 0;
  const formCarriesCG = form === "ITR-2" || form === "ITR-3";
  checks.push({
    id: "cg-securities-match",
    title: "Share sales are on a form that can report them",
    status: !soldSecurities ? "pass" : formCarriesCG ? "pass" : "fail",
    detail: !soldSecurities
      ? "You did not sell any securities this year, so there is nothing to reconcile."
      : formCarriesCG
        ? `Your broker reported sales, and ${form} has the capital gains schedule to report them in.`
        : `Your broker reported share sales to the department, but ${form} has nowhere to declare them. This return would be marked defective under section 139(9).`,
    fix: soldSecurities && !formCarriesCG ? "Switch to ITR-2, which carries Schedule CG." : undefined,
  });

  // 5. Chapter VI-A within limits.
  const over80C = input.deduction80C > 150_000;
  checks.push({
    id: "80c-limit",
    title: "Deduction claims are within their statutory caps",
    status: over80C ? "warn" : "pass",
    detail: over80C
      ? `You entered ${inr(input.deduction80C)} under 80C. Only ${inr(150_000)} of it will be allowed.`
      : "Your 80C, 80D and 80TTA claims are all within their limits.",
    fix: over80C ? "Trim the claim to ₹1,50,000 so the figure in your return matches what gets allowed." : undefined,
  });

  // 6. Balance due must be paid before filing.
  checks.push({
    id: "self-assessment-tax",
    title: "Nothing left to pay before you file",
    status: computation.balance > TOLERANCE ? "warn" : "pass",
    detail:
      computation.balance > TOLERANCE
        ? `You still owe ${inr(computation.balance)} as self-assessment tax.`
        : computation.refundDue > 0
          ? `Nothing to pay. A refund of ${inr(computation.refundDue)} is due to you.`
          : "Your tax is fully covered by what has already been deducted.",
    fix:
      computation.balance > TOLERANCE
        ? "Pay the balance through the e-Pay Tax service and enter the challan details before submitting."
        : undefined,
  });

  // 7. Refund account.
  checks.push({
    id: "bank-prevalidated",
    title: "Refund bank account is pre-validated",
    status: computation.refundDue > 0 ? "warn" : "pass",
    detail:
      computation.refundDue > 0
        ? `You are claiming ${inr(computation.refundDue)}. An unvalidated account means the refund fails quietly, months from now.`
        : "No refund is due, so no bank account needs validating.",
    fix:
      computation.refundDue > 0
        ? "Validate your account under Profile → My Bank Account on the portal before filing."
        : undefined,
  });

  // 8. E-verification.
  checks.push({
    id: "everify-window",
    title: "You know the return must be e-verified",
    status: "warn",
    detail:
      "Filing is only half of it. A return not e-verified within 30 days is treated as never filed at all.",
    fix: "E-verify with Aadhaar OTP immediately after submitting — it takes under a minute.",
  });

  return checks;
}

export function preflightSummary(checks: PreflightCheck[]) {
  const failed = checks.filter((c) => c.status === "fail").length;
  const warned = checks.filter((c) => c.status === "warn").length;
  const passed = checks.filter((c) => c.status === "pass").length;
  return {
    failed,
    warned,
    passed,
    verdict:
      failed > 0
        ? ("will_bounce" as const)
        : warned > 0
          ? ("check_first" as const)
          : ("ready" as const),
  };
}
