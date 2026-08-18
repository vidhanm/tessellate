"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, PageHeader, Why, cx } from "@/components/ui";
import { saveSession } from "@/lib/session";
import type { Persona } from "@/lib/schemas";
import { inr } from "@/lib/format";

export default function StartPage() {
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/mock/personas")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setPersonas(data.personas ?? []);
          setLoading(false);
        }
      })
      .catch(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const proceed = () => {
    const persona = personas.find((p) => p.id === selected);
    if (!persona) return;
    saveSession({ personaId: persona.id, persona, answers: {}, regime: null });
    router.push("/interview");
  };

  /** A real Form 16 parser is a project of its own. Here it maps to a persona. */
  const onUpload = (file: File | undefined) => {
    if (!file) return;
    const match = personas[0];
    setSelected(match?.id ?? null);
    setUploadNote(
      `Read "${file.name}". In this prototype, an uploaded Form 16 is mapped to the demo taxpayer ${match?.name ?? ""} rather than parsed.`,
    );
  };

  return (
    <main>
      <PageHeader
        eyebrow="Step 1"
        title="Who are we filing for?"
        subtitle="Pick a demo taxpayer to walk through the whole flow with realistic data, or upload a Form 16."
      />

      {loading && <p className="text-[15px] text-ink-faint">Loading demo taxpayers…</p>}

      <div className="grid gap-3">
        {personas.map((p) => {
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              aria-pressed={isSelected}
              className={cx(
                "w-full rounded-2xl border p-4 text-left transition-colors",
                isSelected
                  ? "border-brand bg-brand-soft ring-2 ring-brand/30"
                  : "border-line bg-paper",
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[17px] font-bold text-ink">{p.name}</span>
                <span className="shrink-0 text-xs font-semibold text-ink-faint">
                  {p.age} · {p.city}
                </span>
              </div>
              <p className="mt-0.5 text-[14px] font-semibold text-brand">{p.tagline}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{p.story}</p>
              <p className="mt-2.5 text-[13px] text-ink-faint">
                Gross income about {inr(
                  p.taxInput.grossSalary +
                    p.taxInput.businessIncome +
                    p.taxInput.interestIncome +
                    p.taxInput.dividendIncome +
                    p.taxInput.shortTermCapitalGains +
                    p.taxInput.longTermCapitalGains,
                )}
                {" · "}
                {p.ais.length} entries in AIS
              </p>
            </button>
          );
        })}
      </div>

      <Card className="mt-4">
        <h2 className="text-[15px] font-bold text-ink">Or upload your Form 16</h2>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
          PDF only. Your employer issues it in June.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onUpload(e.target.files?.[0])}
        />
        <div className="mt-3">
          <Button variant="secondary" onClick={() => fileInput.current?.click()}>
            Choose a PDF
          </Button>
        </div>
        {uploadNote && (
          <p className="mt-3 rounded-lg bg-warn-soft px-3 py-2 text-[14px] leading-relaxed text-warn">
            {uploadNote}
          </p>
        )}
      </Card>

      <div className="mt-4">
        <Why label="Why start with a Form 16?">
          Form 16 is the certificate your employer gives you showing what they paid
          you and what tax they already deducted. Almost every figure in a first
          return comes from it, which is why the very first thing we ask for is
          the one document you already have.
        </Why>
      </div>

      <div className="mt-5">
        <Button onClick={proceed} disabled={!selected}>
          Continue
        </Button>
      </div>
    </main>
  );
}
