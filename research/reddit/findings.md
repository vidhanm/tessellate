# Painful, Unsolved Problems on Indian Government Digital Portals — Reddit Research

Source: Reddit only (via Google `site:reddit.com` search + direct thread reads on reddit.com, primarily r/epfoindia, r/IndiaTax, r/india, r/AskIndia, r/indianrailways, r/mumbai, r/Kerala, r/bangalore, r/TamilNadu, r/indianrealestate, r/pune, r/CBSE, r/JEENEETards, r/LegalAdviceIndia).

Ratings are 1 (low) – 5 (high). "Deeper" = needs process/backend/policy rethink, not just a UI fix.

## Ranked Top 10 (by combined pain + breadth + buildability + deeper-than-UI)

| Rank | Problem | Portal | Pain | Breadth | Buildability (9-day proto) | Deeper-than-UI | Score |
|---|---|---|---|---|---|---|---|
| 1 | PF/pension claims (Form-19/31) rejected for "Insufficient Service/Balance" due to backend data that contradicts the visible passbook | EPFO | 5 | 5 | 3 | 5 | 18 |
| 2 | CPGRAMS grievances closed with generic template replies, no real resolution, appeal option hidden | CPGRAMS (cross-department) | 5 | 5 | 4 | 4 | 18 |
| 3 | Passport stuck at "sent to police for verification" for months with zero visibility into where/why | Passport Seva | 5 | 4 | 4 | 4 | 17 |
| 4 | Ayushman Bharat (PM-JAY) cards refused by hospitals citing unpaid govt dues, no way to know in advance which hospitals will honor it | Ayushman Bharat / PM-JAY | 5 | 4 | 3 | 5 | 17 |
| 5 | ITR refund fails citing "invalid IFSC"/bank mismatch even on pre-validated, previously-used accounts; portal loop with no diagnostic | Income Tax e-filing | 4 | 5 | 3 | 4 | 16 |
| 6 | Tatkal booking: payment debited, ticket not booked, due to gateway timeout under peak load | IRCTC | 5 | 5 | 3 | 3 | 16 |
| 7 | PAN–Aadhaar name-format mismatch (initials vs expanded, name order) silently blocks linking, banking, GST registration | PAN/Aadhaar/Income Tax | 4 | 5 | 4 | 3 | 16 |
| 8 | Income Tax Dept sends mass "held by Risk Management" SMS after 6 months of silence, giving only ~8 days to revise return | Income Tax e-filing | 5 | 4 | 2 | 5 | 16 |
| 9 | NTA/NEET/JEE registration portal crashes on the last day, before the deadline, with no extension | NTA (NEET/JEE) | 5 | 5 | 2 | 3 | 15 |
| 10 | Land mutation (Bhulekh/Katha) does not equal legal title; presumptive-title system leaves buyers exposed to later claims, officials demand bribes to update records despite High Court orders | Land Records / Property Registration | 5 | 3 | 2 | 5 | 15 |

---

## Detailed Findings

### 1. EPFO PF/pension claim rejected — "Insufficient Service" / "Insufficient Balance" despite correct passbook and completed transfer
- **Portal**: EPFO (Form-19/Form-31 claims, member portal + UMANG)
- **Who / how often**: Salaried employees withdrawing or transferring PF after a job change or trust-to-EPFO transfer; recurring — r/epfoindia has near-daily posts of this exact shape.
- **What breaks**: Backend eligibility/service-length flags are not updated even though the passbook and Annexure-K show the transfer as complete. EPFO's own grievance system (EPFiGMS) gives contradictory reasons across successive rejections (first "Insufficient Service," then "Insufficient Balance," then back to "Insufficient Service") — a **data-mismatch across systems**, not a UI bug.
- **Evidence**:
  - [EPFO Form-31 Nightmare – 3 months, multiple grievances, CPGRAMS & RTI](https://www.reddit.com/r/epfoindia/comments/1q1qr92/epfo_form31_nightmare_3_months_multiple/) (r/epfoindia, 8mo ago, 10+ comments): "EPFO Form-31 keeps getting rejected for Insufficient Service despite 13+ years service and completed PF transfer... EPFiGMS, CPGRAMS failed. Now forced to use RTI just to make EPFO acknowledge their own data." A commenter (PaintingAcrobatic830) replies: "RTI response said.. i have -37K in EE share... which is completely wrong (in passbook its +ve balance)... their backend data is updating only withdrawls since march 2025 and avoiding contributions."
  - "EPF Claim Getting Rejected? These are the 7 actual reasons" — r/epfoindia, 50+ comments, 4 months ago.
  - "PF Transfer Claim rejected" / "PF transfer claim rejected - No EPS Contribution Received" — r/epfoindia, 10-20+ comments each.
  - "CLAIM REJECTED" (Form-31 House Construction rejected as "Not eligible" despite 9.5 yrs service) — r/epfoindia, 6mo ago, 20+ comments.
- **Workarounds today**: Physically visit the PF Commissioner/Assistant Commissioner office (repeatedly cited as the only thing that actually works); file RTI to force EPFO to disclose its own backend numbers; re-file CPGRAMS appeals dozens of times until someone calls. One user in a related thread says reopening a CPGRAMS complaint 18 times finally got a callback. No private product solves this; EPFO data reconciliation is the core defect.
- **Ratings**: Pain 5, Breadth 5, Buildability 3 (a "pre-flight checker" comparing passbook/Annexure-K data against common rejection patterns, plus an escalation-script generator, is buildable in 9 days), Deeper 5 (root cause is EPFO's own multi-system data inconsistency).

### 2. CPGRAMS grievances closed with generic/template replies, no real resolution
- **Portal**: CPGRAMS (central grievance redress, used as escalation path for EPFO, Railways, tax, etc.)
- **Who**: Anyone escalating a stuck government process; extremely recurring, appears as the *second-order* complaint inside almost every other portal's threads (EPFO, Railways, NPS).
- **What breaks**: Process/policy — SLA of 21 days is not enforced; departments close tickets with boilerplate ("resubmit your claim") without addressing the issue; the appeal option is hidden under "Feedback" and doesn't appear on all grievances.
- **Evidence**:
  - [CPGram grievance unattended to in over 3 months, what's the next step?](https://www.reddit.com/r/AskIndia/comments/1sqccr9/cpgram_grievance_unattended_to_in_over_3_months/) (r/AskIndia, 4mo ago, 14 comments): "I read in a few places... that CPGram complaints are promptly attended to. So I created a few grievances... I haven't got a single response, let alone any action." Reply explains the hidden appeal mechanism: "CPGRAMS has an option to appeal against the closure... It's hidden under the 'Feedback' option."
  - "EPFO grievances closed without resolution, finally escalated complaint to DPG portal" — r/epfoindia, 2mo ago, 20+ comments.
  - "Filed 3 complaints on CPGRAMS against Railways all [ignored]" — r/indianrailways, 5mo ago, 10+ comments: "No explanation, no response to the actual issue raised... It feels like the complaints were [not looked into]."
  - "CPGRAM appeal closed" — r/epfoindia, 6mo ago: "till now no response on new grievence... I am not sure how come they closed CPGRAM appeal but no amount credited till now."
- **Workarounds**: Escalate to PMOPG (pmopg.gov.in/citizenreforms) which routes through the PMO; email named nodal officers directly; repeatedly reopen the same grievance. No private product exists — this is pure government infrastructure.
- **Ratings**: Pain 5, Breadth 5 (cross-cutting — affects every other portal's escalation path), Buildability 4 (a grievance-drafting + escalation-path navigator, tracking SLA deadlines and auto-suggesting PMOPG/RTI next steps, is very buildable), Deeper 4.

### 3. Passport stuck at "sent to police for verification" for months, no visibility
- **Portal**: Passport Seva (PSK/RPO + state police verification)
- **Who**: First-time and reissue applicants; recurring seasonal spike (~monthly new threads across city subreddits).
- **What breaks**: Process — verification sits with local police stations that have no SLA enforcement; the applicant has zero visibility into which police station/officer is holding the file or why; portal status just says "sent for verification" for months.
- **Evidence**:
  - [Passport stuck at SP Office for over 20 days](https://www.reddit.com/r/pune/comments/1fkgmjh/passport_stuck_at_sp_office_for_over_20_days/) (r/pune, 2yr, several comments): applicant had completed police verification but status stayed static; fix required an **in-person visit** — "Go to SP office of PCMC. Tell them your passport is pending review. They will approve it... There was no reason from their side [for the delay]." Another reply: "There is an option to raise a grievance on govt passport portal. The passport status will change within 2 days" (i.e., the grievance itself, not the underlying process, is what moves things).
  - "My passport is stuck in this status for over a month" — r/india, 3yr, 170+ comments.
  - "Passport stuck in police verification for 7.5 months (Kolkata)" — r/india, 5mo, 10+ comments.
  - "Passport Verification Issue what to do now??" — r/LegalAdviceIndia, 7mo, 10+ comments: "It's been three months since I'm going to Police station for passport Verification, in 3 months they exhausted me by asking various docs."
- **Workarounds**: Physically visit the police station (repeatedly the only fix that works); file a grievance on the Passport Seva portal (forces a status change within ~2 days per one report); pay informal "facilitation" — several threads across categories hint at bribery being common at this exact chokepoint.
- **Ratings**: Pain 5, Breadth 4, Buildability 4 (a status tracker + escalation letter/RTI generator + "who to contact at this PS" directory is very buildable in 9 days), Deeper 4 (police verification workflow itself needs an SLA/escalation redesign).

### 4. Ayushman Bharat (PM-JAY) card refused by hospitals citing unpaid government dues
- **Portal**: Ayushman Bharat / PM-JAY empanelled hospitals
- **Who**: Poor/lower-middle-class families, especially urgent cases (pregnancy, cancer, cardiac); recurring, often goes viral.
- **What breaks**: Process/backend — private/semi-private empanelled hospitals stop honoring the scheme because government reimbursements are delayed by 8-9 months; there's no reliable, up-to-date public list of which empanelled hospitals are *actually* still accepting the card in practice.
- **Evidence**:
  - [Sister in advanced pregnancy & hospitals refusing Ayushman Card… any advice?](https://www.reddit.com/r/mumbai/comments/1pfiwah/sister_in_advanced_pregnancy_hospitals_refusing/) (r/mumbai, 9mo, 80+ comments): OP scraped the official NHA/PM-JAY hospital list, called many, and "almost all of them said pregnancy/delivery isn't covered under PM-JAY." A doctor commenter: "I work in a private hospital. Most larger ones don't accept Aayushmaan Bharat schemes." Another: "Bills of lakhs and crores of rupees are pending to be received from the Govt. Hospitals are helpless... How can you expect them to run operations with so much money stuck??"
  - "Mumbai Woman Calls ₹5 Lakh Ayushman Bharat Claim A 'Joke'" — r/india, 1yr, 70+ comments — "Not a Single Hospital Took Us In."
  - "Private hospital in Delhi refused Ayushman Bharat card" (viral video) — r/InsuranceAdviceIndia, 8mo, 30+ comments.
  - "'Hospital denying discharge, asking private money citing [delay]'" — r/Dehradun, 7mo, 20+ comments: "'If we discharge early and Ayushman doesn't pay, then you will have to pay privately (around ₹50,000).'"
- **Workarounds**: Fall back to government hospitals only (repeatedly recommended, but with worse facilities); crowd-source which private hospitals *currently* honor the scheme informally on Reddit itself. No reliable product exists — the official empanelled-hospital list is stale/misleading.
- **Ratings**: Pain 5, Breadth 4, Buildability 3 (a crowd-verified "does this hospital actually accept Ayushman right now" directory is buildable, though data freshness is hard in 9 days), Deeper 5 (root cause is government reimbursement delay to hospitals — a payments/policy problem).

### 5. ITR refund fails citing "invalid IFSC"/bank mismatch on already-validated accounts
- **Portal**: Income Tax e-filing (refund reissue flow)
- **Who**: Any taxpayer expecting a refund; recurring every filing season, sometimes affecting tens of thousands at once (mass SMS blasts).
- **What breaks**: Backend/data-mismatch — refund fails even when the IFSC is correct and the account is pre-validated and has received refunds in prior years; the "Refund Re-Issue" flow itself sometimes claims "no refund failures to raise reissue requests," a contradictory UI state.
- **Evidence**:
  - [Got an email saying my ITR refund has failed citing invalid IFSC code...](https://www.reddit.com/r/IndiaTax/comments/1dxcq5h/got_an_email_saying_my_itr_refund_has_failed/) (r/IndiaTax, 2yr ago, 390+ comments — one of the largest threads found): dozens of independent confirmations of the identical error. "Facing same issue although I received the refund in same account. Irony is I am income tax official." Another: "These are the most incompetent guys I have ever seen man. It's annoying AF." A commenter got a **different** error on the same flow: "instead of invalid IFSC code it was saying my PAN card is not linked to my bank account... when I go to 'Refund Re-Issue Request' the portal claims there are no refunds to reissue!"
  - "IT Portal Glitch Cost Me ₹13k - Now My Refund Is ₹16k [more than owed]" — r/IndiaTax, 1yr, 8 comments.
  - "Filed return hasn't moved to processing yet, and I received..." — r/IndiaTax, 7mo, 50+ comments.
- **Workarounds**: Re-validate the bank account and re-raise the reissue request repeatedly (works for some after 24-48 hrs, fails for others for weeks); call IT customer care (who confirm it's a known systemic bug); switch to a different bank account. No private product exists to pre-diagnose or track this.
- **Ratings**: Pain 4, Breadth 5, Buildability 3, Deeper 4 (root cause is backend validation logic disagreeing with the bank-account-validation subsystem).

### 6. Tatkal booking: payment debited, ticket not booked
- **Portal**: IRCTC (Tatkal window, peak-load booking)
- **Who**: Anyone booking Tatkal (10am/11am opening window); extremely recurring — essentially every Tatkal window produces new threads.
- **What breaks**: Backend/infrastructure — payment gateway timeouts under peak load; UI shows a stuck/frozen payment-processing screen while the debit has already gone through, and the booking silently fails.
- **Evidence**:
  - "IRCTC Tatkal Booking is a NIGHTMARE! Money deducted..." — r/indianrailways, 1yr, 20+ comments: "Idiots deducted money and the payment gateway timed out which resulted in me not getting a ticket."
  - [Money got deducted but train ticket not booked...what to do](https://www.reddit.com/r/indianrailways/comments/1825ku7/money_got_deducted_but_train_ticket_not/) (r/indianrailways, 3yr): "I was booking ticket and when I entered my UPI ID and went in background to pay and after paying when I entered in irctc app it was again showing enter UPI ID."
  - "Payment deducted (Rs. 187) but no ticket booked. App froze..." — r/indianrailways, 7mo, 9 comments.
  - "Payment issues while tatkal booking" — r/indianrailways, 7mo, 10+ comments: "the irctc app restarted and my ticket wasnt book. had to wait for 5mins after which it showed ticket was not booked, and amount is 'settled'."
- **Workarounds**: Wait 2-7 business days for automatic refund (IRCTC does self-refund, which is the one part that mostly works); use IRCTC eWallet to reduce gateway hops; retry immediately with a different payment method, sacrificing the Tatkal window. No third-party product fixes the core gateway/server capacity problem.
- **Ratings**: Pain 5, Breadth 5, Buildability 3 (can't fix IRCTC's backend, but a "payment status reconciliation + auto-refund tracker" companion app is buildable), Deeper 3 (mostly infra capacity, not a deep process rethink).

### 7. PAN–Aadhaar name-format mismatch silently blocks linking, banking, GST
- **Portal**: PAN / Aadhaar / Income Tax e-filing / bank KYC / GST registration
- **Who**: Anyone whose PAN uses initials (e.g., "Arjun K R") while Aadhaar has the expanded name (e.g., "Arjun K Raghavan"), or first/last name order swapped; extremely widespread, recurring for years.
- **What breaks**: Data-mismatch across departments — PAN database, Aadhaar/UIDAI, bank KYC, and GST registration each independently validate name strings with no shared canonical identity, so a technically-linked PAN-Aadhaar pair can still be rejected downstream by a bank or GST portal.
- **Evidence**:
  - [First name Last name issue in PAN card...](https://www.reddit.com/r/india/comments/1na5sej/) — r/india, 11mo, 70+ comments.
  - "Do we need to have exact name in both Aadhar and Pan card[?]" — r/IndiaTax, 11mo, 10+ comments: "They didn't open my account because they wanted my name on Aadhar Card and Pan card [to match]... If your PAN is linked to Aadhaar, then bank can't say it's not same" (i.e., banks impose their own stricter check beyond what UIDAI/IT dept require).
  - "Name mismatch across PAN, Aadhaar – How to change..." — r/LegalAdviceIndia, 6mo, 20+ comments.
  - "Name Mismatch in PAN Database vs. PAN Card. Will It [block GST registration]?" — r/IndiaTax, 10mo, 4 comments.
  - "Getting name mismatch error though the name in profile [matches]" — r/epfoindia, 1mo, 20+ comments (same root problem hits EPFO too).
- **Workarounds**: File the new "CR01" offline correction form to force PAN to match Aadhaar exactly; visit bank branches in person; some choose to change Aadhaar back to initials instead. No unified product exists to normalize/pre-validate identity across all four systems (PAN, Aadhaar, bank KYC, GST) before submission.
- **Ratings**: Pain 4, Breadth 5, Buildability 4 (a diagnostic tool that ingests name strings across documents and flags exact mismatch type + correct-form-to-file is very buildable), Deeper 3.

### 8. Income Tax Dept mass "held by Risk Management" notice after months of silence, ~8-day deadline
- **Portal**: Income Tax e-filing
- **Who**: Broad swath of filers who claimed deductions flagged by risk analytics; happened as a mass event in late 2025 (thread is 8mo old, i.e. ~Dec 2025).
- **What breaks**: Process/policy — returns filed mid-year (e.g., June) were silently held for 6 months, then a mass SMS/email arrived giving until Dec 31 (~8 days in some cases) to file a revision or face additional liabilities; many recipients had already filed clean/revised returns or had zero discrepancy, causing confusion and panic.
- **Evidence**:
  - [ITR held by Risk Management](https://www.reddit.com/r/IndiaTax/comments/1pt6tll/itr_held_by_risk_management/) (r/IndiaTax, 8mo, 310+ comments): "I guess so.. I have filled on Jun'2025 but the GOVERNMENT having time now only to intimate me after almost 6 months..!! Irony is they want me revise the return filled within a week as they took more than 6 months to do the review!! SHAME!!!" Another: "lot of ppl with 0 refund, refund already processed & some who paid additional tax also got it.." Another: "my friend who has already got his refund and ITR processed back in july also got this sms and mail. How can they intimate that your process is on hold when everything is already processed?"
  - Related: "Hard-earned lesson: Missed the ITR deadline by 2.5 hours..." — r/IndiaTax, 2 weeks, 190+ comments (₹5,000 penalty for an ₹850 balance due to a portal-timing dispute).
- **Workarounds**: File a revised return regardless, out of caution; wait for the official email (many got only SMS, no email, and were unsure it was legitimate — several suspected phishing). No product exists to help interpret/triage these notices.
- **Ratings**: Pain 5, Breadth 4, Buildability 2 (can't replicate the underlying risk-analytics decision, but a "what does this SMS actually mean, am I affected, what's my deadline" explainer/triage tool is feasible), Deeper 5 (root cause is a batch policy/comms process failure, not a UI bug).

### 9. NTA (NEET/JEE) registration portal crashes on the last day before the deadline
- **Portal**: National Testing Agency (NEET/JEE Main registration)
- **Who**: Lakhs of students per exam cycle; recurring every single registration window.
- **What breaks**: Infrastructure — server capacity/backend cannot handle last-day traffic; portal goes down ~2 hours before the official close with no extension granted, causing students to lose the ability to appear for the exam entirely that year.
- **Evidence**:
  - [Today NEET Portal Crashed. Yesterday It Was JEE. When Systems Fail, Students Shouldn't Lose a Year.](https://www.reddit.com/r/CBSE/comments/1rmg3bp/) (r/CBSE, 6mo, petition-style post): "Recently, on the last day of JEE Mains registration, the NTA portal reportedly stopped working almost 2 hours before the official closing time. Students were continuously trying to fill their forms, refreshing pages, switching devices, trying different browsers — but the portal simply didn't work... it meant losing the chance to even appear for the exam this year."
  - "NTA Portal Crashed Again – NEET Aspirants, We've Been There! Join Us to Demand Reopen/Extension for JEE Main 2026 Session 2 Registration!" — r/JEENEETards, recent, organized petition thread.
  - "NTA website crash" — r/JEENEETards, multiple threads.
- **Workarounds**: Petition/social-media pressure campaigns demanding extensions (sometimes successful, sometimes not); switching devices/browsers/networks during the window (rarely works, load is server-side). No private product can fix NTA's infrastructure; this is purely an NTA capacity-planning failure.
- **Ratings**: Pain 5, Breadth 5, Buildability 2 (can't touch NTA's servers; at best build a deadline/extension-tracking + evidence-collection tool for students to document failures for appeals), Deeper 3 (mostly capacity planning, though also policy — no automatic extension SLA when the portal fails).

### 10. Land mutation (Bhulekh/Katha) ≠ legal title; presumptive-title system + official bribery to update records
- **Portal**: State land records portals (Bhulekh, Katha, Dharani, etc.) + Sub-Registrar/Tahsildar offices
- **Who**: Property buyers, especially first-time; affects a smaller but high-stakes population (real estate transactions).
- **What breaks**: Process/policy — India's presumptive-title system means even a registered sale deed and updated Bhulekh mutation don't guarantee ownership; can be challenged later by competing claims (inheritance, fraud). On top of the legal gap, local officials (Tahsildars) demand bribes to actually update records even when compelled by High Court orders.
- **Evidence**:
  - [India's land/property ownership system feels dangerously broken](https://www.reddit.com/r/indianrealestate/comments/1r3kc74/) (r/indianrealestate, 6mo, 30+ comments): "Even mutation in Bhulekh (government land records) does not make someone the legal owner. Just look up the difference between absolute title and presumptive title." A commenter (Mo_h) describes a personal case: "Property purchased. Sale deed registered. EC current in our name, but local Tahisildar and minions refuse to update katha (official land records) without substantial bribe. All this in spite of several HC orders directing them to do so, and a Contempt of Court petition pending before HC."
  - "Bought land with registered sale deed, but mutation office [refuses]" — r/LegalAdviceIndia, 8mo, 1 comment.
  - "Grandson Selling Grandfather' Land" — r/indianrealestate, 1yr, 20+ comments: "There's something called bhulekh but that just sucks!"
- **Workarounds**: Physical possession treated as the real proof of ownership ("possession is nine-tenths of the law"); title insurance is virtually nonexistent in India (unlike the US); proposals exist for a blockchain-based national property register (cited: Raghav Chadha's proposal) but nothing is live. No private product solves the underlying legal-title gap; some startups do EC/title-search verification as a point solution.
- **Ratings**: Pain 5, Breadth 3 (narrower than filing-type portals but very high-stakes), Buildability 2 (can't fix land law in 9 days; could build an EC/mutation-history aggregator/red-flag checker as a narrow slice), Deeper 5 (fundamentally a legal/title-system redesign, not a portal fix).

### 11. EPFO — UMANG app / passbook access broken (OTP sync failures, "service not available")
- **Portal**: UMANG app (EPFO services) + EPFO member passbook portal
- **Who**: Any EPFO subscriber checking balance or UAN status; very recurring on r/epfoindia (near-weekly new threads).
- **What breaks**: Backend/infra — sync errors between EPFO and UIDAI servers cause OTP failures; scheduled "migration activities" take services offline for weeks; passbook login throws "Invalid UAN/Password" even after password resets.
- **Evidence**:
  - "UMANG App Still Not Working – EPFO Services..." — r/epfoindia, 1mo, 70+ comments: "The UMANG app is currently not working for EPFO services because the department is carrying out scheduled migration activities."
  - "⚠️ What's wrong with UMANG app? Can't view EPFO..." — r/epfoindia, 1yr, 10+ comments: "it's been more than 1 and a half months that I (and some of my friends) have been unable to [access]."
  - "UMANG app not sending OTP" — r/epfoindia, 11mo, 8 comments: "The OTP issue on UMANG usually happens due to sync errors between EPFO and UIDAI servers."
  - "I'm unable to login to passbook website or Umang app" — r/epfoindia, 10mo: "Passbook portal threw 'Invalid UAN/Password' error, and Umang app gave 'Invalid UAN' error."
- **Workarounds**: Try logging in at night (lower load); clear app cache/reinstall; wait out "scheduled migrations" (can last 1.5+ months). No private alternative exists since EPFO data isn't exposed via any other API.
- **Ratings**: Pain 3, Breadth 4, Buildability 2, Deeper 4.

### 12. GST ITC mismatch notices for supplier-side non-compliance the taxpayer can't control
- **Portal**: GST portal (GSTR-1/2A/2B/3B reconciliation)
- **Who**: Small business owners, GST-registered freelancers/traders; recurring, especially around notice season.
- **What breaks**: Process/data-mismatch — Input Tax Credit claimed in GSTR-3B is compared against what suppliers reported in GSTR-2A/2B; if a supplier files late or incorrectly, the buyer's legitimately-claimed ITC gets flagged, and the buyer bears the compliance burden for someone else's filing failure.
- **Evidence**:
  - "ITC mitmatch due to portal error." — r/IndiaTax, 7mo, 4 comments: "The supplier of that invoice may not have filed their GSTR 1 within due date. You can't claim it for October..."
  - "😣 Help needed! Fiscal year: 2020-21 - GST Recovery order..." — r/IndiaTax, 1yr, 7 comments: "FORM GSTR-3B v FORM GSTR-2A/2B mismatches are common issues."
  - "A Small Business Owner Got a GST Notice and Panicked" — r/IndiaFinance, 3mo: "Most notices are triggered by routine data-level issues such as: ITC mismatch — Input Tax Credit claimed in GSTR-3B not matching what is [reported by supplier]."
- **Workarounds**: Manually reconcile GSTR-2B against 3B every month (many small businesses can't afford a CA to do this continuously); chase suppliers to file on time; several SaaS/CA-tool products already exist here (e.g., "LitigationShift" mentioned in one thread) — this space is partially solved commercially, unlike most others in this list.
- **Ratings**: Pain 4, Breadth 3, Buildability 4 (an automated GSTR-2B vs 3B diff + alert tool is very buildable and has existing analogues to learn from), Deeper 3.

### 13. NPS withdrawal/exit request stuck at District Treasury Office (maker-checker step)
- **Portal**: NPS (National Pension System) exit/withdrawal portal
- **Who**: Retired government employees (superannuation exits); narrower population but very high pain.
- **What breaks**: Process — after submitting an exit request online, it requires manual "maker-checker" authorization at the District Treasury Office; no SLA, no escalation visibility, and repeated CPGRAMS complaints get the identical copy-paste reply.
- **Evidence**:
  - [My Father's NPS Exit Request Is Stuck](https://www.reddit.com/r/IndiaTax/comments/1ksxdup/) (r/IndiaTax, 1yr, 40+ comments): "'Your Superannuation withdrawal request is pending with your District Treasury Office for authorization...' We've also tried emailing the DTO, but no one responds." A commenter describes the only thing that worked for a similar EPFO case: "REOPEN the original CPGRAMS complaint and let them respond again... I did that 18 times and 19th time one lady called me... My service history got updated in next 7 days... I struggled for 2 years."
- **Workarounds**: Repeated CPGRAMS reopening (extreme persistence required); RTI requests; contacting the retiree's former office finance department directly rather than relying on the online portal alone.
- **Ratings**: Pain 4, Breadth 2, Buildability 3, Deeper 4.

### 14. DigiLocker document fetch fails silently on minor name/spelling mismatches
- **Portal**: DigiLocker (used to fetch marksheets, Aadhaar, RC, etc. for other portals like EPFO, passport, admissions)
- **Who**: Students and anyone using DigiLocker to auto-fill documents into another portal (passport, EPFO KYC, college admission); recurring across many contexts.
- **What breaks**: Data-mismatch — DigiLocker's "fetch" API silently fails when the source-issuer database's name spelling differs even slightly from the account holder's DigiLocker profile name, with no clear error message telling the user *why* it failed.
- **Evidence**:
  - "Cannot upload my digilocker file for my passport" — r/india, 3yr, 30+ comments.
  - "My documents are not getting fetched from digilocker" — r/thane, 1yr, 7 comments: "The reason could be minor name changes or spelling changes. digilocker will not fetch it... Get your certificate name [corrected]."
  - "I'm trying to do name correction and chose get doc from [DigiLocker for EPFO]" — r/epfoindia, 5mo, 6 comments: "Sometimes the DigiLocker fetch option on the EPFO portal gets stuck due to a portal issue. Even if you try different browsers, it can still hang."
  - "NSR DigiLocker KYC stuck with 'Internal Server Error'" — r/TCS_India, 6mo, 30+ comments.
- **Workarounds**: Correct the name at the source issuer first (slow, requires separate bureaucratic process); try different browsers; contact DigiLocker support via email.
- **Ratings**: Pain 3, Breadth 4, Buildability 3, Deeper 3.

### 15. e-District caste/income/domicile certificates: fast & free in Kerala, bribery-ridden elsewhere
- **Portal**: State e-District portals (varies: UP, Bihar, Delhi e-District vs Kerala's Akshaya/e-District)
- **Who**: Students applying for reserved-category admissions/exams (JEE/NEET counselling, government jobs); recurring, seasonal around counselling windows.
- **What breaks**: Process/policy, not the portal tech itself — Kerala's e-District + Akshaya kiosk model resolves OBC-NCL/domicile certificates in 3-7 days with no bribery, while the same certificate elsewhere (UP, Bihar, Delhi) can cost ₹5,000–₹30,000 in informal payments and take weeks, because village officers/Tahsildars gatekeep issuance manually even where a portal exists.
- **Evidence**:
  - [Other states struggling for even a OBC-NCL certificate… keralites vibing at Akshaya centres](https://www.reddit.com/r/Kerala/comments/1p4d9m6/) (r/Kerala, 9mo, 160+ comments): "30k for obc 😭😭😭 wallahi"; "I am a mallu raised in delhi. I had to pay almost 5k to get my category documents for which I was valid."; a Kerala-based comparison: "my fellow colleague from Lucknow had to bribe several officers there to get the same [certificate I got in 4 days via Akshaya]."
  - "guys please help asap (discrepancy raised in obc ncl certificate in josaa what to do)" — r/JEENEETards, live counselling-crisis thread.
- **Workarounds**: Use informal "agents"/facilitators who know which officials to pay; travel back to home district in person rather than relying on the portal; state-to-state variance means no universal workaround — this is fundamentally a governance-quality gap, replicable only by copying Kerala's model.
- **Ratings**: Pain 4, Breadth 4, Buildability 2 (can't fix corruption/governance quality with a prototype; could build a document-checklist + status-tracker + escalation tool, narrow slice), Deeper 5.

### 16. NSP (National Scholarship Portal) money delayed by a year or more, partial disbursement
- **Portal**: National Scholarship Portal (NSP) / state scholarship portals
- **Who**: SC/ST/OBC/EWS/PwD students on post-matric or PG scholarships; extremely recurring every academic year.
- **What breaks**: Process/backend — PFMS (Public Financial Management System) payment pipeline stalls between "application sent to PFMS for payment" and actual disbursement, sometimes for a full year; students graduate before receiving money; partial/half disbursements happen with no explanation.
- **Evidence**:
  - [Has anyone got PG scholarship NSP money? Its been a year since I got selected, I will graduate within 2 months.](https://www.reddit.com/r/Kerala/comments/1rg5fer/) (r/Kerala, 6mo, 140+ comments): "I applied in 2024 november... got update that i got selected for scholarship in 2025 october, and I renewed my scholarship in Jan 2026, I will graduate within two months. Why is it getting delayed." Follow-up thread months later: "did anyone recieved the pg scholarship from the nsp portal but in half?"
  - "Has anyone received money from nsp scholarship" — r/Btechtards, 6mo, 90+ comments.
  - "Misleading NSP Pragati scholarship status- Aadhar not [seeded]" — r/Btechtards, 5mo, 40+ comments.
  - "POST MATRIC SCHOLARSHIP DELHI SC/ST/OBC (NSP...)" — r/DTU__Delhi, 3wk, 10+ comments: "no amount has rececived till now. Last year... 40% of the amount got refunded in..."
- **Workarounds**: Check Aadhaar-bank seeding status obsessively (a common silent failure cause); wait, often for a full academic year; no reliable escalation path is reported working (unlike CPGRAMS for other portals — NSP escalation is barely mentioned).
- **Ratings**: Pain 4, Breadth 4, Buildability 3 (a payment-pipeline status explainer + common-failure-cause checklist is buildable), Deeper 4.

### 17. Voter registration: Aadhaar e-sign mandated online, but offline Form 6 illegally refused too
- **Portal**: National Voters' Service Portal / voter.eci.gov.in (ECI)
- **Who**: New voters without Aadhaar, or those who prefer offline registration; narrower but a clear rights/access issue.
- **What breaks**: Process/policy conflict — ECI mandates Aadhaar e-sign for online Form 6 since Sept 2025, but per ECI's own regulation, offline hard-copy submission should still be accepted without Aadhaar; ward offices in at least one major city are reported refusing offline submissions entirely, in violation of the regulation, with no public accountability.
- **Evidence**:
  - [Cannot apply for voter ID without Aadhaar in Bangalore?](https://www.reddit.com/r/bangalore/comments/1qbryl5/) (r/bangalore, 7mo, 46+ comments): "all ward offices in Bangalore have stopped accepting hard copies of Form 6 even for offline submission in violation of ECI regulations. How can Bangalore be exempt from ECI regulations which are followed in the rest of India?"
- **Workarounds**: None reliable reported besides persistent in-person visits and public pressure; no private tool exists.
- **Ratings**: Pain 3, Breadth 3, Buildability 3, Deeper 3.

### 18. Ration card e-KYC: short mandatory deadlines threaten deletion of members
- **Portal**: State PDS/ration card e-KYC portals (mandated biometric re-verification)
- **Who**: Ration card holders, especially those living outside their registered state/country (students, migrant workers); recurring across states (TN, Odisha, others) on short notice cycles.
- **What breaks**: Process/policy — states mandate biometric re-verification of every member on a card within an impractically short window (as little as one week), threatening to erase names from the card for non-compliance, without accounting for members who live elsewhere.
- **Evidence**:
  - [Ration card biometrics verification](https://www.reddit.com/r/TamilNadu/comments/1v56q1n/) (r/TamilNadu, 25 days ago, 20+ comments): "The state has mandated the biometric verification of all the members of a ration card holder within July 31. They've given just one weeks time to do it and have said that failure to do so will result in erasure of name from the card. How is this practical? What will people living in other states / countries with a TN ration card do?... So frustrating!"
  - "Ration card e-kyc being in other states?" — r/Odisha, 1yr, 10+ comments.
- **Workarounds**: The TN thread notes biometrics can now be done at any center within the state (helps in-state movers, not those abroad/out-of-state); otherwise no fix reported for absentee members.
- **Ratings**: Pain 4, Breadth 3, Buildability 2, Deeper 4.

### 19. Electricity/utility bill payment debited but not reflected on the portal
- **Portal**: State electricity board portals + UPI/payment-gateway integrations (BSES, JVVNL, TGSPDCL, Mahavitaran, TNEB, etc.)
- **Who**: Nearly every bill-paying household; very recurring across virtually every state/city subreddit.
- **What breaks**: Backend/reconciliation — payment gateway debits the customer but reconciliation with the utility's own billing system lags days to weeks, leaving the bill showing as unpaid/due, sometimes triggering disconnection notices despite payment.
- **Evidence**:
  - "I paid the the bill through the website and it didn't get updated" — r/lucknow, 1yr, 30+ comments.
  - "Paid mahavitaran electricity bill from gpay but in their [system, still shows pending]" — r/pune, 10mo, 13 comments: "Same same, I paid it on 1st Oct and still showing pending in BHIM app🥲🥹"
  - "BSES bill payment through paytm not reflected in account" — r/delhi, 2yr, 3 comments.
  - "Payment Issue with TGSPDCL - Refund not issued" — r/hyderabad, 2yr, 3 comments.
  - "Money Debited but UPI Transaction Failed via BHIM..." — r/CreditCardsIndia, 1yr, 80+ comments (cross-portal: same UPI reconciliation gap hits multiple government payment flows, not just electricity).
- **Workarounds**: Wait 3-7 days for reconciliation (works most of the time); raise a dispute via the payment app if not resolved; visit the local utility office with the payment reference ID. Point solutions exist informally (raising disputes via Paytm/GPay support) but nothing addresses the root cause.
- **Ratings**: Pain 3, Breadth 5, Buildability 4 (a payment-reference reconciliation tracker/reminder tool is very buildable), Deeper 2 (mostly a settlement-timing/UX issue, not a deep process rethink).

---

## Notes on methodology
- All evidence pulled directly from reddit.com (via Google `site:reddit.com` search to locate threads, then reading the actual thread + comments on reddit.com — old.reddit.com and reddit.com's API/JSON endpoints were blocked in this environment, so a logged-out browser session was used to read threads directly).
- Comment/upvote counts are approximate, as read from Google's cached snippet counts or the live thread at time of access (dates given as "X months/years ago" per Reddit's own relative timestamps).
- Problems were prioritized for recurrence (same complaint shape appearing across many independent threads) over one-off complaints.
