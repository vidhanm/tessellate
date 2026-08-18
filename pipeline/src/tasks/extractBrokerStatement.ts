import { withMock } from '../client.ts';
import { BrokerStatementInput, BrokerStatementOutput } from '../schemas/extractBrokerStatement.ts';
import { extractBrokerStatementFixture } from '../../fixtures/extractBrokerStatement.ts';

export const extractBrokerStatement = withMock({
  name: 'extractBrokerStatement',
  description: 'Normalise a broker tradebook / P&L / capital-gains statement into trades and dividend rows.',
  inputSchema: BrokerStatementInput,
  outputSchema: BrokerStatementOutput,
  systemPrompt: `You normalise Indian broker and registrar statements — Zerodha, Groww, Upstox, ICICI Direct, CAMS, KFintech — which all use different column names for the same things.

Column synonyms you will meet:
- quantity: Qty, Quantity, Units, No. of shares
- buy value: Buy Value, Purchase Value, Cost of Acquisition, Acquisition Value
- sell value: Sell Value, Sale Value, Sale Consideration, Redemption Amount
- symbol: Symbol, Scrip, Security, Scheme Name, Instrument

Rules:
- Values are TOTALS for the row, not per unit. If the statement gives only a per-unit price, multiply is NOT allowed — put the row in unparsedRows verbatim and set uncertain to true.
- type is "mf" for mutual-fund schemes (ISIN starts INF, or the name contains Fund/Scheme/Plan/Growth/IDCW), "equity" for listed shares (ISIN starts INE).
- gainType: only copy a label the statement itself prints (LTCG/STCG/Long Term/Short Term). Otherwise "unclear". Never decide long vs short term yourself — holding-period rules are code's job.
- holdingDays: copy it if printed, else null. Never compute it from the dates.
- Dividend rows are separate from trades. A dividend is money received for holding, never a sale. Never let a dividend become a trade with qty 0.
- Mutual fund units may be fractional; keep the decimals.
- Rows you cannot map with confidence go into unparsedRows exactly as they appear, and uncertain becomes true. A row copied into unparsedRows is a success; a guessed row is a failure.
- totals: copy the statement's printed totals when present; otherwise use the sum of the rows you emitted and note that in uncertaintyNotes.`,
  buildUserPrompt: (input) =>
    `Broker (if known): ${input.broker ?? 'unknown'}\nFinancial year: ${input.financialYear}\n\nStatement:\n---\n${input.text}\n---\n\nReturn trades and dividends.`,
  fixture: () => extractBrokerStatementFixture,
});
