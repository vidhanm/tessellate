import { NextResponse } from "next/server";
import departmental from "@/app/mock-backend/departmental.json";

/**
 * GET /api/mock/departmental — everything the department would know:
 * CPC rules, the officer queue, sample notices and the processing timeline.
 */
export async function GET(request: Request) {
  const slice = new URL(request.url).searchParams.get("slice");
  if (slice && slice in departmental) {
    return NextResponse.json({
      [slice]: departmental[slice as keyof typeof departmental],
    });
  }
  return NextResponse.json(departmental);
}
