# Data Schema — ITR Filing Prototype Demo Data

**ALL DATA IN THIS DIRECTORY IS SYNTHETIC.** Names, PANs, Aadhaar numbers, bank
names and account numbers are fabricated for prototyping only. PANs use the
prefix `ZZ` (never issued by the Income Tax Department) so they can never
collide with a real PAN. Aadhaar numbers use the UIDAI test-range style
`9999 9999 xxxx`. FY 2025-26 / AY 2026-27 throughout.

## Directory layout

```
data/
  personas/<slug>.json          persona master record
  personas/<slug>/form16.json   Form 16 Part A + Part B (or note if none issued)
  personas/<slug>/ais.json      AIS-style entries
  personas/<slug>/form26as.json Form 26AS (TDS-only view)
  personas/<slug>/bank.json     bank accounts + prevalidation status
  personas/<slug>/broker.csv    Zerodha-style tradebook/P&L (personas 1, 3 only)
  personas/<slug>/expected.json answer key: correct ITR form, regime, tax, findings
  notices/*.json + *.txt        synthetic 139(9)/143(1) notices
  rules/preflight-checks.json   CPC-style consistency checks
  glossary.json                 plain-language term definitions
```

## `personas/<slug>.json` shape

```jsonc
{
  "slug": "first-job-dividend",
  "name": "Demo Filer",
  "age": 24,
  "pan": "ZZAPD1234E",
  "aadhaar": "9999 9999 0001",
  "aadhaar_pan_linked": true,
  "fy": "2025-26",
  "ay": "2026-27",
  "residential_status": "Resident",
  "narrative": "one paragraph describing the persona and the filing scenario",
  "employment": { "type": "salaried|intern|freelance|senior-pensioner", ... },
  "language_pref": "en|hi",
  "digital_literacy": "low|medium|high",
  "files": { "form16": "...", "ais": "...", "form26as": "...", "bank": "...", "broker": "...", "expected": "..." }
}
```

## `form16.json` shape (Part A + Part B)

```jsonc
{
  "issued": true,
  "part_a": {
    "employer_name": "Demo Bank Pvt Ltd" ,
    "employer_tan": "ZZZD01234E",
    "employer_pan": "ZZCPD5678F",
    "employee_pan": "ZZAPD1234E",
    "period": "01-Apr-2025 to 31-Mar-2026",
    "quarterly_tds": [ {"quarter":"Q1","receipt_no":"...","amount_paid":0,"tds":0}, ... ],
    "total_tds": 0
  },
  "part_b": {
    "gross_salary_17_1": 0,
    "perquisites_17_2": 0,
    "profits_in_lieu_17_3": 0,
    "exemptions_10": { "hra": 0, "lta": 0, "other": 0 },
    "standard_deduction_16_ia": 0,
    "professional_tax_16_iii": 0,
    "income_chargeable_under_head_salary": 0,
    "deductions_chapter_via": { "80C": 0, "80D": 0, "80CCD1B": 0, "80TTA": 0 },
    "total_taxable_income_as_per_employer": 0,
    "tax_payable_as_per_employer": 0,
    "regime_assumed_by_employer": "new|old"
  }
}
```
If `issued` is `false`, a `"note"` field explains why (e.g. professional-fee stipend, pension with no employer).

## `ais.json` shape

```jsonc
{
  "entries": [
    {
      "info_code": "SFT-015",
      "description": "Dividend",
      "source": "Zerodha Broking Ltd / RTA",
      "amount": 1040,
      "tds": 0,
      "quarter": "Q3",
      "status": "Active"
    }
  ]
}
```

## `form26as.json` shape

TDS-only view: `{"deductors":[{"name":..., "tan":..., "section":"192|194J|194A", "quarterly":[...], "total_tds":...}], "total_tds_all_deductors": 0}`

## `bank.json` shape

`{"accounts":[{"bank":"Demo Bank","account_no":"XXXXXXXX1234","ifsc":"DEMO0001234","type":"Savings","prevalidated":true,"nominated_for_refund":true}]}`

## `expected.json` shape (answer key)

```jsonc
{
  "correct_itr_form": "ITR-1",
  "itr_form_reasoning": "...",
  "alternative_interpretation": null,
  "recommended_regime": "new|old",
  "regime_comparison": {"new_regime_tax": 0, "old_regime_tax": 0, "note": "..."},
  "income_by_head": {"salary": 0, "other_sources": 0, "capital_gains": {"stcg_111a":0,"ltcg_112a":0}, "business_profession": 0},
  "deductions_claimed": {"80C":0,"80D":0,"80TTB":0,"standard_deduction":0},
  "tax_computation": {"new_regime": {...steps...}, "old_regime": {...steps...}},
  "tds_total": 0,
  "final_outcome": {"type":"refund|demand|nil","amount":0},
  "expected_preflight_findings": [ {"code":"AIS_DIVIDEND_NOT_DECLARED","severity":"warning","message":"..."} ],
  "expected_ais_mismatches": [ {"item":"Dividend","form16_or_declared":0,"ais":1040,"note":"..."} ]
}
```

## Notice JSON shape (`notices/*.json`)

`{"synthetic": true, "banner": "SYNTHETIC — NOT AN OFFICIAL NOTICE", "din": "...", "pan": "...", "ay": "2026-27", "section": "139(9)|143(1)", "date_of_order": "...", "response_due_date": "...", "reason_codes": [...], "computation_table": [{"field":"...", "as_computed_by_cpc":0, "as_entered_by_taxpayer":0}], "demand_or_refund": {...}}`
Each notice also has a plain-text rendering at the same basename with `.txt`.

## Glossary entry shape

`{"term":"...", "simple":"...", "why_it_matters":"...", "where_in_return":"...", "hi":"..."}`
