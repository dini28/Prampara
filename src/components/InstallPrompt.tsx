"use client";

import { useEffect, useState } from "react";
import { haptic } from "@/lib/haptics";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pp_a2hs_dismiss";
const VIEWS_KEY = "pp_a2hs_views";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const views = Number(localStorage.getItem(VIEWS_KEY) || "0") + 1;
    localStorage.setItem(VIEWS_KEY, String(views));

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    // Sensible moment: not first load — after 3 navigations or 45s engagement
    const ready = views >= 3;
    const timer = window.setTimeout(() => {
      if (ready || views >= 2) setShow(true);
    }, ready ? 800 : 45_000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.clearTimeout(timer);
    };
  }, []);

  if (!show || !deferred) return null;

  return (
    <div
      className="fixed inset-x-3 z-[60] rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4 shadow-[var(--shadow)] md:hidden"
      style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
      role="dialog"
      aria-label="Install Parampara Path"
    >
      <p className="serif text-lg text-[var(--ink)]">Add to Home Screen</p>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        Open instantly, even offline — like a native app on your phone.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="btn min-h-11 flex-1 touch-manipulation select-none rounded-full bg-[var(--primary)] text-sm text-[var(--on-primary)]"
          onClick={async () => {
            haptic(12);
            await deferred.prompt();
            setShow(false);
            setDeferred(null);
          }}
        >
          Install
        </button>
        <button
          type="button"
          className="btn min-h-11 flex-1 touch-manipulation select-none rounded-full border border-[var(--line-strong)] text-sm"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setShow(false);
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
