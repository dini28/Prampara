import { staffLogin } from "@/app/admin/actions";
import { isStaff } from "@/lib/staff";
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
      <h1 className="serif text-5xl">Reviewer gate</h1>
      <p className="mt-3 text-sm text-[var(--ink-soft)]">
        Default demo secret is <code>parampara-demo</code> unless PARAMPARA_ADMIN_SECRET is set.
        This is a student CMS, not Strapi.
      </p>
      <form action={staffLogin} className="mt-8 space-y-4">
        <input
          name="secret"
          type="password"
          required
          className="w-full rounded-2xl bg-[var(--paper-2)] px-4 py-3 outline outline-1 outline-[var(--line)]"
          placeholder="Admin secret"
        />
        <button className="btn rounded-full bg-[var(--indigo)] px-5 py-2 text-[var(--paper)]">
          Enter queue
        </button>
      </form>
      {sp.error ? <p className="mt-4 text-sm text-[var(--terracotta)]">Wrong secret.</p> : null}
    </main>
  );
}
