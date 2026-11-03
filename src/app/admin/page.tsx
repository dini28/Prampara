import { staffLogin } from "@/app/admin/actions";
import { UserNeedBanner } from "@/components/UserNeedBanner";
import { isStaff } from "@/lib/staff";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isStaff()) redirect("/admin/queue");
  const sp = await searchParams;
  return (
    <main className="mx-auto max-w-md px-5 py-10">
      <UserNeedBanner ids={["UR-09"]} />
      <p className="mt-6 text-sm font-medium text-[var(--primary)]">Human review gate</p>
      <h1 className="serif mt-2 text-5xl">Reviewer access</h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
        Contributions stay unpublished until a person accepts them. This screen is the project’s
        moderation requirement — a lightweight student CMS, not a public authoring tool.
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
          className="w-full rounded-xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]"
          placeholder="Enter reviewer secret"
        />
        <p className="text-xs text-[var(--muted)]">
          Demo default is documented in the README (<code className="text-[var(--ink)]">parampara-demo</code>
          ). Override with <code className="text-[var(--ink)]">PARAMPARA_ADMIN_SECRET</code> when deployed.
        </p>
        <button className="btn min-h-11 w-full rounded-full bg-[var(--primary)] px-5 text-[var(--on-primary)] hover:bg-[var(--primary-hover)]">
          Enter moderation queue
        </button>
      </form>
      {sp.error ? (
        <p role="alert" className="mt-4 text-sm text-[var(--danger)]">
          Wrong secret. Try again or check the environment secret.
        </p>
      ) : null}
      <p className="mt-8 text-sm text-[var(--ink-soft)]">
        Need a pending item?{" "}
        <Link href="/items/kalbelia/contribute" className="text-[var(--primary)] underline underline-offset-4">
          Queue a contribution from Kalbelia
        </Link>
        .
      </p>
    </main>
  );
}
