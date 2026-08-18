"use client";

import { useEffect, useState } from "react";
import { Badge, Button, ButtonLink, Card, PageHeader, Why } from "@/components/ui";
import { EmptySession } from "@/components/EmptySession";
import { loadSession, saveSession } from "@/lib/session";
import type { Persona } from "@/lib/schemas";
import { deriveFor } from "@/lib/derive";
import { inr } from "@/lib/format";

export default function SubmitPage() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [ready, setReady] = useState(false);
  const [ack, setAck] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const s = loadSession();
    setPersona(s.persona);
    setAck(s.ackNumber);
    setVerified(s.verified);
    setReady(true);
  }, []);

  if (!ready) return <main className="text-[15px] text-ink-faint">Loading…</main>;
  if (!persona) return <main><EmptySession what="Submission" /></main>;

  const { chosen, decision } = deriveFor(persona);

  const submit = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/mock/efile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pan: persona.pan,
          form: decision.form,
          taxpayer: persona.name,
          action: "submit",
        }),
      });
      const data = await res.json();
      setAck(data.ackNumber);
      setMessage(data.message);
      saveSession({ ackNumber: data.ackNumber });
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/mock/efile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pan: persona.pan,
          form: decision.form,
          action: "everify",
          otp,
        }),
      });
      const data = await res.json();
      setVerified(Boolean(data.verified));
      setMessage(data.message);
      if (data.verified) saveSession({ verified: true });
    } finally {
      setBusy(false);
    }
  };

  const downloadJson = () => {
    const payload = {
      _note: "Mock ITR JSON. Shaped like the real thing; not accepted by any portal.",
      itrForm: decision.form,
      assessmentYear: "2026-27",
      taxpayer: { name: persona.name, pan: persona.pan },
      acknowledgementNumber: ack,
      regime: chosen.regime,
      computation: chosen,
      formSelection: decision,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${decision.form}-${persona.pan}-AY2026-27.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <PageHeader
        eyebrow="Step 5"
        title={ack ? "Filed" : "Ready to file"}
        subtitle={
          ack
            ? "Your return has an acknowledgement number. It is not finished until you e-verify."
            : `${decision.form} for ${persona.name}, ${chosen.regime} regime.`
        }
      />

      {!ack && (
        <>
          <Card>
            <dl className="space-y-2 text-[15px]">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Form</dt>
                <dd className="font-semibold text-ink">{decision.form}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Assessment year</dt>
                <dd className="font-semibold text-ink">2026-27</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Regime</dt>
                <dd className="font-semibold text-ink capitalize">{chosen.regime}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Total tax</dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {inr(chosen.totalTaxLiability)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">
                  {chosen.refundDue > 0 ? "Refund claimed" : "Balance payable"}
                </dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {inr(chosen.refundDue > 0 ? chosen.refundDue : chosen.balance)}
                </dd>
              </div>
            </dl>
          </Card>
          <div className="mt-5">
            <Button onClick={submit} disabled={busy}>
              {busy ? "Submitting…" : "Submit my return"}
            </Button>
          </div>
          <p className="mt-3 text-center text-[13px] leading-relaxed text-ink-faint">
            This is a mock submission. Nothing is sent to the Income Tax Department.
          </p>
        </>
      )}

      {ack && (
        <>
          <Card tone="brand">
            <p className="text-[13px] font-bold uppercase tracking-widest text-brand">
              Acknowledgement number
            </p>
            <p className="mt-1 select-all font-mono text-[22px] font-bold tracking-tight text-ink">
              {ack}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              Write this down. Every conversation you ever have with the department
              about this year starts with this number.
            </p>
          </Card>

          <Card className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[17px] font-bold text-ink">E-verify with Aadhaar OTP</h2>
              {verified && <Badge tone="pass">Verified</Badge>}
            </div>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
              A return that is not e-verified within 30 days is treated as never
              filed. This is the step people skip.
            </p>

            {!verified && (
              <div className="mt-4">
                {!otpSent ? (
                  <Button variant="secondary" onClick={() => setOtpSent(true)}>
                    Send OTP to my Aadhaar-linked mobile
                  </Button>
                ) : (
                  <>
                    <label className="block">
                      <span className="mb-1.5 block text-[14px] font-semibold text-ink">
                        Enter the 6-digit OTP
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        className="min-h-[56px] w-full rounded-xl border border-line bg-paper px-4 text-center font-mono text-[24px] tracking-[0.4em] text-ink outline-none focus:ring-2 focus:ring-brand/40"
                      />
                    </label>
                    <p className="mt-2 text-[13px] text-ink-faint">
                      Mock step — any six digits will do.
                    </p>
                    <div className="mt-3">
                      <Button onClick={verify} disabled={busy || otp.length !== 6}>
                        {busy ? "Verifying…" : "Verify"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>

          {message && (
            <p className="mt-3 rounded-xl border border-line bg-paper px-4 py-3 text-[14px] leading-relaxed text-ink-soft">
              {message}
            </p>
          )}

          <div className="mt-4 grid gap-3">
            <Button variant="secondary" onClick={downloadJson}>
              Download ITR JSON
            </Button>
            <ButtonLink href="/track" variant={verified ? "primary" : "secondary"}>
              Track my return
            </ButtonLink>
          </div>

          <div className="mt-4">
            <Why label="What happens next?">
              Your return joins a queue at CPC Bengaluru. Automated systems compare
              every figure against Form 26AS, your AIS and the SFT reports banks and
              brokers filed. Most returns are processed within three to five weeks,
              and an intimation under section 143(1) tells you the outcome.
            </Why>
          </div>
        </>
      )}
    </main>
  );
}
