/**
 * Synthetic inputs for tests and the offline demo.
 * All PAN/TAN/DIN values are fabricated. No real taxpayer data anywhere.
 */

export const sampleForm16Text = `FORM NO. 16 [See rule 31(1)(a)]
PART A
Certificate under Section 203 of the Income-tax Act, 1961 for tax deducted at source on salary
Name and address of the Employer: Nimbus Software Services Private Limited, Level 6, Prestige Tech Park, Outer Ring Road, Bengaluru 560103
PAN of the Deductor: AAECN4412K      TAN of the Deductor: BLRN02931E
Name and address of the Employee: Ananya R Nair, Flat 402, Sobha Jasmine, Bengaluru 560103
PAN of the Employee: BQZPN1234F
Assessment Year: 2026-27     Period with the Employer: 01-04-2025 to 31-03-2026

Summary of amount paid/credited and tax deducted at source thereon
Quarter  Receipt No.  Amount paid/credited  Tax deducted  Tax deposited
Q1       QQAB1234     295000                11450         11450
Q2       QQAB2291     295000                11450         11450
Q3       QQAB3374     295000                11450         11450
Q4       QQAB4488     295000                11461         11461
Total                 1180000               45811         45811

PART B (Annexure)
1. Gross Salary
 (a) Salary as per provisions contained in section 17(1)      1180000
 (b) Value of perquisites under section 17(2)                       0
 (c) Profits in lieu of salary under section 17(3)                  0
 (d) Total                                                    1180000
2. Less: Allowances to the extent exempt under section 10           0
5. Less: Standard deduction under section 16(ia)                75000
6. Income chargeable under the head "Salaries"                1105000
8. Deductions under Chapter VI-A
 (h) Section 80CCD(2) - employer contribution to pension scheme
     Gross Amount 47200   Deductible Amount 47200
9. Total deduction under Chapter VI-A                           47200
10. Total taxable income                                      1057800
11. Tax on total income                                         44050
12. Rebate under section 87A                                        0
13. Health and education cess @4%                                1761
14. Tax payable                                                 45811
15. Relief under section 89                                         0
Note: Tax computed as per section 115BAC(1A) (new tax regime).`;

export const sampleAISText = `Annual Information Statement (AIS) - PAN: BQZPN1234F - AY 2026-27
Information Code,Information Description,Information Source,TAN,Amount (Rs.),TDS (Rs.),Quarter
192,Salary received,Nimbus Software Services Private Limited,BLRN02931E,1180000,45811,
SFT-015,Dividend,Infosys Limited,BLRI00512B,620,0,Q2
SFT-015,Dividend,ITC Limited,CALI01188D,310,0,Q3
SFT-015,Dividend,Hindustan Unilever Limited,MUMH02277A,110,0,Q4
SFT-016,Interest from savings bank,HDFC Bank Limited,MUMH03344C,4820,0,
194A,Interest from deposit,HDFC Bank Limited,MUMH03344C,18400,1840,Q4
Total,,,,1204260,47651,`;

export const sampleBrokerCsv = `Zerodha - Tradewise Capital Gains Statement - FY 2025-26 - PAN BQZPN1234F
Symbol,ISIN,Instrument Type,Quantity,Buy Date,Buy Value,Sell Date,Sell Value,Holding Days,Type,Charges
INFY,INE009A01021,EQ,40,2023-06-14,52800,2025-11-21,71600,891,LTCG,118
ITC,INE154A01025,EQ,100,2025-05-02,42300,2025-09-18,46900,139,STCG,96
ICICI PRU BLUECHIP FUND - GROWTH,INF109K012R1,MF,412.883,2022-08-09,25000,2026-01-12,39850,1251,LTCG,0

Dividend Statement FY 2025-26
Symbol,ISIN,Credit Date,Gross Amount,TDS
INFY,INE009A01021,2025-08-04,620,0
ITC,INE154A01025,2025-11-27,310,0
HINDUNILVR,INE030A01027,2026-02-19,110,0`;

export const sampleRecommendInput = {
  facts: {
    assessmentYear: '2026-27',
    residentialStatus: 'resident' as const,
    age: 24,
    incomeByHead: {
      salary: 1105000,
      houseProperty: 0,
      businessProfession: 0,
      capitalGainsShortTerm111A: 4504,
      capitalGainsLongTerm112A: 33650,
      capitalGainsOther: 0,
      otherSources: 24260,
      vda: 0,
      agricultural: 0,
    },
    deductions: { '80CCD(2)': 47200 },
    flags: { multipleEmployers: false },
  },
  deterministic: {
    chosenForm: 'ITR-2' as const,
    formTriggerFacts: [
      'you sold shares and mutual fund units during the year, which is capital gains income',
      'capital gains beyond the ITR-1 carve-out force ITR-2',
    ],
    totalIncome: 1167414,
    newRegime: {
      taxableIncome: 1082060,
      taxBeforeRebate: 51056,
      rebate87A: 0,
      surcharge: 0,
      cess: 2042,
      totalTax: 53098,
    },
    oldRegime: {
      taxableIncome: 1132060,
      taxBeforeRebate: 66368,
      rebate87A: 0,
      surcharge: 0,
      cess: 2655,
      totalTax: 69023,
    },
    recommendedRegime: 'new' as const,
    savingsVsAlternative: 15925,
    requiresForm10IEA: false,
  },
  language: ['en', 'hi'] as const,
};

export const sampleAskInput = {
  fieldId: 'ScheduleOS.dividend',
  fieldLabel: 'Dividend income (other than 2(22)(e))',
  persona: {
    name: 'Ananya',
    situation: '24-year-old salaried, first return, small equity portfolio',
    firstTimeFiler: true,
    knownFacts: ['AIS already shows ₹1,040 of dividend from 3 companies'],
  },
  language: 'en' as const,
  scheduleContext: 'Dividend from shares/MF → Other Sources (Sch OS); quarterly breakup needed for 234C.',
};

export const samplePreflightInput = {
  check: {
    code: 'AIS_INCOME_NOT_DECLARED',
    severity: 'fail' as const,
    facts: {
      incomeType: 'dividend and interest',
      aisAmount: 24260,
      declaredAmount: 4820,
      difference: 19440,
    },
    ruleText: 'AIS dividend/interest/other > declared by >₹100 → fail. Remedy: add to Other Sources; or give AIS feedback.',
  },
  personaSituation: '24-year-old salaried first-time filer',
};

export const sampleNotice143_1Text = `INCOME TAX DEPARTMENT - CENTRALISED PROCESSING CENTRE, BENGALURU
Intimation under section 143(1) of the Income-tax Act, 1961
DIN: CPC/2627/A1/2610445123          Date: 14-10-2026
PAN: BQZPN1234F     Assessment Year: 2026-27     Acknowledgement No: 458812740140826

                                          As provided by      As computed under
Particulars                               taxpayer            section 143(1)      Difference
Income from Salary                         1105000             1105000                  0
Income from Other Sources                     4820               24260              19440
Gross Total Income                         1109820             1129260              19440
Total Income                               1109820             1129260              19440
Total Tax Payable                            45811               51991               6180
TDS credit allowed                           45811               45811                  0
Net Amount Payable                               0                6180               6180

Reason: Income appearing in the Annual Information Statement under codes SFT-015 and 194A has not been
offered to tax in the return of income.
If you disagree with the adjustment, you may file a rectification request under section 154 or a revised
return under section 139(5). Response is to be submitted within 30 days of this intimation.
This is a system-generated document. SYNTHETIC - FOR DEMONSTRATION ONLY.`;

export const sampleNotice139_9Text = `INCOME TAX DEPARTMENT - CENTRALISED PROCESSING CENTRE, BENGALURU
Notice under section 139(9) of the Income-tax Act, 1961 - Defective Return
DIN: CPC/2627/D9/2607781904          Date: 02-09-2026
PAN: BQZPN1234F     Assessment Year: 2026-27

Error Code: 31 (Rule 11B)
Error Description: The taxpayer has reported income under the head Capital Gains in a return form which does
not provide for such income. Capital gains of Rs. 18,800 have been reported in Form ITR-1.
Probable Resolution: File the return in the appropriate form (ITR-2) in response to this notice.
You are requested to respond within 15 days of receipt of this notice, failing which the return may be
treated as invalid. SYNTHETIC - FOR DEMONSTRATION ONLY.`;

export const sampleFiledReturnSummary = {
  acknowledgementNumber: '458812740140826',
  form: 'ITR-1',
  assessmentYear: '2026-27',
  filedOn: '2026-07-18',
  regime: 'new' as const,
  summary: {
    grossSalary: 1180000,
    standardDeduction: 75000,
    incomeFromSalary: 1105000,
    incomeFromOtherSources: 4820,
    grossTotalIncome: 1109820,
    totalTds: 45811,
    taxPayable: 45811,
  },
};

export const sampleClusterInput = {
  checks: [
    { caseId: 'C-1001', code: 'AIS_INCOME_NOT_DECLARED', severity: 'fail' as const, form: 'ITR-1', regime: 'new' as const, personaTag: 'salaried-first-timer', detail: 'Dividend 1040 not declared' },
    { caseId: 'C-1002', code: 'AIS_INCOME_NOT_DECLARED', severity: 'fail' as const, form: 'ITR-1', regime: 'new' as const, personaTag: 'salaried-first-timer', detail: 'FD interest 18400 not declared' },
    { caseId: 'C-1003', code: 'AIS_INCOME_NOT_DECLARED', severity: 'fail' as const, form: 'ITR-2', regime: 'new' as const, personaTag: 'equity-investor', detail: 'Savings interest 4820 not declared' },
    { caseId: 'C-1003', code: 'DIVIDEND_QUARTERLY_MISSING', severity: 'warn' as const, form: 'ITR-2', regime: 'new' as const, personaTag: 'equity-investor', detail: 'No quarterly split' },
    { caseId: 'C-1004', code: 'FORM_MISMATCH_CG_ON_ITR1', severity: 'fail' as const, form: 'ITR-1', regime: 'new' as const, personaTag: 'equity-investor', detail: 'Capital gains on ITR-1' },
    { caseId: 'C-1005', code: 'LTCG_112A_ABOVE_THRESHOLD_ITR1', severity: 'fail' as const, form: 'ITR-1', regime: 'new' as const, personaTag: 'equity-investor', detail: 'LTCG 210000 on ITR-1' },
    { caseId: 'C-1006', code: 'MULTI_EMPLOYER_DOUBLE_STD_DED', severity: 'fail' as const, form: 'ITR-1', regime: 'new' as const, personaTag: 'job-switcher', detail: 'Std deduction twice' },
    { caseId: 'C-1006', code: 'MULTI_EMPLOYER_87A_TWICE', severity: 'fail' as const, form: 'ITR-1', regime: 'new' as const, personaTag: 'job-switcher', detail: 'Rebate twice' },
    { caseId: 'C-1007', code: 'MULTI_EMPLOYER_DOUBLE_STD_DED', severity: 'fail' as const, form: 'ITR-1', regime: 'old' as const, personaTag: 'job-switcher', detail: 'Std deduction twice' },
    { caseId: 'C-1008', code: 'BANK_NOT_PREVALIDATED', severity: 'fail' as const, form: 'ITR-1', regime: 'new' as const, personaTag: 'pensioner-fd', detail: 'Refund 12400 due' },
    { caseId: 'C-1009', code: 'REGIME_DEDUCTION_NOT_ALLOWED', severity: 'fail' as const, form: 'ITR-1', regime: 'new' as const, personaTag: 'salaried-first-timer', detail: '80C claimed under new regime' },
    { caseId: 'C-1010', code: 'STIPEND_194J_AS_SALARY', severity: 'warn' as const, form: 'ITR-1', regime: 'new' as const, personaTag: 'intern-194J', detail: '194J TDS declared as salary' },
  ],
  topN: 5,
};
