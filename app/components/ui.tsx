/**
 * Hand-written shadcn-flavoured primitives. Deliberately small: on a slow
 * connection every kilobyte of component library is a kilobyte of nothing.
 */
import Link from "next/link";
import type { ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function Card({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "brand" | "warn" | "danger";
}) {
  const tones = {
    default: "bg-paper border-line",
    brand: "bg-brand-soft border-brand/25",
    warn: "bg-warn-soft border-warn/25",
    danger: "bg-danger-soft border-danger/25",
  } as const;
  return (
    <div className={cx("rounded-2xl border p-5", tones[tone], className)}>
      {children}
    </div>
  );
}

const buttonBase =
  "inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl px-5 text-[17px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-40";

const buttonVariants = {
  primary: "bg-brand text-white hover:bg-brand/90 active:bg-brand/80",
  secondary: "bg-paper text-ink border border-line hover:bg-surface",
  ghost: "text-brand hover:bg-brand-soft",
} as const;

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: keyof typeof buttonVariants;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(buttonBase, buttonVariants[variant], className)}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof buttonVariants;
  className?: string;
}) {
  return (
    <Link href={href} className={cx(buttonBase, buttonVariants[variant], className)}>
      {children}
    </Link>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "pass" | "warn" | "fail" | "brand";
}) {
  const tones = {
    neutral: "bg-surface text-ink-soft border-line",
    brand: "bg-brand-soft text-brand border-brand/25",
    pass: "bg-pass-soft text-pass border-pass/25",
    warn: "bg-warn-soft text-warn border-warn/30",
    fail: "bg-danger-soft text-danger border-danger/25",
  } as const;
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** The "Why are we asking?" expander — the teaching surface of the whole app. */
export function Why({ children, label = "Why are we asking?" }: { children: ReactNode; label?: string }) {
  return (
    <details className="group rounded-xl border border-line bg-surface/60">
      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between px-4 py-3 text-[15px] font-semibold text-brand">
        {label}
        <span className="text-ink-faint transition-transform group-open:rotate-45" aria-hidden>
          +
        </span>
      </summary>
      <div className="border-t border-line px-4 py-3 text-[15px] leading-relaxed text-ink-soft">
        {children}
      </div>
    </details>
  );
}

export function StatusDot({ status }: { status: "pass" | "warn" | "fail" }) {
  const map = {
    pass: { bg: "bg-pass", label: "Pass" },
    warn: { bg: "bg-warn", label: "Check" },
    fail: { bg: "bg-danger", label: "Fail" },
  } as const;
  return (
    <span className="flex items-center gap-2">
      <span className={cx("h-2.5 w-2.5 shrink-0 rounded-full", map[status].bg)} aria-hidden />
      <span className="sr-only">{map[status].label}</span>
    </span>
  );
}

export function Row({
  label,
  value,
  strong,
  hint,
}: {
  label: string;
  value: string;
  strong?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className={cx("text-[15px]", strong ? "font-semibold text-ink" : "text-ink-soft")}>
        {label}
        {hint && <span className="block text-xs text-ink-faint">{hint}</span>}
      </span>
      <span
        className={cx(
          "shrink-0 tabular-nums",
          strong ? "text-[17px] font-bold text-ink" : "text-[15px] text-ink",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-5">
      {eyebrow && (
        <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-brand">
          {eyebrow}
        </p>
      )}
      <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-ink">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{subtitle}</p>}
    </header>
  );
}
