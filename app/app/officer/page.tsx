import { Badge, Card, PageHeader, cx } from "@/components/ui";
import departmental from "@/app/mock-backend/departmental.json";
import { inr } from "@/lib/format";

/**
 * The other side of the counter. Showing the officer's queue is the fastest way
 * to make a first-time filer understand that "the department" is mostly a set of
 * automated reconciliation rules, not a person forming an opinion about them.
 */
const STATE_LABELS: Record<string, { label: string; tone: "neutral" | "brand" | "warn" | "fail" | "pass" }> = {
  filed: { label: "Filed, awaiting verification", tone: "neutral" },
  everified: { label: "Verified", tone: "brand" },
  processing: { label: "In processing", tone: "brand" },
  processed_refund: { label: "Refund issued", tone: "pass" },
  processed_demand: { label: "Demand raised", tone: "warn" },
  notice_issued: { label: "Notice issued", tone: "fail" },
  closed: { label: "Closed", tone: "neutral" },
};

export default function OfficerPage() {
  const queue = departmental.officerQueue;

  return (
    <main>
      <PageHeader
        eyebrow="Mock CPC view"
        title="The queue on the other side"
        subtitle="What a Centralised Processing Centre operator sees. Every case here is fictional."
      />

      <Card tone="warn" className="mb-5">
        <p className="text-[14px] leading-relaxed text-ink">
          This screen exists to make one point: nobody is reading your return and
          judging you. A rules engine compares your figures against filings other
          people made about you, and the outcome follows from that.
        </p>
      </Card>

      <ul className="grid gap-4">
        {queue.map((c) => {
          const state = STATE_LABELS[c.state] ?? STATE_LABELS.filed;
          const failing = c.checks.filter((k) => k.status === "fail").length;
          return (
            <li key={c.id} className="rounded-2xl border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[17px] font-bold text-ink">{c.taxpayer}</h2>
                  <p className="font-mono text-[12px] text-ink-faint">
                    {c.pan} · {c.ackNumber}
                  </p>
                </div>
                <Badge tone={state.tone}>{state.label}</Badge>
              </div>

              <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-surface px-3 py-2.5 text-center">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Form
                  </dt>
                  <dd className="text-[15px] font-bold text-ink">{c.form}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Refund
                  </dt>
                  <dd className="text-[15px] font-bold tabular-nums text-ink">
                    {c.refundClaimed > 0 ? inr(c.refundClaimed) : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Risk
                  </dt>
                  <dd
                    className={cx(
                      "text-[15px] font-bold tabular-nums",
                      c.riskScore >= 60
                        ? "text-danger"
                        : c.riskScore >= 30
                          ? "text-warn"
                          : "text-pass",
                    )}
                  >
                    {c.riskScore}
                  </dd>
                </div>
              </dl>

              <ul className="mt-3 space-y-2">
                {c.checks.map((check) => (
                  <li key={check.id} className="flex gap-2.5">
                    <span
                      className={cx(
                        "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                        check.status === "pass"
                          ? "bg-pass"
                          : check.status === "warn"
                            ? "bg-warn"
                            : "bg-danger",
                      )}
                      aria-hidden
                    />
                    <div>
                      <p className="text-[14px] font-semibold leading-snug text-ink">
                        {check.title}
                      </p>
                      <p className="text-[13px] leading-relaxed text-ink-soft">
                        {check.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {failing > 0 && (
                <p className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-[13px] font-semibold text-danger">
                  {failing} automated check failed — routed to adjustment under
                  section 143(1)(a).
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="mb-2 mt-8 text-[19px] font-extrabold tracking-tight text-ink">
        The rules being applied
      </h2>
      <Card>
        <ul className="space-y-3">
          {departmental.cpcRules.map((rule) => (
            <li key={rule.id}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] font-bold text-ink">{rule.title}</p>
                <Badge tone={rule.severity === "fail" ? "fail" : "warn"}>
                  {rule.severity === "fail" ? "Blocking" : "Advisory"}
                </Badge>
              </div>
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">
                {rule.description}
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
