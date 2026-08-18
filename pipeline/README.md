# `@saral/pipeline`

Every OpenAI-model task Saral makes, in one framework-free TypeScript package.

Nothing in here knows about React, Next, or HTTP. You import a task and call `run(input)`; you get back an object that has already been validated with zod. Drop the folder next to the Next app and import it — that is the whole integration story.

The division of labour the concept doc insists on is enforced here by construction:

> **Deterministic parts (tax computation, form-selection rules, check evaluation) are code, not the model — the model explains and extracts; it does not compute tax.**

Every prompt in this package says so, and `recommendFormAndRegime` is structurally incapable of disagreeing with the tax engine: the form and regime it "recommends" are fields it must copy from its own input.

---

## Quick start

```bash
npm install
npm test          # 29 tests, mock mode, no network
npm run demo      # the 3-minute demo script, offline
npm run typecheck
```

```ts
import { extractForm16, recommendFormAndRegime } from '@saral/pipeline';

const form16 = await extractForm16.run({ text: pdfText });
// → { employer: { tan: 'BLRN02931E', … }, grossSalary: { total: 1180000, … }, regimeIndicated: 'new', … }
```

### Environment

| Variable | Default | Meaning |
|---|---|---|
| `OPENAI_API_KEY` | — | Absent ⇒ mock mode. Never send it to the browser. |
| `OPENAI_MODEL` | `gpt-4.1-mini` | Any model that supports the Responses API with structured outputs. |
| `MOCK_LLM` | unset | `1` forces fixtures; `0` forces a live call (and then a missing key throws). |

**Everything runs offline.** With no key, or `MOCK_LLM=1`, every task returns a realistic canned fixture that satisfies the same zod schema a live response must satisfy. Demo laptops, CI, and reviewers without a key all get a working product.

---

## The nine tasks

Each one exports the same shape:

```ts
{
  name, description,
  inputSchema, outputSchema,   // zod
  jsonSchema,                  // OpenAI-ready, strict:true
  systemPrompt,                // shared preamble + task prompt
  fixture(input),              // the canned output
  run(input, opts?),           // → Promise<Output>
  runWithMeta(input, opts?),   // → Promise<{ data, meta }>  meta: model, attempts, usage, latencyMs
}
```

| # | Task | In | Out |
|---|---|---|---|
| 1 | `extractForm16` | Form 16 Part A + B text | employer, TAN, gross salary 17(1)/(2)/(3), §10 exemptions, standard deduction, Chapter VI-A items, quarter-wise TDS, `regimeIndicated` + the evidence line |
| 2 | `extractAIS` | AIS/TIS export text or CSV | `entries[]` of `{ infoCode, description, source, amount, tds, quarter, head, status }`, printed totals, Schedule-FA / VDA / 194N flags |
| 3 | `extractBrokerStatement` | tradebook / P&L / capital-gains CSV | `trades[]` `{ isin, symbol, qty, buyDate, buyValue, sellDate, sellValue, type: equity\|mf, … }` + `dividends[]` + `unparsedRows[]` |
| 4 | `recommendFormAndRegime` | structured facts **+ the deterministic outputs from code** | plain-language form and regime explanation in `en` and `hi`, `reasons[]` each citing a RULES.md rule, `confidence` |
| 5 | `askInPlainLanguage` | schedule/field id + persona + language | question (**≤ 30 words**), "why we ask" (**≤ 60 words**), example, `glossary[]`, answer type, prefill hint |
| 6 | `explainPreflight` | failed check `{ code, severity, facts }` | what happened, why CPC would flag it, consequence, ordered remedy steps — all in `en` + `hi` |
| 7 | `readNotice` | notice text + filed-return summary | type, DIN, due date, `differences[] { item, cpc, taxpayer, delta }`, root cause, action ∈ {`respond_139_9`, `rectification_154`, `revised_139_5`, `agree_and_pay`, `disagree`}, drafted response, `en`+`hi` summary |
| 8 | `clusterOfficerIssues` | failed checks across many cases | top systemic issues with distinct-case counts and one upstream fix each |
| 9 | `translate` | text + target `hi` | Devanagari Hindi with tax terms kept in English in brackets |

### 1–3, the extractors

They read heterogeneous documents and emit strict JSON. The prompts carry the column synonyms each broker and registrar uses, and a standing instruction that a row copied verbatim into `unparsedRows` is a **success** while a guessed row is a **failure**. They never compute: `holdingDays`, `gainType` and long-vs-short-term are copied if printed and left `null`/`"unclear"` otherwise, because holding-period rules belong to code (RULES.md §2).

### 4, the one that must not compute

`recommendFormAndRegime` receives a `deterministic` block — the chosen form, both regimes' tax numbers, the saving, and whether Form 10-IEA is needed. The prompt states that `form.value` **must equal** `deterministic.chosenForm` and every rupee figure must already appear in the input; "approximately" and "roughly" are banned. If the model thinks the numbers are wrong it may not correct them — it sets `uncertain` and drops `confidence`.

### 5, the interview

Word budgets are not advisory: `question ≤ 30` and `whyWeAsk ≤ 60` are zod refinements, so a live response that overruns triggers the repair retry. Hindi words are counted the same way. Section numbers and schedule names are allowed in `whyWeAsk` and `glossary`, never in the question itself.

### 6–8, the back half

`explainPreflight` takes one row of the RULES.md §4 table plus the facts the engine compared, and turns it into what-happened / why-CPC-would-flag / remedy. `readNotice` diffs the notice against the return we filed and picks the remedy — with the reasoning for why the other four options are worse, and an explicit refusal to recommend ITR-U. `clusterOfficerIssues` groups by underlying cause rather than by check code and demands a fix **earlier in the journey** than where the check fired.

---

## What every prompt promises

`SHARED_PREAMBLE` in `src/client.ts` is prepended to all nine system prompts, and `test/schemas.test.ts` asserts each clause is present:

1. **Never invent a number.** Every rupee figure is copied from the input; missing means `null`, not a guess.
2. **Never compute tax.** Slabs, rebates, interest, capital gains — all code.
3. **Cite the rule.** RULES.md section, check code, or section of the Act.
4. **Say when you are not sure.** Every output schema carries `uncertain: boolean` and `uncertaintyNotes: string[]`. A confident wrong answer costs the user a notice; an honest "I'm not sure" does not.
5. **Hindi in Devanagari.** Never Latin transliteration. Tax terms in English in round brackets: `मानक कटौती (standard deduction)`.
6. **Simple words.** No jargon without a gloss, no marketing tone, no emoji.

---

## How it works

### Structured outputs

Zod is the source of truth. `toJsonSchema()` converts each output schema and then `strictify()` makes it legal for OpenAI's `strict: true` mode: every object gets `additionalProperties: false` and a `required` list containing *all* its properties, and constraint keywords the API rejects (`minLength`, `pattern`, `minimum`, `format`, …) are stripped.

The constraints do not disappear — they stay in zod and are checked against the parsed response. That gap is deliberate: the wire schema guarantees *shape*, zod guarantees *substance*.

### Retry on schema failure

`withMock()` wraps each task definition. On a live call it sends the request, parses `output_text`, and validates with zod. On failure it retries **exactly once**, feeding the zod issues back as a user message with the instruction not to change any figure that was already correct. A second failure throws `TaskSchemaError` carrying `{ task, issues, raw }` — so the app can fall back to the interview instead of showing a half-parsed document.

Optional fields are modelled as `.nullable()`, not `.optional()`, because strict mode requires every property to be present.

### Mock mode

`isMock()` is true when `MOCK_LLM=1` or there is no key. In mock mode `run()` returns `fixture(input)` — still parsed through the output schema, so a fixture that drifts from its schema fails the test suite rather than the demo. Fixtures are input-aware where it matters: `recommendFormAndRegime` echoes whatever deterministic numbers you hand it, `clusterOfficerIssues` really counts distinct cases, and `readNotice` returns the 139(9) or 143(1) fixture depending on the text.

`usingMock(fn)` forces mock mode for one block — useful in tests and in a "demo mode" toggle.

---

## Cost notes

Measured on the sample documents in `fixtures/sampleInputs.ts` (≈ chars ÷ 4). The JSON schema is sent on every call and is usually the largest fixed cost.

| Task | System | Schema | Document/input | Output | **≈ total tokens** |
|---|---|---|---|---|---|
| `extractForm16` | 730 | 1 280 | ~500 | ~380 | **≈ 2 900** |
| `extractAIS` | 740 | 650 | ~200 | ~340 | **≈ 1 950** |
| `extractBrokerStatement` | 760 | 880 | ~200 | ~330 | **≈ 2 200** |
| `recommendFormAndRegime` | 810 | 1 070 | ~350 | ~1 500¹ | **≈ 3 700** |
| `askInPlainLanguage` | 800 | 390 | ~120 | ~400¹ | **≈ 1 700** |
| `explainPreflight` | 760 | 650 | ~120 | ~800¹ | **≈ 2 350** |
| `readNotice` | 1 000 | 830 | ~450 | ~1 300¹ | **≈ 3 600** |
| `clusterOfficerIssues` | 790 | 450 | ~600 | ~770 | **≈ 2 600** |
| `translate` | 680 | 160 | ~30 | ~60¹ | **≈ 930** |

¹ Devanagari costs roughly 2–3× more tokens per character than Latin text, so bilingual outputs are budgeted at about double their character count.

**One complete filing journey** — three imports, one recommendation, ~8 interview questions, ~3 pre-flight explanations — is roughly **35–40k tokens**, most of it input. At `gpt-4.1-mini` list pricing (verify before you rely on it; ~$0.40 / 1M input, ~$1.60 / 1M output) that is well under a cent per return. The notice reader adds ~4k, the officer console ~3k per batch.

Ways to spend less, in order of effect:
- Keep `MOCK_LLM=1` for every demo run. It is free and deterministic.
- Cache by input hash — Form 16 text does not change between screens.
- Batch interview questions: one `askInPlainLanguage` call per schedule, not per render.
- The system prompts are static, so prompt caching applies to ~40% of a typical call.
- `temperature` defaults to 0, so identical input gives near-identical output and caching is worth doing.

---

## Importing from the Next app

The package is plain ESM TypeScript with `.ts` extensions in its imports, which Next transpiles happily.

**1. Point the app at it** — `next.config.ts`:

```ts
export default {
  transpilePackages: ['@saral/pipeline'],
};
```

and either add `"@saral/pipeline": "file:../pipeline"` to the app's dependencies, or a `tsconfig.json` path:

```json
{ "compilerOptions": { "paths": { "@saral/pipeline": ["../pipeline/src/index.ts"] } } }
```

**2. Server only.** Every task reads `OPENAI_API_KEY`. Call them from route handlers or server actions, never from a client component.

```ts
// app/api/import/form16/route.ts
import { extractForm16 } from '@saral/pipeline';

export async function POST(request: Request) {
  const { text } = await request.json();
  const data = await extractForm16.run({ text });
  return Response.json(data);
}
```

**3. Or one generic route**, using the registry:

```ts
// app/api/pipeline/[task]/route.ts
import { tasks, taskNames, TaskSchemaError, type TaskName } from '@saral/pipeline';

export async function POST(request: Request, { params }: { params: Promise<{ task: string }> }) {
  const { task } = await params;
  if (!taskNames.includes(task as TaskName)) return new Response('unknown task', { status: 404 });
  try {
    const { data, meta } = await tasks[task as TaskName].runWithMeta(await request.json());
    return Response.json({ data, meta });
  } catch (error) {
    if (error instanceof TaskSchemaError) return Response.json({ error: 'schema', issues: error.issues }, { status: 502 });
    throw error;
  }
}
```

**4. Type the UI from the schemas** — no hand-written interfaces:

```ts
import { schemas } from '@saral/pipeline';
type Form16 = import('zod').infer<typeof schemas.Form16Output>;
```

**5. Validate on the client boundary too.** The same zod schemas are safe to import into a client component *for validation of a fetched payload* — but not the task modules, which pull in the OpenAI SDK.

---

## Layout

```
pipeline/
├── package.json          openai + zod + zod-to-json-schema; tsx to run; node --test
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts          all nine tasks + the `tasks` registry
│   ├── client.ts         OpenAI client, SHARED_PREAMBLE, withMock(), retry-once
│   ├── schemas/          zod → strict JSON schema, one file per task
│   └── tasks/            one file per task: prompt + fixture wiring
├── fixtures/             canned outputs + synthetic sample documents
├── scripts/demo.ts       offline walk-through in demo-script order
└── test/                 node --test, mock mode, fixtures validated against schemas
```

## Safety

Every PAN, TAN, DIN, employer and notice in `fixtures/` is fabricated, and the synthetic notices say so in their own text. No live government system is contacted from this package. The only network call it can make is to the OpenAI Responses API.
