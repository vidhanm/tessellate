import Link from "next/link";
import { Badge, Card, PageHeader } from "@/components/ui";

/**
 * The honesty page. A tax prototype that blurs the line between what it computes
 * and what it pretends to compute is worse than no prototype at all.
 */
type Row = { area: string; status: "real" | "mocked" | "partial"; detail: string };

const ROWS: Row[] = [
  {
    area: "Tax computation (both regimes)",
    status: "real",
    detail:
      "FY 2025-26 slabs, ₹75,000 / ₹50,000 standard deduction, section 87A rebate with marginal relief, 80C/80D/80TTA caps, 4% cess, STCG at 20% and LTCG at 12.5% above ₹1.25 lakh. Unit tested.",
  },
  {
    area: "ITR form selection",
    status: "real",
    detail:
      "Rules for ITR-1 through ITR-4 from income sources, with the reasons and the forms ruled out. Covers the common disqualifiers: capital gains, second property, agricultural income above ₹5,000, foreign assets, directorship, unlisted shares.",
  },
  {
    area: "Pre-filing mismatch checks",
    status: "real",
    detail:
      "The reconciliation logic runs for real against the AIS data in the session — salary vs Form 24Q, interest vs SFT-016, TDS vs 26AS, share sales vs the chosen form.",
  },
  {
    area: "Form 16 upload",
    status: "mocked",
    detail:
      "The file picker accepts a PDF and then maps to a demo persona. No parsing, no OCR.",
  },
  {
    area: "AIS / Form 26AS import",
    status: "mocked",
    detail:
      "Served from app/mock-backend/personas.json. There is no connection to the income-tax portal and no scraping.",
  },
  {
    area: "Broker trade import",
    status: "mocked",
    detail:
      "Static trade lists per persona. No broker API, no contract-note parsing, no FIFO cost-basis engine.",
  },
  {
    area: "E-filing submission",
    status: "mocked",
    detail:
      "POST /api/mock/efile returns a realistic-looking acknowledgement number generated locally. Nothing is transmitted to any government system.",
  },
  {
    area: "Aadhaar OTP e-verification",
    status: "mocked",
    detail: "No OTP is sent anywhere. Any six digits are accepted.",
  },
  {
    area: "CPC processing and officer queue",
    status: "mocked",
    detail:
      "The queue, risk scores and case states are fixtures in app/mock-backend/departmental.json.",
  },
  {
    area: "Notice explanation",
    status: "partial",
    detail:
      "Goes through the real LLM adapter (lib/llm.ts) with structured outputs. With MOCK_LLM=1 it returns canned JSON so the app runs without an API key; with OPENAI_API_KEY set it calls the model for real.",
  },
  {
    area: "ITR JSON download",
    status: "partial",
    detail:
      "Contains the genuine computation output, but not the department's official JSON schema. No portal would accept it.",
  },
  {
    area: "Hindi translation",
    status: "mocked",
    detail: "The toggle stores a preference. No strings are translated yet.",
  },
  {
    area: "Saving your data",
    status: "real",
    detail:
      "There is no database and no server-side storage. Your session lives in your own browser's localStorage and nowhere else.",
  },
];

const TONES = {
  real: { tone: "pass" as const, label: "Real" },
  mocked: { tone: "fail" as const, label: "Mocked" },
  partial: { tone: "warn" as const, label: "Partial" },
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Honesty"
        title="What is real and what is not"
        subtitle="This is a hackathon prototype. Here is exactly where the line falls."
      />

      <Card tone="warn" className="mb-5">
        <p className="text-[15px] font-semibold leading-relaxed text-ink">
          Nothing in this app is filed with the Income Tax Department, and none of
          it is tax advice. Do not use the figures here to make a decision about a
          real return.
        </p>
      </Card>

      <ul className="grid gap-3">
        {ROWS.map((row) => {
          const t = TONES[row.status];
          return (
            <li key={row.area} className="rounded-2xl border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[16px] font-bold leading-snug text-ink">{row.area}</h2>
                <Badge tone={t.tone}>{t.label}</Badge>
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{row.detail}</p>
            </li>
          );
        })}
      </ul>

      <Card className="mt-5">
        <h2 className="text-[16px] font-bold text-ink">Known simplifications in the maths</h2>
        <ul className="mt-2 space-y-1.5 text-[14px] leading-relaxed text-ink-soft">
          <li>Resident individuals below 60 only — no senior-citizen slabs.</li>
          <li>Surcharge bands are applied flat, with no marginal relief at the edges.</li>
          <li>No relief under section 89, no set-off of brought-forward losses.</li>
          <li>No 80CCD(1B), 80G, 80E or the long tail of Chapter VI-A.</li>
          <li>Interest under sections 234A, 234B and 234C is not computed.</li>
        </ul>
      </Card>

      <p className="mt-6 text-[15px]">
        <Link href="/" className="font-semibold text-brand underline underline-offset-4">
          Back to the start
        </Link>
      </p>
    </main>
  );
}
