# India ITR e-filing (incometax.gov.in) — Pain-point research map
Compiled 2026-08-19 for AY 2024-25 / 2025-26 / 2026-27 filing seasons. Sources: news (Business Standard, Tribune, Deccan Herald, Gulf News), tax-portal help pages, CA/tax blogs (ClearTax, Quicko, TaxBuddy, Tax2win, CAclubindia, TaxGuru-adjacent), PIB/CBDT press notes, Lok Sabha unstarred questions, GitHub (open-source ITR helper projects). Note on method: live scraping of reddit.com and Quora threads was blocked/thin via the search tool used (returned news aggregator results instead of raw threads in most cases); the qualitative "what people say" claims below are backed by secondary reporting (CA forum quotes, journalist summaries of taxpayer complaints, ICAI representations) rather than raw Reddit permalinks in every case. Where a direct forum/thread URL was retrievable it is cited; where not, the claim is attributed to the reporting source that surveyed/quoted taxpayers.

---

## TOP 12 PROBLEMS (ranked)

| # | Problem | Pain (1-5) | Breadth (1-5) | 8-day buildable w/ mock data (1-5) | Needs backend/process rethink (1-5) | LLM leverage (1-5) |
|---|---|---|---|---|---|---|
| 1 | **Which ITR form + old vs new regime decision** — first-timers can't tell ITR-1 vs 2 vs 3 vs 4, and can't tell which tax regime is cheaper for them | 4 | 5 | 5 | 2 | 5 |
| 2 | **AIS/TIS/26AS/Form‑16 reconciliation** — figures disagree across the four documents, no clear "why" or fix path | 5 | 5 | 4 | 3 | 5 |
| 3 | **Refund stuck "Under Processing" / risk-management hold** — no explanation, 24+ lakh returns pending >90 days, silent AI risk flags | 5 | 4 | 3 | 5 | 3 |
| 4 | **Portal instability at deadline** — crashes, "something went wrong," JSON upload failures, session timeouts, captcha loops during peak traffic | 4 | 5 | 2 | 5 | 1 |
| 5 | **Capital gains (Schedule CG / 112A) & crypto (Schedule VDA) entry** — scrip-wise LTCG grandfathering (pre-31 Jan 2018 cost), which schedule for what, TDS-vs-income mismatch for crypto | 4 | 3 | 4 | 2 | 5 |
| 6 | **Defective return notices (139(9))** — cryptic reasons, 15-day response window, no plain-English guidance on the fix | 4 | 3 | 4 | 2 | 5 |
| 7 | **Intimation 143(1) / demand notices** — people expecting refunds get demand notices from TDS/AIS mismatches, don't understand what changed or how to respond | 4 | 4 | 4 | 3 | 5 |
| 8 | **E-verification failures (Aadhaar OTP, 30-day rule)** — OTP not received, mobile not linked to Aadhaar, return goes "invalid" if missed, condonation request opaque | 4 | 4 | 3 | 3 | 2 |
| 9 | **PAN inoperative (Aadhaar not linked)** — silently blocks filing/refunds/normal TDS rates; people don't realize until they try to file | 3 | 3 | 3 | 3 | 2 |
| 10 | **Bank pre-validation / IFSC-PAN linkage failure blocking refund** — refund silently withheld with generic "linkage failed" error, no diagnosis of root cause | 3 | 3 | 4 | 3 | 3 |
| 11 | **Belated vs revised vs updated (ITR-U) return confusion** — people don't know which window applies, ITR-U penalty (25-70% additional tax) surprise | 3 | 3 | 5 | 1 | 5 |
| 12 | **Grievance (e-Nivaran) / demand response black hole** — filed grievance, no meaningful resolution timeline visibility, escalation path (CPGRAMS, Ombudsman) undiscoverable | 4 | 3 | 3 | 4 | 4 |

(20+ additional problems are detailed below in the numbered sections; this table is the "if you can only fix 12" shortlist, weighted toward pain × breadth × buildability.)

---

## FIRST-TIME FILER JOURNEY MAP — what breaks at each step

**Step 0 — "Do I even need to file?"**
Breaks: no clear guidance on threshold rules (basic exemption limit vs mandatory-filing triggers like foreign travel >₹2L, electricity bill >₹1L, TDS deducted). Students/interns with stipend TDS often don't realize they *should* file to claim a refund of TDS withheld — "it is your job to file ITR ... and claim that money back" (Tax2win/Quicko explainers). No portal nudge tells a below-threshold TDS-deducted person "you have a refund waiting."

**Step 1 — Register / log in on the new portal**
Breaks: PAN not linked to Aadhaar → PAN "inoperative," registration/login fails outright with no actionable message until user hunts external explainer articles (cleartax, zeebiz). Deadline was 31 Dec 2025 / 31 May 2024 depending on PAN issuance date — most first-timers don't know their own deadline bucket.

**Step 2 — Choose ITR form**
Breaks: ITR-1 vs 2 vs 3 vs 4 depends on income sources (capital gains, foreign assets, >1 house property, business income) that a first-timer doesn't know how to self-classify. "One of the most common mistakes ... is using the wrong ITR form, which leads to a defective filing" (Business Standard, first-time taxpayer's guide). Wrong form choice cascades into Step 6 (defective notice).

**Step 3 — Choose regime (old vs new)**
Breaks: New regime is default since AY 2024-25; missing the ITR deadline auto-forfeits the old-regime election. People don't know which is actually cheaper for their own numbers (depends on HRA, 80C/80D investments actually made) — no simple calculator is built into the flow itself, they go to third-party comparison tools instead. ~75% of taxpayers now on new regime per Finance Secretary statement, but many switched by default/inertia rather than calculated choice.

**Step 4 — Reconcile pre-filled data (AIS/TIS/26AS vs Form 16 vs payslips)**
Breaks: this is the single most cited pain point. Pre-filled ITR data frequently disagrees with Form 26AS; AIS/TIS have "limited response options" to dispute an entry, and even after submitting a correction "feedback," changes don't promptly reflect back in TIS (ICAI representation to the I-T Dept, reported by Business Standard). Users have to manually cross-check 3-4 documents with no diff/highlight tool.

**Step 5 — Fill schedules (capital gains, VDA/crypto, foreign assets, deductions)**
Breaks: Schedule CG vs Schedule 112A confusion for equity LTCG (112A only for listed-equity/equity-MF LTCG, needs scrip-wise entries for pre-2018 grandfathered cost); Schedule VDA is new and separate for crypto, auto-populates into CG but TDS-vs-declared-income mismatches trigger notices; Schedule FA (foreign assets) causes outright panic among newly-resident NRIs/returning expats who don't realize RNOR-era exemptions stopped applying — CRS data-sharing from 100+ countries triggers automated "mismatch" notices even for people who did nothing wrong.

**Step 6 — Submit / JSON utility / online mode**
Breaks: Offline JSON utility (esp. ITR-2/3 Excel utility for AY 2025-26) reported as "highly unstable" by CAclubindia forum threads — validation errors, JSON generation/upload failures, calculation glitches. Near deadline, portal itself buckles: "something went wrong," DSC attach errors, captcha loops, session timeouts — CA advice is literally "log in at 3am to avoid the queue."

**Step 7 — E-verify within 30 days**
Breaks: Aadhaar OTP not received (mobile not linked/updated), and users don't realize the *filing date used* becomes the *verification date* if they miss 30 days — silently downgrading a "on-time" return to effectively-late, with no on-screen warning strong enough. Fallback (posting signed ITR-V to CPC Bengaluru) is a jarring physical-mail step in an otherwise digital flow.

**Step 8 — Wait for processing / refund**
Breaks: "Under Processing" can sit for months; CBDT legally has until 31 Dec 2026 to process AY 2025-26 returns, so "delay" is often not actually a bug — but the portal gives zero explanation of *why* a specific return is stuck (AI-driven risk flags, common-mobile/email red flags for "high-risk refund" cohorts) vs. just being in a normal queue. SMS phishing ("your refund is approved, click here") exploits this information vacuum.

**Step 9 — Get a notice instead of/along with a refund**
Breaks: Section 143(1) intimation can show a demand instead of expected refund; people don't understand it's often an automated TDS/AIS-mismatch flag, not a punitive audit. Section 139(9) "defective return" notices give a code/reason that's not plain-English; 15-day response window; no return possible if the original filing window has also lapsed — forces a de facto "your return is now void" outcome that isn't clearly stated.

**Step 10 — Fix it / escalate**
Breaks: revised (139(5)) vs belated vs updated (ITR-U, 2022-introduced, up to 24 months, 25-70% additional-tax premium) — people don't know the ordering (exhaust revised first, then belated, ITR-U last resort) and can pay an avoidable premium by defaulting to ITR-U out of confusion. If genuinely stuck, e-Nivaran grievance system has unclear resolution SLAs; escalation to CPGRAMS or the Income-Tax Ombudsman is not signposted from within the grievance flow itself.

---

## DETAILED PROBLEM ENTRIES

### First-time-filer confusion

**1. ITR form selection (ITR-1/2/3/4)**
Pain 4 / Breadth 5 / Buildable 5 / Deep-rethink 2 / LLM 5.
"Choosing the right ITR form is one of the most confusing parts of income tax filing" — confusion concentrated between ITR-1 (salary/1 house property/other-source income, ≤₹50L, no capital gains/foreign income) and ITR-2 (capital gains, >1 house property, foreign assets). ITR-4/Sugam for presumptive business income adds a third fork. Wrong-form filings are treated as defective. Source: Business Standard first-time taxpayer's guide (https://www.business-standard.com/finance/personal-finance/first-time-taxpayer-s-guide-forms-filing-and-avoiding-common-pitfalls-125051200843_1.html), spare8.com ITR comparison (https://spare8.com/finance-blogs-india/itr-1-vs-itr-2-vs-itr-3-vs-itr-4).
LLM angle: read a Form 16 + broker statement + bank statement, classify income sources, recommend form with a one-paragraph justification — genuinely high leverage, deterministic rules underneath but the *input classification* (is this "other sources" or "capital gains"? is this a second house?) benefits from NL reasoning over messy documents.

**2. Old vs new regime decision**
Pain 4 / Breadth 5 / Buildable 5 / Deep-rethink 1 / LLM 5.
New regime is default since AY 2024-25; ~75% of filers reportedly on new regime (Finance Secretary Tuhin Kanta Pandey, quoted in Deccan Herald https://www.deccanherald.com/business/union-budget/union-budget-2025-old-tax-regime-continues-but-most-are-likely-to-shift-to-new-regime-3385204). Old regime only pays off if HRA/80C/80D/home-loan-interest actually add up to enough deduction — a simple, deterministic calculation that the portal itself doesn't surface proactively; third-party calculators fill the gap today.

**3. AIS/TIS/26AS vs Form 16 mismatches**
Pain 5 / Breadth 5 / Buildable 4 / Deep-rethink 3 / LLM 5.
ICAI formally wrote to the I-T Department about "difficulty due to glitches in the income-tax e-filing portal" around 26AS/TIS/AIS; taxpayers report "access problems and discrepancies," "limited response options" in AIS/TIS to dispute an entry, and delayed reflection of submitted corrections. Source: Business Standard (https://www.business-standard.com/finance/personal-finance/guide-to-filing-tax-return-view-all-your-financial-activities-in-one-place-125071600400_1.html) and (https://www.business-standard.com/finance/personal-finance/correct-form-26as-and-form-16-mismatches-before-income-tax-filing-124052701203_1.html). 68,000+ cases were picked up for e-verification purely over AIS income mismatches in one past year (Tribune India: https://www.tribuneindia.com/news/nation/68-000-cases-picked-up-for-e-verification-for-income-mismatch-in-ais-itr-for-fy-2019-20-487647).
LLM angle: this is the highest-leverage LLM use case in the whole map — diff four semi-structured documents (Form 16, AIS, TIS, 26AS), explain each discrepancy in plain language, and suggest which one is authoritative and what action to take (contact employer / file feedback in AIS / adjust ITR entry).

**4. Deductions understanding (80C/80D/HRA)**
Pain 3 / Breadth 4 / Buildable 4 / Deep-rethink 1 / LLM 4.
Common mistake: salaried filers forget EPF counts toward 80C. Deductions under Chapter VI-A are disallowed under new regime except 80CCD(2)/80CCH/80JJAA, which surprises people who assume all deductions still apply. Source: TaxBuddy (https://www.taxbuddy.com/blog/can-i-claim-80c-80d-and-hra-together), IT dept regime FAQ (https://www.incometax.gov.in/iec/foportal/help/new-tax-vs-old-tax-regime-faqs).

**5. JSON utility vs online mode**
Pain 3 / Breadth 3 / Buildable 2 (this is inherently a govt-portal-side fix, hard to prototype meaningfully) / Deep-rethink 4 / LLM 2.
AY 2025-26 ITR-2 Excel utility called "highly unstable" with validation errors, JSON generation/upload failures, calculation glitches, compatibility issues (CAclubindia forum thread: https://www.caclubindia.com/forum/itr-2-excel-utility-for-ay-2025-26-my-update-on-using-it-613218.asp). "Caught Error Description as null" reported on JSON upload. Source: TaxBuddy (https://www.taxbuddy.com/blog/common-json-file-errors-while-filing-itr-and-how-to-fix), official FAQ (https://www.incometax.gov.in/iec/foportal/help/offline-utility-faq).

**6. E-verification (Aadhaar OTP failures, 30-day rule)**
Pain 4 / Breadth 4 / Buildable 3 / Deep-rethink 3 / LLM 2.
"If ITR is verified within 30 days of filing, the Income Tax Department considers the original filing date as the valid filing date" — miss it, and the *verification date* becomes the filing date, which can silently convert an on-time return into a late one. OTP failures usually trace to Aadhaar-mobile linkage gaps. Fallback is physically posting signed ITR-V to CPC Bengaluru. Condonation-of-delay request process exists but is not well signposted. Sources: CAclubindia (https://www.caclubindia.com/articles/everify-itr-2026-the-30day-itr-rule-that-every-taxpayer-should-know-56009.asp), SimpleTaxIndia (https://www.simpletaxindia.net/2025/06/how-to-deal-with-rejection-of-e-verification-of-aadhaar-otp.html), official FAQ (https://www.incometax.gov.in/iec/foportal/help/e-filing-e-verify-your-return-faq).

**7. ITR-V and "whether to file at all below threshold"**
Pain 2 / Breadth 3 / Buildable 4 / Deep-rethink 1 / LLM 4.
Students/interns below taxable threshold don't realize they can/should file purely to reclaim TDS withheld on stipends — "It is your job to file ITR, show that your income is below the taxable limit, and claim that money back" (Quicko: https://learn.quicko.com/stipend-income-taxable-in-india).

**8. Stipend/internship income classification**
Pain 3 / Breadth 3 / Buildable 5 / Deep-rethink 1 / LLM 4.
Stipend taxed as "Salary" if TDS deducted + Form 16 issued, else "Income from Other Sources"; CA-articleship stipends and research fellowships can be exempt under Sec 10(16) as "scholarship to meet cost of education." Source: Tax2win (https://tax2win.in/guide/are-stipends-taxable), Quicko (https://learn.quicko.com/stipend-income-taxable-in-india), Quora thread (https://www.quora.com/How-do-I-file-a-Income-Tax-Return-for-the-internship-stipend-in-India).

**9. Capital gains schedule (112A) filling**
Pain 4 / Breadth 3 / Buildable 4 / Deep-rethink 2 / LLM 5.
Schedule 112A applies only to LTCG on listed equity/equity MFs; scrip-wise entry mandatory for shares bought on/before 31 Jan 2018 (grandfathering cost-of-acquisition rule) — this is the single most fiddly manual-data-entry task in the whole ITR, and broker P&L statements don't map 1:1 to the schedule's fields. Source: filewise.in walkthrough (https://filewise.in/blog/itr2-capital-gains-reporting-schedules), IT dept ITR-2 manual (https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/file-itr-2-online/itr-2-UM).

**10. Crypto / VDA schedule**
Pain 4 / Breadth 2 / Buildable 4 / Deep-rethink 2 / LLM 5.
Schedule VDA is separate from Schedule CG; auto-populates into CG but mismatches occur "when TDS appears in AIS/26AS but the related VDA income is not reported in Schedule VDA, or the taxpayer claims more TDS credit than reflected." Flat 30% tax, cost-of-acquisition only allowed deduction, no loss set-off. Sources: Business Standard (https://www.business-standard.com/finance/personal-finance/report-crypto-earnings-accurately-to-avoid-mismatch-during-verification-123070400597_1.html, https://www.business-standard.com/markets/cryptocurrency/crypto-tax-notices-file-revised-return-before-assessment-update-later-125121200849_1.html).

**11. Foreign assets (Schedule FA) panic — NRIs / returning residents**
Pain 4 / Breadth 2 / Buildable 3 / Deep-rethink 2 / LLM 5.
"NRIs and RNOR taxpayers are not required to disclose foreign assets... but the moment they become ROR (Resident and Ordinarily Resident), Schedule FA becomes mandatory" — confusion because RNOR-era exemption lapses invisibly. India receives CRS data from 100+ countries; mismatches between self-reported residency status and CRS foreign-asset data trigger automated notices even for compliant filers. ~200,000 returns flagged for foreign-asset reporting checks per CBDT (Business Standard: https://www.business-standard.com/india-news/choose-correct-itr-to-report-foreign-assets-200k-return-filed-cbdt-124112400354_1.html). Source: MostlyNRI (https://mostlynri.com/how-nris-can-declare-foreign-assets-in-indian-itr/), Gulf News (https://gulfnews.com/your-money/taxation/nris-in-uae-are-getting-foreign-asset-disclosure-notices-why-what-to-do-1.500364983).

**12. Refund not received / stuck under processing**
Pain 5 / Breadth 4 / Buildable 3 / Deep-rethink 5 / LLM 3.
Over 24 lakh AY 2025-26 returns pending >90 days as of Feb 2026, attributed to "enhanced AI-driven compliance checks and data matching"; department legally has until 31 Dec 2026 to process. Interest is owed under Sec 244A for delay, but is opaque/hard to independently verify. Source: charteredhelp.com (https://charteredhelp.com/itr-refund-delay/), Business Standard (https://www.business-standard.com/finance/personal-finance/itr-refund-stuck-experts-warn-december-31-delays-could-block-revisions-125122200655_1.html).

**13. "Defective return" (139(9)) notices**
Pain 4 / Breadth 3 / Buildable 4 / Deep-rethink 2 / LLM 5.
Common triggers: TDS claimed but corresponding income not offered for tax; gross receipts in 26AS exceed total declared income; name mismatch vs PAN database. 15-day response window; once original filing window has lapsed, a fresh/revised return is no longer possible — must respond to the 139(9) notice or the return is void. Source: official FAQ (https://www.incometax.gov.in/iec/foportal/faqs/response-defective-notice-1399), Business Standard (https://www.business-standard.com/finance/personal-finance/defective-itr-123073100080_1.html).

**14. Mismatch notices / 143(1) intimation showing demand instead of refund**
Pain 4 / Breadth 4 / Buildable 4 / Deep-rethink 3 / LLM 5.
Automated CPC comparison of declared income vs Form 16/26AS/AIS; common causes: employer delay in TDS filing, unreported bank interest, ignored AIS entries. 30-day response window; options are online response + rectification request. Sources: readwithmayank Substack walkthrough (https://readwithmayank.substack.com/p/how-to-read-income-tax-intimation), ebizfiling (https://ebizfiling.com/blog/expecting-tax-refund-got-demand-understanding-1431-notice/).

**15. Revised vs belated vs updated (ITR-U) return confusion**
Pain 3 / Breadth 3 / Buildable 5 / Deep-rethink 1 / LLM 5.
Correct order is: revised (139(5), only if original filed on time, until 31 Dec of AY) → belated (also until 31 Dec of AY, carries Sec 234F late fee up to ₹5,000) → ITR-U (introduced 2022, up to 24 months post-AY, but at a 25-70% *additional* tax premium and last-resort only). People default to ITR-U out of not knowing the ordering and overpay. Source: taxgarden.in (https://taxgarden.in/blog/belated-revised-updated-itr-return-guide-india-ay-2026-27), finnovate.in (https://www.finnovate.in/learn/blog/itr-u-updated-return-form-india).

**16. PAN inoperative (Aadhaar not linked)**
Pain 3 / Breadth 3 / Buildable 3 / Deep-rethink 2 / LLM 2.
Inoperative PAN blocks: ITR filing/verification, refund processing, correct TDS/TCS credit reflection in 26AS, and normal (vs. higher) TDS rates. Deadline was 31 Dec 2025 for PANs issued via Aadhaar Enrolment ID pre-Oct-2024, else 31 May 2024; late linking costs ₹1,000 penalty. Source: Zeebiz (https://www.zeebiz.com/personal-finance/income-tax/news-income-tax-filing-last-date-september-2025-how-to-file-itr-if-pan-not-linked-aadhaar-inactive-375113), ClearTax (https://cleartax.in/s/what-happens-if-pan-card-is-not-linked-to-aadhaar-card).

**17. Bank pre-validation / IFSC-PAN linkage failure**
Pain 3 / Breadth 3 / Buildable 4 / Deep-rethink 3 / LLM 3.
Refund is only credited to a pre-validated bank account linked to PAN; "PAN-Bank-IFSC linkage failed" is a generic error with root causes like name mismatch, PAN not KYC'd at the bank, invalid IFSC, or dormant account — the portal doesn't diagnose *which* cause applies. Source: bharatkatax.com (https://bharatkatax.com/articles/restricted-refund-pan-bank-ifsc-linkage-failed.php), official FAQ (https://www.incometax.gov.in/iec/foportal/help/my-bank-account-faq).

### Portal glitches

**18. Deadline-week crashes / traffic-driven outages**
Pain 4 / Breadth 5 / Buildable 1 / Deep-rethink 5 / LLM 1.
Recurring, multi-year pattern: 2021 launch was plagued with glitches (FM summoned Infosys CEO — Tribune: https://www.tribuneindia.com/news/business/finance-minister-sitharaman-summons-infosys-ceo-as-income-tax-portal-goes-dark-300634); 2024 saw "taxpayers struggle with glitches... as July 31 nears" and Infosys set up a "dedicated war room" (Deccan Herald: https://www.deccanherald.com/business/infosys-sets-up-dedicated-war-room-for-i-t-portal-glitches-as-itr-filing-deadline-nears-1061830); 2025 (AY 2025-26) deadline was extended twice — first to Sept 15, then a further 24 hours to Sept 16 after the portal was "down for hours" under peak traffic (Business Standard: https://www.business-standard.com/finance/personal-finance/income-tax-return-deadline-extended-by-24-hours-after-portal-slows-down-125091600313_1.html). In July 2026, government told Lok Sabha the portal is "largely stable" but confirmed Infosys has been penalized across 12 quarters for missed SLAs and FY26 peak-season outages under the "Integrated e-Filing and CPC 2.0" contract (Business Standard: https://www.business-standard.com/economy/news/govt-tells-lok-sabha-i-t-portal-stable-infosys-faces-penalties-for-delays-126072001258_1.html).

**19. JSON upload / offline utility instability** — see #5 above.

**20. Session timeouts, captcha loops, DSC attach errors**
Pain 3 / Breadth 3 / Buildable 1 (portal-side) / Deep-rethink 4 / LLM 1.
CAclubindia forum: DSC attach throws "something went wrong please try after sometime"; workaround culture is "log in during off-peak hours (early morning/late night)," clear browser cache, switch browsers. (https://www.caclubindia.com/forum/dsc-error-in-new-it-portal-581057.asp, https://www.caclubindia.com/forum/dsc-is-not-working-in-the-last-moment-of-e-filing-583811.asp)

**21. AIS "feedback" not reflecting / not loading**
Pain 3 / Breadth 3 / Buildable 3 / Deep-rethink 4 / LLM 3.
Covered under #3 — "even after updating responses, many taxpayers find that changes don't appear promptly in the TIS." No SLA communicated to the user for when a submitted correction should reflect.

### Post-filing pain

**22. "Under processing" refund with AI-risk-flag opacity** — see #12.

**23. "Held by risk management" / high-risk refund flagging**
Pain 4 / Breadth 3 / Buildable 3 / Deep-rethink 5 / LLM 3.
Department examines "high-risk refund" cases via statistical analysis; multiple returns sharing a mobile number/email is a red flag triggering manual scrutiny and delay, with no explicit legal protection or clear notification to the taxpayer of *why* their specific refund is held. Cyber-security agency CERT-IN has separately warned of "smishing" scams exploiting exactly this ambiguity (fake "refund approved, click here" SMS). Source: Business Standard (https://www.business-standard.com/finance/personal-finance/tax-refunds-via-common-email-mobile-id-face-scrutiny-key-actions-to-take-124101500829_1.html).

**24. e-Nivaran grievance system opacity**
Pain 4 / Breadth 3 / Buildable 3 / Deep-rethink 4 / LLM 4.
Official guidance says most complaints resolve within 8 weeks/typically a month, but escalation ladder (e-Nivaran → CPGRAMS → Income-Tax Ombudsman) is not signposted inside the grievance flow itself; users discover the Ombudsman option only via third-party explainers, not the department UI. Source: patronaccounting.com summary (https://www.patronaccounting.com/blog/income-tax-portal-grievance-and-compliance-handling-a-complete-guide), IT dept manual (https://www.incometax.gov.in/iec/foportal/help/how-to-raise-grievances-UM).

### What people pay for today, and what those tools still don't solve

ClearTax, Quicko, Tax2win, myITreturn, TaxBuddy and CA-assisted filing dominate the assisted-filing market (exact market-share/complaint data was not independently retrievable via this research pass — direct review-site/Reddit complaint threads about these specific vendors did not surface in search; this is a gap flagged for follow-up, not a claim to be treated as sourced). What their public blog content reveals about the *underlying* user confusion (which is itself useful signal, since these companies write explainers precisely where users get stuck):
- All of them publish extensive "how to fix AIS/26AS mismatch," "how to e-verify," "how to pre-validate bank account," "belated vs revised vs updated" explainer content — strong indirect evidence these are the highest-support-load queries.
- None of the mainstream consumer tools appear to offer real-time diagnosis of *why* a specific refund is stuck or *why* a specific bank-linkage failed (both require querying the government backend/portal state, not just computing tax) — this is a structural gap, not a UX one, and is where a tool would need actual portal-session access (via RPA/browser automation) rather than pure computation.
- Several open-source/AI-agent projects have already appeared on GitHub attacking pieces of this space in 2025-26 — worth knowing about as prior art / competition:
  - `karanb192/itr-wala` — terminal-based deterministic tax engine, both regimes, AY 2026-27 (https://github.com/karanb192/itr-wala)
  - `NidheeshJain/itr-prep-skill` — Claude Code skill parsing Form 16/AIS/26AS/broker statements, reconciling, comparing regimes, emitting a "portal-ready data-pack JSON for a browser agent to file" (https://github.com/NidheeshJain/itr-prep-skill) — directly validates that "AIS/Form16 reconciliation + regime comparison + auto-fill" is seen as the core high-value LLM task by at least one other builder.
  - `Nootus/OpenTax` — open-source Indian income-tax computation framework (https://github.com/nootus/opentax)
  - `Loki200399/india-itr-copilot` — rules registry per assessment year with source citations (https://github.com/Loki200399/india-itr-copilot)
  - `shivprime94/file-itr` — agent skill for ITR-1/2/3/4 prep across old/new regime (https://github.com/shivprime94/file-itr)
  This is a meaningful finding for an 8-day prototype: the "read documents → reconcile → recommend form/regime → produce a filing-ready output" pattern is clearly the consensus best LLM entry point, and there's already competitive validation but no dominant consumer product yet (these are all early/dev-tool-flavored, not consumer apps).

---

## NUMBERS

- **7.28 crore** ITRs filed by 31 July 2024 for AY 2024-25 (vs 6.77 crore AY 2023-24, +7.5% YoY). **69.92 lakh** returns filed in a single day (31 July 2024 deadline day). Source: PIB/newsonair (https://www.newsonair.gov.in/record-over-6-77-crore-itr-filed-for-2023-24), Business Standard.
- **58.57 lakh first-time filers** joined in AY 2024-25.
- Regime split AY 2024-25: **72% (5.27 crore) new regime**, 28% (2.01 crore) old regime.
- **~75%** of taxpayers reportedly on new regime per Finance Secretary statement in 2025 Budget context (Deccan Herald).
- **49%** of taxpayers surveyed by LocalCircles had not filed ITR as deadline approached (FY23-24 season); **40%** of the not-yet-filed cohort cited portal difficulties as the primary reason; **4%** of all respondents said they tried but "faced difficulty in filing." Source: Business Standard / LocalCircles (https://www.business-standard.com/finance/personal-finance/tax-portal-glitches-49-taxpayers-yet-to-file-itr-124072500292_1.html).
- **Over 24 lakh** AY 2025-26 returns pending >90 days as of Feb 2026 (charteredhelp.com, secondary source — flagged as needing primary confirmation).
- **~200,000** returns flagged by CBDT for foreign-asset reporting review (Business Standard, Nov 2024).
- **68,000** cases picked up for e-verification specifically over AIS income mismatches, FY2019-20 cycle (Tribune India).
- AY 2025-26 deadline: extended from 31 July → **15 Sept 2025** → **16 Sept 2025** (further 24-hour extension after portal outage under peak load).
- CBDT has until **31 December 2026** to process AY 2025-26 returns under the Income-tax Act's statutory processing window.
- Infosys penalized "across 12 quarters" for missed SLAs on the Integrated e-Filing & CPC 2.0 contract, plus separate fines for FY26 peak-season application outages and for deadline extensions attributable to portal issues (Business Standard, July 2026, reporting on a Lok Sabha unstarred question response — https://www.business-standard.com/economy/news/govt-tells-lok-sabha-i-t-portal-stable-infosys-faces-penalties-for-delays-126072001258_1.html).
- Late-PAN-Aadhaar-linking penalty: **₹1,000**.
- ITR-U additional tax premium: **25% to 70%** depending on how late it's filed within the 24-month window.
- Sec 234F belated-filing fee: up to **₹5,000**.

## REFORMS UNDERWAY (so an 8-day prototype avoids building what CBDT is already fixing)

- **New Income-tax Rules 2026** (effective 1 April 2026): rules reduced from 511 to **333**, forms from 399 to **190**; explicit stated goal of "smarter, more pre-filled" ITR forms to reduce manual entry. Source: Ebizfiling (https://ebizfiling.com/blog/new-income-tax-rules-2026-simplified-itr-forms/), CAalley (https://www.caalley.com/news-updates/indian-news/simpler-smarter-itr-forms-ahead-as-new-income-tax-act-kicks-in-from-april).
- ITR-1/2/4 online + offline utilities enabled; ITR-3 Excel Utility v1.0 + JSON schema/validation rules released 18 June 2026 for AY 2026-27 (A2Z Taxcorp: https://a2ztaxcorp.net/cbdt-releases-itr-3-utility-json-schema-and-validation-rules-for-assessment-year-2026-27/).
- CBDT publicly claims portal "upgrades" and "expanded capacity" ahead of deadlines (Digit.in: https://www.digit.in/news/general/itr-filing-made-easier-cbdt-upgrades-portal-expands-capacity-ahead-of-return-deadline.html) — but the Sept 2025 outage happened *after* similar prior claims, so treat "stability" claims skeptically; the AIS/TIS reconciliation UX and post-filing black-box (refund/grievance) status are **not** part of the announced simplification scope and remain open territory.
- Government's official Lok Sabha position (July 2026) is that the portal is "largely stable" while simultaneously confirming ongoing SLA penalties against Infosys — i.e., official confidence in portal reliability should be discounted; the same document confirms structural contractor accountability problems persist. (https://www.business-standard.com/economy/news/govt-tells-lok-sabha-i-t-portal-stable-infosys-faces-penalties-for-delays-126072001258_1.html)

## RESEARCH GAPS / CAVEATS
- Direct raw Reddit thread text (r/IndiaTax, r/personalfinanceindia, r/IndianStreetBets) and Quora threads were not retrievable via the search tool used in this pass — it returned news-aggregator and blog results instead of forum permalinks for most reddit-scoped queries. The qualitative texture of "what people say" is therefore backed mainly by CA-forum threads (CAclubindia — which *are* raw practitioner/user posts), ICAI's formal written representation to the I-T Dept (a strong proxy signal, since it's professionals aggregating client complaints), and journalist summaries citing taxpayer complaints. A follow-up pass with direct Reddit/Quora fetch access (old.reddit.com JSON API or a logged-in browser tool) would meaningfully strengthen the "first-hand quotes" layer of this map.
- Vendor-specific complaint data (ClearTax/Quicko/Tax2win user reviews, App Store/Play Store ratings, Trustpilot) was not retrieved — flagged above rather than fabricated.
- LocalCircles and refund-pendency figures cited above are the most recent found but some (e.g., "24 lakh returns >90 days") trace to a secondary blog (charteredhelp.com) rather than a primary CBDT/PIB release; worth re-verifying against a PIB press note before using in an external-facing deck.
