/**
 * The interview is the product. A first-time filer cannot answer "do you have
 * income under the head 'other sources'?" — but they can answer "does your bank
 * pay you interest?". Every step carries the plain question, the reason we are
 * asking, and what the department already knows.
 */

export type StepKind = "yesno" | "amount" | "choice" | "info";

export type InterviewStep = {
  id: string;
  kind: StepKind;
  /** The question in the words a first-timer uses. */
  question: string;
  /** One line under the question. */
  helper?: string;
  /** The "Why are we asking?" expander — this is the teaching surface. */
  why: string;
  /** What the department already sees, so the answer is never a blind guess. */
  departmentKnows?: string;
  options?: { value: string; label: string; sublabel?: string }[];
  /** Which key in the session answers map this writes to. */
  field: string;
  /** Show this step only when the predicate over earlier answers holds. */
  showIf?: (answers: Record<string, unknown>) => boolean;
  section: "identity" | "income" | "deductions" | "taxes";
};

export const SECTIONS: { id: InterviewStep["section"]; label: string }[] = [
  { id: "identity", label: "About you" },
  { id: "income", label: "What you earned" },
  { id: "deductions", label: "What you can claim" },
  { id: "taxes", label: "Tax already paid" },
];

export const steps: InterviewStep[] = [
  {
    id: "residency",
    kind: "choice",
    section: "identity",
    field: "residency",
    question: "Did you live in India for most of last year?",
    helper: "Roughly 182 days or more between 1 April 2025 and 31 March 2026.",
    why: "Residency decides how much of your income India can tax at all. If you lived here, India taxes your worldwide income. If you did not, it taxes only what you earned in India. Nearly everyone filing a first return is a resident.",
    options: [
      { value: "resident", label: "Yes, I was in India", sublabel: "182 days or more" },
      { value: "nri", label: "No, I was mostly abroad", sublabel: "This makes filing more complex" },
    ],
  },
  {
    id: "salary",
    kind: "yesno",
    section: "income",
    field: "hasSalary",
    question: "Did an employer pay you a salary?",
    helper: "Any job where you got a payslip counts, even if you left partway through the year.",
    why: "Salary is the most common head of income and the one your employer has already reported to the department under Form 24Q. If you changed jobs, every employer counts — this is the single most common reason first returns get a notice.",
    departmentKnows: "Your employers have already filed quarterly TDS returns naming you.",
  },
  {
    id: "multipleEmployers",
    kind: "yesno",
    section: "income",
    field: "multipleEmployers",
    question: "Did you work for more than one employer last year?",
    helper: "Include any job you left, not just your current one.",
    why: "Each employer calculates your tax as if they are your only employer, so each one gives you the full standard deduction and the full basic exemption. Added together, too little tax gets deducted. The gap is yours to pay, and the department will find it.",
    showIf: (a) => a.hasSalary === true,
  },
  {
    id: "bankInterest",
    kind: "yesno",
    section: "income",
    field: "hasInterest",
    question: "Does your bank pay you interest on your savings or deposits?",
    helper: "Check the interest line on your bank statement. Almost everyone answers yes.",
    why: "Bank interest is taxable even when it is small and even when no tax was deducted from it. Your bank reports it to the department under SFT-016 whether or not you mention it, so leaving it out is the easiest way to trigger a mismatch.",
    departmentKnows: "Your bank has already reported your interest for the year.",
  },
  {
    id: "interestAmount",
    kind: "amount",
    section: "income",
    field: "interestAmount",
    question: "How much interest did you receive?",
    helper: "We have pre-filled this from your AIS. Change it if your records disagree.",
    why: "Under the old regime the first ₹10,000 of savings-bank interest is deductible under section 80TTA. Fixed-deposit interest does not get that benefit. Either way the full amount is declared first, and the deduction is applied after.",
    showIf: (a) => a.hasInterest === true,
  },
  {
    id: "shares",
    kind: "yesno",
    section: "income",
    field: "hasCapitalGains",
    question: "Did you sell any shares, mutual funds or property?",
    helper: "Selling counts even if you made a loss, and even if the money stayed in your broking account.",
    why: "A single share sale changes which form you must file — from the one-page ITR-1 to the longer ITR-2. Your broker has already reported the sale value to the department, so a return with no capital gains schedule gets marked defective.",
    departmentKnows: "Brokers report gross sale value under SFT-017.",
  },
  {
    id: "houseProperty",
    kind: "choice",
    section: "income",
    field: "houseProperty",
    question: "Do you own a house?",
    helper: "Include a house you live in, and any you rent out.",
    why: "A house you live in has no rental income, but if you pay a home loan you can claim the interest as a loss — up to ₹2 lakh under the old regime. Owning more than one property pushes you out of ITR-1.",
    options: [
      { value: "none", label: "No" },
      { value: "one_self", label: "One, and I live in it" },
      { value: "one_rented", label: "One, and I rent it out" },
      { value: "multiple", label: "More than one" },
    ],
  },
  {
    id: "freelance",
    kind: "yesno",
    section: "income",
    field: "hasBusiness",
    question: "Did you earn anything from freelancing, consulting or a business?",
    helper: "Include side income where a client deducted TDS before paying you.",
    why: "Professional and business income needs a different form, but if your receipts are under ₹50 lakh you can use the presumptive scheme (section 44ADA) — declare half your receipts as profit, keep no books, and file the short ITR-4 instead.",
    departmentKnows: "Clients who deducted TDS filed Form 26Q naming you.",
  },
  {
    id: "investments80C",
    kind: "amount",
    section: "deductions",
    field: "amount80C",
    question: "Did you put money into PPF, ELSS, life insurance or EPF?",
    helper: "Your employer's EPF contribution from your payslip counts too.",
    why: "These qualify for a deduction under section 80C, capped at ₹1,50,000 — but only under the old regime. Under the new regime they are worth nothing in tax terms, which is exactly the comparison we will show you at the end.",
  },
  {
    id: "healthInsurance",
    kind: "amount",
    section: "deductions",
    field: "amount80D",
    question: "Did you pay a health insurance premium?",
    helper: "For yourself, your spouse, your children or your parents.",
    why: "Section 80D allows up to ₹25,000 for your own family's premium, and more if you also insure parents. Like 80C, this only counts under the old regime.",
  },
  {
    id: "tds",
    kind: "info",
    section: "taxes",
    field: "tdsConfirmed",
    question: "Here is the tax already deducted in your name",
    helper: "Pulled from Form 26AS. This is money you have already paid.",
    why: "TDS is tax your employer or clients already handed to the government on your behalf. If it comes to more than you owe, the difference is your refund. If it comes to less, you pay the balance before filing.",
    departmentKnows: "Form 26AS is the department's own ledger of tax deposited against your PAN.",
  },
  {
    id: "bankAccount",
    kind: "info",
    section: "taxes",
    field: "bankAccount",
    question: "Which account should a refund go to?",
    helper: "It must be pre-validated on the income-tax portal, and in your own name.",
    why: "An unvalidated bank account is the most common reason a refund silently fails months after filing. The return processes fine, the money simply never arrives, and you find out when you go looking.",
  },
];

export function visibleSteps(answers: Record<string, unknown>): InterviewStep[] {
  return steps.filter((s) => !s.showIf || s.showIf(answers));
}

export function progressFor(stepIndex: number, answers: Record<string, unknown>) {
  const total = visibleSteps(answers).length;
  return {
    current: Math.min(stepIndex + 1, total),
    total,
    percent: total === 0 ? 0 : Math.round((Math.min(stepIndex, total) / total) * 100),
  };
}
