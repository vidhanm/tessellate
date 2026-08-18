import { ButtonLink, Card } from "@/components/ui";
import { LanguageToggle } from "@/components/LanguageToggle";
import Link from "next/link";

export default function Landing() {
  return (
    <main>
      <div className="mb-6 flex justify-end">
        <LanguageToggle />
      </div>

      <h1 className="text-[34px] font-extrabold leading-[1.15] tracking-tight text-ink">
        File your first return in 10 minutes.
        <span className="block text-brand">We explain everything.</span>
      </h1>

      <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
        No jargon, no forms to decode, no assumption that you already know what a
        section 87A rebate is. We ask questions in plain language, tell you why
        each one matters, and pick the right ITR form for you.
      </p>

      <div className="mt-7">
        <ButtonLink href="/start">Start my return</ButtonLink>
      </div>

      <div className="mt-4 grid gap-3">
        <Card tone="brand">
          <h2 className="text-[15px] font-bold text-brand">You will not guess once</h2>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
            Every question shows what the tax department already knows about you,
            so you are confirming rather than recalling.
          </p>
        </Card>
        <Card>
          <h2 className="text-[15px] font-bold text-ink">We check before you file</h2>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
            The same mismatch checks CPC runs after you file, run here first —
            while you can still fix them.
          </p>
        </Card>
        <Card>
          <h2 className="text-[15px] font-bold text-ink">Both regimes, side by side</h2>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
            Old versus new, with the actual rupee difference and the reason for it.
          </p>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
        <Link href="/about" className="font-semibold text-brand underline underline-offset-4">
          What is real and what is mocked
        </Link>
        <Link href="/officer" className="font-semibold text-ink-soft underline underline-offset-4">
          Officer view
        </Link>
      </div>

      <p className="mt-8 text-[13px] leading-relaxed text-ink-faint">
        Prototype for FY 2025-26 (AY 2026-27). Nothing here is filed with the
        Income Tax Department, and none of this is tax advice.
      </p>
    </main>
  );
}
