# Saral (सरल) — file your first Indian tax return

An interview-led ITR filing experience for people who have never filed. Built for
a hackathon; the backend is mocked and the honesty page says exactly where.

**The bet:** first-time filers do not fail at arithmetic. They fail because nobody
tells them *which form*, *which regime*, and *what the department already knows
about them*. So the app is an interview, not a form — every question is asked in
plain language, carries a "Why are we asking?" expander, and shows what has
already been reported about the user before they answer.

## Run it

```bash
npm install
cp .env.example .env.local   # MOCK_LLM=1 by default — no API key needed
npm run dev                  # http://localhost:3000
```

```bash
npm run build   # production build
npm test        # node --test, tax engine + form selector
```

Node 20+ required (uses native TypeScript type-stripping in tests). Verified on
Node 24.18.

### LLM configuration

Every model call goes through `lib/llm.ts`. Out of the box `MOCK_LLM=1` returns
canned structured JSON, so the whole app is demonstrable with no key and no
network. To use real models:

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini   # default
# remove MOCK_LLM=1
```

The adapter uses OpenAI structured outputs (`json_schema`, strict) and falls back
to the canned response if the call fails — a tax app should never show a nervous
first-time filer a stack trace.

## The flow

| Route | What it does |
| --- | --- |
| `/` | Landing. The promise, plus an en/hi language toggle (stub). |
| `/start` | Pick a demo persona, or upload a Form 16 (maps to a persona for now). |
| `/interview` | Step-based question cards driven by `lib/interview/steps.ts`. |
| `/review` | Chosen ITR form + reasons, both regimes side by side, income by head, deductions, tax due or refund. |
| `/preflight` | "Will this return bounce?" — the reconciliation checks CPC runs, run early. |
| `/submit` | Mock submission → acknowledgement number → mock Aadhaar OTP e-verify → ITR JSON download. |
| `/track` | Post-filing timeline with Normal / Refund / Notice scenarios, and notice explanation via the LLM adapter. |
| `/officer` | Mock CPC-side queue: cases, automated checks, risk scores, case states. |
| `/about` | What is real vs mocked, and the known simplifications in the maths. |

## What is actually computed

Not placeholders — these run for real, and `npm test` covers them:

- **`lib/tax/compute.ts`** — FY 2025-26 (AY 2026-27), both regimes. Slab ladder,
  standard deduction (₹75,000 new / ₹50,000 old), section 87A rebate including
  marginal relief above ₹12L, 80C/80D/80TTA caps (old regime only), STCG at 20%
  and LTCG at 12.5% above the ₹1.25L exemption, flat surcharge bands, 4% cess.
  Exports `computeTax(input, regime)` and `compareRegimes(input)`.
- **`lib/tax/formSelector.ts`** — ITR-1 / 2 / 3 / 4 from income sources, returning
  the form, human-readable reasons, and *why each other form was ruled out*.
- **`lib/preflight.ts`** — salary vs Form 24Q, interest vs SFT-016, TDS vs 26AS,
  share sales vs the chosen form, deduction caps, self-assessment tax, refund
  account, e-verification window.

Simplifications are listed on `/about` rather than buried here.

## Folder map

```
app/
├── page.tsx                  landing
├── layout.tsx                mobile shell + fixed bottom progress bar
├── globals.css               Tailwind v4 theme tokens
├── start|interview|review|preflight|submit|track|officer|about/
├── api/mock/
│   ├── personas/             GET  demo taxpayers, zod-validated on the way out
│   ├── departmental/         GET  CPC rules, officer queue, notices, timeline
│   ├── efile/                POST mock submission + mock Aadhaar OTP
│   └── explain/              POST the single door to the LLM adapter
└── mock-backend/
    ├── personas.json         4 personas with Form 16, AIS, broker trades
    └── departmental.json     what the department would know
components/
├── ui.tsx                    hand-written primitives (no shadcn CLI, no deps)
├── ProgressBar.tsx           fixed bottom nav / progress
├── LanguageToggle.tsx        en/hi stub
└── EmptySession.tsx          graceful dead-end for downstream routes
lib/
├── schemas.ts                zod: Persona, Form16, AISEntry, BrokerTrade,
│                             TaxComputation, PreflightCheck, Notice, CaseState
├── tax/compute.ts            the tax engine
├── tax/formSelector.ts       which ITR form, and why
├── interview/steps.ts        the question script
├── preflight.ts              mismatch checks
├── llm.ts                    OpenAI adapter + MOCK_LLM fallback
├── derive.ts                 persona → computation + form decision
├── session.ts                in-memory + localStorage, no database
└── format.ts                 Indian rupee formatting
test/tax.test.mjs             node --test
```

## Design constraints

Mobile-first at 512px max width, 44px minimum touch targets, system fonts only
(nothing blocks first paint on a slow connection), high contrast for daylight use
on cheap screens, no component library and no animation library. Total first-load
JS is around 105 KB.

## No database

There isn't one. A return in progress lives in memory and is mirrored to
`localStorage` so a dropped connection does not cost the user their answers.
Nothing is stored server-side.
