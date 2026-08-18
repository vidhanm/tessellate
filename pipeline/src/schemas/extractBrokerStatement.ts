import { z } from 'zod';
import { Rupees, uncertaintyFields } from './common.ts';

export const BrokerStatementInput = z.object({
  text: z.string().min(1).describe('tradebook / capital-gains / P&L statement as CSV or pasted text'),
  broker: z.string().nullable().default(null).describe('Zerodha, Groww, ICICI Direct, CAMS, KFintech, ...'),
  financialYear: z.string().default('2025-26'),
});
export type BrokerStatementInput = z.infer<typeof BrokerStatementInput>;

export const Trade = z.object({
  isin: z.string().nullable().describe('12-character ISIN when the statement prints one'),
  symbol: z.string().describe('trading symbol or scheme name'),
  name: z.string().nullable().describe('full security / scheme name'),
  type: z.enum(['equity', 'mf']).describe('"mf" for mutual-fund units, "equity" for listed shares'),
  qty: z.number().describe('units sold in this row; fractional allowed for mutual funds'),
  buyDate: z.string().nullable().describe('ISO YYYY-MM-DD'),
  buyValue: Rupees.describe('total acquisition cost for this row, not per unit'),
  sellDate: z.string().nullable().describe('ISO YYYY-MM-DD'),
  sellValue: Rupees.describe('total sale consideration for this row, not per unit'),
  fmv31Jan2018: Rupees.nullable().describe('grandfathering FMV when the statement prints one, else null'),
  holdingDays: z.number().nullable().describe('copy from the statement; null if not printed — do NOT calculate'),
  gainType: z
    .enum(['stcg', 'ltcg', 'unclear'])
    .describe('only when the statement itself labels the row; otherwise "unclear" and let code decide'),
  charges: Rupees.describe('brokerage + STT + other charges attributed to the row; 0 when not printed'),
});
export type Trade = z.infer<typeof Trade>;

export const DividendRow = z.object({
  isin: z.string().nullable(),
  symbol: z.string(),
  date: z.string().nullable().describe('ISO YYYY-MM-DD credit date'),
  amount: Rupees.describe('gross dividend'),
  tds: Rupees.describe('194 TDS deducted, 0 when none'),
  quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']).nullable().describe('for the 234C quarterly breakup'),
});
export type DividendRow = z.infer<typeof DividendRow>;

export const BrokerStatementOutput = z.object({
  broker: z.string().nullable(),
  financialYear: z.string(),
  statementKind: z
    .enum(['tradebook', 'pnl', 'capital_gains', 'mf_statement', 'mixed', 'unknown'])
    .describe('what the document actually is'),
  trades: z.array(Trade),
  dividends: z.array(DividendRow),
  totals: z.object({
    sellValue: Rupees,
    buyValue: Rupees,
    dividendAmount: Rupees,
    dividendTds: Rupees,
  }),
  unparsedRows: z.array(z.string()).describe('rows you could not confidently map; copy them verbatim instead of guessing'),
  ...uncertaintyFields,
});
export type BrokerStatementOutput = z.infer<typeof BrokerStatementOutput>;
