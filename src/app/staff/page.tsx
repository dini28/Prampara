import { staffLogin } from "@/app/staff/actions";
import { getAdminBasePath } from "@/lib/admin-config";
import { isStaff } from "@/lib/staff";
import { redirect } from "next/navigation";

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isStaff()) redirect(`${getAdminBasePath()}/queue`);
  const sp = await searchParams;

  let errorMsg: string | null = null;
  if (sp.error === "1") errorMsg = "Wrong secret. Try again.";
  if (sp.error === "rate") errorMsg = "Too many attempts. Wait a minute and try again.";
  if (sp.error === "csrf") errorMsg = "Security check failed. Reload and try again.";

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-5 py-10">
      <p className="text-sm font-medium text-[var(--primary)]">Human review gate</p>
      <h1 className="serif mt-2 text-4xl sm:text-5xl">Reviewer access</h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
        Contributions stay unpublished until a person accepts them. This desk is not linked from
        the public site.
      </p>
      <form action={staffLogin} className="mt-8 space-y-4">
        <label className="block text-sm font-medium text-[var(--ink)]" htmlFor="secret">
          Admin secret
        </label>
        <input
          id="secret"
          name="secret"
          type="password"
          required
          autoComplete="current-password"
          className="min-h-12 w-full rounded-xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]"
          placeholder="Enter reviewer secret"
        />
        <button className="btn min-h-12 w-full touch-manipulation rounded-full bg-[var(--primary)] px-5 text-[var(--on-primary)] hover:bg-[var(--primary-hover)] select-none">
          Enter moderation queue
        </button>
      </form>
      {errorMsg ? (
        <p role="alert" className="mt-4 text-sm text-[var(--danger)]">
          {errorMsg}
        </p>
      ) : null}
    </main>
  );
}
