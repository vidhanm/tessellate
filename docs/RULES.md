# Domain rules (FY 2025-26 / AY 2026-27) — source of truth for code

Verify each against the official portal before demo. Deterministic — implemented in code, never left to the model.

## 1. Which ITR form (resident individual)
Evaluate in order; first match wins.
| Condition | Form |
|---|---|
| Business/profession income NOT under presumptive (44AD/44ADA/44AE) | ITR-3 |
| Presumptive business/profession (44AD/ADA/AE), total income ≤ 50L, no CG beyond 112A ≤1.25L LTCG* | ITR-4 |
| Any of: capital gains (beyond ITR-1 carve-out), >1 house property, foreign assets/income, director, unlisted shares, agri income >5k, income >50L, non-resident, TDS u/s 194N, ESOP deferral | ITR-2 |
| Salary/pension + ≤1 house property + other sources (interest, dividend, family pension) + agri ≤5k, total ≤50L, LTCG 112A ≤1.25L with no c/f loss (AY25-26+ relaxation) | ITR-1 |
Reasons array must cite the triggering fact ("You sold mutual funds → capital gains → ITR-2").
*The 112A ≤1.25L relaxation applies to both ITR-1 and ITR-4 for AY 2026-27 — confirmed identical eligibility/disqualifier language on both forms (verified 2026-08-19).

## 2. Where does each income go (interview → schedule map)
| Plain question | Head / schedule | Note |
|---|---|---|
| Salary/pension (Form 16) | Salary | Std deduction: 75k new / 50k old |
| Dividend from shares/MF | Other Sources (Sch OS) | Quarterly breakup for 234C; TDS 194 if >10k/company (raised from 5k, Budget 2025, effective FY25-26) (verified 2026-08-19) |
| Savings bank interest | Other Sources | 80TTA up to 10k (old regime, <60y) |
| FD/RD interest | Other Sources | 80TTB up to 50k (old, ≥60y) |
| Stipend with 194J TDS | Profession (44ADA presumptive) or Other Sources — flag ambiguity | Show both; recommend consistency with deductor's section |
| Equity/MF sale held >12m | LTCG 112A (Sch CG) | 12.5% above 1.25L; grandfathering FMV 31-Jan-2018 |
| Equity/MF sale ≤12m | STCG 111A | 20% |
| Freelance receipts | 44ADA if profession, ≤75L (95% digital) | 50% deemed profit |
| Crypto | Sch VDA | 30% flat, 1% TDS 194S, no set-off |
| Rent received | House Property | 30% std deduction |
| Gifts >50k, lottery, family pension | Other Sources | |

## 3. Regime comparison
New (default): slabs 0–4L nil, 4–8L 5%, 8–12L 10%, 12–16L 15%, 16–20L 20%, 20–24L 25%, >24L 30%; std ded 75k; 87A rebate → zero tax up to 12L (with marginal relief); allowed: 80CCD(2), 80CCH, family pension ded 25k. NOT allowed: 80C, 80D, HRA, LTA, 80TTA/TTB, home-loan interest on self-occupied.
Old: 0–2.5L nil (3L ≥60y, 5L ≥80y), 2.5–5L 5%, 5–10L 20%, >10L 30%; std ded 50k; 87A up to 5L (12.5k); all chapter VI-A deductions, HRA (10(13A)), 24(b) up to 2L.
Both: cess 4%; surcharge >50L (ignore for demo personas). Special rates (111A/112A/VDA) unaffected by regime. 87A rebate does NOT apply against tax on 111A/112/112A special-rate income under the new regime — settled by an explicit Finance Act 2025 proviso to §87A, effective AY 2025-26 onward (resolves the earlier AY24-25 portal-utility-vs-Bombay HC ambiguity; no longer contested for AY 2026-27) (verified 2026-08-19).
Salaried can switch yearly via form choice; business income needs Form 10-IEA to opt old (once).

## 4. Pre-flight checks (CPC-style substance validation)
| Code | Trigger | Severity | Remedy |
|---|---|---|---|
| AIS_INCOME_NOT_DECLARED | AIS dividend/interest/other > declared by >₹100 | fail | Add to Other Sources; or give AIS feedback |
| TDS_CLAIMED_GT_26AS | TDS claimed > 26AS total | fail | Reduce or ask deductor to correct |
| TDS_IN_26AS_NOT_CLAIMED | 26AS TDS > claimed | warn | Claim it (refund) |
| MULTI_EMPLOYER_DOUBLE_STD_DED | 2 Form 16s, std ded applied twice | fail | Aggregate salary, single std ded/rebate |
| MULTI_EMPLOYER_87A_TWICE | both employers gave 87A | fail | Recompute → likely tax due |
| FORM_MISMATCH_CG_ON_ITR1 | CG present, ITR-1 chosen | fail | Switch to ITR-2 |
| FORM_MISMATCH_BUSINESS_ON_ITR1_2 | 44ADA/business income on ITR-1/2 | fail | ITR-4/3 |
| REGIME_DEDUCTION_NOT_ALLOWED | HRA/80C/80D/80TTA claimed under new regime | fail | Drop or switch regime |
| BANK_NOT_PREVALIDATED | refund due, no prevalidated account | fail | Pre-validate account |
| PAN_AADHAAR_NOT_LINKED | mock flag | fail | Link (fee ₹1,000) |
| LTCG_112A_ABOVE_THRESHOLD_ITR1 | 112A LTCG >1.25L or c/f loss on ITR-1 | fail | ITR-2 |
| 80TTA_VS_80TTB_AGE | 80TTB claimed <60y or 80TTA ≥60y | fail | Correct section |
| STIPEND_194J_AS_SALARY | 194J TDS but declared as salary | warn | Declare as profession/OS |
| DIVIDEND_QUARTERLY_MISSING | dividend >0 but quarterly split empty | warn | Fill for 234C |
| VDA_TDS_194S_NOT_DECLARED | 194S TDS in 26AS, no Sch VDA | fail | Fill VDA |
| SCHEDULE_FA_HINT | AIS foreign remittance/ESOP flags | warn | Check Sch FA |
| INTEREST_234A_B_C | tax due > 10k without advance tax / late filing | info | Show interest estimate |
| EVERIFY_WINDOW | post-submit, not verified within 30 days | fail | e-verify / ITR-V |
| DUE_DATE | after due date → belated 139(4), fee 234F | info | Fee ₹1k/5k |
| REGIME_BETTER_ALTERNATIVE | other regime saves > ₹500 | info | Suggest switch |

## 5. Post-filing states & notices
States: Submitted → E-verified (30d) → Under processing → (Processed: refund issued | Processed: demand 143(1) | Defective 139(9) | Held: risk-management confirmation) → Closed.
Notice handling: 139(9) → respond within 15 days (fix + re-file under 139(9)) ; 143(1) demand → agree & pay / disagree → rectification 154 (mistake apparent) or revised return 139(5) (till 31 Dec) ; ITR-U (139(8A)) only if others closed, +25/50/60/70% additional tax — warn users not to default to it.

## 6. Key dates AY26-27 (confirm)
Due 31 Jul 2026 (non-audit; check for extension), belated/revised till 31 Dec 2026, e-verify 30 days from filing.
