import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * POST /api/mock/efile — stands in for the e-filing submission endpoint.
 * Returns an acknowledgement number shaped like the real thing. Nothing is
 * transmitted anywhere; there is no government system on the other side.
 */
const SubmitSchema = z.object({
  pan: z.string().min(1),
  form: z.string().min(1),
  taxpayer: z.string().default("Demo Taxpayer"),
  action: z.enum(["submit", "everify"]).default("submit"),
  otp: z.string().optional(),
});

function ackNumber(pan: string): string {
  let hash = 0;
  for (const ch of pan) hash = (hash * 31 + ch.charCodeAt(0)) % 1_000_000;
  return `IT2026${String(hash).padStart(6, "0")}${String(Date.now() % 1000).padStart(3, "0")}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { pan, form, taxpayer, action, otp } = parsed.data;

  if (action === "everify") {
    // Any 6-digit OTP works. The demo should never dead-end on a typo.
    const valid = /^\d{6}$/.test(otp ?? "");
    return NextResponse.json({
      mocked: true,
      verified: valid,
      message: valid
        ? "Return e-verified using Aadhaar OTP. This is a mock — no OTP was ever sent."
        : "Enter any 6-digit number. This is a mock verification step.",
      verifiedAt: valid ? new Date().toISOString() : null,
    });
  }

  return NextResponse.json({
    mocked: true,
    ackNumber: ackNumber(pan),
    filedAt: new Date().toISOString(),
    form,
    taxpayer,
    pan,
    state: "filed",
    message:
      "Mock submission accepted. In production this would go to the e-filing portal and you would have 30 days to e-verify.",
  });
}
