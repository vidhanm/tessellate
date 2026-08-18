# Build What Moves India — Synthesis & Build Plan
_Synthesised 2026-08-19 from four research passes: `research/reddit/findings.md`, `research/twitter/findings.md`, `research/forums/findings.md`, `research/news/findings.md`. Deadline: 27 Aug 2026 (8 days)._

Sources are abbreviated **R** (Reddit), **T** (Twitter/complaint boards), **F** (Forums/Quora/CAclubindia/Team-BHP), **N** (News/official/CAG/PIB numbers).

---

## 1. Cross-Source Problem Map — 12 Canonical Problems

Root-cause classes used: **UI**, **CAPACITY** (infra/load), **IDENTITY** (cross-database identity mismatch), **OPAQUE-STATE** (back-office state exists but is not exposed / diverges from the portal), **PROCESS-POLICY** (incentives, SLAs, manual approval chains, policy design).

### C1. Cross-database identity mismatch is the single most repeated root cause
- **Corroboration:** R (#7, #14), T (#20 — explicitly called "arguably the single highest-leverage unsolved problem"), F (#3, #4, cross-cutting note), N (root-cause pattern #1, unaddressed gap #2). **All four sources independently converge on this.**
- **Evidence:** EPFO claim rejection rate **22% FY2024-25, 26% FY2023-24** (~174 lakh of 796 lakh claims rejected) with name/DOB/Aadhaar mismatch as the top named cause (N, Factly/Dataful). Deccan Herald quoting the government's own explanation: *"the main reason for rejection is ... just an alphabet in the name not matching, or different details in Aadhaar."* DigiLocker enforces exact-name match while the government's own guideline *"permits name variations ... if date of birth and gender match exactly"* (F #4, Counterview) — a policy-vs-implementation contradiction. Reddit: *"They didn't open my account because they wanted my name on Aadhar Card and Pan card [to match]... If your PAN is linked to Aadhaar, then bank can't say it's not same"* (r/IndiaTax, 10+ comments).
- **Root cause class:** IDENTITY (data-model). Every department does independent bilateral string matching; no canonical record, no fuzzy tolerance, no confidence score, no reviewer override with audit.
- **Persona:** Universal — but bites hardest on people with initials-style South Indian names, married women post name change, regional transliteration variants, and anyone whose records were keyed by different clerks over 20 years.
- **Reform underway?** **No.** N explicitly lists "no unified golden record or canonical-identity reconciliation layer found in any reform announcement" as unaddressed gap #2. UIDAI's sandbox targets fintech integration, not this.

### C2. EPFO claims rejected/stuck with cryptic, contradictory, or absent reasons
- **Corroboration:** R (#1, #11, #15-adjacent), T (#3), F (#3, #15, #16, #17, #28), N (rejection-rate table).
- **Evidence:** EPF iGMS grievances rose **6x, from 2.5 lakh (2012-13) to 1.6 million (FY2023-24)** (N). Reddit r/epfoindia: *"EPFO Form-31 keeps getting rejected for Insufficient Service despite 13+ years service and completed PF transfer... EPFiGMS, CPGRAMS failed. Now forced to use RTI just to make EPFO acknowledge their own data."* A commenter's RTI reply: *"RTI response said.. i have -37K in EE share... which is completely wrong (in passbook its +ve balance)... their backend data is updating only withdrawls since march 2025 and avoiding contributions."* F: 3.1 lakh higher-pension applications stuck awaiting employer joint-option validation; of one 97,640-member cohort only **8,401 got PPOs**.
- **Root cause class:** OPAQUE-STATE + IDENTITY. The rejection reason exists as officer shorthand in a back-office field and is never rendered as an actionable, evidence-linked cause.
- **Persona:** Salaried job-switcher (very relatable to a hackathon audience), plus retirees on EPS.
- **Reform underway?** Partially — **EPFO 3.0** (UPI/ATM withdrawal, new app, notified 29 June 2026) improves *withdrawal convenience*, not *rejection diagnosis*. BusinessToday July 2026: *"EPFO's instant PF withdrawal promise has a catch — one in five claims still gets rejected."* The gap survives the reform.

### C3. "Approved / Settled / Paid" on the portal, money never lands (last-mile DBT failure)
- **Corroboration:** R (#16 NSP, #5 ITR), T (#2 EPFO NEFT bounce, #6 NSP, #7 PM-Kisan), F (#26 NSP/PFMS, #2 ITR), N (NSP disbursement causes, PM-Kisan exclusion triggers).
- **Evidence:** EPFO marks a claim done when NEFT is *initiated*, and never surfaces the return/bounce: *"The NEFT payment may have bounced because the bank account or IFSC seeded in your UAN is wrong or closed... most banks will automatically reject incoming high-value NEFT transfers to dormant accounts"* — the subscriber cannot see the UTR without filing a fresh grievance (T #2). NSP: r/Kerala thread, 140+ comments — *"I applied in 2024 november... got selected... in 2025 october, and I renewed... in Jan 2026, I will graduate within two months. Why is it getting delayed."* Follow-up thread: *"did anyone recieved the pg scholarship from the nsp portal but in half?"* consumercomplaints NSP page: 36 complaints, one describing status flipping from selected-with-PFMS-token to "Not applicable". N names the causes precisely: institute/district verification lag, **Aadhaar-bank seeding mismatch**, bank-merger IFSC changes.
- **Root cause class:** OPAQUE-STATE (multi-hop payment chain: scheme → PFMS → sponsor bank → NPCI Aadhaar Mapper → destination bank; only the first hop is ever shown) + IDENTITY (seeding mismatches) + PROCESS-POLICY.
- **Persona:** SC/ST/OBC/EWS student waiting a year for tuition money; farmer whose ₹2,000 instalment stopped; PF withdrawer whose "settled" money vanished.
- **Reform underway?** **No.** N lists no reform on DBT failure-code transparency. PFMS/NPCI hop status is simply not citizen-visible anywhere.

### C4. Grievance systems close tickets without resolving them
- **Corroboration:** R (#2, #13), T (#5), F (#6), N (CPGRAMS numbers + reform note).
- **Evidence:** **15-18 lakh central grievances/year; 2,08,103 pending as of April 2025** across 23 states/UTs with 1,000+ each; **5,845 of 71,887 pending grievances are >90 days old** as of 31 Jan 2026 (N/PIB). IMPRI: *"departments are incentivised to prioritize the closure of the ticket over the resolutions of the problem."* Documented pattern: *"'Your grievance has been disposed' with an Action Taken Report that restates the complaint and asserts everything is in order, then closes the file... The closing remark answers nothing."* Reddit r/AskIndia: *"I created a few grievances... I haven't got a single response, let alone any action"* — and the appeal path is *"hidden under the 'Feedback' option."* The extreme workaround, twice independently reported: reopening the same CPGRAMS complaint **18 times** before a human called back.
- **Root cause class:** PROCESS-POLICY (KPI = disposal speed, not resolution quality).
- **Persona:** Anyone who has exhausted the primary portal — this is the *meta* layer under every other problem.
- **Reform underway?** **Yes, partially.** CPGRAMS 10-step reforms cut average resolution **28 → 13-15 days**; redressal window cut 30 → 21 days (Aug 2024). But the reforms optimise *speed*, which is exactly the incentive that produces closure-without-resolution. **Closure quality is measured nowhere.** Government has also shipped an AI intake chatbot — so "AI grievance chatbot" is both taken and orthogonal.

### C5. Payment debited, service not delivered (gateway reconciliation gap)
- **Corroboration:** R (#6 IRCTC, #19 electricity), T (#1 IRCTC/Parivahan/GHMC/GST), F (#12 IRCTC, #27 municipal), N (IRCTC outage numbers).
- **Evidence:** IRCTC publishes an official PDF for the failure mode ("Money debited but ticket not booked"). GHMC property-tax complaint thread on consumercomplaints.in shows a **5% resolution rate (346 of 6,668)**; Parivahan has 60 logged complaints. Amritsar Municipal Corporation collected **₹3.25 crore against a ₹50 crore target** partly because of portal payment failure (F #27). Reddit: *"Idiots deducted money and the payment gateway timed out which resulted in me not getting a ticket."*
- **Root cause class:** CAPACITY + OPAQUE-STATE (no idempotent reconciliation loop; no public transaction-status API on any portal — T's cross-cutting note).
- **Persona:** Everyone. Lowest depth of the set, though: refunds mostly do arrive in 2-7 days.
- **Reform underway?** No specific one; IRCTC auto-refund is the one part that broadly works.

### C6. Income Tax: refund/processing black box, then a mass notice with an 8-day fuse
- **Corroboration:** R (#5, #8), T (#4), F (#2, #5, #18), N (CAG + MSP penalty data).
- **Evidence:** r/IndiaTax "invalid IFSC" thread — **390+ comments**, the largest single thread in the research: *"Facing same issue although I received the refund in same account. Irony is I am income tax official."* And the contradictory portal state: *"when I go to 'Refund Re-Issue Request' the portal claims there are no refunds to reissue!"* "ITR held by Risk Management" thread — **310+ comments**: *"I have filled on Jun'2025 but the GOVERNMENT having time now only to intimate me after almost 6 months..!! Irony is they want me revise the return filled within a week."* AIS/TIS mismatch campaign: the department itself admitted *"the system is not taking into account the interest income disclosed under 'others' in the ITR"* and issued a correcting press release two days later (F #5, TaxGuru). CAG Report 13/2024: 504 observations, ₹5,728.79 crore tax effect; ₹19.35 lakh crore outstanding demand with 97.4% deemed hard to recover.
- **Root cause class:** OPAQUE-STATE + PROCESS-POLICY (batch comms) + IDENTITY (inoperative PAN).
- **Persona:** Salaried filer, freelancer, NRI. High digital literacy — which cuts against the "usability for low-literacy users" criterion.
- **Reform underway?** MSP (Infosys) penalised over 12 quarters via Service Level Score — accountability exists, outages persist.

### C7. Digital front-end bolted onto an unreformed manual approval chain (no SLA, no owner, no ETA)
- **Corroboration:** R (#3 passport, #15 e-District certificates, #10 land), T (#8, #15 birth/death certs), F (#20 passport PV, #22 e-District, #10 land mutation, #13 Vahan RC), N (root-cause pattern #4).
- **Evidence:** **11,500+ birth/death certificate applications pending in Pune district alone** after a 2026 CRS routing change pushed even old-copy requests through the District Registrar with no added staffing; *"Anjali in Pune applied ... 12 February 2026 for her newborn, paid the ₹50 fee, and waited 47 days."* Bihar's Chief Registrar wrote officially: *"Due to the revamped CRS portal being extremely slow, the OTPs not being generated in time... there has been a huge backlog in all the registration units in the State."* Passport: *"Go to SP office of PCMC. Tell them your passport is pending review. They will approve it... There was no reason from their side."* e-District certificates: r/Kerala thread, **160+ comments** — *"30k for obc 😭😭😭 wallahi"*; *"I am a mallu raised in delhi. I had to pay almost 5k to get my category documents for which I was valid"* — versus Kerala's Akshaya model resolving the same certificate in 3-7 days free.
- **Root cause class:** PROCESS-POLICY + OPAQUE-STATE.
- **Persona:** Passport applicant; parent needing a birth certificate for school admission; student needing OBC-NCL before a counselling deadline.
- **Reform underway?** **Yes for passport** — mPassport Police App cut PV from ~30 days to ~14 (5 in adopting districts), live in 25+ states/UTs. So passport-PV is a weaker pick now. **No** for e-District certificates, CRS, or land mutation.

### C8. Deadline-day/peak-window collapse of the portals that have hard legal deadlines
- **Corroboration:** R (#9 NTA), T (#9 GST, #10 NTA), F (#8 NTA/SSC, #23 Kaveri, #24 CRS), N (pattern #3, unaddressed gap #4).
- **Evidence:** IRCTC outage began **9:39am, minutes before the Tatkal window; 1,500+ Downdetector reports by 11am**. NTA re-NEET 2026: **4 lakh+ students** hit server queues for admit cards. SSC Phase 13 applications fell **36 → 30 lakh** amid crashes after the vendor was replaced by a lower bidder — a procurement decision, not a bug. GSTN's own handle: *"GST portal is currently experiencing technical issues and is under maintenance... CBIC is being sent an incident report to consider extension in filing date."* r/CBSE: *"on the last day of JEE Mains registration, the NTA portal reportedly stopped working almost 2 hours before the official closing time... it meant losing the chance to even appear for the exam this year."* Kaveri (Karnataka) had a detected DDoS event of **6.2 lakh malicious requests in 2 hours** on 7-year-old UPS hardware.
- **Root cause class:** CAPACITY + PROCESS-POLICY (no automatic deadline-extension rule when the portal itself fails).
- **Persona:** Student, CA, taxpayer, property buyer.
- **Reform underway?** No credible one (N gap #4: penalties exist, outages recur post-penalty).

### C9. Silent welfare exclusion by automated cross-checks, with no notice and no appeal window
- **Corroboration:** R (#18 ration e-KYC), T (#7 PM-Kisan, #19 ration deletions), F (#7 PM-Kisan, #9 ONORC), N (PM-Kisan triggers, fraud-control pattern #7, gap #5).
- **Evidence:** **48+ lakh of 10.64 crore PM-Kisan beneficiaries had incomplete eKYC (July 2025); 1.12 crore currently marked "ineligible"**; national coverage fell **14%** (2021-22 → 2023-24) largely via wrongful exclusion; a field study found **~40% of 300 Adivasi farmers marked "ineligible" in AP were actually eligible** (F #7, The Wire). Karnataka cancelled **2.34 lakh** ration cards over 5 years; Punjab deleted **2.5 lakh+** cardholders in a single drive. Tamil Nadu gave **one week** for biometric re-verification of every member on a card: *"failure to do so will result in erasure of name from the card. How is this practical? What will people living in other states / countries with a TN ration card do?"*
- **Root cause class:** PROCESS-POLICY + IDENTITY. Same automated machinery produces legitimate fraud catches and wrongful exclusions; **the false-positive rate is disclosed nowhere** (N gap #5).
- **Persona:** Small farmer, migrant worker, elderly PDS beneficiary — precisely the low-digital-literacy persona the brief rewards.
- **Reform underway?** No — enforcement is expanding (PMJAY AI/ML fraud detection saved ₹676.14 crore), the false-positive side is not being built.

### C10. Ayushman Bharat card refused at "empanelled" hospitals because the state owes them money
- **Corroboration:** R (#4), T (#12), F (#25), N (PMJAY enforcement numbers).
- **Evidence:** r/mumbai thread, **80+ comments** — OP scraped the official NHA hospital list, called down it, *"almost all of them said pregnancy/delivery isn't covered."* A doctor: *"I work in a private hospital. Most larger ones don't accept Aayushmaan Bharat schemes."* Another: *"Bills of lakhs and crores of rupees are pending to be received from the Govt. Hospitals are helpless... How can you expect them to run operations with so much money stuck??"* Enforcement scale: **2,359 hospitals de-empanelled, 1,200+ suspended, 1,504 penalised ₹122 crore, total penalties ₹328.49 crore** — implying enormous complaint volume behind it.
- **Root cause class:** PROCESS-POLICY (state reimbursement arrears) — the deepest non-software root cause in the set.
- **Persona:** A family in a medical emergency. Highest emotional stakes of any problem here.
- **Reform underway?** Enforcement yes; the reimbursement-arrears cause, no. **The official empanelment list being stale is the actionable software gap.**

### C11. Aadhaar biometric authentication failure — 6-12%, unchanged for a decade
- **Corroboration:** T (#18), F (#9 ONORC), N (pattern #2, **unaddressed gap #1**).
- **Evidence:** **~312 million authentications/month attempted for welfare access; ~20.3 million fail.** National failure rate 6.5% stable for a decade, recent range 6-12%. In AP's PDS, 2.5% average failure, **92% of failures are biometric mismatch**. UIDAI's own framing names the demographic: *"worn fingerprints, particularly among farmers, masons, cooks, housekeepers and senior citizens who lose ridge depth."*
- **Root cause class:** IDENTITY (biometric) + PROCESS-POLICY (no mandated fallback path at the point of denial).
- **Persona:** The most vulnerable users in the whole map.
- **Reform underway?** **No — N ranks this the #1 unaddressed gap with "no credible fix found in any source reviewed."** But it is also the least fixable by an 8-day software prototype, since the failure is physical.

### C12. Record updated in the office, never updated online (dual source of truth)
- **Corroboration:** R (#10 land/katha), T (#13 land mutation), F (#10 land, #13 Vahan RC, #14 legacy DL), N (DILRMP note).
- **Evidence:** *"Property purchased. Sale deed registered. EC current in our name, but local Tahisildar and minions refuse to update katha... in spite of several HC orders directing them to do so, and a Contempt of Court petition pending before HC."* Vahan: *"the Parivahan website still reflected the previous owner's name even when agents claimed the transfer was complete"* — and courts hold the *registered* owner liable to third parties, so the desync creates real legal exposure ("Car sold but not transferred kills a person" — Team-BHP). Tribune: *"due to some technical glitch, registration record of around 83 vehicles was not updated on 'Vahan' portal."*
- **Root cause class:** OPAQUE-STATE (genuine dual-register divergence) + PROCESS-POLICY (rent-seeking at the update step).
- **Persona:** Property buyer, used-car seller.
- **Reform underway?** DILRMP ongoing, state-fragmented; Gujarat near-complete. 28+ separate state schemas make a general product very hard in 8 days.

**Meta-observation worth stealing for the pitch:** all four sources independently note that the *entire* competitive landscape here is SEO content farms (kustodian.life, citizennest.com, righttoinformation.wiki, mydocstatus.com, futuresmartguide.com) that monetise the frustration with "how to fix X" articles — **none of them ship an actual diagnostic tool.** That is proof of demand and proof of whitespace in one sentence.

---

## 2. Scoring Matrix

All criteria scored 1-5, higher = better for this hackathon. **Uncrowded** = 5 means few other entrants will pick it (IRCTC/Tatkal scores 1).

| # | Canonical problem | Real & important | E2E journey in 8 days | Usability upside (mobile/slow/low-literacy) | Depth (backend/process story) | Honesty / mockability | OpenAI leverage | Uncrowded | **Total** |
|---|---|---|---|---|---|---|---|---|---|
| C1 | Cross-DB identity mismatch | 5 | 4 | 4 | 5 | 5 | 5 | 4 | **32** |
| C2 | EPFO cryptic claim rejection | 5 | 5 | 4 | 4 | 5 | 5 | 3 | **31** |
| C3 | DBT "paid but not received" (NSP/PM-Kisan/EPFO/ITR) | 5 | 4 | 5 | 5 | 5 | 5 | 5 | **34** |
| C4 | Grievance closed-not-resolved | 5 | 4 | 3 | 5 | 4 | 5 | 3 | **29** |
| C5 | Payment debited, service not delivered | 4 | 4 | 4 | 2 | 4 | 2 | 1 | **21** |
| C6 | ITR refund black box / mass notices | 4 | 3 | 2 | 4 | 4 | 4 | 3 | **24** |
| C7 | Manual back-office chain (certs, CRS, passport PV) | 5 | 4 | 5 | 5 | 4 | 4 | 4 | **31** |
| C8 | Deadline-day portal collapse | 5 | 2 | 2 | 3 | 2 | 1 | 2 | **17** |
| C9 | Silent welfare exclusion (PM-Kisan / ration) | 5 | 3 | 5 | 5 | 4 | 4 | 4 | **30** |
| C10 | Ayushman denial at empanelled hospitals | 5 | 3 | 4 | 5 | 3 | 3 | 4 | **27** |
| C11 | Aadhaar biometric failure | 5 | 2 | 5 | 5 | 3 | 2 | 5 | **27** |
| C12 | Office-vs-online record desync (land/Vahan) | 4 | 2 | 3 | 5 | 3 | 3 | 4 | **24** |

### Notes on the harsh scores
- **C5 / C8 (IRCTC, NTA, GST outages): do not build these.** Depth is low (it's capacity engineering you cannot touch), an LLM adds literally nothing (score 1-2 — any LLM you bolt on is decorative, which the brief explicitly penalises), and **Tatkal will be the single most-picked idea in this hackathon.** Skip.
- **C11 (biometric failure)** is the most important unfixed problem in India by N's own ranking, but the failure is a worn fingerprint. A prototype can only route people to a fallback (face auth / OTP / offline eKYC). Genuine, but the demo is thin and OpenAI leverage is weak. Best used as a *sub-flow* inside another product, not the product.
- **C6 (income tax)** loses points on the usability criterion — its persona is a digitally literate salaried filer, so the "works on a ₹6,000 phone on 2G for someone who reads slowly" story cannot be told honestly.
- **C12 (land/Vahan)** has superb depth but 28 state schemas kills the 8-day E2E journey.

### Crowdedness prediction (opinionated)
Expect the entrant field to cluster on: **IRCTC/Tatkal (heaviest by far)**, generic "AI chatbot for CPGRAMS/any govt scheme", "AI form filler for scholarship applications", "WhatsApp bot that explains schemes in your language", and passport slot alerts. All of these are either capacity problems you can't fix or a chatbot bolted onto a portal — precisely the two things the brief says will lose. **The uncrowded, deep lanes are C3 (last-mile DBT money tracing), C1 (identity reconciliation as a service), C7 (reason-coded back-office SLA), and C9 (wrongful-exclusion appeal).**

---

## 3. Top 5 Build Ideas

---

### IDEA 1 — **Paisa Kahan Hai** ("Where is my money") — Last-Mile DBT Failure Tracer
_Canonical problem: C3 (+C1, +C9 as sub-causes)_

**One-sentence problem:** Government portals declare money "Approved / Settled / Paid" the moment they *hand it off*, so millions of students, farmers and PF claimants stare at a green tick while their bank account stays empty, with no way to learn which of five downstream hops actually failed.

**Persona + story hook:** Aarav, final-year PG student on an NSP post-matric scholarship. Portal says *"Payment sent to PFMS"* — October 2025. It is now August 2026, he graduates in two months, and no money. He has no idea whether the college nodal officer never verified, whether PFMS never released, whether his Aadhaar was seeded to an old bank account that merged (IFSC changed), or whether the NEFT bounced off a dormant account. The 140-comment r/Kerala thread is literally hundreds of Aaravs comparing notes. Parallel persona: Sunita, PM-Kisan beneficiary, instalment silently stopped — she has to visit the bank, the CSC, *and* the revenue office to test each hypothesis separately.

**End-to-end journey**

*Citizen side (phone, works on 2G, works in Malayalam/Hindi/Marathi, works by voice):*
1. Enter reference (mock application ID / UAN / PM-Kisan ID) **or** photograph the portal status screen / paste the SMS you got. No login required to start.
2. The system reconstructs a **hop-by-hop payment ledger**: Scheme portal → Institute/State verification → PFMS sanction → Sponsor bank debit → **NPCI Aadhaar Mapper** → Destination bank credit. Each hop is green / amber / red with a timestamp.
3. Exactly one red hop is named in plain language: *"Your money left PFMS on 14 March. It bounced at your bank on 17 March, return code R03 — the account number seeded in your Aadhaar mapper belongs to Vijaya Bank, which merged into Bank of Baroda; the IFSC no longer exists."*
4. One action, not five: *"Go to any Bank of Baroda branch with your Aadhaar and passbook, ask them to re-seed your Aadhaar to your new account via NPCI (form: DBT consent). This takes 72 hours. Do NOT change the account on the NSP portal — that will not fix this."* Plus a printable/WhatsApp-forwardable one-pager in the local language, for a person who will hand it to a bank clerk.
5. If the citizen consents, a **structured case** is filed to the right desk with the diagnosis attached, and an SLA clock starts. The citizen gets SMS-grade updates.

*Back-office / officer side (this is the half most entrants will skip):*
1. **Nodal officer console** shows a queue of cases already *classified by failure hop*, not a flat list of "payment not received" complaints. Officer sees: 61 cases stuck at institute verification (assignable to one college), 40 at Aadhaar-mapper mismatch (bulk-fixable by a bank liaison), 12 genuinely rejected.
2. Each case carries a machine-generated **evidence packet** (which fields disagree, which timestamps, which return code), so the officer resolves rather than triages.
3. **Closure gate:** an officer cannot close a case without selecting a structured resolution reason AND attaching the hop that turned green. Every state change writes to an append-only **audit log** with actor, timestamp, reason code and prior/next state.
4. **Systemic dashboard:** "Institute X has 400 unverified applications for 90 days"; "Bank merger Y is producing 3,000 mapper failures this month." This is the artefact that converts individual pain into a fixable systemic signal — and it is exactly the wrongful-exclusion transparency gap N ranks as unaddressed gap #5.

**Where the OpenAI model sits (and why it's necessary, not decorative)**
1. **Heterogeneous status normalisation.** There is no common vocabulary: NSP says "Application forwarded to PFMS", PM-Kisan says "Land Seeding: No", EPFO says "Settled", banks emit NACH/NEFT return codes (R01/R03/ARN...), state portals emit Hindi/Marathi free text. The model maps *any* of these — including an OCR'd screenshot or a pasted SMS — into a **canonical failure taxonomy** with a confidence score. A regex table cannot do this across schemes, states and languages; that's the honest engineering argument.
2. **Causal reasoning over conflicting evidence.** Given passbook + status string + seeded-account metadata + return code, the model has to decide *which single hop is the real blocker* when three look wrong. Structured-output reasoning with a fixed schema (`{failed_hop, cause_code, confidence, contradicting_evidence[]}`), constrained to a taxonomy so it cannot invent a cause.
3. **Multilingual, low-literacy action generation.** Turning `cause_code=NPCI_MAPPER_STALE_IFSC` into a five-sentence Malayalam instruction that names the office, the document, and the thing *not* to do. Bhashini-style translation alone doesn't do this; the register and the omissions matter.
4. **Officer-side clustering.** Summarising 300 free-text cases into "these 61 are the same root cause at one college."
The model is in the **pipeline** — remove it and the product cannot ingest a screenshot, cannot classify a novel state string, and cannot speak Malayalam. That's the test the brief sets.

**Architecture — what is real vs simulated (say this out loud in the demo)**
- **Real:** the whole application. Next.js/React PWA (mobile-first, offline-tolerant, <100KB first paint target), FastAPI/Node backend, Postgres, a **case lifecycle state machine** (`INTAKE → DIAGNOSED → ACTION_ASSIGNED → PENDING_CITIZEN → PENDING_OFFICER → RESOLVED / REJECTED_WITH_REASON`, with legal transitions enforced in code and a rejection requiring a reason code), append-only audit log table, SLA timers, the OpenAI pipeline, the officer console, the systemic dashboard.
- **Simulated, clearly labelled with a persistent "MOCK DATA" banner:** four fake department databases seeded with synthetic records — `mock_nsp`, `mock_pfms`, `mock_npci_mapper`, `mock_bank_core` — each with its own deliberately inconsistent name/IFSC/account fields, populated to mirror the real distributions from `research/news` (e.g. seeding-mismatch and verification-lag proportions). **Mock DigiLocker consent screen** (modelled on the API Setu sandbox contract) so the consent artefact and its audit entry are real even though the issuer is fake. **Mock Aadhaar** = 12-digit synthetic IDs from the UIDAI test range, never a real number.
- **Explicitly not touched:** no live government system, no scraping, no real PII. A `/mocks` page in the app lists every fake surface and what the real integration would be (API Setu endpoints are named).

**"Deeper than UI" argument:** The UI is not the bug. The bug is that **status is reported at handoff instead of at settlement**, and that the failure code that *does* exist (a NACH return code sitting in a sponsor bank's file) is never propagated back up the chain to the citizen or the officer. This product proposes the missing piece of infrastructure: a **hop-level settlement ledger with a standard failure-code vocabulary**, plus a closure gate that makes "resolved" mean "the money moved." That's a protocol proposal with a working reference implementation, not a skin.

**How it scales safely:** Read-mostly and idempotent — it never initiates a payment, so the worst-case failure is a wrong diagnosis, not a wrong transfer. Every diagnosis is shown with its confidence and its evidence, and a low-confidence case degrades to "we don't know; here are the two offices to try" rather than guessing. Officer actions are the only writes, and they're all audited. Rate-limited per identifier; PII minimised (store hashes of identifiers, not identifiers). Model outputs are schema-constrained and validated against the taxonomy, so an LLM hallucination becomes a rejected response, not a wrong instruction. Cost scales at a few paise per case; the officer-clustering call is batched.

**Honest limitations (put these on a slide — the brief rewards it):**
- We do not have PFMS/NPCI read access. In production this needs an inter-departmental data-sharing agreement; without it, the hop ledger degrades to "most likely hop" inference from citizen-supplied evidence.
- Diagnosis accuracy is unmeasured — there is no labelled dataset of real DBT failures in the world, which is itself part of the problem.
- Bank return codes are not uniformly populated in reality; some banks return generic failures.
- We cannot make an institute nodal officer do their job; we can only make their backlog visible.
- Our name/IFSC/mapper mock is a plausible model, not a replica, of PFMS internals.

**8-day build plan**
- **Day 1:** Lock the failure taxonomy (~15 cause codes across 4 schemes) and the case state machine. Write the synthetic data generator for the four mock DBs, seeded to reproduce ~8 canonical failure stories end-to-end. Codex scaffolds the repo.
- **Day 2:** Backend: schema, state machine with enforced transitions, audit log, SLA clock, mock-DB query layer. Seed 500 synthetic cases.
- **Day 3:** OpenAI pipeline v1 — status-string + SMS → canonical cause code, structured outputs, taxonomy validation, confidence + refusal path. Build a 60-example eval set from the *actual quotes* in the research files and report accuracy honestly.
- **Day 4:** Citizen PWA: intake (ID / paste SMS / photo), hop ledger visualisation, one-action card. Mobile-first, large tap targets, low-bandwidth budget.
- **Day 5:** Screenshot ingestion (vision) + multilingual action generation (2 languages minimum: Hindi + one South Indian) + text-to-speech read-aloud for low-literacy users.
- **Day 6:** Officer console: cause-clustered queue, evidence packet, closure gate with mandatory reason code, systemic dashboard.
- **Day 7:** Mock DigiLocker consent flow, `/mocks` transparency page, audit-log viewer, seed the demo narrative, hard perf pass (throttled 3G test, ₹6,000-phone viewport).
- **Day 8:** Record the 3-minute demo, write the README (architecture + honesty section + eval results), buffer for breakage.

**3-minute demo script**
- 0:00-0:25 — Aarav's real thread on screen (140 comments), then his portal: green tick, "Payment sent." Bank balance: ₹0. "This is not a UI problem. The portal is telling the truth about the wrong thing."
- 0:25-1:05 — Phone, throttled to 3G, in Malayalam. He photographs the status screen. Hop ledger renders: five hops, one red. Plain-language cause, one action, read aloud.
- 1:05-1:45 — Flip to the officer console. His case is already sitting in a cluster of 61 identical mapper failures from one bank merger. Officer bulk-resolves; **tries to close a different case without a reason and the system refuses.** Audit log shown.
- 1:45-2:20 — Systemic dashboard: "College X: 400 applications unverified for 90 days." The pitch line: *this converts 400 individual tragedies into one email to one principal.*
- 2:20-2:50 — The honesty slide: every mocked surface named, real API Setu endpoints named, eval accuracy stated with its error bar.
- 2:50-3:00 — The ask: one read-only PFMS/NPCI status endpoint and a failure-code standard, and this ships nationally.

**Crowdedness risk: LOW.** "Payment failed" entries will overwhelmingly be IRCTC refunds. Almost nobody will model the *DBT settlement chain*, and almost nobody will build the officer side.

---

### IDEA 2 — **Naam** — Cross-Database Identity Reconciliation & Pre-Flight
_Canonical problem: C1 (the root cause under C2, C3, C9)_

**One-sentence problem:** Six government databases hold six slightly different spellings of the same person's name and DOB, every department does its own exact-string match, and so **22-26% of EPF claims** and lakhs of scholarship/PM-Kisan/PMJAY applications are hard-rejected by a missing middle initial that no human ever looks at.

**Persona + story hook:** Arjun K R on his PAN, Arjun Kumar Raghavan on his Aadhaar, ARJUN K RAGHAVAN in his bank KYC, and "Arjun Raghavan" in his EPFO UAN. He passed PAN-Aadhaar linking and *still* got his account opening refused and his PF claim rejected — because each downstream system applies a stricter check than the one that certified him. Reddit's r/india thread on exactly this has 70+ comments; the government itself blames "just an alphabet in the name not matching" for the country's largest claim-rejection category.

**End-to-end journey**

*Citizen:* Upload/fetch (mock DigiLocker) your documents → the system extracts the name/DOB/gender/address fields from each → a **diff view** shows precisely which token differs where (initial expansion, surname order, transliteration variant, married-name change, DOB day/month swap) → a **repair plan in dependency order** ("fix Aadhaar first, then PAN via CR01, then re-KYC the bank; do NOT change EPFO first, it will re-break") with realistic timelines and the exact form number → a pre-flight verdict *before* you submit a claim: "This EPF claim would be rejected today. Fix step 1 first."

*Officer:* A **match-adjudication console**. Instead of a binary reject, the officer sees a normalised comparison, a similarity score with the *reason* for the difference ("initial expansion, common South Indian convention — 0.94"), the government's own guideline permitting name variation when DOB and gender match exactly, and an "Accept with recorded justification" button that writes to the audit log. This is the reform: **turn hard rejections into soft flags with human adjudication and an evidence trail.**

**Where the OpenAI model sits:** Name equivalence across Indian naming systems is genuinely a language problem, not a string-distance problem — Levenshtein says "Arjun K R" and "Arjun Kumar Raghavan" are far apart, and says "Ramesh" and "Rakesh" are close. The model classifies the *type* of variation (initial expansion, patronymic vs surname, transliteration from Devanagari/Tamil/Bengali, honorific, married name, clerical transposition) and outputs a structured verdict + rationale; it also handles OCR extraction from document images, and generates the dependency-ordered repair plan in the user's language. Deterministic post-checks (DOB, gender, Soundex/Metaphone-in-Indic) gate the model so it can never *loosen* a match without corroborating fields.

**Architecture:** Real app + real match engine + real adjudication console + audit log. Simulated: mock DigiLocker issuer sandbox, `mock_uidai`, `mock_pan`, `mock_epfo`, `mock_bank_kyc` synthetic tables seeded with deliberately divergent records; all Aadhaar numbers from the UIDAI test range.

**Deeper than UI:** It proposes a **shared match-tolerance policy** — the same rule DigiLocker refuses to honour but the Income Tax Dept and RTO already do — plus a reference implementation and an override audit trail. That is a data-governance proposal, and it is the #2 unaddressed gap in the news research.

**Scales safely:** Advisory only; it never writes to a source database. It fails *closed* (a low-confidence match is escalated to a human, never auto-approved). Every override is attributable.

**Honest limitations:** Match tolerance is a policy decision we cannot make — we can only propose defaults and expose the dial. No real ground-truth dataset of name-variant pairs exists, so our eval is on synthetic + research-derived cases. Fraud risk is real: any loosening of matching has an adversarial side, which is why the design routes to a human rather than auto-approving.

**8-day plan:** D1 variation taxonomy + synthetic record generator; D2 extraction pipeline + diff engine; D3 model classifier + eval set (150 synthetic pairs, report precision/recall); D4 citizen diff UI + repair-plan generator; D5 mock DigiLocker fetch + multilingual output; D6 officer adjudication console + audit log; D7 pre-flight claim simulator ("would this EPF claim be rejected?") + honesty page; D8 demo + README.

**Demo outline:** Rejection letter on screen → upload four docs → diff lights up one token → repair plan → run the pre-flight again after the mock fix, claim passes → officer console adjudicates a borderline case with a recorded justification → audit log → honesty slide.

**Crowdedness risk: LOW-MEDIUM.** Some entrants will build "AI document verifier"; very few will frame it as a *match-tolerance policy engine with officer adjudication*.

---

### IDEA 3 — **Kyun** — EPF Claim Autopsy & Escalation Engine
_Canonical problem: C2_

**One-sentence problem:** One in four EPF claims is rejected, and the rejection reason a member sees is a two-word officer shorthand ("Insufficient Service") that frequently contradicts their own passbook — so the only escalation that works is an RTI, or a physical visit to the PF Commissioner.

**Persona + story hook:** 13 years of service, transfer completed, Form-31 rejected for "Insufficient Service." Then re-filed and rejected for "Insufficient Balance." Then "Insufficient Service" again. EPFiGMS and CPGRAMS both closed the grievance. He filed an RTI, and EPFO's own reply said his EE share was **−₹37,000** while his passbook showed a positive balance. That is a verbatim Reddit thread, and there are dozens like it.

**End-to-end journey**

*Citizen:* Upload passbook PDF + Annexure-K + the rejection SMS/letter → the system rebuilds a **service-history timeline** across UANs/employers, recomputes eligibility itself, and states either "EPFO is right and here's the gap" or **"EPFO's stated reason contradicts your own passbook — here is the specific contradiction"** → generates the correct instrument (Joint Declaration, Form 13 transfer, KYC correction) *in the right order*, plus a pre-written EPFiGMS grievance, a CPGRAMS escalation with the 21-day SLA cited, and — the killer — a **ready-to-file RTI** asking the exact question that forces disclosure of the backend figure. SLA clock tracks all three and tells you the day you're entitled to escalate.

*Officer:* A console where a rejection **cannot be recorded without** (a) a structured cause code, (b) the specific field(s) that failed, and (c) the value the system compared against. Plus a "contradiction detector" queue that surfaces claims where the stated rejection reason disagrees with the member's own passbook — an internal QA layer EPFO does not have.

**Where the OpenAI model sits:** Parsing the wildly inconsistent EPF passbook and Annexure-K formats (multi-employer, multi-UAN, Hindi/English mixed, PDF and photo) into a structured contribution ledger; reconciling employer names that differ across establishments; classifying the free-text rejection remark into a cause taxonomy; and drafting the grievance/RTI in correct register with the right statutory citations. The drafting matters more than it sounds — the research shows the *wording* of an RTI is what determines whether EPFO discloses the backend number.

**Architecture:** Real: parser, eligibility recomputation engine, contradiction detector, escalation state machine (`FILED → SLA_RUNNING → RESPONDED → APPEALED → RTI_FILED`), audit log, officer console. Mocked: `mock_epfo_backend` (deliberately divergent from the passbook, exactly as the research describes), mock EPFiGMS/CPGRAMS endpoints that return template closures so the appeal loop is demonstrable.

**Deeper than UI:** The reform is **"a rejection is a claim the department makes, and it must be evidenced."** Structured, evidence-linked rejection codes + an automatic contradiction check are back-office process changes, not screens.

**Scales safely:** Read-only on member data, generates documents the member files themselves. Never auto-files anything without explicit confirmation.

**Honest limitations:** We can't see EPFO's real backend, which is the whole point — the tool exists *because* that opacity exists, and it says so. Passbook parsing will fail on some formats. Our eligibility recomputation encodes published EPF rules and may diverge from internal ones.

**8-day plan:** D1 rejection-cause taxonomy + synthetic passbook/Annexure-K generator; D2 parser + ledger model; D3 eligibility engine + contradiction detector; D4 model classification + eval; D5 citizen flow + document generators (JD/Form 13/iGMS/CPGRAMS/RTI); D6 escalation state machine + SLA clock + officer console; D7 mobile/low-bandwidth pass + honesty page; D8 demo.

**Demo:** Upload passbook + rejection → timeline → red contradiction banner → generated RTI text on screen → officer console refuses a reason-less rejection → contradiction queue.

**Crowdedness risk: MEDIUM.** EPFO is well known and *will* attract entries — but most will build "AI chatbot explains your PF." The contradiction detector and the enforced-evidence rejection console are the differentiators.

---

### IDEA 4 — **Band Nahin, Hal** ("Closed isn't fixed") — Grievance Resolution Integrity Layer
_Canonical problem: C4_

**One-sentence problem:** CPGRAMS handles 15-18 lakh grievances a year and is measured on how fast tickets close, so departments close them with Action Taken Reports that restate the complaint and fix nothing — and nobody, anywhere, measures closure *quality*.

**Persona + story hook:** You filed, waited, and got "Your grievance has been disposed." The ATR repeats your own complaint back at you. The appeal button is hidden under "Feedback." Someone in the research reopened the same complaint **18 times** before a human called. The pensioner case: ₹41,000 in arrears still unpaid four months after "resolution," and only an RTI revealed the real cause (a bank IFSC mismatch) that CPGRAMS had concealed.

**End-to-end journey**

*Citizen:* Paste your ATR → the model scores it on **Responsiveness** (does it answer the question actually asked?), **Actionability** (does it name a concrete action taken, with a reference?), and **Verifiability** (is there a checkable artefact?) → if it's boilerplate, you get a drafted appeal that quotes the ATR's specific evasions and cites the 21-day norm, plus the parallel RTI and the PMOPG escalation path, with deadlines on a clock.

*Officer/ministry:* A **closure-quality dashboard**: per-department boilerplate rate, reopen-within-30-days rate, appeal-upheld rate — a "resolution quality index" alongside the disposal-speed KPI the system currently optimises. Plus a **pre-closure check** that warns an officer their draft ATR would score as boilerplate before they submit it.

**Where the OpenAI model sits:** Judging whether a bureaucratic paragraph actually addresses a citizen's question is irreducibly a language-understanding task — no keyword rule does it. The model does rubric-scored classification with cited spans (it must quote the sentence it judged), plus appeal drafting in the citizen's language. Both are pipeline-critical.

**Architecture:** Real: rubric scorer with span citations, appeal/RTI generators, SLA clock, department dashboard, audit log. Mocked: a synthetic corpus of ~300 ATRs written to mirror the documented patterns, a `mock_cpgrams` API with file/appeal/reopen endpoints, mock department directory.

**Deeper than UI:** It attacks the **incentive**, which every source names as the true root cause. Adding a quality metric next to the speed metric is a governance intervention with a working implementation.

**Scales safely:** Advisory scoring, never auto-files; scores are shown with the quoted evidence so a human can overrule; department-level stats are aggregate, never naming individual officers.

**Honest limitations:** Our ATR corpus is synthetic (real ATRs aren't public in bulk) — we say so and show the rubric so it can be re-run on real data. An LLM judging bureaucrats is itself contestable; that's why every score cites its span. Government has already shipped an AI *intake* chatbot; ours deliberately targets the opposite end (closure), and we should say that on stage.

**8-day plan:** D1 rubric + synthetic ATR corpus; D2 scorer + span citations + eval vs hand-labels; D3 citizen flow; D4 appeal/RTI generators; D5 SLA clock + reopen state machine; D6 department dashboard + pre-closure warning; D7 mobile/multilingual/honesty; D8 demo.

**Demo:** Paste a real-shaped ATR → 2/10 with the evasive sentence highlighted → appeal generated → officer view: "your draft would score 3/10, here's what's missing" → ministry dashboard ranking departments by closure quality.

**Crowdedness risk: MEDIUM-HIGH.** "Grievance AI" is an obvious hackathon idea; the *scoring-closures-not-writing-complaints* inversion is what saves it. Some judges may also see it as meta rather than a citizen journey.

---

### IDEA 5 — **Kagaz** — Reason-Coded Certificate Pipeline (e-District: caste / income / domicile / birth)
_Canonical problem: C7_

**One-sentence problem:** The highest-volume citizen document flow in India sits "pending verification" at a Patwari/Tehsildar desk past the state's own Right to Service deadline, gets rejected with no stated reason, and is routinely unstuck only by paying ₹5,000-₹30,000 — while the identical certificate takes 3-7 days and zero rupees in Kerala.

**Persona + story hook:** A JoSAA counselling deadline is nine days away and your OBC-NCL certificate is "pending." r/Kerala, 160+ comments: *"30k for obc 😭😭😭"* and *"I am a mallu raised in delhi. I had to pay almost 5k to get my category documents for which I was valid"* — next to *"my fellow colleague from Lucknow had to bribe several officers there to get the same [certificate I got in 4 days via Akshaya]."* Same country, same form, different back office. Pune: **11,500+ birth/death certificates pending**, one applicant waited 47 days for a newborn's certificate.

**End-to-end journey**

*Citizen:* Pre-flight — before applying, the model checks your document set against *this district's* actual requirements and flags what will get you rejected → after applying, a **named-officer SLA clock** ("your file is with the Tehsildar, Ward 7; the RTS Act deadline for this service in your state is 15 days; day 22 today") → on breach, an auto-drafted RTS appeal to the First Appellate Authority (which carries a statutory penalty on the officer — this is the leverage citizens don't know they have) plus an RTI for the file's movement history.

*Officer:* A queue that shows RTS clocks and forces a **structured rejection reason from a fixed list, with the deficient field named** — because "rejection reason is unclear" is the documented complaint. A district dashboard exposing median clearance time per desk, benchmarked against Kerala's Akshaya numbers.

**Where the OpenAI model sits:** Requirement rules differ per state, per service, per category and exist only as PDFs and portal prose — the model normalises them into a checkable rule set and explains a specific applicant's gap in their language; it OCRs and validates the uploaded document set; it drafts the RTS appeal citing the right state statute and section.

**Architecture:** Real: rule engine, SLA clock, appeal generator, officer queue with mandatory reason codes, district dashboard, audit log. Mocked: `mock_edistrict` for two states (one Kerala-like, one slow) with synthetic applications and a simulated verification chain (Patwari → Tehsildar → issuing authority).

**Deeper than UI:** The reform is **making the Right to Service Act's clock real and attaching it to a named desk**, plus mandatory reason codes. It is also the only idea here with a built-in natural experiment: Kerala already proves the process can work, so the pitch is "port Kerala's SLA discipline, don't invent anything."

**Scales safely:** Never claims a certificate is valid; only tracks and escalates. Aggregate-only officer stats. Appeals are generated for the citizen to file, not auto-filed.

**Honest limitations:** State fragmentation is real — we model two states, not 28. We cannot see actual file movement inside a Tehsil office; in production this needs the e-District workflow engine to emit events. We cannot stop bribery; we can only make the free legal path (RTS appeal) as easy as the paid one.

**8-day plan:** D1 pick 2 states, encode rule sets + synthetic applications; D2 mock e-District + verification chain state machine; D3 pre-flight document checker (model + OCR) + eval; D4 citizen tracker with named-desk SLA clock; D5 RTS appeal + RTI generators, multilingual; D6 officer queue with mandatory reason codes + district dashboard; D7 mobile/2G pass + honesty page; D8 demo.

**Demo:** Student, 9 days to counselling → pre-flight flags a missing income proof → applies → clock breaches → one tap generates the RTS first appeal naming the officer and the statutory penalty → officer console can't reject without a reason code → district dashboard vs Kerala benchmark.

**Crowdedness risk: LOW-MEDIUM.** "Scholarship/certificate form filler" will be common; the RTS-Act-clock-plus-named-desk framing will not be.

---

## 4. Final Recommendation

### Build **Paisa Kahan Hai** — the Last-Mile DBT Failure Tracer (Idea 1).

**Why it beats the other four for a top-10 slot:**

1. **It scores highest on every axis simultaneously (34/35), and it is the only idea that doesn't trade one judging criterion off against another.** Ideas 2 and 4 are intellectually the deepest but their demos are abstract (string diffs, bureaucratic prose scoring). Idea 3 is the most relatable but narrowest. Idea 5 is excellent but state-fragmented. Idea 1 is the only one that is simultaneously *visceral* ("my account is empty"), *deep* (a six-hop settlement chain with no failure-code propagation), and *demonstrable end-to-end in 8 days*.

2. **It converts the brief's hardest criterion — "usability for low digital literacy on slow networks" — from a claim into a demo.** Aarav and Sunita are not power users. Photograph the screen, hear the answer in Malayalam, get one action instead of five office visits. Ideas 2, 3 and 4 all skew toward digitally-literate personas; this one doesn't.

3. **It absorbs the other ideas' root causes instead of competing with them.** The #1 cause of DBT failure *is* identity/seeding mismatch (Idea 2), the EPFO "settled but not credited" case *is* a DBT hop failure (Idea 3), and the case escalation *is* the grievance layer done right (Idea 4). You get to show the deepest root cause in the research (cross-database identity mismatch, named by all four sources) inside a story about money not arriving, which is far more legible on stage than a name-matching demo.

4. **The back-office half is genuinely novel and almost nobody will build it.** Most entrants will ship a citizen-facing screen. The officer console with a **closure gate** — you literally cannot mark a case resolved without the hop turning green — plus the systemic dashboard that turns 400 individual complaints into one actionable message to one college principal, is the artefact that reads as *end-to-end process thinking* rather than product polish.

5. **The OpenAI model is load-bearing and provably so.** Heterogeneous status strings across schemes, states and languages; screenshot ingestion; conflicting-evidence causal reasoning under a constrained taxonomy; multilingual low-literacy action generation; officer-side clustering. Delete the model and the product stops working — which is exactly the test the brief sets, and exactly the test a bolted-on chatbot fails.

6. **Uncrowded.** The payment-failure lane will be flooded with IRCTC refund trackers, which are shallow and will read as generic. Nobody flooding that lane will be modelling **PFMS → NPCI Aadhaar Mapper → destination bank** with NACH return codes. You'll be the only one in the room whose diagram has a mapper in it.

7. **The evidence base is the strongest in the research.** 48 lakh PM-Kisan eKYC failures, 1.12 crore marked ineligible, a field study showing ~40% of "ineligible" Adivasi farmers were actually eligible, a 140-comment scholarship thread, a 6x rise in EPFO grievances, and an explicit finding that this transparency gap has **no reform underway** (news gap #5). You can put a number on every slide.

### Three things that will make judges remember it

1. **The closure gate, demonstrated live as a failure.** An officer tries to mark a case "Resolved," and the system refuses because the money hasn't moved. Ten seconds, no explanation needed, and it reframes the entire product from "app" to "governance mechanism." Say the line: *"Today, 'resolved' means a ticket closed. Here, 'resolved' means the money landed."*
2. **The one-red-hop ledger.** Five green dots and one red dot with a bank return code beside it, on a phone, in Malayalam, read aloud. Judges will have sat through twenty status-tracker demos that show a spinner; this shows *which specific handoff broke and whose desk fixes it.* It's the single most screenshot-able frame in the pitch.
3. **The honesty slide done as a flex, not an apology.** A single screen listing every mocked surface (`mock_pfms`, `mock_npci_mapper`, mock DigiLocker consent, synthetic Aadhaar from the UIDAI test range), the real API Setu endpoints each would map to, your measured classification accuracy *with its error bar*, and one line: **"We did not touch a single live government system, and here is exactly what we would need to go live: one read-only settlement-status endpoint and a standard failure-code vocabulary."** That turns the honesty criterion into a policy ask, and gives the judges a quotable takeaway.

### Second choice / fallback: **Kyun — EPF Claim Autopsy (Idea 3)**

Pick this if the DBT hop chain proves too hard to mock convincingly by Day 3, or if it turns out the personally-faced problem is a PF claim rather than a scheme payment. It's the fastest path to a working end-to-end demo (single scheme, single failure surface, documents the user already has), the evidence is overwhelming (22-26% rejection rate, government's own explanation, 6x grievance growth), and the "contradiction detector" — where the tool proves EPFO's stated reason disagrees with EPFO's own passbook — is a genuinely memorable moment. Its weakness is crowdedness (EPFO is a known punching bag) and a more digitally-literate persona, which costs you on the usability criterion. Much of Idea 1's architecture (state machine, audit log, closure gate, officer console, escalation generators) is reusable, so a Day-3 pivot is cheap if you build the skeleton generically.

**Do not build:** anything IRCTC/Tatkal, any "AI chatbot for scheme information," any NTA/GST outage tracker. All three are either capacity problems no entrant can fix, or exactly the decorative-LLM pattern the brief penalises — and the first will be the most-repeated entry in the competition.

---

## 5. Open Questions for You

The brief requires a problem **you personally faced**. That constraint should override the scoring above if it conflicts.

1. **Which of these have you actually lived through?** Specifically: (a) an EPF claim rejected or a PF transfer stuck; (b) a scholarship/PM-Kisan/refund that said "paid" but never arrived; (c) a name mismatch across PAN/Aadhaar/bank blocking something; (d) a CPGRAMS grievance closed without resolution; (e) a caste/income/domicile/birth certificate stuck at a Tehsil desk; (f) a passport stuck in police verification. Rank the top two by how vividly you can tell the story on stage — including dates, screenshots, and what you had to do to unstick it.
2. **Do you still have artefacts?** Screenshots, rejection SMS text, ATR emails, passbook PDFs. Even redacted, real artefacts (with fake numbers) make the mock data credible and make the "I faced this" claim unfakeable. If you have a real rejection SMS, the taxonomy work on Day 1 gets much easier.
3. **Which language should the second locale be?** The demo needs one non-Hindi Indian language spoken by you or someone you can get to record 30 seconds of voiceover. Malayalam/Tamil/Marathi/Bengali — your call, but it must be one you can sanity-check the model's output in.
4. **What's your realistic build capacity over 8 days?** Full-time or evenings? If it's evenings, we should cut the officer-side systemic dashboard to a static analytics view and cut the vision/screenshot ingestion, keeping the closure gate (which is the memorable bit) intact.
5. **Frontend stack preference?** Next.js PWA vs plain React vs something you already have a template for. Day 1 shouldn't be spent on scaffolding — Codex should generate it against a stack you already know how to debug at 2am on Day 7.
6. **Do you want to attempt the API Setu / DigiLocker sandbox for real**, or fully mock it? Real sandbox integration is a credibility multiplier ("the consent flow is against the actual sandbox contract") but costs a day and can block on registration. Recommendation: mock it, but implement against the sandbox's documented request/response shapes so the swap is one config change — and say that on stage.
7. **Any conflict-of-interest or affiliation** with a department, vendor, or scheme that you'd need to disclose? Worth checking before you build a dashboard that ranks departments by failure rate.
