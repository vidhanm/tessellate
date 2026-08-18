# Unsolved User Problems on Indian Government / Public-Service Digital Portals

Research compiled from Quora, Team-BHP, IndiaMike, CAclubindia, TaxGuru, GitHub issues, Reddit, Blind, and mainstream Indian news coverage (Deccan Herald, Tribune, Business Standard, The Wire, etc.), Aug 2026.

Scoring is 1-5 on: **Pain** (severity/emotional-financial cost), **Breadth** (how many people affected), **Buildability** (can a 9-day prototype meaningfully help), **Depth** (is this a real backend/cross-department/policy problem, not just bad UI -- 5 = deep, 1 = pure UI).

---

## Top 10 (ranked by Pain + Breadth + Buildability + Depth)

| Rank | Problem | Portal | Pain | Breadth | Build | Depth | Sum |
|---|---|---|---|---|---|---|---|
| 1 | GSTR-2A/2B vs 3B ITC mismatch triggers demand notices for the recipient even when the supplier is at fault | GST | 5 | 5 | 4 | 5 | 19 |
| 2 | ITR refunds stuck "under processing" for months with zero visibility into cause | Income Tax e-Filing | 5 | 5 | 3 | 5 | 18 |
| 3 | Name/DOB/Aadhaar KYC mismatch causes automatic EPF claim rejection (~1 in 3 claims) | EPFO | 5 | 5 | 4 | 4 | 18 |
| 4 | DigiLocker enforces exact-name-match rule that contradicts the government's own stated policy on name variations | DigiLocker | 4 | 4 | 4 | 5 | 17 |
| 5 | AIS/TIS "mismatch campaign" notices sent based on the department's own faulty data-matching engine | Income Tax e-Filing | 4 | 4 | 4 | 5 | 17 |
| 6 | CPGRAMS grievances marked "Resolved/Disposed" without the underlying issue being fixed | CPGRAMS | 4 | 5 | 3 | 5 | 17 |
| 7 | PM-Kisan eKYC status silently reverts / cross-database mismatches wrongly mark eligible farmers "ineligible," withholding payments | PM-Kisan | 5 | 5 | 2 | 5 | 17 |
| 8 | Exam-day/admit-card portals (NTA, SSC) collapse under load, sometimes invalidating exams for lakhs of candidates | NTA / SSC exam portals | 5 | 5 | 2 | 5 | 17 |
| 9 | One Nation One Ration Card portability structurally excludes the migrant workers it targets (biometric + fixed-residence assumptions) | Ration card / ONORC | 5 | 5 | 2 | 5 | 17 |
| 10 | Land mutation approved on paper never syncs to the online land record (dual-register desync) | Bhulekh/Bhoomi/land records | 5 | 4 | 2 | 5 | 16 |

---

## Detailed Findings

### 1. GST -- ITC mismatch (GSTR-2A/2B vs GSTR-3B) punishes the recipient for the supplier's non-compliance
**Portal:** GST portal, ASMT-10 automated scrutiny notices
**Who / how often:** Nearly every GST-registered business with multiple suppliers -- millions. CBIC had to issue Circular 183/15/2022-GST specifically because of the volume of FY17-18/18-19 disputes.
**What breaks:** Cross-party/cross-department data mismatch, structurally unfixable by the recipient. If a supplier files late, wrongly, or not at all, the recipient's legitimate ITC doesn't show in 2A/2B and the portal auto-flags a mismatch against the *recipient*, who gets 7-10 days to respond or face interest/penalty.
**Evidence:**
- "a large number of taxpayers under GST have received notices under Form GST ASMT-10 ... granting seven-ten days' time period to rectify ... otherwise proceedings would be initiated" -- indialawoffices.com
- Root cause: "suppliers fail to upload their returns, delay filing, or file them incorrectly" -- Pice/themunim
**Workarounds today:** Paid GST reconciliation SaaS (ClearTax, Cygnet, GSTHero, IRIS); CAs manually draft ASMT-11 replies; businesses proactively chase suppliers monthly.
**Ratings:** Pain 5 | Breadth 5 | Buildability 4 | Depth 5

---

### 2. Income Tax -- Refunds stuck "under processing" for months, no diagnostic visibility
**Portal:** e-Filing portal / CPC
**Who / how often:** "Lakhs of taxpayers" per AY cycle; CPC has until Dec 31 of the following year to process, an enormous backlog window.
**What breaks:** Backend processing black box -- status shows only "under processing," never which of ~10 possible hold reasons (TDS mismatch, unreported interest, capital-gains errors, deduction errors) applies.
**Evidence:**
- "In some cases, 90 days have lapsed and refund is still awaited." -- taxtmi.com
- "Minor discrepancies can turn genuine refunds into tax demands, holding up payouts for months." -- charteredhelp.com
**Workarounds today:** Manual rectification requests (guessing the cause); CAs charge for "refund follow-up"; CPGRAMS escalation (slow).
**Ratings:** Pain 5 | Breadth 5 | Buildability 3 | Depth 5

---

### 3. EPFO -- Name/DOB/Aadhaar KYC mismatch causes automatic claim rejection
**Portal:** EPFO Unified Member Portal (PF withdrawal/final settlement)
**Who / how often:** Rejection rate rose from ~13% (2017-18) to ~34% (2022-23) -- roughly 1 in 3 claims.
**What breaks:** Rigid, non-fuzzy rule engine -- a single differing initial ("Aravind S" vs "Aravind Swamy") between UAN, Aadhaar, and bank passbook triggers a hard rejection, not a soft flag. Documented case: a worker's DOB was silently overwritten by a clerical merge with a neighboring employee's record.
**Evidence:**
- "the main reason for rejection is ... just an alphabet in the name not matching, or different details in Aadhaar" -- Deccan Herald, citing government's own explanation
- "any small mismatch between the UAN profile, the Aadhaar database and the bank passbook flips a claim to 'rejected'" -- righttoinformation.wiki
**Workarounds today:** Paid PF consultants/CAs filing Joint Declaration corrections; EPFiGMS grievances with unmet SLAs; SEO content-mill guide sites (no real tooling).
**Ratings:** Pain 5 | Breadth 5 | Buildability 4 | Depth 4

---

### 4. DigiLocker -- Name-mismatch rejection contradicts government's own stated policy
**Portal:** DigiLocker
**Who / how often:** Anyone with even minor name/spelling variance between Aadhaar and issuing-authority records; disproportionately affects married women (name change) and regional naming variants.
**What breaks:** Policy-vs-implementation mismatch -- government guidelines permit name variations (spelling, middle-name presence) if DOB/gender match; Income Tax and RTO systems honor this, DigiLocker enforces an exact match.
**Evidence:**
- "the system refuses access on the grounds of a so-called mismatch" despite guidelines "permitting name variations ... if date of birth and gender match exactly" -- Counterview.in
- Official Digital India account: "DigiLocker requires that your name must exactly match the one in Aadhaar"
**Workarounds today:** Manual Aadhaar re-linking; formal UIDAI name-correction with affidavit; abandoning DigiLocker fetch entirely for scanned documents.
**Ratings:** Pain 4 | Breadth 4 | Buildability 4 | Depth 5

---

### 5. Income Tax -- AIS/TIS "mismatch campaign" notices based on the department's own faulty data matching
**Portal:** e-Filing portal, AIS/TIS reconciliation
**Who / how often:** Mass SMS/email campaign blasts (e.g., Feb 24-25 2024 weekend); recurring every AIS cycle.
**What breaks:** The department's own matching engine mis-parses correctly filed ITR data (e.g., interest/dividend under "others") and flags genuine returns as mismatched.
**Evidence:**
- "the system is not taking into account the interest income disclosed under 'others' in the ITR" -- TaxGuru, quoting the department's own acknowledgment; department issued a press release admitting the error two days later.
**Workarounds today:** CAs manually reconcile AIS/TIS vs 26AS vs ITR; paid tools (Saral.pro, TaxBuddy, TaxNoticeAI); no free automated diffing tool.
**Ratings:** Pain 4 | Breadth 4 | Buildability 4 | Depth 5

---

### 6. CPGRAMS -- Grievances closed "Resolved" without the issue being fixed
**Portal:** CPGRAMS (pgportal.gov.in)
**Who / how often:** 15-18+ lakh grievances/year at the central level; 2,08,103 pending as of April 2025 across 23 states/UTs with 1,000+ each.
**What breaks:** Structural incentive problem -- officers are measured on disposal speed (21-day SLA), so tickets get closed with generic remarks ("matter forwarded to concerned department") rather than resolved.
**Evidence:**
- "departments are incentivised to prioritize the closure of the ticket over the resolutions of the problem" -- IMPRI policy analysis
- Case study: a pensioner's ₹41,000 arrear stayed unpaid 4 months after "resolution"; an RTI later revealed the real cause (bank-IFSC mismatch) that CPGRAMS had hidden -- righttoinformation.wiki
**Workarounds today:** CPGRAMS's own 30-day appeal window; pairing complaints with parallel RTI filings (productized by righttoinformation.wiki); government's new AI intake chatbot doesn't address closure-without-resolution.
**Ratings:** Pain 4 | Breadth 5 | Buildability 3 | Depth 5

---

### 7. PM-Kisan -- eKYC lockout wrongly marks eligible farmers "ineligible"
**Portal:** PM-KISAN (pmkisan.gov.in)
**Who / how often:** 48+ lakh of 10.64 crore beneficiaries had incomplete eKYC (July 2025); 1.12 crore currently marked "ineligible"; national coverage fell 14% (2021-22 to 2023-24), much via wrongful exclusion. Field study: ~40% of 300 Adivasi farmers marked "ineligible" in AP were actually eligible.
**What breaks:** Cross-database mismatch (Aadhaar vs land records vs bank KYC) plus backend failures -- eKYC status silently reverts from "done" to "not done"; fingerprint mismatches for elderly/manual laborers; conflicting records across systems.
**Evidence:**
- "more than 48 lakh farmers ... had not completed their eKYC" -- The Wire
- Named case: a farmer's eKYC status reverted to "not done" after completion, later marked ineligible.
**Workarounds today:** CSC operators charge for eKYC assistance; helpline/CPGRAMS escalation (slow, redirects to local office); no product solving the reconciliation problem.
**Ratings:** Pain 5 | Breadth 5 | Buildability 2 | Depth 5

---

### 8. NTA/SSC -- Exam-day and admit-card portals collapse under load
**Portal:** NTA (exams.nta.ac.in), SSC (ssc.gov.in)
**Who / how often:** Re-NEET 2026 admit card issue: over 4 lakh students hit server queue problems. SSC Selection Post Phase 13: applications dropped 36->30 lakh amid protests; widespread server crashes, biometric failures, mid-exam cancellations.
**What breaks:** Backend capacity/procurement failure -- SSC replaced its vendor with a lower bidder, a policy/procurement choice, not a UI bug.
**Evidence:**
- "The server of the exam centre was too slow ... we had to click at least 3-4 times to make the system select one option ... computer even crashed twice" -- theprobe.in, candidate quote
- "They are giving Delhi exam centres to Jammu candidates, and Jammu candidates are being given Delhi" -- same source
**Workarounds today:** DigiLocker as an alternate admit-card download channel; off-peak (2-5 AM) download advice circulated informally; street protests as the only real escalation channel.
**Ratings:** Pain 5 | Breadth 5 | Buildability 2 | Depth 5

---

### 9. ONORC -- One Nation One Ration Card structurally excludes migrant workers
**Portal:** ONORC / NFSA portability
**Who / how often:** Targets 450 million itinerant/migrant workers; "poorly implemented" outside metro cities per multiple sources; no systematic migrant database in most states.
**What breaks:** Policy/process design flaw -- biometric authentication requires physical presence, which structurally excludes the mobile population the scheme targets, plus outstation students, elderly, disabled.
**Evidence:**
- "the exception of metro cities such as Delhi and Mumbai, it is poorly implemented across the country. By forcing all holders of the ration card to be physically present ... it especially ignores the outstation students, migrant workers, old age and disabled population" -- indiafellow.org
**Workarounds today:** None systemic; migrants often skip claiming at destination, relying on family back home; NGO manual verification camps.
**Ratings:** Pain 5 | Breadth 5 | Buildability 2 | Depth 5

---

### 10. Land records -- Mutation approved on paper never reflects in the online record
**Portal:** Bhulekh (UP/Bihar), Bhoomi (Karnataka), 7/12-RTC, jamabandi, municipal khata systems
**Who / how often:** Any post-sale/post-inheritance property owner; described as widespread across UP, Karnataka, AP and other states.
**What breaks:** Genuine dual-source-of-truth problem -- manual revenue-office registers and the online database are separate systems that fall out of sync; downstream effects include banks refusing loans, stalled building permits.
**Evidence:**
- "If your mutation is approved but your name still does not show in the online record ... The order and the online database have fallen out of step." -- righttoinformation.wiki
- "Without mutation, banks hesitate on loans, building permissions stall, utility connections get questioned" -- Landeed blog
**Workarounds today:** Landeed (paid instant EC/RTC retrieval across 20+ states); bhoomi-rtconline.com (Bhoomi-specific mismatch fixer); RTI to force digitization.
**Ratings:** Pain 5 | Breadth 4 | Buildability 2 | Depth 5

---

### 11. IRCTC -- Tatkal seats vanish in seconds to bots/agent nexus
**Portal:** IRCTC Tatkal booking
**Who / how often:** Tens of millions of monthly transactions; Railways deactivated 2.5 crore suspected unauthorized booking IDs.
**What breaks:** Backend capacity + policy/enforcement failure -- illegal booking software ("Nexus," "Super Tatkal") and agent nexus exploit concurrency; government responded with mandatory Aadhaar-OTP from July 2025.
**Evidence:**
- "Seats show available, but as soon as it turns 10 am, the IRCTC site hangs. At 10:03, all seats are gone" -- Republic World
**Workarounds today:** Large GitHub automation ecosystem (e.g., `shivamguys/irctc-cypress-automation`, 312 stars, 597 forks -- automates login/captcha/payment); paid Telegram/agent booking services.
**Ratings:** Pain 5 | Breadth 5 | Buildability 2 | Depth 4

---

### 12. IRCTC -- Payment debited, ticket not booked (failed transaction reconciliation)
**Portal:** IRCTC payment gateway
**Who / how often:** Structurally frequent given Tatkal's forced concurrency spikes; dedicated help sites exist purely for this.
**What breaks:** Three-way backend handoff (bank <-> payment gateway <-> IRCTC) fails silently; refund typically resolves in 2-3 days but sometimes needs RBI Ombudsman escalation.
**Evidence:**
- trainhelp.in dedicated guide: "Mostly within 2 or 3 days the refund is done"
**Workarounds today:** Email eticket@irctc.co.in; RBI Banking Ombudsman escalation if bank doesn't reverse within T+5 days.
**Ratings:** Pain 4 | Breadth 3 | Buildability 2 | Depth 5

---

### 13. Parivahan/Vahan -- RC transfer completes legally but portal still shows previous owner
**Portal:** Vahan portal (RC ownership transfer)
**Who / how often:** Every used-vehicle transfer done online -- a large and recurring population.
**What breaks:** RTO back-office update lag; courts hold that the registered owner remains liable to third parties as long as their name stays in RTO records, even after a private sale.
**Evidence:**
- "the Parivahan website still reflected the previous owner's name even when agents claimed the transfer was complete" -- Team-BHP forum
- "Car sold but not transferred kills a person: Legal nightmare for owner" -- Team-BHP headline
- "due to some technical glitch, registration record of around 83 vehicles was not updated on 'Vahan' portal" -- Tribune India
**Workarounds today:** RTO agents/touts who personally follow up for a fee; no digital status-verification product identified.
**Ratings:** Pain 4 | Breadth 4 | Buildability 3 | Depth 5

---

### 14. Parivahan/Sarathi -- Pre-digitization driving licences block online renewal
**Portal:** Sarathi/Parivahan (DL renewal)
**Who / how often:** Large legacy population with pre-~2012 DLs, disproportionately older drivers.
**What breaks:** The record genuinely doesn't exist in the national database; requires a physical visit to the *original issuing RTO*, not the current one; some states (Tamil Nadu) don't even allow self-service backlog entry.
**Evidence:**
- "details of the DL number were not available in the central repository"; resident "was asked to get DL data entered at Salem RTO" while living in a different city -- DT Next
**Workarounds today:** No digital workaround; mandatory physical RTO visit; agent middlemen help navigate which RTO/counter.
**Ratings:** Pain 4 | Breadth 3 | Buildability 2 | Depth 5

---

### 15. EPFO -- PF transfer stuck when either employer won't/can't digitally approve
**Portal:** EPFO Form 13 transfer claims
**Who / how often:** Every job-switcher needing PF transfer -- near-universal in white-collar/tech workforce.
**What breaks:** Sequential digital sign-off (DSC) required from both old and new employer; if either is slow, defunct, or has an expired DSC, the claim sits with no automatic escalation.
**Evidence:**
- "His PF transfer kept getting rejected just because of a one day overlap. Super frustrating." -- Teamblind
- "If either employer doesn't act, the claim stays pending indefinitely." -- Kustodian.life
**Workarounds today:** EPFiGMS grievance escalation; in-person regional office visit in some fully-KYC-verified cases; no status-tracker product found.
**Ratings:** Pain 4 | Breadth 5 | Buildability 3 | Depth 4

---

### 16. EPFO -- Higher EPS pension applications stuck in employer-verification limbo for years
**Portal:** EPFO EPS-95 Higher Pension scheme (post-2022 Supreme Court judgment)
**Who / how often:** 3.1 lakh applications awaiting employer joint-option validation; in one tracked cohort of 97,640 members, only 8,401 got Pension Payment Orders, 89,235 stuck with "demand notices."
**What breaks:** Requires employer wage-record submission and joint-option validation across potentially decades-old, sometimes-defunct employers.
**Evidence:**
- "over 3.1 lakh applications awaiting validation of options or joint options with employers" -- BusinessToday
**Workarounds today:** Manual "Track Application Status" lookup; paid pension consultants; no aggregator/monitoring dashboard found.
**Ratings:** Pain 5 | Breadth 3 | Buildability 3 | Depth 5

---

### 17. EPFO -- EPS pension record errors (missing contributions, unverified transfers) surface only at retirement
**Portal:** EPFO EPS Form 10D
**Who / how often:** Broad, under-quantified; systemic because EPS records depend on decades of employer contribution history across multiple employers/UANs.
**What breaks:** Historical data-integrity accumulation -- errors discovered only when it's hardest to fix (at retirement).
**Evidence:**
- "Errors in your EPS record, like missing contributions, incorrect service periods, or unverified transfers, can lead to a complete claim rejection" -- tataaia.com
**Workarounds today:** Joint Declaration retroactive corrections (slow, employer-dependent); no consolidated service-history audit tool found.
**Ratings:** Pain 5 | Breadth 3 | Buildability 3 | Depth 5

---

### 18. PAN -- "Inoperative" status silently triggers 20% TDS and frozen KYC, especially for NRIs
**Portal:** Income Tax e-Filing, PAN-Aadhaar link status
**Who / how often:** Tens of millions had inoperative PAN post-deadline; a distinct NRI sub-case where exempt users are wrongly flagged due to un-updated residential-status records.
**What breaks:** Cross-system status mismatch -- banks/tax records still show "resident" for NRIs; a name-string mismatch between PAN and Aadhaar blocks linking entirely.
**Evidence:**
- "If you are an NRI and the portal still demands linking or your PAN shows inoperative, the real problem is almost always that your residential status was never updated" -- righttoinformation.wiki
**Workarounds today:** Pay ₹1,000 late-linking fee + wait 30 days; NRIs must submit a formal representation to their Assessing Officer with passport/visa/travel docs -- no online self-service flow.
**Ratings:** Pain 4 | Breadth 5 | Buildability 3 | Depth 3

---

### 19. Passport Seva -- Appointment slot scarcity feeds a tout/agent black market
**Portal:** Passport Seva Portal, PSK/RPO appointments
**Who / how often:** India issues 15-18 million passports/year against static PSK/RPO capacity.
**What breaks:** Capacity + allocation-policy failure -- undisclosed slot-release windows, congestion wipes out newly released slots in minutes.
**Evidence:**
- CBI raid on Mumbai PSKs: 33 locations searched, 12 FIRs, 14 officials + 18 agents/touts booked, ₹1.59 crore recovered -- Tribune India
- Agents resell slots at ₹8,000-15,000 in major metros -- rpoappointment.in
**Workarounds today:** Paid touts/agents; manual early-morning portal refreshing; government "passport melas" as a stopgap.
**Ratings:** Pain 5 | Breadth 5 | Buildability 2 | Depth 4

---

### 20. Passport Seva -- Police verification is an inter-agency black box with no ETA
**Portal:** Passport Seva + state police PV process
**Who / how often:** Applicants whose PV routes to local police stations (vs. instant post-office verification track).
**What breaks:** MEA's system has no real-time visibility into state police workflows once dispatched -- a genuine inter-agency data gap, confirmed by the government's own framing.
**Evidence:**
- "Police verification (PV) is conducted by the state police, not by the Passport Office, so if your application is stuck at the PV stage, the complaint path is slightly different" -- righttoinformation.wiki
**Workarounds today:** RTI filings specifically to force PV status disclosure; PG Portal escalation; National Call Centre.
**Ratings:** Pain 4 | Breadth 3 | Buildability 3 | Depth 5

---

### 21. GST -- New registration rejected via vague SCNs and unwarranted physical verification
**Portal:** GST portal, REG-03/REG-30/REG-05
**Who / how often:** Every new business registrant nationwide; significant enough that CBIC issued 2025 guidelines specifically to curb the practice.
**What breaks:** Officer discretion applying unnecessary physical verification and auto-rejecting under vague "deemed deficiency" with no specific reasoning.
**Evidence:**
- "applications were auto-rejected due to 'deemed deficiency' with no specific reasoning, and queries raised were vague or generic" -- sscoindia.com, describing the problem CBIC's 2025 reform was built to fix.
**Workarounds today:** Paid GST consultants who pre-vet applications/documents; no self-serve pre-check tool.
**Ratings:** Pain 4 | Breadth 3 | Buildability 3 | Depth 4

---

### 22. State e-District portals -- Income/caste/domicile certificate verification stuck with no visibility or reason codes
**Portal:** State e-District (ServicePlus/NIC), certificate services
**Who / how often:** One of the highest-volume G2C flows in India -- tens of millions of applications/year, tied to scholarship/admission/job deadlines.
**What breaks:** Applications sit "pending verification" at Patwari/Lekhpal/Tehsildar level past mandated Right to Service Act SLAs, with no accountable officer and no reason given on rejection.
**Evidence:**
- "I applied for domicile online but it got rejected the rejection reason is unclear" -- NoBroker forum
- UP Lekhpal suspended for issuing an incorrect caste certificate -- Deccan Herald (shows the manual verification chain itself is unreliable)
**Workarounds today:** CSC/cyber-cafe operators who "know someone" at the Tehsil office; RTI applications specifically drafted to unstick certificates; CM grievance cell complaints in parallel.
**Ratings:** Pain 4 | Breadth 5 | Buildability 3 | Depth 4

---

### 23. Kaveri (Karnataka property registration) portal crashes under load / DDoS, forcing repeat sub-registrar visits
**Portal:** Kaveri/Kaveri 2.0 (IGRS Karnataka)
**Who / how often:** Statewide property transactions; 3 sub-registrar offices rolled back mandatory online registration in 2020 because of it.
**What breaks:** Old hardware (7+ year old UPS/batteries), OTP dependency on a separate government server, at least one detected DDoS event (6.2 lakh malicious requests in 2 hours).
**Evidence:**
- "people required to return to sub-registrar offices three or four times for a process that could be completed in a day" -- Deccan Herald
**Workarounds today:** None structural; repeat physical visits; some offices reverted to manual/offline registration during outages.
**Ratings:** Pain 4 | Breadth 4 | Buildability 1 | Depth 5

---

### 24. Civil Registration System (CRS) -- 2024 centralization broke birth/death certificate issuance nationwide
**Portal:** CRS portal (crsorgi.gov.in), 23 states + 6 UTs
**Who / how often:** Near-universal touchpoint -- every citizen needing a birth/death certificate. Nagaland could not issue any certificates for 3 consecutive days; Bihar had a state-wide backlog "in all registration units."
**What breaks:** Backend infrastructure -- explicitly not a UI issue per the government's own complaint letter: OTPs not generating, portal extremely slow, continuous error messages.
**Evidence:**
- "Due to the revamped CRS portal being extremely slow, the OTPs not being generated in time, and the continuous display of error messages, there has been a huge backlog in all the registration units in the State" -- Bihar Chief Registrar's official letter, via BusinessToday
**Workarounds today:** RTI filing to force a written response; local offices bypassing the portal manually where possible.
**Ratings:** Pain 4 | Breadth 5 | Buildability 2 | Depth 5

---

### 25. Ayushman Bharat -- Card issuance rejected on Aadhaar/ration-card/family-record mismatches
**Portal:** PM-JAY / Ayushman Bharat (beneficiary.nha.gov.in)
**Who / how often:** Scheme covers 4.5 crore families / 6 crore seniors (70+); rejection is the #1 named cause across guide sites.
**What breaks:** Cross-department data mismatch -- "all information entered ... must match exactly with Aadhaar data and source data," plus pending e-KYC and periodic server issues.
**Evidence:**
- "3.56 lakh claims worth ₹643 crore" rejected (fraud side); on the genuine-beneficiary side, "most Ayushman Bharat Card applications fail not because people are ineligible, but due to Aadhaar mismatches, incorrect family details, or outdated records" -- futuresmartguide.com
**Workarounds today:** Re-verification at CSC; helpline (14555/1800-111-565); SEO guide sites with no real tooling.
**Ratings:** Pain 5 | Breadth 4 | Buildability 3 | Depth 4

---

### 26. NSP/state scholarship portals -- Disbursement stuck across NSP -> institute verification -> PFMS handoffs
**Portal:** National Scholarship Portal + state portals (e.g., Bihar Medhasoft)
**Who / how often:** "Thousands" of students in Bihar alone per Careers360; a 2022 case found the portal "failing to verify the scholarship applications of over 1,000 girls."
**What breaks:** Multi-stage process failure -- stuck if the institute doesn't complete verification, or if the student's bank isn't Aadhaar-seeded for PFMS; one-mobile-number-per-application rule excludes shared-phone rural households.
**Evidence:**
- "If your college hasn't completed verification, the application stays in pending state and payment is never initiated" -- citizennest.com
**Workarounds today:** Self-help diagnostic guide sites; no tool tracking cross-stage status (NSP -> institute -> treasury -> PFMS) found.
**Ratings:** Pain 4 | Breadth 4 | Buildability 4 | Depth 4

---

### 27. Municipal portals -- Property tax payment deducted with no receipt / not reflected
**Portal:** Municipal e-Seva/mSeva portals (Amritsar cited; pattern repeats in Delhi, Bengaluru, Mumbai, Chennai)
**Who / how often:** Every urban property owner, recurring annually; Amritsar Municipal Corporation collected only ₹3.25 crore against a ₹50 crore target due to the portal.
**What breaks:** Payment-gateway reconciliation failure -- server timeouts near deadlines cause double debits without receipt generation.
**Evidence:**
- "There are some technical issues in the mSeva portal. We have written to the Punjab Municipal Infrastructure Development Company" -- Tribune India, official quote
**Workarounds today:** File complaint on municipal portal + contact bank for refund (15-30 working days); no dedicated reconciliation product found.
**Ratings:** Pain 3 | Breadth 4 | Buildability 4 | Depth 3

---

### 28. EPFO -- Multiple/duplicate UAN activation conflicts block claim filing entirely
**Portal:** EPFO UAN activation
**Who / how often:** Common among workers who changed jobs before UAN portability was standardized (pre-~2014) or where employers issued a fresh UAN instead of reusing an existing one.
**What breaks:** Backend data-model problem -- one person, multiple ID records; not self-serviceable online, requires manual EPFO merger.
**Evidence:** Dedicated troubleshooting guide exists specifically for this ("UAN Activation & Multiple UANs: Common EPF Problems and How to Fix Them" -- Kustodian.life), itself evidence of frequency.
**Workarounds today:** Manual grievance/regional office visit to request merger; no online self-service.
**Ratings:** Pain 4 | Breadth 3 | Buildability 2 | Depth 4

---

## Cross-cutting patterns

- **The dominant unsolved pattern across nearly every portal is cross-department/cross-database name, DOB, or KYC mismatch** (EPFO KYC, DigiLocker, PAN-Aadhaar, Ayushman Bharat, PM-Kisan, e-district certificates, land-record mutation). Each department enforces exact-match rules independently, with no shared canonical identity resolution and no fuzzy-matching tolerance -- a single missed middle initial can freeze money, a certificate, or health coverage.
- **The second dominant pattern is "closed/approved on paper, not reflected online"** -- CPGRAMS resolutions, Vahan RC transfers, land mutations, EPS applications -- where the backend system of record and the portal's display state silently diverge, and the citizen has no way to detect or force reconciliation.
- **No incumbent product solves any of these end-to-end.** The competitive landscape is almost entirely SEO/AI content-mill "how to fix" guide sites (Kustodian.life, CitizenNest, righttoinformation.wiki, futuresmartguide.com) that repackage official FAQs -- real functional tooling (pre-submission validators, cross-portal status trackers, auto-drafted grievance/RTI generators, mismatch diagnosers) is largely unbuilt whitespace.
- **Highest-buildability wedge in 9 days:** pre-submission data-consistency checkers (name/DOB/Aadhaar/PAN/bank string comparison) and multi-stage status trackers/escalation-letter generators -- these don't require government API access and directly target the two cross-cutting patterns above.
- **Lowest-buildability but highest-pain:** raw portal/server capacity failures during peak load (IRCTC Tatkal, exam admit cards, CRS, Kaveri, deadline-time GST/ITR outages) -- these are genuine government infra/procurement problems that no outside product can fix, at best supporting an alert/monitoring layer.
