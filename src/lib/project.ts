/** Jury-facing product spine: users, requirements, loop, and verification. */

export const LEARNER_LOOP = [
  {
    id: "discover",
    step: 1,
    title: "Discover",
    short: "Place or theme",
    body: "Open a region or filter by practice type — not a national encyclopedia dump.",
    href: "/explore",
    needIds: ["UR-01", "UR-02"],
  },
  {
    id: "card",
    step: 2,
    title: "Read card",
    short: "Cited sources",
    body: "Each card shows source count, check dates, and links to official or scholarly pages.",
    href: "/items/kalbelia",
    needIds: ["UR-03", "UR-08"],
  },
  {
    id: "ask",
    step: 3,
    title: "Ask",
    short: "Ground or refuse",
    body: "Q&A retrieves only from the card. Unsupported questions are refused — no invention.",
    href: "/items/kalbelia/ask",
    needIds: ["UR-04", "UR-05"],
  },
  {
    id: "quiz",
    step: 4,
    title: "Quiz",
    short: "Check recall",
    body: "A short quiz written from the same card closes the eight-minute learning pass.",
    href: "/items/kalbelia/quiz",
    needIds: ["UR-06"],
  },
  {
    id: "contribute",
    step: 5,
    title: "Contribute",
    short: "Human review",
    body: "Learner notes stay unpublished until a reviewer accepts them in the moderation queue.",
    href: "/items/kalbelia/contribute",
    needIds: ["UR-07", "UR-09"],
  },
] as const;

export type LoopStepId = (typeof LEARNER_LOOP)[number]["id"];

export const PERSONAS = [
  {
    id: "student",
    role: "Primary user",
    title: "College student (18–24)",
    context: "Laptop or mid-range Android Chrome; short study or assignment break.",
    goals: [
      "Find a practice by place or theme in under two minutes",
      "Trust what they read via sources and check dates",
      "Ask a question without getting invented ritual detail",
      "Prove they learned something with a short quiz",
    ],
    pains: [
      "National portals feel like archives, not a learner loop",
      "Chatbots invent dates, prices, or sacred detail",
      "No safe place to leave a local note without publishing noise",
    ],
  },
  {
    id: "traveller",
    role: "Secondary user",
    title: "Curious traveller",
    context: "Same responsive web app; planning or reflecting on a place visit.",
    goals: [
      "Open a region and skim cited cards",
      "Bookmark a practice for later",
      "Ask only what the card can support",
    ],
    pains: [
      "Tourist blogs mix ads and unverified claims",
      "Need a calm, English UI without exoticising ornament",
    ],
  },
  {
    id: "reviewer",
    role: "Staff user",
    title: "Human reviewer",
    context: "Team member moderating the contribution queue during demo or ops.",
    goals: [
      "See pending notes beside card context",
      "Accept or reject before anything is public",
      "Inspect Ask grounded vs refused log",
    ],
    pains: [
      "User-generated culture content must not go live unreviewed",
    ],
  },
] as const;

export type UserRequirement = {
  id: string;
  priority: "Must" | "Should";
  user: "Student" | "Traveller" | "Reviewer" | "All learners";
  need: string;
  analysis: string;
  acceptance: string;
  href: string;
  /** Runtime signal used on Path analysis, if any. */
  signal:
    | "catalogue"
    | "ask_grounded"
    | "ask_refused"
    | "quiz"
    | "contrib_pending"
    | "contrib_reviewed"
    | "manual";
};

export const USER_REQUIREMENTS: UserRequirement[] = [
  {
    id: "UR-01",
    priority: "Must",
    user: "Student",
    need: "Discover heritage by place or theme quickly",
    analysis:
      "Primary users start from a region or practice type, not from a national catalogue dump. Explore and region pages are the entry.",
    acceptance: "Filter or open a region and reach a published card in one or two taps.",
    href: "/explore",
    signal: "catalogue",
  },
  {
    id: "UR-02",
    priority: "Must",
    user: "All learners",
    need: "Complete an eight-minute guided loop",
    analysis:
      "The product owns a short journey: discover → card → ask → quiz → contribute. Screens must not scatter into encyclopedia browsing alone.",
    acceptance: "Loop stepper is visible on primary screens; Path checklist can be walked end-to-end.",
    href: "/me",
    signal: "manual",
  },
  {
    id: "UR-03",
    priority: "Must",
    user: "All learners",
    need: "Read source-attributed cards with check dates",
    analysis:
      "Trust is a user requirement: students must see how many sources and when they were checked before they Ask or Quiz.",
    acceptance: "Card shows “N sources · checked <date>” and a linked source list.",
    href: "/items/kalbelia",
    signal: "catalogue",
  },
  {
    id: "UR-04",
    priority: "Must",
    user: "Student",
    need: "Ask questions answered only from the card",
    analysis:
      "AI must behave as retrieval, not as an author of culture. Grounded answers cite retrieved card material.",
    acceptance: "Ask returns “Answered from the cards” with source links when the card covers the question.",
    href: "/items/kalbelia/ask",
    signal: "ask_grounded",
  },
  {
    id: "UR-05",
    priority: "Must",
    user: "Student",
    need: "Receive a clear refusal when cards do not cover the question",
    analysis:
      "Users need protection from invented ritual times, prices, or medical claims. Refusal is a feature, not an error.",
    acceptance: "Refuse probe (e.g. exact visarjan minute) returns “Not covered by the cards”.",
    href: "/items/kalbelia/ask",
    signal: "ask_refused",
  },
  {
    id: "UR-06",
    priority: "Must",
    user: "Student",
    need: "Check learning with a short card-based quiz",
    analysis:
      "Assessment closes the learner loop for coursework-style use without leaving the product.",
    acceptance: "Quiz completes with a score shown on Path for the local learner name.",
    href: "/items/kalbelia/quiz",
    signal: "quiz",
  },
  {
    id: "UR-07",
    priority: "Must",
    user: "Student",
    need: "Submit a local note that stays unpublished until review",
    analysis:
      "Contribution satisfies community input without polluting the cited catalogue.",
    acceptance: "Submit creates a pending item visible only in the moderation queue.",
    href: "/items/kalbelia/contribute",
    signal: "contrib_pending",
  },
  {
    id: "UR-08",
    priority: "Should",
    user: "Traveller",
    need: "Bookmark cards for a later pass",
    analysis:
      "Secondary users return to a short list rather than re-filtering Explore.",
    acceptance: "Bookmark toggles on a card and appears under Bookmarks on this device.",
    href: "/bookmarks",
    signal: "manual",
  },
  {
    id: "UR-09",
    priority: "Must",
    user: "Reviewer",
    need: "Accept or reject contributions with card context",
    analysis:
      "Human review is a hard user requirement for staff; nothing user-written is public by default.",
    acceptance: "Admin queue shows side-by-side context and can accept or reject.",
    href: "/admin",
    signal: "contrib_reviewed",
  },
  {
    id: "UR-10",
    priority: "Must",
    user: "All learners",
    need: "Understand the tool is unofficial and points to official pages",
    analysis:
      "Positioning is a user trust requirement: learners must not confuse this MVP with the national archive.",
    acceptance: "Disclaimer appears on Home; footer and About restate non-affiliation.",
    href: "/about#positioning",
    signal: "manual",
  },
  {
    id: "UR-11",
    priority: "Should",
    user: "All learners",
    need: "Use an accessible English UI without sacred autoplay",
    analysis:
      "WCAG 2.2 AA intent, 44px targets, focus rings, reduced-motion respect; no autoplay of sacred sound.",
    acceptance: "Keyboard focus is visible; no autoplaying audio on cards.",
    href: "/about#users",
    signal: "manual",
  },
  {
    id: "UR-12",
    priority: "Should",
    user: "All learners",
    need: "See sensitivity handling for restricted practices",
    analysis:
      "Ethics requirement: flag “Handle with care”, omit closed practices, contribution guidelines block sacred instructions.",
    acceptance: "Sensitivity flag or contribute guidelines visible on relevant cards.",
    href: "/about#ethics",
    signal: "manual",
  },
];

export const PROJECT_AIMS = [
  {
    title: "Close the last-mile learner gap",
    body: "Official portals archive culture; students still need a short, guided pass from place → understanding → check → optional note.",
  },
  {
    title: "Keep AI as a retrieval interface",
    body: "Ask never authors culture. It answers only from retrieved card text and cited sources, or it refuses.",
  },
  {
    title: "Make trust inspectable",
    body: "Source counts, access dates, grounded vs not-covered labels, and a human review gate are visible in the product — not claimed in marketing copy alone.",
  },
  {
    title: "Stay in honest scope",
    body: "Unofficial student MVP. Forty curated cards. English UI. No AR/VR, social feed, or wholesale scrape of national archives.",
  },
] as const;

/** @deprecated Prefer USER_REQUIREMENTS for analysis; kept for compact coverage tables. */
export const REQUIREMENT_COVERAGE = USER_REQUIREMENTS.map((ur) => ({
  requirement: `${ur.id} · ${ur.need}`,
  evidence: ur.acceptance,
  where: ur.href,
}));

export const DEMO_PATH = [
  "Explore → Rajasthan (or open Kalbelia directly) — UR-01",
  "Read the card and open Sources — UR-03",
  "Ask a grounded question, then a refuse probe — UR-04 · UR-05",
  "Complete the quiz — UR-06",
  "Submit a contribution and accept/reject it in Admin — UR-07 · UR-09",
] as const;

export const OUT_OF_SCOPE = [
  "AR / VR experiences",
  "Native mobile apps or social Reels feed",
  "Payments or billed maps",
  "Scraping Indian Culture Portal / Sahapedia wholesale",
  "Claiming to be an official Ministry or UNESCO product",
] as const;

export const ETHICS_NOTES = [
  "No autoplay of sacred sound.",
  "Omit restricted or closed practices from the catalogue.",
  "Ask refuses invented ritual rules, dates, prices, and medical advice.",
  "Contributions must not include closed/sacred instructions or others’ photos without consent.",
] as const;
