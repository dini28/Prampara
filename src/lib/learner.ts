import { cookies } from "next/headers";

export async function getLearnerName() {
  const jar = await cookies();
  const name = jar.get("pp_learner")?.value?.trim();
  return name || null;
}
