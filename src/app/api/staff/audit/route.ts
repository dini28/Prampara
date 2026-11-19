import { NextResponse } from "next/server";
import { listAudit } from "@/lib/runtime-store";
import { isStaff } from "@/lib/staff";

/** Staff-only audit feed. Middleware also gates /api/staff/*. */
export async function GET() {
  if (!(await isStaff())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ audit: listAudit(100) });
}
