import { cookies } from "next/headers";

export async function isStaff() {
  const jar = await cookies();
  return jar.get("pp_staff")?.value === "1";
}
