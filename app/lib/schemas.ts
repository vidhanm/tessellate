import { z } from "zod";

/** All money is in whole rupees (INR). No paise anywhere in this app. */
export const Rupees = z.number().finite().min(0);

export const RegimeSchema = z.enum(["old", "new"]);
export type Regime = z.infer<typeof RegimeSchema>;

export const Form16Schema = z.object({
  employerName: z.string(),
  tan: z.string(),
  grossSalary: Rupees,
  /** Exempt allowances u/s 10 (HRA, LTA...) — only meaningful in the old regime. */
  exemptAllowances: Rupees.default(0),
  professionalTax: Rupees.default(0),
  tdsDeducted: Rupees.default(0),
  /** Employer-reported chapter VI-A, as declared by the employee. */
  declared80C: Rupees.default(0),
  declared80D: Rupees.default(0),
});
export type Form16 = z.infer<typeof Form16Schema>;

export const AISEntrySchema = z.object({
  id: z.string(),
  category: z.enum([
    "salary",
    "interest",
    "dividend",
    "sft",
    "tds",
    "securities",
    "property",
    "other",
  ]),
  description: z.string(),
  amount: Rupees,
  source: z.string(),
  /** Set when the taxpayer's own answer disagrees with what the department sees. */
  taxpayerDisputes: z.boolean().default(false),
});
export type AISEntry = z.infer<typeof AISEntrySchema>;

export const BrokerTradeSchema = z.object({
  id: z.string(),
  broker: z.string(),
  symbol: z.string(),
  quantity: z.number(),
  buyDate: z.string(),
  sellDate: z.string(),
  buyValue: Rupees,
  sellValue: Rupees,
  gainType: z.enum(["stcg", "ltcg"]),
});
export type BrokerTrade = z.infer<typeof BrokerTradeSchema>;

export const IncomeSourcesSchema = z.object({
  salary: z.boolean().default(false),
  housePropertyCount: z.number().int().min(0).default(0),
  housePropertyLoss: z.boolean().default(false),
  otherSources: z.boolean().default(false),
  capitalGains: z.boolean().default(false),
  business: z.boolean().default(false),
  presumptiveBusiness: z.boolean().default(false),
  agriculturalIncome: Rupees.default(0),
  foreignAssetsOrIncome: z.boolean().default(false),
  directorInCompany: z.boolean().default(false),
  unlistedShares: z.boolean().default(false),
  cryptoVDA: z.boolean().default(false),
});
export type IncomeSources = z.infer<typeof IncomeSourcesSchema>;

/** The normalised input the tax engine consumes. */
export const TaxInputSchema = z.object({
  grossSalary: Rupees.default(0),
  exemptAllowances: Rupees.default(0),
  housePropertyIncome: z.number().default(0),
  interestIncome: Rupees.default(0),
  dividendIncome: Rupees.default(0),
  otherIncome: Rupees.default(0),
  shortTermCapitalGains: Rupees.default(0),
  longTermCapitalGains: Rupees.default(0),
  businessIncome: Rupees.default(0),
  deduction80C: Rupees.default(0),
  deduction80D: Rupees.default(0),
  deduction80TTA: Rupees.default(0),
  professionalTax: Rupees.default(0),
  tdsPaid: Rupees.default(0),
  advanceTaxPaid: Rupees.default(0),
  age: z.number().int().min(0).max(120).default(30),
});
export type TaxInput = z.infer<typeof TaxInputSchema>;

export const SlabBreakupSchema = z.object({
  label: z.string(),
  rate: z.number(),
  taxableInSlab: z.number(),
  tax: z.number(),
});

export const TaxComputationSchema = z.object({
  regime: RegimeSchema,
  grossTotalIncome: z.number(),
  standardDeduction: z.number(),
  totalDeductions: z.number(),
  totalTaxableIncome: z.number(),
  /** Income taxed at slab rates (capital gains are carved out). */
  slabIncome: z.number(),
  slabBreakup: z.array(SlabBreakupSchema),
  taxOnSlabIncome: z.number(),
  taxOnSpecialRates: z.number(),
  taxBeforeRebate: z.number(),
  rebate87A: z.number(),
  taxAfterRebate: z.number(),
  cess: z.number(),
  totalTaxLiability: z.number(),
  taxesAlreadyPaid: z.number(),
  /** Positive => you owe. Negative => refund due. */
  balance: z.number(),
  refundDue: z.number(),
  notes: z.array(z.string()),
});
export type TaxComputation = z.infer<typeof TaxComputationSchema>;

export const PreflightCheckSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["pass", "warn", "fail"]),
  detail: z.string(),
  /** What the user should actually do about it. */
  fix: z.string().optional(),
});
export type PreflightCheck = z.infer<typeof PreflightCheckSchema>;

export const NoticeSchema = z.object({
  id: z.string(),
  section: z.string(),
  issuedOn: z.string(),
  summary: z.string(),
  plainEnglish: z.string(),
  suggestedAction: z.string(),
  responseDeadline: z.string(),
});
export type Notice = z.infer<typeof NoticeSchema>;

export const CaseStateSchema = z.enum([
  "draft",
  "filed",
  "everified",
  "processing",
  "processed_refund",
  "processed_demand",
  "notice_issued",
  "closed",
]);
export type CaseState = z.infer<typeof CaseStateSchema>;

export const PersonaSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  age: z.number().int(),
  city: z.string(),
  pan: z.string(),
  story: z.string(),
  sources: IncomeSourcesSchema,
  form16: Form16Schema.nullable(),
  ais: z.array(AISEntrySchema),
  trades: z.array(BrokerTradeSchema),
  taxInput: TaxInputSchema,
});
export type Persona = z.infer<typeof PersonaSchema>;

export const OfficerCaseSchema = z.object({
  id: z.string(),
  ackNumber: z.string(),
  taxpayer: z.string(),
  pan: z.string(),
  form: z.string(),
  refundClaimed: z.number(),
  state: CaseStateSchema,
  riskScore: z.number(),
  checks: z.array(PreflightCheckSchema),
});
export type OfficerCase = z.infer<typeof OfficerCaseSchema>;
