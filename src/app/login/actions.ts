"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function saveLearner(formData: FormData) {
  const name = String(formData.get("name") ?? "")
    .trim()
    .slice(0, 40);
  if (name.length < 2) {
    redirect("/login?error=1");
  }
  const jar = await cookies();
  jar.set("pp_learner", name, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  redirect("/me");
}

export async function clearLearner() {
  const jar = await cookies();
  jar.delete("pp_learner");
  redirect("/login");
}
