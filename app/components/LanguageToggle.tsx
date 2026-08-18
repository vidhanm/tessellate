"use client";

import { useEffect, useState } from "react";
import { cx } from "@/components/ui";
import { loadSession, saveSession } from "@/lib/session";

/**
 * A stub, and labelled as one. Real Hindi copy is a translation job, not a
 * toggle — but the toggle has to exist from day one or the layout never makes
 * room for Devanagari's taller line height.
 */
export function LanguageToggle() {
  const [lang, setLang] = useState<"en" | "hi">("en");

  useEffect(() => {
    setLang(loadSession().language);
  }, []);

  const choose = (next: "en" | "hi") => {
    setLang(next);
    saveSession({ language: next });
  };

  return (
    <div
      className="inline-flex rounded-full border border-line bg-paper p-1"
      role="group"
      aria-label="Language"
    >
      {(["en", "hi"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => choose(code)}
          aria-pressed={lang === code}
          className={cx(
            "min-h-[36px] rounded-full px-3.5 text-sm font-semibold transition-colors",
            lang === code ? "bg-brand text-white" : "text-ink-soft",
          )}
        >
          {code === "en" ? "English" : "हिंदी"}
        </button>
      ))}
    </div>
  );
}
