import { clearLearner } from "@/app/login/actions";
import { getLearnerName } from "@/lib/learner";
import { getItemBySlug } from "@/lib/catalogue";
import { listQuizzes } from "@/lib/runtime-store";
import Link from "next/link";

export default async function MePage() {
  const learner = await getLearnerName();
  const scores = listQuizzes(learner ?? "guest");
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="serif text-5xl">Your path</h1>
      {learner ? (
        <p className="mt-4">
          Local name: <strong>{learner}</strong>. Quiz scores live in{" "}
          <code>data/runtime-queue.json</code> until Supabase is added.
        </p>
      ) : (
        <p className="mt-4 text-[var(--muted)]">
          You are browsing as guest.{" "}
          <Link href="/login" className="underline">
            Set a local name
          </Link>{" "}
          to label progress.
        </p>
      )}
      {learner ? (
        <form action={clearLearner} className="mt-3">
          <button className="text-sm underline" type="submit">
            Clear name
          </button>
        </form>
      ) : null}
      <ol className="mt-8 space-y-3 text-lg">
        <li>1. Open the Jaipur / Rajasthan node → Kalbelia</li>
        <li>2. Read the card and sources</li>
        <li>3. Ask, including one refuse probe</li>
        <li>4. Take the quiz</li>
        <li>5. Queue a pending contribution</li>
      </ol>
      <section className="mt-10">
        <h2 className="serif text-2xl">Quiz scores</h2>
        {scores.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">No scores yet on this device.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {scores.map((s) => (
              <li key={s.id} className="rounded-2xl bg-[var(--surface)] px-4 py-3">
                {getItemBySlug(s.itemSlug)?.title ?? s.itemSlug}: {s.score}/{s.total}
              </li>
            ))}
          </ul>
        )}
      </section>
      <Link
        href="/items/kalbelia"
        className="btn mt-8 inline-block rounded-full bg-[var(--primary)] px-5 py-2 text-[var(--on-primary)]"
      >
        Start demo loop
      </Link>
    </main>
  );
}
