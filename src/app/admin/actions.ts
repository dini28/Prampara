"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { moderateContribution } from "@/lib/runtime-store";
import { isStaff } from "@/lib/staff";

export async function staffLogin(formData: FormData) {
  const secret = String(formData.get("secret") ?? "");
  const expected = process.env.PARAMPARA_ADMIN_SECRET ?? "parampara-demo";
  if (secret !== expected) {
    redirect("/admin?error=1");
  }
  const jar = await cookies();
  jar.set("pp_staff", "1", { httpOnly: true, sameSite: "lax", path: "/" });
  redirect("/admin/queue");
}

export async function staffLogout() {
  const jar = await cookies();
  jar.delete("pp_staff");
  redirect("/admin");
}

export async function reviewContribution(formData: FormData) {
  if (!(await isStaff())) redirect("/admin");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "accepted" | "rejected";
  if (id && (status === "accepted" || status === "rejected")) {
    moderateContribution(id, status);
  }
  redirect("/admin/queue");
}
