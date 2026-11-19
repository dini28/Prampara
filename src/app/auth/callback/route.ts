import { NextResponse } from "next/server";

/** Legacy stub , no OAuth. Send learners to Passport. */
export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/passport", request.url));
}
