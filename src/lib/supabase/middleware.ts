import { NextResponse, type NextRequest } from "next/server";

/** Session refresh will return here when Supabase Auth is added. */
export async function updateSession(request: NextRequest) {
  return NextResponse.next({ request });
}
