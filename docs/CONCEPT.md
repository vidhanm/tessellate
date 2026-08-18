# Saral — an income-tax return for people who have never filed one

> Working title. Codename `saral`. Hackathon: Build What Moves India (deadline 27 Aug 2026).

## The one-line problem
India's e-filing portal assumes you already know tax law. First-time filers don't — so they guess, get a notice, or pay someone.

## The personal story (hook)
> "Last month I filed my first ITR. I had ₹1,040 of dividend from three stocks and I genuinely could not find where to declare it. Every screen was a schedule name — 'Schedule OS', 'Schedule 112A' — none of them told me what they meant or whether they applied to me. My friends who are CAs said they never use the portal; they use third-party software and file a return in five minutes."

That last sentence is the thesis: **the government's own product loses to third parties on the government's own workflow.** Every third-party tool converged on the same pattern — interview-style questions, document-first import, live computation, pre-submit checks — and the portal has none of it.

## Who is affected
- ~8 crore returns/year; a large and growing share are first-time or DIY filers under 30 (salaried, interns with TDS, small equity/MF holders, freelancers).
- People with low digital literacy filing for refunds (pensioners with FD TDS).
- Everyone who then gets a 139(9)/143(1) notice and can't understand it.

## What is difficult today (from research, `research/itr/`)
1. Must pick ITR-1/2/3/4 yourself; wrong pick → defective notice weeks later.
2. Old vs new regime is a toggle with no comparison; miss the deadline → choice forfeited.
3. Pre-filled data (AIS / TIS / 26AS / Form 16) disagree; the portal doesn't reconcile or explain.
4. Income types are hidden behind schedule names (dividend → "Other Sources"; MF sale → "112A").
5. Validation is format-only, so mismatches surface as notices after filing.
6. Post-filing: "under processing" with no reason; notices are cryptic codes with 15-day windows.

## What we change (the product)
An interview-first, teach-as-you-go filing journey that:
1. **Imports first, asks second.** Form 16 / AIS / broker statement (mock uploads) are read by the model; the interview only asks what the documents can't answer.
2. **Picks the form and the regime for you — with reasons.** "You're ITR-1 because: salary + dividend + savings interest, no capital gains. New regime saves you ₹X."
3. **Asks in plain language, teaches inline.** "Did you receive dividends?" → "Your AIS already shows ₹1,040 from 3 companies. This goes under 'Income from Other Sources'. Why the department knows: companies report dividends via SFT-015." Every question has *Why are we asking?* and a glossary term.
4. **Runs CPC's checks before you submit ("Will this return bounce?").** A pre-flight that models the mismatch rules the back-office runs (AIS vs declared, TDS vs 26AS, double standard deduction across employers, bank not pre-validated, wrong form for capital gains…) and fixes them with you.
5. **Emits a schema-valid ITR JSON** (the department publishes ITR JSON schemas + prefill schema v6.5 + ERI API specs) — proof this is a real filing pipeline, not a mock-up.
6. **Stays with you after filing.** Timeline with *explained* states (why a refund is held), and a notice reader: upload a 139(9)/143(1), get a plain-language diff of "what CPC computed vs what you entered" and the exact remedy (rectification vs revised vs respond).
7. **Has a back-office view.** A mock CPC officer console showing the same checks, the case state machine, and audit log — the "end-to-end" half.

## Why this is deeper than UI
- The core defect is *process*: the portal validates format, then a separate back-office engine validates substance weeks later, and the gap becomes a notice. We move substance-validation to *before* submission and make its rules legible.
- Education is a process fix: the return is only as correct as the filer's understanding; every question carries its rule and consequence.
- Output is the department's own JSON schema and would plug into ERI/prefill APIs — the integration path is concrete.

## Where the OpenAI model sits (and why it is load-bearing)
| Stage | Model task | Why an LLM |
|---|---|---|
| Import | Extract structured fields from Form 16 PDF, AIS export, broker CSV of varying layouts | Heterogeneous formats; strict JSON schema output |
| Decide | Form + regime recommendation with citations to rules | Reasoning over rule set + user facts, explanation generation |
| Interview | Turn schedules into plain questions; answer "why?" in the user's language | Language, adaptivity, multilingual (hi/en, extendable via Bhashini) |
| Pre-flight | Explain each failed check and propose the fix | Explanation + remedy drafting |
| Notice | Read notice, diff vs filed return, draft response | Document understanding + reasoning |
| Officer | Cluster failed checks across cases → systemic issue summary | Aggregation/summarisation |
Deterministic parts (tax computation, form-selection rules, check evaluation) are **code**, not the model — the model explains and extracts; it does not compute tax.

## What is real vs mocked (honesty table — keep updated)
| Component | Status |
|---|---|
| Tax computation, both regimes, FY25-26 slabs | Real (code, unit-tested) |
| Form-selection rules | Real (code) |
| Pre-flight check engine | Real rules on mock data |
| Form 16 / AIS / broker parsing | Real model extraction on synthetic documents |
| ITR JSON output | Real schema-shaped output; validated against published schema where feasible |
| Login / PAN / Aadhaar / OTP / e-verify | Mocked |
| AIS/26AS fetch, ERI submit, CPC processing, refunds | Mocked state machine |
| Notices | Synthetic, marked as such |

## Safety / scale
- No live government system touched; synthetic PAN/Aadhaar only.
- Model outputs are constrained by JSON schemas and never compute tax; every recommendation shows its rule.
- To go live: ERI registration + prefill/AIS APIs + submit API — all documented by the department.

## Demo script (3 min)
0:00 hook (dividend story, "my CA friends don't use the portal") → 0:30 upload Form 16 + broker CSV, model extracts → 0:50 form + regime chosen with reasons → 1:10 interview: dividend question, "why are we asking", Hindi toggle → 1:40 pre-flight catches AIS dividend + bank not pre-validated, fixes → 2:10 submit → ITR JSON → tracker → 2:30 notice reader on persona 5 → 2:45 officer console + honesty slide.
