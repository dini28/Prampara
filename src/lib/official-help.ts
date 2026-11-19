/**
 * Official help links for Place Hubs.
 * National layer verified in plan (2026-11-20). State apps only when verified ,
 * never invent portals.
 */

export type OfficialHelpLink = {
  id: string;
  label: string;
  url: string;
  purpose: string;
  publisher: string;
  checked_on: string;
  status: "verified" | "needs_verification";
};

export const NATIONAL_OFFICIAL_HELP: OfficialHelpLink[] = [
  {
    id: "moc",
    label: "Ministry of Culture",
    url: "https://culture.gov.in/",
    purpose: "National culture programmes and institutions",
    publisher: "Government of India",
    checked_on: "2026-11-20",
    status: "verified",
  },
  {
    id: "icp",
    label: "Indian Culture Portal",
    url: "https://www.indianculture.gov.in/",
    purpose: "Digitised cultural collections and stories",
    publisher: "Ministry of Culture",
    checked_on: "2026-11-20",
    status: "verified",
  },
  {
    id: "incredible-india",
    label: "Incredible India",
    url: "https://www.incredibleindia.gov.in/en",
    purpose: "Travel information from Ministry of Tourism",
    publisher: "Ministry of Tourism",
    checked_on: "2026-11-20",
    status: "verified",
  },
  {
    id: "mot",
    label: "Ministry of Tourism",
    url: "https://tourism.gov.in/",
    purpose: "Policy, schemes, and tourism advisories",
    publisher: "Government of India",
    checked_on: "2026-11-20",
    status: "verified",
  },
  {
    id: "asi",
    label: "Archaeological Survey of India",
    url: "https://asi.nic.in/",
    purpose: "Protected monuments and site information",
    publisher: "ASI",
    checked_on: "2026-11-20",
    status: "verified",
  },
  {
    id: "asi-tickets",
    label: "ASI ticketing (Indian Heritage)",
    url: "https://asi.paygov.org.in/",
    purpose: "Official monument ticket booking",
    publisher: "ASI / PayGov",
    checked_on: "2026-11-20",
    status: "verified",
  },
  {
    id: "sahapedia",
    label: "Sahapedia",
    url: "https://www.sahapedia.org/",
    purpose: "Open heritage encyclopedia (not a government portal)",
    publisher: "Sahapedia",
    checked_on: "2026-11-20",
    status: "verified",
  },
];

/** Per-state official links. Empty = show honest “none verified yet”. */
const STATE_OFFICIAL_HELP: Record<string, OfficialHelpLink[]> = {
  // OBMS exists but plan marks needs_verification until purpose/hours confirmed for hub copy.
  rajasthan: [
    {
      id: "rj-obms",
      label: "Rajasthan tourist booking (OBMS)",
      url: "https://obms-tourist.rajasthan.gov.in/",
      purpose: "State tourist monument / ticket booking portal",
      publisher: "Government of Rajasthan",
      checked_on: "2026-11-20",
      status: "needs_verification",
    },
  ],
};

export function getStateOfficialHelp(stateSlug: string): OfficialHelpLink[] {
  return STATE_OFFICIAL_HELP[stateSlug] ?? [];
}

export function getOfficialHelpForHub(stateSlug: string | null): {
  national: OfficialHelpLink[];
  state: OfficialHelpLink[];
  stateNote: string;
} {
  const state = stateSlug ? getStateOfficialHelp(stateSlug) : [];
  const verifiedState = state.filter((l) => l.status === "verified");
  const pendingState = state.filter((l) => l.status === "needs_verification");

  let stateNote =
    "No verified state tourism or culture app linked yet for this place. We only list portals after human verification.";
  if (verifiedState.length > 0) {
    stateNote = "State portals below were checked for this hub.";
  } else if (pendingState.length > 0) {
    stateNote =
      "A state portal is listed below as needs verification. Confirm purpose and hours before relying on it.";
  }

  return {
    national: NATIONAL_OFFICIAL_HELP.filter((l) => l.status === "verified"),
    state,
    stateNote,
  };
}
