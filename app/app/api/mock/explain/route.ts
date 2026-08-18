import { NextResponse } from "next/server";
import { z } from "zod";
import { explain } from "@/lib/llm";

/** POST /api/mock/explain — the single door to the LLM adapter. */
const RequestSchema = z.object({
  task: z
    .enum(["explain_term", "explain_notice", "summarise_return", "answer_question"])
    .default("answer_question"),
  input: z.string().min(1).max(4000),
  context: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const result = await explain(parsed.data.task, parsed.data.input, parsed.data.context);
  return NextResponse.json(result);
}
