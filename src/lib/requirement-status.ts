import { getItems } from "@/lib/catalogue";
import { USER_REQUIREMENTS, type UserRequirement } from "@/lib/project";
import { listAsks, listContributions, listQuizzes } from "@/lib/runtime-store";

export type RequirementStatus = {
  requirement: UserRequirement;
  state: "met" | "partial" | "ready" | "unmet";
  detail: string;
};

/**
 * Analyse user requirements against live runtime evidence where possible.
 * Catalogue / manual items stay "ready" (verifiable by demo, not auto-logged).
 */
export function analyseUserRequirements(learner?: string | null): RequirementStatus[] {
  const asks = listAsks();
  const contrib = listContributions();
  const quizzes = listQuizzes(learner ?? undefined);
  const hasCards = getItems().length > 0;
  const grounded = asks.some((a) => !a.refused);
  const refused = asks.some((a) => a.refused);
  const pending = contrib.some((c) => c.status === "pending");
  const reviewed = contrib.some((c) => c.status === "accepted" || c.status === "rejected");
  const quizDone = quizzes.length > 0;

  return USER_REQUIREMENTS.map((requirement) => {
    switch (requirement.signal) {
      case "catalogue":
        return {
          requirement,
          state: hasCards ? ("ready" as const) : ("unmet" as const),
          detail: hasCards
            ? `${getItems().length} published cards available to verify in UI`
            : "No published cards in catalogue",
        };
      case "ask_grounded":
        return {
          requirement,
          state: grounded ? ("met" as const) : ("unmet" as const),
          detail: grounded
            ? "Ask log contains at least one grounded answer"
            : "Run Ask with a question the card covers",
        };
      case "ask_refused":
        return {
          requirement,
          state: refused ? ("met" as const) : ("unmet" as const),
          detail: refused
            ? "Ask log contains at least one refused answer"
            : "Run a refuse probe (e.g. exact visarjan minute)",
        };
      case "quiz":
        return {
          requirement,
          state: quizDone ? ("met" as const) : ("unmet" as const),
          detail: quizDone
            ? `${quizzes.length} quiz score(s) for ${learner ?? "learners"}`
            : "Complete a card quiz (set a local name to label scores)",
        };
      case "contrib_pending":
        return {
          requirement,
          state: pending || reviewed ? ("met" as const) : ("unmet" as const),
          detail: pending
            ? "Pending contribution in moderation queue"
            : reviewed
              ? "Contribution was submitted and already reviewed"
              : "Queue a contribution from a card",
        };
      case "contrib_reviewed":
        return {
          requirement,
          state: reviewed ? ("met" as const) : pending ? ("partial" as const) : ("unmet" as const),
          detail: reviewed
            ? "At least one contribution accepted or rejected"
            : pending
              ? "Pending item waiting in Admin — accept or reject to close UR-09"
              : "Submit then review a contribution in Admin",
        };
      case "manual":
      default:
        return {
          requirement,
          state: "ready" as const,
          detail: "Verify by walking the linked screen during demo",
        };
    }
  });
}

export function summariseRequirementAnalysis(rows: RequirementStatus[]) {
  const met = rows.filter((r) => r.state === "met").length;
  const partial = rows.filter((r) => r.state === "partial").length;
  const ready = rows.filter((r) => r.state === "ready").length;
  const unmet = rows.filter((r) => r.state === "unmet").length;
  return { met, partial, ready, unmet, total: rows.length };
}
