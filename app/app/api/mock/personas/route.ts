import { NextResponse } from "next/server";
import personas from "@/app/mock-backend/personas.json";
import { PersonaSchema } from "@/lib/schemas";

/** GET /api/mock/personas — the demo taxpayers, validated on the way out. */
export async function GET() {
  const parsed = personas.personas.map((p) => PersonaSchema.safeParse(p));
  const ok = parsed.flatMap((r) => (r.success ? [r.data] : []));
  const bad = parsed.flatMap((r, i) =>
    r.success ? [] : [{ index: i, error: r.error.issues[0]?.message }],
  );
  return NextResponse.json({ personas: ok, invalid: bad });
}
