"use client";

import Link from "next/link";
import { Card } from "@/components/ui";

/** Every page downstream of /start needs the same graceful dead-end. */
export function EmptySession({ what }: { what: string }) {
  return (
    <Card tone="warn">
      <h1 className="text-[18px] font-bold text-ink">Nothing to show yet</h1>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
        {what} needs a taxpayer and a set of answers first.
      </p>
      <Link
        href="/start"
        className="mt-4 inline-flex min-h-[48px] items-center font-semibold text-brand underline underline-offset-4"
      >
        Pick a taxpayer to begin
      </Link>
    </Card>
  );
}
