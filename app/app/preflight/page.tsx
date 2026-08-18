"use client";

import { useEffect, useState } from "react";
import { Badge, ButtonLink, Card, PageHeader, cx } from "@/components/ui";
import { EmptySession } from "@/components/EmptySession";
import { loadSession } from "@/lib/session";
import type { Persona } from "@/lib/schemas";
import { deriveFor } from "@/lib/derive";
import { preflightSummary, runPreflight } from "@/lib/preflight";

const VERDICTS = {
  will_bounce: {
    tone: "danger" as const,
    title: "This return would bounce",
    body: "At least one check fails against what the department already has on record. Filing now means a notice later.",
  },
  check_first: {
    tone: "warn" as const,
    title: "Worth a second look",
    body: "Nothing here will get your return rejected outright, but each of these is a way filings quietly go wrong.",
  },
  ready: {
    tone: "brand" as const,
    title: "This return should sail through",
    body: "Every figure agrees with what the department already has. Nothing here would trigger an automated adjustment.",
  },
};

export default function PreflightPage() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPersona(loadSession().persona);
    setReady(true);
  }, []);

  if (!ready) return <main className="text-[15px] text-ink-faint">Loading…</main>;
  if (!persona) return <main><EmptySession what="The pre-filing check" /></main>;

  const { chosen, decision } = deriveFor(persona);
  const checks = runPreflight(persona, chosen, decision.form);
  const summary = preflightSummary(checks);
  const verdict = VERDICTS[summary.verdict];

  return (
    <main>
      <PageHeader
        eyebrow="Step 4"
        title="Will this return bounce?"
        subtitle="These are the same reconciliation checks CPC runs after you file. We run them while you can still change something."
      />

      <Card tone={verdict.tone}>
        <h2 className="text-[19px] font-extrabold tracking-tight text-ink">{verdict.title}</h2>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{verdict.body}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="pass">{summary.passed} pass</Badge>
          {summary.warned > 0 && <Badge tone="warn">{summary.warned} to check</Badge>}
          {summary.failed > 0 && <Badge tone="fail">{summary.failed} fail</Badge>}
        </div>
      </Card>

      <ul className="mt-4 grid gap-3">
        {checks.map((check) => (
          <li
            key={check.id}
            className={cx(
              "rounded-2xl border p-4",
              check.status === "fail"
                ? "border-danger/30 bg-danger-soft"
                : check.status === "warn"
                  ? "border-warn/30 bg-warn-soft"
                  : "border-line bg-paper",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[16px] font-bold leading-snug text-ink">{check.title}</h3>
              <Badge
                tone={
                  check.status === "pass" ? "pass" : check.status === "warn" ? "warn" : "fail"
                }
              >
                {check.status === "pass" ? "Pass" : check.status === "warn" ? "Check" : "Fail"}
              </Badge>
            </div>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{check.detail}</p>
            {check.fix && (
              <p className="mt-2.5 border-t border-ink/10 pt-2.5 text-[14px] leading-relaxed text-ink">
                <strong className="font-bold">What to do: </strong>
                {check.fix}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <ButtonLink href="/submit">
          {summary.failed > 0 ? "File anyway" : "File my return"}
        </ButtonLink>
      </div>
      {summary.failed > 0 && (
        <p className="mt-3 text-center text-[14px] leading-relaxed text-danger">
          We will not stop you. But a failing check almost always becomes a notice
          under section 143(1) within a few months.
        </p>
      )}
    </main>
  );
}
