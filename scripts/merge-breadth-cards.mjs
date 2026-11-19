/**
 * Merge verified breadth cards for previously uncovered states/UTs into catalogue.json.
 * Idempotent: skips slugs that already exist.
 * Usage: node scripts/merge-breadth-cards.mjs
 */
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const catPath = path.join(root, "src/data/catalogue.json");
const ACCESSED = "2026-11-20";
const NS_HEX = "8f3c1d2e4a5b6c7d8e9f0a1b2c3d4e5f";

function uid(name) {
  const ns = Buffer.from(NS_HEX, "hex");
  const hash = createHash("sha1").update(ns).update(name).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const h = hash.subarray(0, 16).toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function src(url, title, publisher) {
  return { url, title, publisher, accessed_on: ACCESSED, id: uid(`src:${url}`) };
}

function q(prompt, options, answer_index, explanation, slug, idx) {
  return {
    prompt,
    options,
    answer_index,
    explanation,
    id: uid(`q:${slug}:${idx}`),
    sort_order: idx,
  };
}

const GI = "https://search.ipindia.gov.in/GIRPublicSearch";
const MOC = "https://culture.gov.in/intangible-cultural-heritage";
const ICP = "https://www.indianculture.gov.in/";
const UNESCO_IN = "https://ich.unesco.org/en/state/india-IN";
const SNA = "https://indiaich-sna.in/national-inventory";

const NEW_REGIONS = [
  {
    slug: "andaman-and-nicobar",
    name: "Andaman and Nicobar Islands",
    state_ut: "Andaman and Nicobar Islands",
    zone: "Island",
    lat: 11.7401,
    lng: 92.6586,
    blurb: "Island craft traditions registered under India's GI system, with careful community respect.",
  },
  {
    slug: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    state_ut: "Arunachal Pradesh",
    zone: "Northeast",
    lat: 27.1004,
    lng: 93.6167,
    blurb: "Highland textiles and craft knowledge, including Apatani weaving with GI protection.",
  },
  {
    slug: "chandigarh",
    name: "Chandigarh",
    state_ut: "Chandigarh",
    zone: "North",
    lat: 30.7333,
    lng: 76.7794,
    blurb: "Planned capital with the Capitol Complex recognised in a UNESCO World Heritage serial nomination.",
  },
  {
    slug: "dadra-daman-diu",
    name: "Dadra and Nagar Haveli and Daman and Diu",
    state_ut: "Dadra and Nagar Haveli and Daman and Diu",
    zone: "West",
    lat: 20.1809,
    lng: 73.0169,
    blurb: "Warli painting geography includes this UT under the registered GI area.",
  },
  {
    slug: "delhi",
    name: "Delhi",
    state_ut: "Delhi",
    zone: "North",
    lat: 28.6139,
    lng: 77.209,
    blurb: "Capital region living arts and agricultural GIs that name Delhi in their registered area.",
  },
  {
    slug: "goa",
    name: "Goa",
    state_ut: "Goa",
    zone: "West",
    lat: 15.2993,
    lng: 74.124,
    blurb: "Coastal craft and food GIs including Feni, with Portuguese-era and Konkani living culture.",
  },
  {
    slug: "haryana",
    name: "Haryana",
    state_ut: "Haryana",
    zone: "North",
    lat: 29.0588,
    lng: 76.0856,
    blurb: "North Indian oral and craft traditions, including Jangam Gayan in the national ICH inventory.",
  },
  {
    slug: "jharkhand",
    name: "Jharkhand",
    state_ut: "Jharkhand",
    zone: "East",
    lat: 23.3441,
    lng: 85.3096,
    blurb: "Sohrai-Khovar mural painting and other tribal-linked crafts with GI recognition.",
  },
  {
    slug: "lakshadweep",
    name: "Lakshadweep",
    state_ut: "Lakshadweep",
    zone: "Island",
    lat: 10.5667,
    lng: 72.6417,
    blurb: "Island folk arts described by the UT administration, approached with visitor restraint.",
  },
  {
    slug: "meghalaya",
    name: "Meghalaya",
    state_ut: "Meghalaya",
    zone: "Northeast",
    lat: 25.5788,
    lng: 91.8933,
    blurb: "Hill craft GIs including Lyrnai / Larnai pottery traditions.",
  },
  {
    slug: "madhya-pradesh",
    name: "Madhya Pradesh",
    state_ut: "Madhya Pradesh",
    zone: "Central",
    lat: 23.2599,
    lng: 77.4126,
    blurb: "Central Indian arts including Gond painting with a registered GI.",
  },
  {
    slug: "mizoram",
    name: "Mizoram",
    state_ut: "Mizoram",
    zone: "Northeast",
    lat: 23.7271,
    lng: 92.7176,
    blurb: "Mizo handloom textiles with several registered GI names including Puanchei.",
  },
  {
    slug: "nagaland",
    name: "Nagaland",
    state_ut: "Nagaland",
    zone: "Northeast",
    lat: 25.6751,
    lng: 94.1086,
    blurb: "Naga textile knowledge including Chakhesang shawls under GI protection.",
  },
  {
    slug: "puducherry",
    name: "Puducherry",
    state_ut: "Puducherry",
    zone: "South",
    lat: 11.9416,
    lng: 79.8083,
    blurb: "Terracotta and papier-mache crafts registered for the former Pondicherry territory.",
  },
  {
    slug: "sikkim",
    name: "Sikkim",
    state_ut: "Sikkim",
    zone: "Northeast",
    lat: 27.533,
    lng: 88.5122,
    blurb: "Himalayan Buddhist monastic dances listed in India's national ICH inventory.",
  },
  {
    slug: "tripura",
    name: "Tripura",
    state_ut: "Tripura",
    zone: "Northeast",
    lat: 23.9408,
    lng: 91.9882,
    blurb: "Tripura Risa textile and related handloom knowledge with GI registration.",
  },
];

function makeItem(def) {
  const iid = uid(`item:${def.slug}`);
  const rid = uid(`region:${def.region}`);
  const questions = def.questions.map((qq, idx) =>
    q(qq[0], qq[1], qq[2], qq[3], def.slug, idx),
  );
  return {
    id: iid,
    slug: def.slug,
    type: def.type,
    title: def.title,
    summary: def.summary,
    body: def.body.trim(),
    unesco_id: def.unesco_id ?? null,
    gi_flag: Boolean(def.gi_flag),
    region_id: rid,
    region_slug: def.region,
    calendar_note: def.calendar_note,
    sensitivity_flag: Boolean(def.sensitivity_flag),
    published: true,
    tags: def.tags,
    languages: def.languages,
    sources: def.sources.map((s) => ({ ...s, id: s.id ?? uid(`src:${def.slug}:${s.url}`) })),
    quiz: {
      id: uid(`quiz:${def.slug}`),
      item_id: iid,
      title: def.quiz_title,
      questions,
    },
  };
}

const BREADTH = [
  makeItem({
    slug: "padauk-wood-craft-andaman",
    type: "craft",
    title: "Padauk wood craft of the Andaman and Nicobar Islands",
    region: "andaman-and-nicobar",
    gi_flag: true,
    calendar_note: "Workshop craft year-round. Island travel needs permits and local rules.",
    tags: ["gi", "craft", "andaman", "wood"],
    languages: ["en", "hi"],
    sensitivity_flag: true,
    summary:
      "Padauk wood craft is a registered Geographical Indication handicraft of the Andaman and Nicobar Islands. This card explains the GI fact and respectful visiting, without inventing tribal ritual detail.",
    body: `Padauk wood craft of Andaman & Nicobar appears on India's state-wise list of registered Geographical Indications as a handicraft (application noted in Intellectual Property India materials). A GI tag protects a place-linked product name under Indian IP law. It does not turn island communities into exhibits.

For learners: use the GI registry and Ministry of Culture pages as outbound sources. Do not invent “secret” meanings for motifs. Indigenous communities of the islands have histories of contact restrictions; this app will not give trespass tips or precise coordinates for restricted settlements.

Respectful engagement means buying only through legitimate artisan channels when available, asking before photographs of people, and treating gaps in sources as unknown rather than filling them with fiction.`,
    sources: [
      src("https://ipindia.gov.in/frontend/pdf/gi/registered/State_wise_Registered_GI_of_India.pdf", "State wise Registered GI of India (lists Padauk Wood Craft)", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Padauk craft. five checks",
    questions: [
      ["Padauk wood craft is described here mainly as…", ["A UNESCO dance", "A registered GI handicraft of the Andaman and Nicobar Islands", "A hotel loyalty club", "An AI-generated myth"], 1, "The card cites the GI registration listing."],
      ["A Geographical Indication primarily protects…", ["Any social media hashtag", "A place-linked product name under Indian IP law", "A private app trademark only", "A tourist tip jar"], 1, "GI is an IP protection for place-linked goods."],
      ["Why does this card set a sensitivity flag?", ["To invent secret rituals", "Because island Indigenous contexts need care and no trespass framing", "To block all reading", "Because wood is illegal everywhere"], 1, "Restricted contact and community dignity matter."],
      ["If a motif meaning is not in the sources, you should…", ["Invent a story", "Treat it as unknown", "Copy a random reel", "Scrape private chats"], 1, "Grounded answers only."],
      ["Which outbound official search helps verify GI status?", ["Intellectual Property India GI public search", "A fashion marketplace alone", "A meme page", "This student app as registrar"], 0, "IP India hosts the GI registry search."],
    ],
  }),
  makeItem({
    slug: "apatani-textile-arunachal",
    type: "craft",
    title: "Apatani textile of Arunachal Pradesh",
    region: "arunachal-pradesh",
    gi_flag: true,
    calendar_note: "Handloom practice year-round; festival displays vary by community calendar.",
    tags: ["gi", "textile", "arunachal", "apatani"],
    languages: ["en", "hi"],
    sensitivity_flag: false,
    summary:
      "Apatani textile is a registered Geographical Indication handicraft of Arunachal Pradesh. The card sticks to GI facts and respectful craft learning.",
    body: `Arunachal Pradesh Apatani Textile is listed among registered Geographical Indications for the state (handicraft class in Intellectual Property India materials). The GI framework recognises textile knowledge linked to Apatani communities and place.

This learner card does not invent weave diagrams or sacred rules. Use the GI registry entry and culture portals to verify claims. Tourist shops may sell related textiles; a shop label is not automatic proof of GI-authorised production.

Respectful visiting: ask before photographing weavers, credit makers when you share, and avoid treating community dress as costume for outsiders.`,
    sources: [
      src("https://ipindia.gov.in/frontend/pdf/gi/registered/State_wise_Registered_GI_of_India.pdf", "State wise Registered GI of India (Apatani Textile)", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Apatani textile. five checks",
    questions: [
      ["Apatani textile is tied in this card to which state?", ["Goa", "Arunachal Pradesh", "Kerala", "Punjab"], 1, "The GI listing is for Arunachal Pradesh."],
      ["GI status means…", ["The app owns the weave", "A registered place-linked product name exists under Indian IP law", "UNESCO automatically inscribed it", "Anyone may invent a new GI online"], 1, "GI is an IP registration."],
      ["A shop label alone…", ["Always proves GI-authorised production", "Is not automatic proof of GI-authorised production", "Replaces the registry", "Bans photography forever"], 1, "The card warns against assuming shop labels equal GI proof."],
      ["Respectful visiting includes…", ["Grabbing looms for selfies", "Asking before photographing weavers", "Demanding secret patterns", "Ignoring makers' names"], 1, "Consent and credit matter."],
      ["Primary verification link class cited here includes…", ["Intellectual Property India GI materials", "Only anonymous chats", "Pirate PDFs with no publisher", "Hotel menus"], 0, "IP India is cited."],
    ],
  }),
  makeItem({
    slug: "chandigarh-capitol-complex",
    type: "knowledge",
    title: "Chandigarh Capitol Complex (Le Corbusier World Heritage)",
    region: "chandigarh",
    unesco_id: null,
    gi_flag: false,
    calendar_note: "Public monumental site; access rules and ticketed zones follow official notices.",
    tags: ["unesco-wh", "modern", "chandigarh", "architecture"],
    languages: ["en", "hi"],
    sensitivity_flag: false,
    summary:
      "Chandigarh's Capitol Complex is part of the UNESCO World Heritage serial property for the Architectural Work of Le Corbusier. This card is a cited learning path, not a ticket office.",
    body: `The Architectural Work of Le Corbusier is a UNESCO World Heritage serial nomination that includes the Capitol Complex at Chandigarh. Official UNESCO pages describe the property and its outstanding universal value. This student app is not the Archaeological Survey of India and does not invent opening hours.

Learners should treat the complex as protected modern heritage: follow posted rules, prefer official guides, and do not climb or mark surfaces. Living craft of the wider region (for example Phulkari GI applicants historically linked to Chandigarh addresses) is a neighbour topic, not the same card.

If you need current ticket or photography rules, use ASI or UT tourism notices, not a language model.`,
    sources: [
      src("https://whc.unesco.org/en/list/1321/", "The Architectural Work of Le Corbusier (World Heritage List)", "UNESCO World Heritage Centre"),
      src("https://asi.nic.in/", "Archaeological Survey of India", "ASI"),
      src("https://asi.paygov.org.in/", "ASI ticketing (Indian Heritage)", "ASI / PayGov"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Capitol Complex. five checks",
    questions: [
      ["The Capitol Complex is discussed here as part of…", ["A GI chilli", "A UNESCO World Heritage serial property for Le Corbusier's work", "A private mall brand", "An unofficial meme"], 1, "UNESCO WH list entry is cited."],
      ["This app's role is…", ["Official ticket seller", "A cited learner path, not a ticket office", "UNESCO headquarters", "A demolition crew"], 1, "The card disclaims official ticketing."],
      ["For current photography rules you should…", ["Invent them", "Check official ASI or UT notices", "Trust a random chat bot alone", "Ignore all signs"], 1, "Official notices beat guesses."],
      ["Phulkari appears here as…", ["The same as the Capitol Complex", "A neighbour regional craft topic, not this card", "Banned forever", "A UNESCO dance"], 1, "Neighbour topic only."],
      ["Which body hosts the World Heritage List page cited?", ["UNESCO World Heritage Centre", "A fashion blog alone", "This student app", "A ride-hailing company"], 0, "whc.unesco.org is cited."],
    ],
  }),
  makeItem({
    slug: "warli-painting-dnhdd",
    type: "craft",
    title: "Warli painting (Dadra and Nagar Haveli & Daman and Diu geography)",
    region: "dadra-daman-diu",
    gi_flag: true,
    calendar_note: "Living mural and portable painting practice; festival seasons vary by community.",
    tags: ["gi", "warli", "painting", "dnhdd"],
    languages: ["en", "hi", "mr"],
    sensitivity_flag: false,
    summary:
      "Warli painting is a registered GI whose geographical area includes Dadra & Nagar Haveli and Daman & Diu along with Maharashtra and Gujarat. This card centres the UT link without inventing ritual rules.",
    body: `Warli Painting is registered as a Geographical Indication handicraft with a multi-state geographical area that Intellectual Property India materials list as Maharashtra, Gujarat, Dadara & Nagar Haveli, and Daman Diu. The practice is associated with Warli communities' visual vocabulary of human, animal, and harvest scenes.

This card for the Dadra and Nagar Haveli and Daman and Diu hub does not replace Maharashtra-focused cards elsewhere; it documents that the registered GI geography includes this UT. Do not invent sacred meanings for motifs. Prefer GI and culture-portal sources over souvenir myths.

Respectful engagement: credit painters, ask before photographing people at work, and buy through fair channels when possible.`,
    sources: [
      src("https://ipindia.gov.in/frontend/pdf/gi/registered/State_wise_Registered_GI_of_India.pdf", "State wise Registered GI of India (Warli Painting geography)", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Warli (DNHDD). five checks",
    questions: [
      ["The GI geography for Warli painting includes…", ["Only Kerala", "Maharashtra, Gujarat, and Dadra & Nagar Haveli / Daman Diu as listed", "Only Ladakh", "Only foreign museums"], 1, "IP India materials list the multi-state area."],
      ["This UT card exists to…", ["Invent new rituals", "Document that the registered GI area includes this UT", "Replace all Maharashtra cards", "Sell paint"], 1, "Breadth coverage for the UT hub."],
      ["Motif meanings not in sources should be…", ["Invented freely", "Treated as unknown", "Sold as secrets", "Forced on children"], 1, "No fabrication."],
      ["Respectful engagement includes…", ["Crediting painters", "Stealing sketches", "Demanding free murals", "Ignoring consent"], 0, "Credit and consent."],
      ["GI here means…", ["A registered place-linked product name", "A hotel star rating", "A traffic fine", "An app badge only"], 0, "GI is IP protection."],
    ],
  }),
  makeItem({
    slug: "basmati-delhi-ncr",
    type: "knowledge",
    title: "Basmati rice (Delhi in the registered GI area)",
    region: "delhi",
    gi_flag: true,
    calendar_note: "Agricultural season follows cropping cycles; not a tourist show.",
    tags: ["gi", "basmati", "delhi", "agriculture"],
    languages: ["en", "hi"],
    sensitivity_flag: false,
    summary:
      "Basmati is a registered Geographical Indication whose area includes Delhi among other north Indian states/UTs. This card explains the GI fact for the Delhi hub.",
    body: `Basmati (GI application materials associated with APEDA) is registered with a geographical area that Intellectual Property India details list as including Punjab, Haryana, Himachal Pradesh, Delhi, Uttarakhand, Uttar Pradesh, and Jammu & Kashmir. The protection concerns aromatic rice linked to that geography.

This Delhi hub card does not invent farm recipes or export prices. It teaches that Delhi appears in the registered area and that GI claims should be checked on Intellectual Property India / APEDA materials. Street food using basmati is not automatically GI-authorised product.

For travellers: markets may label “basmati” loosely; the registry, not a menu, is the authority for GI status.`,
    sources: [
      src("https://search.ipindia.gov.in/GIRPublicSearch/Application/Details/145", "Basmati. GI application details (area includes Delhi)", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src("https://apeda.gov.in/", "APEDA (Basmati GI applicant organisation)", "APEDA"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Basmati (Delhi). five checks",
    questions: [
      ["Delhi appears in this card because…", ["It grows coffee only", "It is listed in the Basmati GI geographical area", "UNESCO inscribed a Delhi dance under this slug", "The app invented a rice myth"], 1, "GI details list Delhi in the area."],
      ["Who is noted as connected to the Basmati GI applicant side?", ["APEDA", "A random cafe", "This student app", "A ride share firm"], 0, "APEDA is cited."],
      ["A restaurant label “basmati”…", ["Always equals GI-authorised product", "Is not automatic proof of GI-authorised status", "Bans the GI", "Is a UNESCO inscription"], 1, "Registry beats menus."],
      ["This card type is…", ["knowledge about a GI agricultural product", "A temple timetable", "A hacking guide", "A sports league"], 0, "Knowledge / GI agriculture."],
      ["Primary verification source class includes…", ["Intellectual Property India GI details", "Only anonymous forwards", "Pirate streams", "Fake certificates"], 0, "IP India details page is linked."],
    ],
  }),
  makeItem({
    slug: "feni-goa",
    type: "knowledge",
    title: "Feni of Goa",
    region: "goa",
    gi_flag: true,
    calendar_note: "Distillation and tasting follow local licensed contexts; not a public binge sport.",
    tags: ["gi", "feni", "goa", "food"],
    languages: ["en", "kok", "hi"],
    sensitivity_flag: false,
    summary:
      "Feni is a registered Geographical Indication manufactured product of Goa. The card covers the GI fact and responsible learning, not drinking advice for minors.",
    body: `Feni is listed among Goa's registered Geographical Indications (manufactured goods) in Intellectual Property India state-wise materials. Cashew and coconut feni traditions are part of Goan food knowledge; this card does not invent cocktail myths or medical claims.

Learners should verify GI status via Intellectual Property India search pages. Tourism promotions are not the GI certificate. Responsible adults follow local law; this unofficial student app does not sell alcohol or encourage unsafe drinking.

Respectful travel: treat distillery visits as workspaces, ask before photos of workers, and keep sacred or family ceremonies out of collectible “quest” framing.`,
    sources: [
      src("https://ipindia.gov.in/frontend/pdf/gi/registered/State_wise_Registered_GI_of_India.pdf", "State wise Registered GI of India (Feni, Goa)", "Intellectual Property India"),
      src("https://search.ipindia.gov.in/GIRPublicSearch/Application/Details/120", "Feni. GI application details", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Feni. five checks",
    questions: [
      ["Feni is registered as a GI associated with…", ["Ladakh only", "Goa", "Sikkim only", "A fictional island"], 1, "Goa GI listing."],
      ["This card refuses to…", ["Cite IP India", "Invent medical claims or sell alcohol", "Mention cashew", "Link the GI search"], 1, "No medical invention; no sales."],
      ["Tourism ads alone…", ["Replace the GI certificate", "Are not the GI certificate", "Ban Feni forever", "Are UNESCO inscriptions"], 1, "Registry is authority."],
      ["Respectful distillery visits include…", ["Asking before photographing workers", "Climbing stills", "Forcing tastings on minors", "Ignoring local law"], 0, "Consent and law."],
      ["GI class for Feni in state lists is described as…", ["Manufactured", "A dance form", "A temple", "A river"], 0, "Manufactured goods GI."],
    ],
  }),
  makeItem({
    slug: "jangam-gayan-haryana",
    type: "oral",
    title: "Jangam Gayan",
    region: "haryana",
    gi_flag: false,
    calendar_note: "Oral performance calendars vary; confirm local events through community or official notices.",
    tags: ["oral", "haryana", "sna", "jangam"],
    languages: ["hi", "en"],
    sensitivity_flag: false,
    summary:
      "Jangam Gayan appears in Sangeet Natak Akademi's national inventory of intangible cultural heritage elements. This card points to that inventory rather than inventing lyrics.",
    body: `Jangam Gayan is listed in the National Inventory maintained via Sangeet Natak Akademi as nodal agency for India's ICH inventory work under the Ministry of Culture framework. Inventory listing is not the same as a UNESCO Representative List inscription.

This learner card does not invent verses, caste myths, or performance fees. Use the national inventory and Ministry of Culture pages to verify. If a touring show claims a fixed “original” text, ask for a source.

Respectful listening: do not interrupt ritual contexts, ask before recording, and avoid treating singers as photo props.`,
    sources: [
      src(SNA, "National Inventory of ICH (Sangeet Natak Akademi)", "Sangeet Natak Akademi / Ministry of Culture framework"),
      src("https://indiaich-sna.in/", "ICH nodal information (Sangeet Natak Akademi)", "Sangeet Natak Akademi"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Jangam Gayan. five checks",
    questions: [
      ["Jangam Gayan is cited here via…", ["A national ICH inventory listing", "A random meme", "A GI for rice only", "A hotel playlist"], 0, "SNA national inventory is cited."],
      ["Inventory listing equals UNESCO RL inscription?", ["Always", "Not automatically; the card distinguishes them", "Never related to culture", "Only if this app says so"], 1, "Inventory ≠ automatic UNESCO RL."],
      ["The card refuses to…", ["Cite MoC", "Invent verses or caste myths", "Link SNA", "Mention Haryana"], 1, "No fabrication of lyrics/myths."],
      ["Respectful listening includes…", ["Asking before recording", "Forcing encores", "Mocking singers", "Secret taping in sacred spaces"], 0, "Consent."],
      ["Sangeet Natak Akademi is described as…", ["Nodal agency context for India's ICH inventory work", "A ride-hailing firm", "UNESCO HQ in Paris only", "A private NFT marketplace"], 0, "Nodal ICH role cited."],
    ],
  }),
  makeItem({
    slug: "sohrai-khovar-jharkhand",
    type: "craft",
    title: "Sohrai-Khovar painting of Jharkhand",
    region: "jharkhand",
    gi_flag: true,
    calendar_note: "Traditionally linked to harvest and domestic mural seasons; public displays also appear in civic spaces.",
    tags: ["gi", "sohrai", "khovar", "jharkhand"],
    languages: ["hi", "en"],
    sensitivity_flag: false,
    summary:
      "Sohrai-Khovar painting is a registered Geographical Indication handicraft of Jharkhand. The card explains GI status and respectful viewing of mural traditions.",
    body: `Sohrai-Khovar Painting is registered as a Geographical Indication handicraft associated with Jharkhand (Intellectual Property India materials). The tradition is widely described as mural art connected to harvest and domestic celebration contexts in regions such as Hazaribagh, without this app inventing ritual law.

Civic spaces in Jharkhand have displayed related motifs; public murals are not a license to enter private homes uninvited. Verify GI claims through Intellectual Property India search tools.

Respectful visiting: ask before photographing people painting, do not scrape wet mud walls, and credit artists when sharing images.`,
    sources: [
      src("https://ipindia.gov.in/frontend/pdf/gi/registered/State_wise_Registered_GI_of_India.pdf", "State wise Registered GI of India (Sohrai-Khovar Painting)", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Sohrai-Khovar. five checks",
    questions: [
      ["Sohrai-Khovar painting is tied here to…", ["Goa beaches", "Jharkhand GI handicraft registration", "Only foreign auctions", "A coding bootcamp"], 1, "Jharkhand GI listing."],
      ["Public murals mean you may…", ["Enter any private home uninvited", "Still need consent and respect for private spaces", "Ignore artists", "Remove wall sections"], 1, "No trespass."],
      ["GI verification should use…", ["Intellectual Property India tools", "Only WhatsApp forwards", "Fake certificates", "Hotel menus"], 0, "IP India."],
      ["Respectful visiting includes…", ["Asking before photographing painters", "Touching wet murals", "Scraping samples", "Demanding free paintings"], 0, "Consent."],
      ["Harvest-linked timing in this card is…", ["A fixed Gregorian showtime invented here", "Described as traditional seasonality without inventing ritual law", "A sports season", "Irrelevant forever"], 1, "Seasonality without invented law."],
    ],
  }),
  makeItem({
    slug: "kolkali-lakshadweep",
    type: "performing",
    title: "Kolkali of Lakshadweep",
    region: "lakshadweep",
    gi_flag: false,
    calendar_note: "Folk performance contexts vary by island; confirm local guidance. Travel to Lakshadweep is permit-regulated.",
    tags: ["performing", "lakshadweep", "kolkali", "folk"],
    languages: ["en", "ml"],
    sensitivity_flag: true,
    summary:
      "Kolkali is described by the Lakshadweep administration as a popular folk art form of the Territory. This card cites that official page and insists on permit-aware, non-trespass travel.",
    body: `The Lakshadweep Administration's Culture & Heritage page states that Kolkali and Parichakali are popular folk art forms in the Territory (with LAVA noted for Minicoy). This unofficial learner card quotes that administrative description; it does not invent choreography or sacred rules.

Island travel is regulated. This app will not provide ways to bypass permits or enter restricted spaces. Watch performances only in contexts open to visitors, and ask before recording people.

If a detail is missing from official pages, the honest answer is unknown, not a generated island myth.`,
    sources: [
      src("https://lakshadweep.gov.in/about-lakshadweep/culture-heritage/", "Culture & Heritage (Lakshadweep Administration)", "Lakshadweep Administration"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
      src(UNESCO_IN, "India. elements on the Lists of ICH", "UNESCO"),
    ],
    quiz_title: "Kolkali. five checks",
    questions: [
      ["Kolkali is cited from…", ["Lakshadweep Administration culture pages", "A pirate stream only", "This app inventing a dance", "A GI rice tag"], 0, "Official UT page."],
      ["Why is sensitivity flagged?", ["To ban reading", "Because island travel and community contexts need care and no permit bypass tips", "Because dance is illegal", "Because English is forbidden"], 1, "Permits and respect."],
      ["This app will not…", ["Cite MoC", "Help bypass island entry permits", "Link UNESCO India ICH state page", "Mention Parichakali as also listed by the administration"], 1, "No trespass/permit bypass."],
      ["If choreography detail is missing…", ["Invent steps", "Say unknown", "Sell a fake certificate", "Force a tourist show"], 1, "Honesty."],
      ["Parichakali appears in the official page as…", ["Another popular folk art form of the Territory", "A GI metal craft", "A World Heritage fort", "A coding language"], 0, "Admin page pairs Kolkali and Parichakali."],
    ],
  }),
  makeItem({
    slug: "lyrnai-pottery-meghalaya",
    type: "craft",
    title: "Lyrnai pottery of Meghalaya",
    region: "meghalaya",
    gi_flag: true,
    calendar_note: "Studio and village craft year-round; market seasons vary.",
    tags: ["gi", "pottery", "meghalaya", "lyrnai"],
    languages: ["en", "hi"],
    sensitivity_flag: false,
    summary:
      "Meghalaya Lyrnai pottery is listed among registered Geographical Indication handicrafts for Meghalaya. The card sticks to GI verification and respectful craft visits.",
    body: `Meghalaya Lyrnai Pottery appears in Intellectual Property India state-wise registered GI lists as a handicraft of Meghalaya (alongside related spellings such as Larnai in public GI search indexes). GI status protects a place-linked craft name; it does not authorise trespass into private workshops.

Verify claims with Intellectual Property India search. Souvenir stalls may sell clay ware that is related but not automatically GI-authorised.

Respectful visiting: ask before photos, do not handle unfired work without permission, and credit potters.`,
    sources: [
      src("https://ipindia.gov.in/frontend/pdf/gi/registered/State_wise_Registered_GI_of_India.pdf", "State wise Registered GI of India (Meghalaya Lyrnai Pottery)", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Lyrnai pottery. five checks",
    questions: [
      ["Lyrnai pottery is associated here with…", ["Meghalaya", "Goa only", "Lakshadweep only", "A fictional state"], 0, "Meghalaya GI list."],
      ["GI authorises…", ["Trespass into any workshop", "A protected place-linked craft name, not trespass", "Free shipping worldwide", "UNESCO automatic inscription"], 1, "Name protection ≠ trespass rights."],
      ["Souvenir clay ware…", ["Always equals GI-authorised production", "Is not automatic proof of GI-authorised production", "Bans pottery", "Is a dance"], 1, "Registry vs stall."],
      ["Respectful visits include…", ["Asking before photos", "Grabbing wet pots", "Secret filming", "Ignoring potters"], 0, "Consent."],
      ["Verification should include…", ["Intellectual Property India materials", "Only memes", "Fake stamps", "Anonymous tips alone"], 0, "IP India."],
    ],
  }),
  makeItem({
    slug: "gond-painting-madhya-pradesh",
    type: "craft",
    title: "Gond painting of Madhya Pradesh",
    region: "madhya-pradesh",
    gi_flag: true,
    calendar_note: "Studio practice year-round; exhibition calendars vary.",
    tags: ["gi", "gond", "painting", "madhya-pradesh"],
    languages: ["hi", "en"],
    sensitivity_flag: false,
    summary:
      "Gond Painting of Madhya Pradesh is a registered Geographical Indication handicraft. The card cites IP India details and refuses invented myth summaries.",
    body: `Gond Painting of Madhya Pradesh is registered as a Geographical Indication (handicraft). Intellectual Property India application details list Madhya Pradesh as the geographical area and record registration metadata for public verification.

Contemporary Gond artists work in many styles. This card will not collapse all work into one “tribal myth” script. Use GI and culture portals; credit living artists.

Respectful engagement: buy fairly, ask before photos, and do not treat community stories as free content to remix without consent.`,
    sources: [
      src("https://search.ipindia.gov.in/GIRPublicSearch/Application/Details/701", "Gond Painting of Madhya Pradesh. GI details", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Gond painting. five checks",
    questions: [
      ["Gond painting GI details are cited from…", ["Intellectual Property India", "A meme page only", "This app as registrar", "A sports league"], 0, "IP India details."],
      ["The registered geographical area named here is…", ["Madhya Pradesh", "Only Goa", "Only Andaman", "Only foreign museums"], 0, "MP geography."],
      ["This card refuses to…", ["Cite MoC", "Invent a single myth script for all Gond art", "Link GI search", "Mention artists"], 1, "No collapsed myth invention."],
      ["Respectful engagement includes…", ["Crediting living artists", "Tracing without consent", "Demanding free originals", "Erasing signatures"], 0, "Credit."],
      ["GI handicraft status means…", ["A place-linked registered product name", "Automatic UNESCO dance inscription", "A hotel rating", "A traffic rule"], 0, "GI meaning."],
    ],
  }),
  makeItem({
    slug: "mizo-puanchei",
    type: "craft",
    title: "Mizo Puanchei",
    region: "mizoram",
    gi_flag: true,
    calendar_note: "Handloom year-round; ceremonial wear follows community occasions.",
    tags: ["gi", "mizo", "textile", "mizoram"],
    languages: ["en", "lus"],
    sensitivity_flag: false,
    summary:
      "Mizo Puanchei is a registered Geographical Indication handicraft of Mizoram. The card covers GI verification and respectful textile learning.",
    body: `Mizo Puanchei is listed among Mizoram's registered Geographical Indication handicrafts in Intellectual Property India state-wise materials, alongside related Mizo textile GIs. The puan traditions are living handloom knowledge; this card does not invent pattern charts.

Verify with Intellectual Property India search. Ceremonial textiles deserve care: do not treat them as costumes for outsiders without guidance.

Respectful visiting: ask before photographing weavers and credit makers.`,
    sources: [
      src("https://ipindia.gov.in/frontend/pdf/gi/registered/State_wise_Registered_GI_of_India.pdf", "State wise Registered GI of India (Mizo Puanchei)", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Mizo Puanchei. five checks",
    questions: [
      ["Mizo Puanchei is associated with…", ["Mizoram", "Only Goa", "Only Delhi", "A fictional UT"], 0, "Mizoram GI."],
      ["Ceremonial textiles…", ["Are free costumes for any tourist", "Deserve care and guidance before use as costume", "Are banned from museums", "Are GI rice"], 1, "Respect."],
      ["Pattern charts not in sources should be…", ["Invented", "Left unknown", "Sold as secrets by this app", "Forced"], 1, "No invention."],
      ["GI lists also mention related Mizo textiles?", ["Yes, the card notes related Mizo textile GIs exist", "No other textiles exist in India", "Only in Brazil", "Only in Antarctica"], 0, "Related GIs noted."],
      ["Verification uses…", ["Intellectual Property India materials", "Only anonymous blogs", "Fake tags", "Hotel flyers alone"], 0, "IP India."],
    ],
  }),
  makeItem({
    slug: "chakhesang-shawl-nagaland",
    type: "craft",
    title: "Chakhesang shawl",
    region: "nagaland",
    gi_flag: true,
    calendar_note: "Handloom year-round; ceremonial use follows community practice.",
    tags: ["gi", "chakhesang", "shawl", "nagaland"],
    languages: ["en", "hi"],
    sensitivity_flag: false,
    summary:
      "Chakhesang Shawl is a registered Geographical Indication handicraft associated with Nagaland. The card cites GI materials and respectful textile learning.",
    body: `Chakhesang Shawl appears as a registered Geographical Indication handicraft in Intellectual Property India materials linked with Nagaland. Shawl designs carry community meaning that this app will not invent or flatten into a tourist slogan.

Verify GI status through official search pages. Festival tourism in Nagaland is not a substitute for community consent when photographing people or ceremonial cloth.

Respectful engagement: ask before photos, credit weavers, and avoid bargaining that demeans skilled labour.`,
    sources: [
      src("https://ipindia.gov.in/frontend/pdf/gi/registered/State_wise_Registered_GI_of_India.pdf", "State wise Registered GI of India (Chakhesang Shawl)", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Chakhesang shawl. five checks",
    questions: [
      ["Chakhesang shawl GI is associated here with…", ["Nagaland", "Only Goa", "Only Kerala", "A fictional state"], 0, "Nagaland."],
      ["This card will not…", ["Cite IP India", "Invent community design meanings", "Link MoC", "Mention weaving"], 1, "No invented meanings."],
      ["Festival tourism…", ["Replaces consent for photographs", "Does not replace community consent for photos of people or ceremonial cloth", "Bans all travel", "Is a GI certificate"], 1, "Consent."],
      ["Respectful engagement includes…", ["Crediting weavers", "Demanding free shawls", "Secret filming", "Mocking labour"], 0, "Credit."],
      ["GI verification tool cited includes…", ["Intellectual Property India public search", "Only memes", "Pirate torrents", "Fake QR codes"], 0, "IP India."],
    ],
  }),
  makeItem({
    slug: "villianur-terracotta-puducherry",
    type: "craft",
    title: "Villianur terracotta works",
    region: "puducherry",
    gi_flag: true,
    calendar_note: "Workshop craft year-round; temple and market demand may be seasonal.",
    tags: ["gi", "terracotta", "puducherry", "villianur"],
    languages: ["ta", "en", "fr"],
    sensitivity_flag: false,
    summary:
      "Villianur Terracotta Works is a registered Geographical Indication handicraft for the Pondicherry / Puducherry territory. The card sticks to GI facts.",
    body: `Villianur Terracotta Works is listed among registered Geographical Indications for Pondicherry (now Puducherry UT) in Intellectual Property India materials. Terracotta making is a living craft; this card does not invent kiln “secrets.”

Verify via Intellectual Property India search. Temple-linked objects deserve respectful handling; do not treat sacred images as toys.

Respectful visiting: ask before photographing artisans at work and support fair purchase channels when available.`,
    sources: [
      src("https://ipindia.gov.in/frontend/pdf/gi/registered/State_wise_Registered_GI_of_India.pdf", "State wise Registered GI of India (Villianur Terracotta Works)", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Villianur terracotta. five checks",
    questions: [
      ["Villianur terracotta GI is listed for…", ["Pondicherry / Puducherry territory", "Only Ladakh", "Only Assam", "A fictional city"], 0, "Pondicherry listing."],
      ["Sacred terracotta images…", ["Are toys for any tourist", "Deserve respectful handling", "May be broken for souvenirs", "Are GI rice"], 1, "Respect."],
      ["The card refuses to…", ["Cite GI lists", "Invent kiln secrets", "Link MoC", "Mention craft"], 1, "No invented secrets."],
      ["Verification uses…", ["Intellectual Property India materials", "Only anonymous tips", "Fake stamps", "Hotel ads alone"], 0, "IP India."],
      ["Respectful visiting includes…", ["Asking before photographing artisans", "Grabbing wet clay", "Secret filming", "Ignoring makers"], 0, "Consent."],
    ],
  }),
  makeItem({
    slug: "lama-dances-sikkim",
    type: "ritual",
    title: "Lama dances of Sikkim",
    region: "sikkim",
    gi_flag: false,
    calendar_note: "Monastic calendars vary; public festival timings follow monastery and state notices.",
    tags: ["ritual", "sikkim", "buddhist", "sna"],
    languages: ["en", "hi", "bo"],
    sensitivity_flag: true,
    summary:
      "Lama dances of Sikkim appear in Sangeet Natak Akademi's national ICH inventory as Buddhist monastic dances. The card emphasises respectful watching, not capture-the-temple play.",
    body: `Lama Dances Of Sikkim: Buddhist Monastic Dances appear in the National Inventory associated with Sangeet Natak Akademi's ICH nodal role. Inventory listing supports learning; it is not a ticket to interrupt ritual.

Visitors should follow monastery rules, keep distance when asked, and avoid flash photography if prohibited. This app will not gamify sacred spaces or invent mask meanings.

Use inventory and culture ministry pages; treat gaps as unknown.`,
    sources: [
      src(SNA, "National Inventory of ICH (includes Lama Dances of Sikkim)", "Sangeet Natak Akademi / Ministry of Culture framework"),
      src("https://indiaich-sna.in/", "ICH nodal information (Sangeet Natak Akademi)", "Sangeet Natak Akademi"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Lama dances. five checks",
    questions: [
      ["Lama dances of Sikkim are cited via…", ["National ICH inventory listing", "A GI for Feni", "A hotel disco", "This app inventing masks"], 0, "SNA inventory."],
      ["Sensitivity is flagged to…", ["Ban all learning", "Avoid capture-the-temple gamification and respect monastic rules", "Hide the state forever", "Sell tickets"], 1, "Respect sacred contexts."],
      ["Flash photography…", ["Is always required", "Should follow monastery rules and prohibitions", "Replaces consent", "Is a GI rule"], 1, "Follow rules."],
      ["Missing mask meanings should be…", ["Invented", "Left unknown", "Sold as NFTs by this app", "Forced on monks"], 1, "Honesty."],
      ["Inventory listing means…", ["Automatic right to interrupt ritual", "A documented ICH element for learning, not a trespass pass", "A sports trophy", "A rice GI"], 1, "Learning ≠ trespass."],
    ],
  }),
  makeItem({
    slug: "tripura-risa-textile",
    type: "craft",
    title: "Tripura Risa textile",
    region: "tripura",
    gi_flag: true,
    calendar_note: "Handloom year-round; ceremonial wear follows community occasions.",
    tags: ["gi", "risa", "tripura", "textile"],
    languages: ["en", "hi"],
    sensitivity_flag: false,
    summary:
      "Tripura Risa Textile is a registered Geographical Indication handicraft. The card cites IP India details for verification.",
    body: `Tripura Risa Textile is registered as a Geographical Indication handicraft (Intellectual Property India application details list Tripura as the geographical area). Risa cloth is living handloom knowledge; this card does not invent weave patents or sacred rules.

Verify via the GI details page and public search. Support artisans fairly and ask before photographing weavers.

Respectful visiting: credit makers and avoid treating ceremonial cloth as costume without guidance.`,
    sources: [
      src("https://search.ipindia.gov.in/GIRPublicSearch/Application/Details/893", "Tripura Risa Textile. GI details", "Intellectual Property India"),
      src(GI, "Geographical Indications public search", "Intellectual Property India"),
      src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
      src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
    ],
    quiz_title: "Tripura Risa. five checks",
    questions: [
      ["Tripura Risa textile GI geography is…", ["Tripura", "Only Goa", "Only Delhi", "A fictional island"], 0, "Tripura details."],
      ["GI details page cited is hosted by…", ["Intellectual Property India", "A meme site", "This student app as registrar", "A ride-hailing firm"], 0, "IP India."],
      ["Ceremonial cloth…", ["Is free costume for anyone", "Needs care and guidance before costume use", "Is banned", "Is a World Heritage fort"], 1, "Respect."],
      ["The card refuses to…", ["Cite MoC", "Invent sacred weave rules", "Link GI search", "Mention handloom"], 1, "No invention."],
      ["Respectful visiting includes…", ["Crediting makers", "Secret filming", "Grabbing looms", "Ignoring consent"], 0, "Credit."],
    ],
  }),
];

const cat = JSON.parse(fs.readFileSync(catPath, "utf8"));
const existingSlugs = new Set(cat.items.map((i) => i.slug));
const existingRegions = new Set(cat.regions.map((r) => r.slug));

let regionsAdded = 0;
for (const r of NEW_REGIONS) {
  if (existingRegions.has(r.slug)) continue;
  cat.regions.push({
    ...r,
    id: uid(`region:${r.slug}`),
  });
  existingRegions.add(r.slug);
  regionsAdded += 1;
}

let itemsAdded = 0;
for (const item of BREADTH) {
  if (existingSlugs.has(item.slug)) continue;
  cat.items.push(item);
  existingSlugs.add(item.slug);
  itemsAdded += 1;
}

cat.generated_on = ACCESSED;
fs.writeFileSync(catPath, JSON.stringify(cat, null, 2) + "\n", "utf8");
console.log(`Added ${regionsAdded} regions, ${itemsAdded} items → ${catPath}`);
console.log(`Catalogue now: ${cat.regions.length} regions, ${cat.items.filter((i) => i.published).length} published items`);
