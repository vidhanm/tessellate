"use client";

import { useEffect, useState } from "react";
import { Badge, ButtonLink, Card, PageHeader, Row, Why, cx } from "@/components/ui";
import { EmptySession } from "@/components/EmptySession";
import { loadSession, saveSession } from "@/lib/session";
import type { Persona, Regime, TaxComputation } from "@/lib/schemas";
import { deriveFor, incomeByHead } from "@/lib/derive";
import { FORM_DESCRIPTIONS } from "@/lib/tax/formSelector";
import { inr, pct } from "@/lib/format";

function RegimeCard({
  computation,
  label,
  recommended,
  onChoose,
  chosen,
}: {
  computation: TaxComputation;
  label: string;
  recommended: boolean;
  chosen: boolean;
  onChoose: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChoose}
      aria-pressed={chosen}
      className={cx(
        "rounded-2xl border p-4 text-left transition-colors",
        chosen ? "border-brand bg-brand-soft ring-2 ring-brand/30" : "border-line bg-paper",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[16px] font-bold text-ink">{label}</span>
        {recommended && <Badge tone="brand">Cheaper</Badge>}
      </div>
      <p className="mt-2 text-[26px] font-extrabold tabular-nums tracking-tight text-ink">
        {inr(computation.totalTaxLiability)}
      </p>
      <p className="text-[13px] text-ink-faint">total tax for the year</p>
      <dl className="mt-3 space-y-1 text-[13px] text-ink-soft">
        <div className="flex justify-between gap-2">
          <dt>Standard deduction</dt>
          <dd className="tabular-nums">{inr(computation.standardDeduction)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Taxable income</dt>
          <dd className="tabular-nums">{inr(computation.totalTaxableIncome)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>87A rebate</dt>
          <dd className="tabular-nums">{inr(computation.rebate87A)}</dd>
        </div>
      </dl>
    </button>
  );
}

export default function ReviewPage() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [regime, setRegime] = useState<Regime | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = loadSession();
    setPersona(s.persona);
    setRegime(s.regime);
    setReady(true);
  }, []);

  if (!ready) return <main className="text-[15px] text-ink-faint">Loading…</main>;
  if (!persona) return <main><EmptySession what="Your summary" /></main>;

  const { comparison, decision } = deriveFor(persona);
  const active: Regime = regime ?? comparison.recommended;
  const computation = active === "new" ? comparison.new : comparison.old;
  const heads = incomeByHead(persona);

  const choose = (r: Regime) => {
    setRegime(r);
    saveSession({ regime: r });
  };

  return (
    <main>
      <PageHeader
        eyebrow="Step 3"
        title="Here is your return"
        subtitle={`Everything below is computed from your answers, for FY 2025-26 (AY 2026-27).`}
      />

      <Card tone="brand">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] font-bold uppercase tracking-widest text-brand">
            Your form
          </span>
          <Badge tone="brand">{decision.confidence === "high" ? "Confident" : "Check this"}</Badge>
        </div>
        <p className="mt-1 text-[30px] font-extrabold tracking-tight text-ink">
          {decision.form}
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
          {FORM_DESCRIPTIONS[decision.form]}
        </p>
        <ul className="mt-3 space-y-1.5">
          {decision.reasons.map((reason, i) => (
            <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-ink">
              <span className="text-brand" aria-hidden>→</span>
              {reason}
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <Why label="Why not one of the other forms?">
            <ul className="space-y-1.5">
              {decision.ruledOut.map((r, i) => (
                <li key={i}>
                  <strong className="font-semibold text-ink">{r.form}:</strong> {r.because}
                </li>
              ))}
            </ul>
          </Why>
        </div>
      </Card>

      <h2 className="mb-3 mt-7 text-[19px] font-extrabold tracking-tight text-ink">
        Old regime or new?
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <RegimeCard
          label="New regime"
          computation={comparison.new}
          recommended={comparison.recommended === "new"}
          chosen={active === "new"}
          onChoose={() => choose("new")}
        />
        <RegimeCard
          label="Old regime"
          computation={comparison.old}
          recommended={comparison.recommended === "old"}
          chosen={active === "old"}
          onChoose={() => choose("old")}
        />
      </div>
      <p className="mt-3 rounded-xl border border-line bg-paper px-4 py-3 text-[15px] leading-relaxed text-ink-soft">
        {comparison.reason}
      </p>

      <h2 className="mb-2 mt-7 text-[19px] font-extrabold tracking-tight text-ink">
        Where your income came from
      </h2>
      <Card>
        {heads.map((row) => (
          <Row key={row.head} label={row.head} hint={row.note} value={inr(row.amount)} />
        ))}
        <Row label="Gross total income" value={inr(computation.grossTotalIncome)} strong />
      </Card>

      <h2 className="mb-2 mt-7 text-[19px] font-extrabold tracking-tight text-ink">
        What you were allowed to deduct
      </h2>
      <Card>
        <Row label="Standard deduction" value={inr(computation.standardDeduction)} />
        <Row
          label="80C — PPF, ELSS, EPF, insurance"
          value={active === "old" ? inr(Math.min(persona.taxInput.deduction80C, 150_000)) : "Not available"}
        />
        <Row
          label="80D — health insurance"
          value={active === "old" ? inr(Math.min(persona.taxInput.deduction80D, 25_000)) : "Not available"}
        />
        <Row
          label="80TTA — savings interest"
          value={active === "old" ? inr(Math.min(persona.taxInput.deduction80TTA, 10_000)) : "Not available"}
        />
        <Row label="Total deductions" value={inr(computation.totalDeductions)} strong />
      </Card>

      <h2 className="mb-2 mt-7 text-[19px] font-extrabold tracking-tight text-ink">
        How the tax was worked out
      </h2>
      <Card>
        {computation.slabBreakup.map((slab, i) => (
          <Row
            key={i}
            label={`${slab.label} at ${pct(slab.rate)}`}
            hint={`${inr(slab.taxableInSlab)} taxed in this band`}
            value={inr(slab.tax)}
          />
        ))}
        {computation.taxOnSpecialRates > 0 && (
          <Row
            label="Capital gains at special rates"
            hint="STCG 20%, LTCG 12.5% above ₹1.25L"
            value={inr(computation.taxOnSpecialRates)}
          />
        )}
        <Row label="Section 87A rebate" value={`− ${inr(computation.rebate87A)}`} />
        <Row label="Health and education cess (4%)" value={inr(computation.cess)} />
        <Row label="Total tax" value={inr(computation.totalTaxLiability)} strong />
        <Row label="Already paid (TDS and advance tax)" value={`− ${inr(computation.taxesAlreadyPaid)}`} />
      </Card>

      <Card tone={computation.refundDue > 0 ? "brand" : "warn"} className="mt-4">
        <p className="text-[13px] font-bold uppercase tracking-widest text-ink-soft">
          {computation.refundDue > 0 ? "Refund due to you" : "Still to pay"}
        </p>
        <p className="mt-1 text-[34px] font-extrabold tabular-nums tracking-tight text-ink">
          {inr(computation.refundDue > 0 ? computation.refundDue : computation.balance)}
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
          {computation.refundDue > 0
            ? "More tax was deducted during the year than you actually owe. The difference comes back to you after processing."
            : computation.balance > 0
              ? "Pay this as self-assessment tax before you file, or the return will be treated as incomplete."
              : "Your liability is exactly covered. Nothing to pay, nothing to claim."}
        </p>
      </Card>

      {computation.notes.length > 0 && (
        <div className="mt-4">
          <Why label={`${computation.notes.length} things we adjusted`}>
            <ul className="space-y-2">
              {computation.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </Why>
        </div>
      )}

      <div className="mt-6">
        <ButtonLink href="/preflight">Check before filing</ButtonLink>
      </div>
    </main>
  );
}
