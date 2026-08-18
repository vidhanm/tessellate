"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Why, cx } from "@/components/ui";
import { SECTIONS, visibleSteps, type InterviewStep } from "@/lib/interview/steps";
import { loadSession, saveSession } from "@/lib/session";
import type { Persona } from "@/lib/schemas";
import { inr } from "@/lib/format";

export default function InterviewPage() {
  const router = useRouter();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadSession();
    setPersona(session.persona);
    setAnswers(session.answers ?? {});
    setReady(true);
  }, []);

  const active = useMemo(() => visibleSteps(answers), [answers]);
  const step: InterviewStep | undefined = active[index];
  const percent = active.length ? Math.round((index / active.length) * 100) : 0;

  const answer = (value: unknown) => {
    if (!step) return;
    const next = { ...answers, [step.field]: value };
    setAnswers(next);
    saveSession({ answers: next });
  };

  const advance = () => {
    if (index + 1 >= active.length) {
      saveSession({ answers, taxInput: persona?.taxInput ?? null });
      router.push("/review");
      return;
    }
    setIndex(index + 1);
  };

  if (!ready) return <main className="text-[15px] text-ink-faint">Loading…</main>;

  if (!persona) {
    return (
      <main>
        <Card tone="warn">
          <h1 className="text-[18px] font-bold text-ink">No taxpayer chosen yet</h1>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
            The interview needs a starting point — a Form 16 or a demo taxpayer.
          </p>
          <div className="mt-4">
            <Button onClick={() => router.push("/start")}>Go back to Start</Button>
          </div>
        </Card>
      </main>
    );
  }

  if (!step) {
    return (
      <main>
        <Card tone="brand">
          <h1 className="text-[20px] font-bold text-ink">That is every question.</h1>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
            Nothing left to ask. Let us show you what it adds up to.
          </p>
          <div className="mt-4">
            <Button onClick={() => router.push("/review")}>See my summary</Button>
          </div>
        </Card>
      </main>
    );
  }

  const sectionLabel =
    SECTIONS.find((s) => s.id === step.section)?.label ?? "Interview";
  const current = answers[step.field];

  return (
    <main>
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">
            {sectionLabel}
          </p>
          <p className="text-xs font-semibold text-ink-faint">
            Question {index + 1} of {active.length}
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{ width: `${Math.max(percent, 4)}%` }}
          />
        </div>
      </div>

      <Card>
        <h1 className="text-[22px] font-extrabold leading-snug tracking-tight text-ink">
          {step.question}
        </h1>
        {step.helper && (
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.helper}</p>
        )}

        <div className="mt-5">
          {step.kind === "yesno" && (
            <div className="grid grid-cols-2 gap-3">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => answer(value)}
                  aria-pressed={current === value}
                  className={cx(
                    "min-h-[56px] rounded-xl border text-[17px] font-semibold transition-colors",
                    current === value
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-paper text-ink",
                  )}
                >
                  {value ? "Yes" : "No"}
                </button>
              ))}
            </div>
          )}

          {step.kind === "choice" && (
            <div className="grid gap-2.5">
              {(step.options ?? []).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => answer(option.value)}
                  aria-pressed={current === option.value}
                  className={cx(
                    "min-h-[56px] rounded-xl border px-4 py-3 text-left transition-colors",
                    current === option.value
                      ? "border-brand bg-brand-soft ring-2 ring-brand/30"
                      : "border-line bg-paper",
                  )}
                >
                  <span className="block text-[16px] font-semibold text-ink">
                    {option.label}
                  </span>
                  {option.sublabel && (
                    <span className="mt-0.5 block text-[13px] text-ink-faint">
                      {option.sublabel}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {step.kind === "amount" && (
            <label className="block">
              <span className="sr-only">{step.question}</span>
              <div className="flex items-center gap-2 rounded-xl border border-line bg-paper px-4 focus-within:ring-2 focus-within:ring-brand/40">
                <span className="text-[18px] font-bold text-ink-faint">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={typeof current === "number" ? current : ""}
                  onChange={(e) => answer(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="min-h-[56px] w-full bg-transparent text-[20px] font-semibold tabular-nums text-ink outline-none"
                />
              </div>
            </label>
          )}

          {step.kind === "info" && (
            <div className="rounded-xl border border-line bg-surface px-4 py-3">
              <p className="text-[15px] leading-relaxed text-ink-soft">
                {step.id === "tds"
                  ? `Form 26AS shows ${inr(persona.taxInput.tdsPaid)} deducted against ${persona.pan} this year.`
                  : "A pre-validated account in your own name is required for any refund to reach you."}
              </p>
            </div>
          )}
        </div>

        {step.departmentKnows && (
          <p className="mt-4 rounded-lg border border-brand/20 bg-brand-soft px-3 py-2.5 text-[14px] leading-relaxed text-brand">
            <strong className="font-bold">The department already knows: </strong>
            {step.departmentKnows}
          </p>
        )}
      </Card>

      <div className="mt-3">
        <Why>{step.why}</Why>
      </div>

      <div className="mt-5 flex gap-3">
        {index > 0 && (
          <Button variant="secondary" onClick={() => setIndex(index - 1)} className="max-w-[110px]">
            Back
          </Button>
        )}
        <Button onClick={advance}>
          {index + 1 >= active.length ? "See my summary" : "Next"}
        </Button>
      </div>
    </main>
  );
}
