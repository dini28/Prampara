"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type LookResult = {
  unsure?: boolean;
  message?: string;
  confidence?: "High" | "Medium" | "Low";
  locationUsed?: boolean;
  locationNote?: string;
  consentNote?: string;
  askConfirm?: boolean;
  match?: {
    slug: string;
    name: string;
    type: string;
    symbolises: string;
    community_context: string;
    sentiment: string;
    sensitivity_flag?: boolean;
    sources: { title: string; url: string; publisher: string | null; accessed_on: string }[];
    related_place_slugs: string[];
    related_card_slugs: string[];
  };
  alternatives?: { slug: string; name: string; type: string; confidence?: string }[];
  learnMore?: string;
};

const MAX_EDGE = 1280;
const MAX_BYTES = 1_000_000;

async function resizeToJpeg(file: File): Promise<{ blob: Blob; bytes: number; dataUrl: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Encode failed"))),
      "image/jpeg",
      0.82,
    );
  });
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  return { blob, bytes: blob.size, dataUrl };
}

export function PhotoUnderstand({
  destinationSlug,
  compact = false,
}: {
  destinationSlug?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hint, setHint] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveJournal, setSaveJournal] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  async function onFile(file: File | null) {
    if (!file) return;
    setError(null);
    setResult(null);
    setFeedbackSent(false);
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      setError("Please use JPG, PNG, or WebP.");
      return;
    }
    try {
      const resized = await resizeToJpeg(file);
      if (resized.bytes > MAX_BYTES) {
        setError("Image is still too large after resize. Try a simpler photo.");
        return;
      }
      setPreview(resized.dataUrl);
      setLoading(true);
      const res = await fetch("/api/look", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hint: hint || undefined,
          destinationSlug,
          hasImage: true,
          imageBytesApprox: resized.bytes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not analyse this photo.");
      } else {
        setResult(data);
        if (saveJournal && typeof window !== "undefined") {
          const key = "pp_photo_journal";
          const prev = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown[];
          prev.unshift({
            at: new Date().toISOString(),
            hint,
            destinationSlug,
            matchSlug: data.match?.slug ?? null,
            note: "Image bytes not stored; metadata only by opt-in.",
          });
          window.localStorage.setItem(key, JSON.stringify(prev.slice(0, 30)));
        }
      }
    } catch {
      setError("Could not process this image on your device.");
    } finally {
      setLoading(false);
    }
  }

  async function sendFeedback(feedback: "yes" | "no" | "not_sure") {
    if (!result?.match?.slug) return;
    await fetch("/api/look", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feedback,
        meaningSlug: result.match.slug,
        destinationSlug,
      }),
    });
    setFeedbackSent(true);
  }

  async function confirmHint(altName: string) {
    setHint(altName);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/look", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hint: altName,
          destinationSlug,
          hasImage: Boolean(preview),
          imageBytesApprox: preview ? 100_000 : 0,
        }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={`rounded-2xl bg-[var(--bg)] p-5 shadow-[var(--shadow)] outline outline-1 outline-[var(--line)] ${
        compact ? "" : ""
      }`}
      aria-labelledby="look-heading"
    >
      <h2 id="look-heading" className="serif text-2xl">
        What am I looking at?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        Upload a photo of a motif, craft, or monument. Explanations come only from cited meanings and
        cards. Your photo is used only to explain this object, EXIF and GPS are stripped by resize, and
        the image is not stored by default. We never identify people.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn inline-flex min-h-12 items-center rounded-full bg-[var(--terracotta)] px-5 text-sm text-white hover:opacity-95"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.accept = "image/*";
              inputRef.current.capture = "environment";
              inputRef.current.click();
            }
          }}
        >
          Camera
        </button>
        <button
          type="button"
          className="btn inline-flex min-h-12 items-center rounded-full border border-[var(--line-strong)] px-5 text-sm hover:border-[var(--primary)]"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.removeAttribute("capture");
              inputRef.current.accept = "image/jpeg,image/png,image/webp";
              inputRef.current.click();
            }
          }}
        >
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <label className="mt-4 block text-sm font-medium" htmlFor="look-hint">
        Optional: type what you think it is
      </label>
      <input
        id="look-hint"
        value={hint}
        onChange={(e) => setHint(e.target.value)}
        placeholder="e.g. jali screen, peacock mosaic, Kalbelia dress"
        className="mt-2 w-full min-h-12 rounded-xl bg-[var(--surface)] px-4 outline outline-1 outline-[var(--line)]"
      />
      <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-[var(--ink-soft)]">
        <input
          type="checkbox"
          checked={saveJournal}
          onChange={(e) => setSaveJournal(e.target.checked)}
        />
        Save match note to my journal on this device (opt in; photo still not stored)
      </label>

      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Your upload preview (processed locally)"
          className="mt-4 max-h-48 rounded-xl object-contain"
        />
      ) : null}

      {loading ? <p className="mt-3 text-sm text-[var(--muted)]">Matching to cited meanings…</p> : null}
      {error ? (
        <p className="mt-3 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-5 space-y-3 rounded-xl bg-[var(--surface)] p-4 outline outline-1 outline-[var(--line)]">
          <p className="text-xs text-[var(--muted)]">{result.consentNote}</p>
          <p className="text-xs text-[var(--ink-soft)]">{result.locationNote}</p>

          {result.unsure && !result.match ? (
            <p className="text-sm font-medium text-[var(--ink)]">{result.message}</p>
          ) : null}

          {result.match ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                {result.confidence ?? "Medium"} confidence · {result.match.type}
              </p>
              <h3 className="serif text-xl">{result.match.name}</h3>
              {result.match.sensitivity_flag ? (
                <p className="rounded-lg border border-[var(--line-strong)] px-3 py-2 text-sm">
                  Handle with care: public summary only. Do not invent ritual rules.
                </p>
              ) : null}
              <p className="text-sm leading-relaxed">
                <strong>Meaning:</strong> {result.match.symbolises}
              </p>
              <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                <strong>Local context:</strong> {result.match.community_context}
              </p>
              <p className="text-sm text-[var(--ink-soft)]">
                <strong>Sentiment:</strong> {result.match.sentiment}
              </p>
              <ul className="space-y-1 text-xs">
                {result.match.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--primary)] underline"
                    >
                      {s.title}
                    </a>
                    {s.publisher ? ` · ${s.publisher}` : ""} · accessed {s.accessed_on}
                  </li>
                ))}
              </ul>
              {result.learnMore ? (
                <Link
                  href={result.learnMore}
                  className="btn mt-2 inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm text-[var(--on-primary)]"
                >
                  Learn more in the loop
                </Link>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-sm text-[var(--muted)]">Is this right?</span>
                {(["yes", "no", "not_sure"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    disabled={feedbackSent}
                    onClick={() => sendFeedback(f)}
                    className="min-h-10 rounded-full border border-[var(--line-strong)] px-3 text-xs hover:border-[var(--primary)] disabled:opacity-60"
                  >
                    {f === "yes" ? "Yes" : f === "no" ? "No" : "Not sure"}
                  </button>
                ))}
                {feedbackSent ? (
                  <span className="text-xs text-[var(--verified)]">Thanks. Feedback stored, not the photo.</span>
                ) : null}
              </div>
            </>
          ) : null}

          {result.alternatives && result.alternatives.length > 0 ? (
            <div>
              <p className="text-sm font-medium">Alternatives / confirm one</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.alternatives.map((a) => (
                  <button
                    key={a.slug}
                    type="button"
                    className="min-h-10 rounded-full bg-[var(--primary-tint)] px-3 text-xs text-[var(--primary-deep)]"
                    onClick={() => confirmHint(a.name)}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
