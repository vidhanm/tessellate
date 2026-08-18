"use client";

import { useEffect, useRef, useState } from "react";
import { Badge, Button, Card, PageHeader, Why, cx } from "@/components/ui";
import { loadSession } from "@/lib/session";
import type { CaseState, Notice } from "@/lib/schemas";
import { inr } from "@/lib/format";

type TimelineStep = {
  state: string;
  label: string;
  description: string;
  typicalDays: number;
};

const SCENARIOS: { id: CaseState; label: string; blurb: string }[] = [
  { id: "processing", label: "Normal", blurb: "Return filed, verified, sitting in the processing queue." },
  { id: "processed_refund", label: "Refund", blurb: "Processed with a refund credited." },
  { id: "notice_issued", label: "Notice", blurb: "A mismatch was found and an intimation was issued." },
];

export default function TrackPage() {
  const [timeline, setTimeline] = useState<TimelineStep[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [scenario, setScenario] = useState<CaseState>("processing");
  const [ack, setAck] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState<{
    headline: string;
    plainEnglish: string;
    whyItMatters: string;
    nextSteps: string[];
    mocked: boolean;
  } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAck(loadSession().ackNumber);
    fetch("/api/mock/departmental")
      .then((r) => r.json())
      .then((d) => {
        setTimeline(d.timeline ?? []);
        setNotices(d.notices ?? []);
      })
      .catch(() => undefined);
  }, []);

  const reachedIndex =
    scenario === "processing" ? 2 : scenario === "processed_refund" ? 3 : 2;

  const explainNotice = async (notice: Notice) => {
    setExplaining(true);
    try {
      const res = await fetch("/api/mock/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          task: "explain_notice",
          input: `Explain this notice to someone filing for the first time: ${notice.summary}`,
          context: { section: notice.section, deadline: notice.responseDeadline },
        }),
      });
      const data = await res.json();
      setExplanation({ ...data.data, mocked: data.mocked });
    } finally {
      setExplaining(false);
    }
  };

  return (
    <main>
      <PageHeader
        eyebrow="Step 6"
        title="Where your return is"
        subtitle={
          ack
            ? `Acknowledgement ${ack}. Filing is the beginning of the process, not the end of it.`
            : "Filing is the beginning of the process, not the end of it."
        }
      />

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Demo scenario">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScenario(s.id)}
            aria-pressed={scenario === s.id}
            className={cx(
              "min-h-[44px] shrink-0 rounded-full border px-4 text-[14px] font-semibold transition-colors",
              scenario === s.id
                ? "border-brand bg-brand text-white"
                : "border-line bg-paper text-ink-soft",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="mb-5 text-[14px] text-ink-faint">
        {SCENARIOS.find((s) => s.id === scenario)?.blurb}
      </p>

      <ol className="relative border-l-2 border-line pl-6">
        {timeline.map((step, i) => {
          const done = i < reachedIndex;
          const current = i === reachedIndex;
          const isNoticeBranch = scenario === "notice_issued" && i === 3;
          return (
            <li key={step.state} className="relative pb-7 last:pb-0">
              <span
                className={cx(
                  "absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold",
                  isNoticeBranch
                    ? "border-danger bg-danger text-white"
                    : done
                      ? "border-brand bg-brand text-white"
                      : current
                        ? "border-brand bg-paper text-brand"
                        : "border-line bg-paper text-ink-faint",
                )}
                aria-hidden
              >
                {done ? "✓" : ""}
              </span>
              <h3
                className={cx(
                  "text-[16px] font-bold",
                  isNoticeBranch ? "text-danger" : done || current ? "text-ink" : "text-ink-faint",
                )}
              >
                {isNoticeBranch ? "Notice issued" : step.label}
                {current && !isNoticeBranch && (
                  <span className="ml-2 align-middle">
                    <Badge tone="brand">Now</Badge>
                  </span>
                )}
              </h3>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
                {isNoticeBranch
                  ? "The department's automated comparison found a figure it disagrees with. An intimation under section 143(1) has been issued."
                  : step.description}
              </p>
              <p className="mt-1 text-[12px] text-ink-faint">
                Typically about {step.typicalDays} days after filing
              </p>
            </li>
          );
        })}
      </ol>

      {scenario === "processed_refund" && (
        <Card tone="brand" className="mt-5">
          <p className="text-[13px] font-bold uppercase tracking-widest text-brand">
            Refund credited
          </p>
          <p className="mt-1 text-[28px] font-extrabold tabular-nums text-ink">{inr(41000)}</p>
          <p className="mt-1 text-[14px] text-ink-soft">
            Credited to the account ending 4412 on 22 August 2026.
          </p>
        </Card>
      )}

      <h2 className="mb-2 mt-8 text-[19px] font-extrabold tracking-tight text-ink">
        I got a notice
      </h2>
      <Card>
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Upload it and we will tell you what it actually says, what the department
          wants, and by when.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setUploaded(file.name);
          }}
        />
        <div className="mt-3">
          <Button variant="secondary" onClick={() => fileInput.current?.click()}>
            Upload the notice PDF
          </Button>
        </div>
        {uploaded && (
          <p className="mt-3 rounded-lg bg-warn-soft px-3 py-2 text-[14px] leading-relaxed text-warn">
            Read &ldquo;{uploaded}&rdquo;. Parsing a real notice PDF is not built yet —
            pick one of the sample notices below to see the explanation flow.
          </p>
        )}

        <div className="mt-4 grid gap-2">
          {notices.map((notice) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => explainNotice(notice)}
              className="rounded-xl border border-line bg-surface px-4 py-3 text-left"
            >
              <span className="block text-[13px] font-bold text-danger">
                Section {notice.section}
              </span>
              <span className="mt-0.5 block text-[15px] font-semibold leading-snug text-ink">
                {notice.summary}
              </span>
              <span className="mt-1 block text-[13px] text-ink-faint">
                Respond by {notice.responseDeadline}
              </span>
            </button>
          ))}
        </div>

        {explaining && (
          <p className="mt-3 text-[14px] text-ink-faint">Working out what it means…</p>
        )}

        {explanation && (
          <div className="mt-4 rounded-xl border border-brand/25 bg-brand-soft p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[16px] font-bold leading-snug text-ink">
                {explanation.headline}
              </h3>
              {explanation.mocked && <Badge tone="neutral">Mock LLM</Badge>}
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              {explanation.plainEnglish}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              {explanation.whyItMatters}
            </p>
            <ul className="mt-3 space-y-1.5">
              {explanation.nextSteps.map((s, i) => (
                <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-ink">
                  <span className="text-brand" aria-hidden>→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <div className="mt-5">
        <Why label="Why does processing take weeks?">
          Your return is not read by a person. It is matched, line by line, against
          the Form 24Q your employer filed, the SFT reports your bank and broker
          filed, and the tax actually deposited against your PAN. Those filings
          arrive on their own schedule, which is why a return filed in July is often
          processed in August.
        </Why>
      </div>
    </main>
  );
}
