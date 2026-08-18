"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/components/ui";

/**
 * The fixed bottom bar. On a phone it is the only navigation, and it doubles as
 * an answer to the question every first-time filer asks: how much is left?
 */
const FLOW = [
  { href: "/start", label: "Start" },
  { href: "/interview", label: "Interview" },
  { href: "/review", label: "Review" },
  { href: "/preflight", label: "Checks" },
  { href: "/submit", label: "Submit" },
  { href: "/track", label: "Track" },
];

export function ProgressBar() {
  const pathname = usePathname();
  const index = FLOW.findIndex((s) => pathname.startsWith(s.href));
  if (index === -1) return null;
  const percent = ((index + 1) / FLOW.length) * 100;

  return (
    <nav
      aria-label="Filing progress"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur"
    >
      <div
        className="h-1 bg-brand transition-[width] duration-300"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={FLOW.length}
      />
      <ol className="mx-auto flex max-w-lg items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
        {FLOW.map((step, i) => (
          <li key={step.href} className="flex-1">
            <Link
              href={step.href}
              aria-current={i === index ? "step" : undefined}
              className={cx(
                "flex min-h-[52px] flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold",
                i === index
                  ? "text-brand"
                  : i < index
                    ? "text-ink-soft"
                    : "text-ink-faint",
              )}
            >
              <span
                className={cx(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-[11px]",
                  i === index
                    ? "border-brand bg-brand text-white"
                    : i < index
                      ? "border-brand/40 bg-brand-soft text-brand"
                      : "border-line bg-surface text-ink-faint",
                )}
              >
                {i < index ? "✓" : i + 1}
              </span>
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
