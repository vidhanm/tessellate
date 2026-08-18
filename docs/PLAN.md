# 8-day plan (19–27 Aug 2026)

Principle: a clickable end-to-end journey by Day 3; depth after.

| Day | Deliverable | Real vs mock |
|---|---|---|
| 1 (19) | Research done; scaffold; synthetic personas/data; tax engine + form selector + tests | — |
| 2 (20) | Interview flow wired to steps + persona data; review page with regime comparison; glossary/“why” drawer | Persona import mock |
| 3 (21) | Pre-flight engine (rules JSON → results), submit → ITR JSON → ack; tracker states. **Full journey clickable.** | Submit mocked |
| 4 (22) | OpenAI pipeline: Form 16/AIS/broker extraction (structured outputs), form/regime explainer, question rewriter (en/hi) | Real model calls |
| 5 (23) | Notice reader (139(9)/143(1) diff + remedy); officer console + audit log | Notices synthetic |
| 6 (24) | Mobile/slow-network pass (Lighthouse, PWA, no heavy assets), Hindi copy, accessibility | — |
| 7 (25) | Deploy (Vercel), write-up, honesty table, README, Codex contribution log | — |
| 8 (26) | Demo video (≤3 min), buffer, submit by 27th | — |

## Codex usage (must be meaningful)
Use Codex for: scaffold refactors, test generation for tax engine, schema generation from published ITR JSON schema, i18n extraction. Keep a `docs/CODEX_LOG.md` with dated entries.

## Risks
- Overbuilding: cut officer console to a single page if behind by Day 5.
- Tax rule errors: unit tests + cross-check against official calculator numbers.
- Crowded space: emphasise pre-flight + notice + officer half in the demo, not the pretty form.
