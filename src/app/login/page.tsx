import { clearLearner, saveLearner } from "@/app/login/actions";
import { getLearnerName } from "@/lib/learner";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const learner = await getLearnerName();
  const sp = await searchParams;
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="serif text-5xl">Local learner</h1>
      <p className="mt-3 max-w-xl text-[var(--muted)]">
        Supabase Auth is not wired yet. This name is stored in a cookie on this device and labels
        quiz scores and contribution queue rows. Cards, Ask, quizzes, and bookmarks already work
        without an account.
      </p>
      <form action={saveLearner} className="mt-8 max-w-md space-y-4">
        <label className="block text-sm">
          Display name
          <input
            name="name"
            required
            minLength={2}
            defaultValue={learner ?? ""}
            className="mt-1 w-full rounded-2xl bg-[var(--surface)] px-4 py-3 outline outline-1 outline-[var(--line)]"
            placeholder="e.g. Demo team"
          />
        </label>
        <button className="btn rounded-full bg-[var(--primary)] px-5 py-2 text-[var(--on-primary)]" type="submit">
          Save on this device
        </button>
      </form>
      {learner ? (
        <form action={clearLearner} className="mt-4">
          <button className="text-sm underline" type="submit">
            Clear local name
          </button>
        </form>
      ) : null}
      {sp.error ? <p className="mt-4 text-sm text-[var(--primary)]">Use at least two characters.</p> : null}
    </main>
  );
}
