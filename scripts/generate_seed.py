"""Generate 40 attributed heritage cards as JSON + CSV. Original summaries; sources are public URLs only."""
from __future__ import annotations

import csv
import json
import uuid
from pathlib import Path

NS = uuid.UUID("8f3c1d2e-4a5b-6c7d-8e9f-0a1b2c3d4e5f")
ACCESSED = "2026-09-03"


def uid(name: str) -> str:
    return str(uuid.uuid5(NS, name))


REGIONS = [
    {"slug": "rajasthan", "name": "Rajasthan", "state_ut": "Rajasthan", "zone": "West", "lat": 26.9124, "lng": 75.7873, "blurb": "Desert courts, GI crafts, and living performance including Kalbelia."},
    {"slug": "gujarat", "name": "Gujarat", "state_ut": "Gujarat", "zone": "West", "lat": 23.0225, "lng": 72.5714, "blurb": "Garba, Ajrakh, and coastal–desert craft corridors."},
    {"slug": "west-bengal", "name": "West Bengal", "state_ut": "West Bengal", "zone": "East", "lat": 22.5726, "lng": 88.3639, "blurb": "Durga Puja neighbourhoods, patachitra lineages, and urban ritual theatre."},
    {"slug": "kerala", "name": "Kerala", "state_ut": "Kerala", "zone": "South", "lat": 9.9312, "lng": 76.2673, "blurb": "Kutiyattam, Mudiyettu, Onam, and temple-linked performance."},
    {"slug": "tamil-nadu", "name": "Tamil Nadu", "state_ut": "Tamil Nadu", "zone": "South", "lat": 13.0827, "lng": 80.2707, "blurb": "Kanchipuram weaving, Pongal, and Carnatic-adjacent living practice."},
    {"slug": "odisha", "name": "Odisha", "state_ut": "Odisha", "zone": "East", "lat": 20.2961, "lng": 85.8245, "blurb": "Chhau, Pattachitra, and coastal–tribal craft belts."},
    {"slug": "manipur", "name": "Manipur", "state_ut": "Manipur", "zone": "Northeast", "lat": 24.8170, "lng": 93.9368, "blurb": "Sankirtana and court–temple performance lineages."},
    {"slug": "punjab", "name": "Punjab", "state_ut": "Punjab", "zone": "North", "lat": 31.3260, "lng": 75.5762, "blurb": "Thathera metalcraft at Jandiala Guru and Phulkari embroidery."},
    {"slug": "uttarakhand", "name": "Uttarakhand", "state_ut": "Uttarakhand", "zone": "North", "lat": 30.3165, "lng": 78.0322, "blurb": "Ramman of Garhwal and Himalayan festival theatre."},
    {"slug": "karnataka", "name": "Karnataka", "state_ut": "Karnataka", "zone": "South", "lat": 12.9716, "lng": 77.5946, "blurb": "Channapatna lacquer toys and Mysore inlay crafts."},
    {"slug": "maharashtra", "name": "Maharashtra", "state_ut": "Maharashtra", "zone": "West", "lat": 18.5204, "lng": 73.8567, "blurb": "Warli painting, Ganesh Utsav, and Parsi Nawrouz in cities."},
    {"slug": "telangana", "name": "Telangana", "state_ut": "Telangana", "zone": "South", "lat": 17.3850, "lng": 78.4867, "blurb": "Bidriware of Hyderabad and Deccan metal inlay."},
    {"slug": "andhra-pradesh", "name": "Andhra Pradesh", "state_ut": "Andhra Pradesh", "zone": "South", "lat": 16.5062, "lng": 80.6480, "blurb": "Kalamkari, Kondapalli toys, and temple-town crafts."},
    {"slug": "bihar", "name": "Bihar", "state_ut": "Bihar", "zone": "East", "lat": 26.1542, "lng": 85.8918, "blurb": "Madhubani/Mithila painting and ritual wall art."},
    {"slug": "uttar-pradesh", "name": "Uttar Pradesh", "state_ut": "Uttar Pradesh", "zone": "North", "lat": 25.3176, "lng": 82.9739, "blurb": "Banarasi weaving, Chikankari, Ramlila, and Kumbh host cities."},
    {"slug": "assam", "name": "Assam", "state_ut": "Assam", "zone": "Northeast", "lat": 26.1445, "lng": 91.7362, "blurb": "Bihu, Muga silk, and river-valley festival cycles."},
    {"slug": "ladakh", "name": "Ladakh", "state_ut": "Ladakh", "zone": "North", "lat": 34.1526, "lng": 77.5771, "blurb": "Buddhist chanting and high-altitude monastic sound."},
    {"slug": "jammu-kashmir", "name": "Jammu and Kashmir", "state_ut": "Jammu and Kashmir", "zone": "North", "lat": 34.0837, "lng": 74.7973, "blurb": "Pashmina and valley craft knowledge."},
    {"slug": "himachal-pradesh", "name": "Himachal Pradesh", "state_ut": "Himachal Pradesh", "zone": "North", "lat": 31.1048, "lng": 77.1734, "blurb": "Hill weaving and local festival calendars."},
    {"slug": "chhattisgarh", "name": "Chhattisgarh", "state_ut": "Chhattisgarh", "zone": "Central", "lat": 21.2514, "lng": 81.6296, "blurb": "Dhokra/bell-metal casting belts."},
]


def src(url, title, publisher):
    return {"url": url, "title": title, "publisher": publisher, "accessed_on": ACCESSED}


UNESCO = "https://ich.unesco.org/en/state/india-IN"
MOC = "https://culture.gov.in/intangible-cultural-heritage"
ICP = "https://www.indianculture.gov.in/"
SAHA = "https://www.sahapedia.org/"


def quiz(title, questions):
    return {"title": title, "questions": questions}


def q(prompt, options, answer, explanation):
    return {"prompt": prompt, "options": options, "answer_index": answer, "explanation": explanation}


ITEMS = []


def add(item):
    ITEMS.append(item)


add({
    "slug": "kalbelia",
    "type": "performing",
    "title": "Kalbelia folk songs and dances",
    "region": "rajasthan",
    "unesco_id": "00340",
    "gi_flag": False,
    "calendar_note": "Performed year-round; often visible around tourist seasons and local fairs in Rajasthan. Do not treat hotel shows as the only authentic context.",
    "tags": ["unesco", "dance", "rajasthan", "jaipur"],
    "languages": ["hi", "raj"],
    "summary": "Kalbelia is a living song-and-dance practice of Kalbelia communities in Rajasthan, inscribed by UNESCO. The compass card ties it to place, community, and sources — not a costume souvenir.",
    "body": """Kalbelia refers to songs and dances associated with Kalbelia communities in Rajasthan. UNESCO lists “Kalbelia folk songs and dances of Rajasthan” on the Representative List of the Intangible Cultural Heritage of Humanity. The practice is a performing art: swirling black skirts, rapid footwork, and snake-related imagery appear in popular descriptions, but those visuals are not a license to invent ritual rules or “ancient secrets.”

For a student or traveller in or near Jaipur, Jodhpur, or Pushkar, the useful questions are narrower. Who performs, in what setting, and what has already been documented by UNESCO, the Ministry of Culture, or open scholarship? Stage shows for tourists can be skilled and paid work; they are not automatically the same as community ceremony. If a guide claims a step “always means” a specific myth, ask for a source. This card will not invent that meaning.

Respectful watching means not grabbing dancers for photos, not demanding “more authentic” versions, and not treating the community as an exhibit. If you ask a question this app cannot retrieve from the card and its cited pages, the answer is that we do not know — not a generated folk tale.

Kalbelia sits in a place–practice graph: Rajasthan as region, performing type, UNESCO badge with an outbound link. GI crafts of the same state (for example Jaipur blue pottery) are neighbours in the explorer, not the same item. A short quiz after this card only tests facts written here and in the listed sources.""",
    "sources": [
        src("https://ich.unesco.org/en/RL/kalbelia-folk-songs-and-dances-of-rajasthan-00340", "Kalbelia folk songs and dances of Rajasthan", "UNESCO ICH"),
        src(UNESCO, "India — elements on the Lists of ICH", "UNESCO"),
        src(MOC, "Intangible Cultural Heritage (Ministry of Culture)", "Ministry of Culture"),
        src(ICP, "Indian Culture Portal", "Ministry of Culture / ICP"),
        src(SAHA, "Sahapedia", "Sahapedia"),
    ],
    "quiz": quiz("Kalbelia — five checks", [
        q("Kalbelia is primarily classified here as which heritage type?", ["Craft / GI metalwork", "Performing art (song and dance)", "A national government archive", "A social video feed"], 1, "The card treats Kalbelia as a performing practice tied to Rajasthan communities."),
        q("Which body inscribed Kalbelia on a Representative List mentioned in this card?", ["Only a hotel association", "UNESCO ICH", "A private marketplace", "This student app as the official owner"], 1, "The UNESCO RL page is a primary outbound source."),
        q("If a tourist show and a community event differ, what does this card recommend?", ["Assume they are identical", "Invent a unifying myth", "Do not treat hotel shows as the only authentic context", "Ignore living performers"], 2, "Settings differ; the card refuses a fake single story."),
        q("What should you do if a fact is not in the card or its sources?", ["Ask a generic chatbot to fill it in", "Treat the gap as “we do not know”", "Copy a WhatsApp forward", "Scrape Sahapedia in full"], 1, "Grounded answers only; refuse otherwise."),
        q("Jaipur on this compass is mainly a…", ["Place node that can lead to living practices such as Kalbelia", "Replacement for the Archaeological Survey of India", "3D metaverse twin", "Payment marketplace"], 0, "Place ↔ practice graph, not an official archive clone."),
    ]),
})

add({
    "slug": "durga-puja-kolkata",
    "type": "festival",
    "title": "Durga Puja in Kolkata",
    "region": "west-bengal",
    "unesco_id": "00703",
    "gi_flag": False,
    "calendar_note": "Sharadiya / autumn (Ashwin). Exact city dates follow the Bengali calendar each year — store as season, not a fake Gregorian timestamp.",
    "tags": ["unesco", "festival", "kolkata", "bengal"],
    "languages": ["bn", "en"],
    "summary": "Neighbourhood-scale festival in Kolkata combining worship, public art (pandals), and civic gathering. UNESCO inscribed Durga Puja in Kolkata; this card is a learner path, not a temple timetable.",
    "body": """Durga Puja in Kolkata is a public, neighbourhood festival: temporary pavilions (pandals), images of the goddess Durga and her children, processions, food, and late-night walking routes. UNESCO inscribed “Durga Puja in Kolkata” on the Representative List. The Ministry of Culture and Indian Culture Portal discuss Durga Puja among India’s ICH narratives. That does not make this student app an official calendar.

Do / don’t for a first-time visitor, at the level this card can honestly support: do expect crowds and photography rules that vary by pandal committee; don’t assume every image or chant is free to commercialise; don’t invent caste or “secret tantra” explanations. Committee and household practices differ. If you need visarjan timing for a specific ghat, use a local notice, not a language model.

The innovation of Parampara Path is to bind the festival to West Bengal as a region, mark UNESCO, and let you ask only questions the retrieved text can answer. Quizzes are generated from this card, not from rumours. Contributions (a family memory of a particular para) stay unpublished until a human reviewer accepts them.

Patachitra and other Bengal crafts appear as separate items so the explorer does not collapse “Bengal culture” into one page.""",
    "sources": [
        src("https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00703", "Durga Puja in Kolkata", "UNESCO ICH"),
        src(UNESCO, "India — ICH state page", "UNESCO"),
        src(MOC, "MoC ICH page", "Ministry of Culture"),
        src("https://indianculture.gov.in/intangible-cultural-heritage", "ICP intangible cultural heritage", "Indian Culture Portal"),
        src(SAHA, "Sahapedia", "Sahapedia"),
    ],
    "quiz": quiz("Durga Puja Kolkata — five checks", [
        q("UNESCO’s inscription named in this card is for Durga Puja in…", ["Every Indian city equally", "Kolkata", "Only rural Bengal with no city form", "A theme park"], 1, "The RL title is Durga Puja in Kolkata."),
        q("How should exact visarjan times be treated in the MVP?", ["As invented precise timestamps", "As local notices, not LLM guesses", "As a paid Google Maps feature", "As AR overlays"], 1, "Calendar_note is seasonal; no fake dates."),
        q("A pandal is described here as…", ["A permanent ASI monument only", "A temporary public pavilion / neighbourhood stage", "A GI metal workshop", "A national exam hall"], 1, "Public art and gathering, temporary structures."),
        q("User-submitted para memories publish when?", ["Immediately", "After human review", "After blockchain stamping", "Never, because contributions are banned"], 1, "Unpublished until reviewed."),
        q("This product’s relationship to the Ministry of Culture is…", ["Official replacement portal", "Unofficial learner tool that points to official pages", "UMANG super-app module", "Google Arts & Culture"], 1, "Do not impersonate government."),
    ]),
})

add({
    "slug": "garba-of-gujarat",
    "type": "festival",
    "title": "Garba of Gujarat",
    "region": "gujarat",
    "unesco_id": "01962",
    "gi_flag": False,
    "calendar_note": "Navaratri (approx. September–October). Regional and diaspora events exist; do not invent a single “correct” step list.",
    "tags": ["unesco", "dance", "navaratri", "gujarat"],
    "languages": ["gu", "hi"],
    "summary": "Garba is a participatory dance-and-song practice of Gujarat, inscribed by UNESCO in 2023. The card separates living practice from club remix culture without shaming either.",
    "body": """Garba of Gujarat is a community dance traditionally associated with Navaratri, circling a lamp or image, with clapping patterns and songs. UNESCO inscribed Garba of Gujarat on the Representative List (2023). Variants exist across districts and in diaspora halls. This card will not publish a “one true choreography.”

A traveller in Ahmedabad or Vadodara during Navaratri may find municipal and neighbourhood events. Dress codes and gender mixing rules are local, not universal. Do not treat film choreography as ethnography. If you ask whether a specific mudra is mandatory, and it is not in the sources below, the system refuses.

Ajrakh and other Gujarati crafts are separate nodes. The compass job is: region Gujarat → Garba card → grounded Q&A → quiz. Social reels of Garba are out of MVP on purpose: they explode moderation risk.""",
    "sources": [
        src("https://ich.unesco.org/en/RL/garba-of-gujarat-01962", "Garba of Gujarat", "UNESCO ICH"),
        src(UNESCO, "India ICH list", "UNESCO"),
        src(MOC, "MoC ICH", "Ministry of Culture"),
        src(ICP, "Indian Culture Portal", "ICP"),
        src(SAHA, "Sahapedia", "Sahapedia"),
    ],
    "quiz": quiz("Garba — five checks", [
        q("Garba of Gujarat was inscribed by UNESCO in which year named on the official RL page cited here?", ["2008", "2018", "2023", "2030"], 2, "UNESCO RL for Garba of Gujarat is 2023."),
        q("This card’s stance on a single correct Garba step list is…", ["Publish one national syllabus", "Refuse to invent one true choreography", "Scrape every YouTube tutorial", "Replace Navaratri with a video game"], 1, "Variants exist; RAG must not hallucinate steps."),
        q("Navaratri timing in the MVP is stored as…", ["A fake exact timestamp for every city", "An approximate seasonal note", "A billed Maps API", "AR moon tracking"], 1, "Avoid fake festival dates."),
        q("Why is a Garba social feed out of this MVP?", ["Judges dislike dance", "Moderation, copyright, and communal-risk cost", "UNESCO forbids video", "Next.js cannot play video"], 1, "Appendix B / concept C rejection."),
        q("Ajrakh in this explorer is…", ["The same row as Garba", "A separate Gujarati craft item", "Not Indian", "A ministry chatbot"], 1, "Place–practice graph keeps types distinct."),
    ]),
})

add({
    "slug": "yoga",
    "type": "knowledge",
    "title": "Yoga",
    "region": "uttarakhand",
    "unesco_id": "01186",
    "gi_flag": False,
    "calendar_note": "International Day of Yoga is 21 June (UN). Living practice is year-round; studio marketing is not ICH law.",
    "tags": ["unesco", "knowledge", "practice"],
    "languages": ["sa", "hi", "en"],
    "summary": "Yoga is inscribed by UNESCO as an ICH element of India. This card is a source-attributed orientation, not a medical or guru-endorsement product.",
    "body": """Yoga appears on UNESCO’s Representative List as an Indian ICH element. The Ministry of Culture discusses yoga among living heritage narratives. Parampara Path places a learner card in the Uttarakhand / Himalayan foothills node because Rishikesh is a commonly searched place for practice — that is a navigation convenience, not a claim that yoga “belongs only” to one town.

What this card will not do: prescribe asanas for injury, certify teachers, or generate Sanskrit translations of closed lineages. If a question is medical, refuse. If a question is historical and not in the cited pages, refuse.

The product principle is attribution before animation. A quiz tests whether you noticed UNESCO listing and the unofficial-learner stance, not whether you can perform a headstand.

Related items (Vedic chanting, Kumbh) are neighbours in the knowledge/festival graph, not substitutes.""",
    "sources": [
        src("https://ich.unesco.org/en/RL/yoga-01186", "Yoga", "UNESCO ICH"),
        src(UNESCO, "India ICH", "UNESCO"),
        src(MOC, "MoC ICH", "Ministry of Culture"),
        src(ICP, "ICP", "Indian Culture Portal"),
        src("https://www.un.org/en/observances/yoga-day", "International Day of Yoga", "United Nations"),
    ],
    "quiz": quiz("Yoga card — five checks", [
        q("In this product, Yoga is typed as…", ["A GI handicraft", "Knowledge / living practice", "A native iOS game", "AR lens"], 1, "type=knowledge."),
        q("Medical asana advice from the Ask feature should be…", ["Freely generated", "Refused if not in retrieved cards", "Sold as a course", "Posted to a social feed"], 1, "Cite or refuse."),
        q("Placing Yoga under an Uttarakhand region node means…", ["Yoga exists only in Rishikesh by law", "A navigation convenience, not exclusive ownership", "UNESCO moved the capital", "ICP was shut down"], 1, "Honest IA, not fake geography."),
        q("International Day of Yoga is cited as…", ["21 June (UN observance)", "A random demo date", "Deepavali", "Only a private brand holiday"], 0, "UN observance is sourced."),
        q("This app is…", ["A yoga teacher council", "An unofficial learner compass with outbound sources", "The Ministry of AYUSH website", "A metaverse ashram"], 1, "Do not impersonate government."),
    ]),
})

add({
    "slug": "kumbh-mela",
    "type": "festival",
    "title": "Kumbh Mela",
    "region": "uttar-pradesh",
    "unesco_id": "01258",
    "gi_flag": False,
    "calendar_note": "Cycle of gatherings at rotating host cities; dates follow traditional calendars. Do not invent the next snan minute.",
    "tags": ["unesco", "festival", "pilgrimage"],
    "languages": ["hi", "en"],
    "summary": "Kumbh Mela is a large cyclical pilgrimage gathering inscribed by UNESCO. This card orients learners; it is not crowd-control or ticketing software.",
    "body": """Kumbh Mela is among India’s UNESCO-listed ICH elements: a massive, cyclical gathering of pilgrims, akharas, and temporary cities at rotating river sites. Host geography includes cities in Uttar Pradesh and other states depending on the cycle. This MVP pins a region node to Uttar Pradesh for discoverability (Prayagraj is a widely searched host) while stating clearly that the phenomenon is not “UP-only property.”

Safety, stamps, and exact bathing minutes are operational matters for authorities. This app must not hallucinate them. Ask may refuse crowd numbers that are not in the card. Contributions about family pilgrimage stay in a pending queue.

Do not depict restricted initiatory knowledge. Public festival description is enough for a student MVP.""",
    "sources": [
        src("https://ich.unesco.org/en/RL/kumbh-mela-01258", "Kumbh Mela", "UNESCO ICH"),
        src(UNESCO, "India ICH", "UNESCO"),
        src(MOC, "MoC ICH", "Ministry of Culture"),
        src(ICP, "ICP", "ICP"),
        src(SAHA, "Sahapedia", "Sahapedia"),
    ],
    "quiz": quiz("Kumbh — five checks", [
        q("Exact next snan timings in Ask should be…", ["Invented confidently", "Refused unless present in retrieved sources", "Sold via Maps billing", "Posted as reels"], 1, "No fake operational data."),
        q("The UP region pin is…", ["Legal exclusive ownership", "A discovery convenience with an explicit caveat", "A replacement for the mela administration", "A 3D twin"], 1, "Honest geography."),
        q("Kumbh is typed here as…", ["Craft", "Festival", "Programming language", "UMANG module"], 1, "festival."),
        q("Restricted initiatory content is…", ["Scraped in full", "Omitted / not touristified", "Required for MVP", "Generated by LLM"], 1, "Sensitivity principle."),
        q("Family pilgrimage stories go to…", ["Instant public comments", "A pending human-reviewed queue", "A social ranking feed", "Chain of blocks"], 1, "Contribution brakes."),
    ]),
})

# Remaining items: slightly shorter bodies, 3-question quizzes except we need 5 for all to make quizzes consistent - 3 is OK per plan for non-demo.

SHORT_QUIZ_EXTRA = True


def three(a, b, c):
    return [a, b, c]


def unesco_item(slug, title, typ, region, unesco_id, calendar, tags, langs, summary, body, extra_sources, questions):
    sources = [
        src(f"https://ich.unesco.org/en/RL/{slug.replace('_','-')}" if False else UNESCO, "India ICH state page", "UNESCO"),
        src(MOC, "MoC ICH", "Ministry of Culture"),
        src(ICP, "Indian Culture Portal", "ICP"),
        src(SAHA, "Sahapedia", "Sahapedia"),
    ]
    sources = extra_sources + sources
    add({
        "slug": slug, "type": typ, "title": title, "region": region, "unesco_id": unesco_id,
        "gi_flag": False, "calendar_note": calendar, "tags": tags, "languages": langs,
        "summary": summary, "body": body, "sources": sources,
        "quiz": quiz(f"{title} — checks", questions),
    })


unesco_item(
    "kutiyattam",
    "Kutiyattam, Sanskrit theatre",
    "performing",
    "kerala",
    "00010",
    "Temple and stage calendars vary; do not invent show times.",
    ["unesco", "theatre", "kerala"],
    ["ml", "sa"],
    "Kutiyattam is a Sanskrit theatre tradition of Kerala inscribed by UNESCO. Treat it as a specialist performing lineage, not a tourist skit generator.",
    """Kutiyattam (Koodiyattam) is a form of Sanskrit theatre practised in Kerala, with UNESCO inscription on the Representative List. Training, gesture vocabularies, and temple associations are specialised. This card will not generate a fake scene-by-scene script or claim that every Kerala tourist show is Kutiyattam.

For learners: use outbound UNESCO and MoC pages; respect that some performance contexts are not drop-in tourist products. Ask refuses costume “meanings” that are not in sources. Related Kerala nodes include Mudiyettu and Onam, which are different practices.""",
    [src("https://ich.unesco.org/en/RL/kutiyattam-sanskrit-theatre-00010", "Kutiyattam, Sanskrit theatre", "UNESCO ICH")],
    three(
        q("Kutiyattam is primarily…", ["A GI toy cluster", "Sanskrit theatre of Kerala", "A Punjab metalcraft", "A social DM product"], 1, "UNESCO performing element."),
        q("Fake scene scripts from Ask are…", ["Encouraged", "Out of scope / refuse if ungrounded", "Required by SIH"], 1, "No ungrounded generation."),
        q("Mudiyettu and Kutiyattam in this app are…", ["The same row", "Different Kerala practices", "Banned words"], 1, "Graph, not collapse."),
    ),
)

unesco_item(
    "chhau-dance",
    "Chhau dance",
    "performing",
    "odisha",
    "00337",
    "Seasonal and community performance calendars vary across Seraikella, Purulia, and Mayurbhanj styles.",
    ["unesco", "dance", "odisha"],
    ["or", "hi"],
    "Chhau is a masked or martial-inflected dance family spanning Odisha, Jharkhand, and West Bengal. MoC notes vulnerability to falling participation.",
    """Chhau dance is UNESCO-listed. Styles associated with Seraikella, Purulia, and Mayurbhanj are often distinguished in public literature; this card will not invent a fourth “official” national style. The Ministry of Culture has described Chhau as pressured by modern influences and declining participation — a reminder that living heritage is not guaranteed.

Odisha is the region pin for discovery; neighbouring states also host styles. Masks and martial vocabulary are documented at a high level; sacred or closed details are omitted. Do not use Ask to generate a combat manual.""",
    [src("https://ich.unesco.org/en/RL/chhau-dance-00337", "Chhau dance", "UNESCO ICH")],
    three(
        q("Chhau is listed by…", ["UNESCO ICH", "Only a marketplace", "This app as owner"], 0, "UNESCO RL."),
        q("This card’s Odisha pin means…", ["Other states never practised Chhau", "A discovery default; styles also exist across a wider belt", "ICP shutdown"], 1, "Honest geography."),
        q("MoC language about falling participation is used here to…", ["Shame communities", "Note that living heritage can be vulnerable", "Sell AR tickets"], 1, "Problem landscape."),
    ),
)

unesco_item(
    "sankirtana",
    "Sankirtana of Manipur",
    "performing",
    "manipur",
    "00508",
    "Temple and festival contexts; do not invent liturgy.",
    ["unesco", "manipur", "music"],
    ["mni"],
    "Sankirtana is a ritual singing-and-drumming practice of Manipur inscribed by UNESCO.",
    """Sankirtana (Manipur) is a UNESCO-listed performing/ritual singing practice with drums and dance in Vaishnava contexts as described on official ICH pages. This learner card will not reconstruct full liturgy, nor treat it as a nightclub genre.

Ask refuses unsourced claims about caste or “secret” verses. Contributions of family attendance memories are allowed as pending text, not as theology.""",
    [src("https://ich.unesco.org/en/RL/sankirtana-ritual-singing-drumming-and-dancing-of-manipur-00508", "Sankirtana of Manipur", "UNESCO ICH")],
    three(
        q("Sankirtana in this explorer is pinned to…", ["Manipur", "Only Gujarat", "Only Europe"], 0, "Region node."),
        q("Full liturgical reconstruction is…", ["MVP scope", "Out of scope", "Required AR"], 1, "Sensitivity."),
        q("Drumming here is described at…", ["A high-level sourced practice", "A DJ contest"], 0, "ICH performing."),
    ),
)

add({
    "slug": "thathera-jandiala-guru",
    "type": "craft",
    "title": "Thathera metal craft of Jandiala Guru",
    "region": "punjab",
    "unesco_id": "00865",
    "gi_flag": True,
    "calendar_note": "Workshop practice is ongoing; not a one-day festival.",
    "tags": ["unesco", "gi", "craft", "punjab"],
    "languages": ["pa", "hi"],
    "summary": "Traditional brass and copper utensil making of the Thatheras of Jandiala Guru, Punjab — UNESCO listed and a craft-economy story, not a souvenir mill.",
    "body": """The traditional brass and copper craft of the Thatheras of Jandiala Guru is a UNESCO-listed ICH element. Public descriptions emphasise hammered utensils and a specialised artisan community in Punjab. GI and craft-economy writing in India often treats metalware as livelihood plus authenticity — still poorly explained to youth, which is this product’s gap.

This card will not set prices, certify GI labels for a stall, or generate a metallurgy textbook. If you are at a fair, the learner job is: name, place, UNESCO pointer, and how-it-is-made at summary level. Phulkari is a neighbouring Punjab textile practice, not the same item.

Photos: prefer own or clearly licensed images later; captions must not imply Ministry ownership of this app.""",
    "sources": [
        src("https://ich.unesco.org/en/RL/traditional-brass-and-copper-craft-of-utensil-making-among-the-thatheras-of-jandiala-guru-punjab-india-00865", "Thatheras of Jandiala Guru", "UNESCO ICH"),
        src(UNESCO, "India ICH", "UNESCO"),
        src(MOC, "MoC ICH", "Ministry of Culture"),
        src("https://www.memeraki.com/blogs/posts/mapping-india-s-arts-and-crafts-heritage-through-g-i-tags", "GI crafts mapping (contextual)", "Memeraki"),
        src("https://presidencyuniversity.in/blog-details/safeguarding-traditional-art-forms-the-role-of-gi-tagged-handicrafts-and-artisans-in-sustainable-development", "GI handicrafts and livelihoods (contextual)", "Presidency University"),
    ],
    "quiz": quiz("Thathera — five checks", [
        q("Jandiala Guru is associated in this card with…", ["Brass and copper utensil craft", "Only Garba", "Only Durga Puja", "LiDAR scanning"], 0, "UNESCO metalcraft element."),
        q("GI-flag on this item means…", ["This app issues GI certificates", "Craft authenticity/livelihood is part of the learning frame", "Payments are enabled", "ICP was scraped wholesale"], 1, "Learner loop, not marketplace."),
        q("Price haggling scripts from Ask are…", ["In scope", "Out of scope", "Required"], 1, "Not a shop."),
        q("Phulkari is…", ["The same UNESCO metal element", "A separate Punjab textile practice", "A Kerala theatre"], 1, "Graph."),
        q("Youth-facing GI explanation is…", ["Already solved by every shop app", "Named as a gap this compass tries to fill", "Illegal"], 1, "Problem landscape."),
    ]),
})

unesco_item(
    "ramman",
    "Ramman, religious festival and ritual theatre of the Garhwal Himalayas",
    "festival",
    "uttarakhand",
    "00281",
    "Village festival cycle in Garhwal; do not invent the next date.",
    ["unesco", "uttarakhand", "theatre"],
    ["hi"],
    "Ramman is a UNESCO-listed religious festival and ritual theatre of Garhwal.",
    """Ramman combines festival and ritual theatre in the Garhwal Himalayas and is UNESCO-listed. It is place-specific. This card will not relocate it to a generic “hill station package.” Closed or highly local ritual details stay out. Yoga and Ramman share a region node but are different types.""",
    [src("https://ich.unesco.org/en/RL/ramman-religious-festival-and-ritual-theatre-of-the-garhwal-himalayas-india-00281", "Ramman", "UNESCO ICH")],
    three(
        q("Ramman is associated with…", ["Garhwal Himalayas", "Only Kanchipuram", "Only Kutch"], 0, "UNESCO title."),
        q("Inventing the next village date is…", ["Fine", "Against this card’s calendar rule", "Required"], 1, "No fake dates."),
        q("Yoga and Ramman are…", ["Identical", "Different items that can share a region node", "Both GI toys"], 1, "IA."),
    ),
)

unesco_item(
    "ramlila",
    "Ramlila, traditional performance of the Ramayana",
    "performing",
    "uttar-pradesh",
    "00110",
    "Often around Dussehra; local calendars vary widely.",
    ["unesco", "theatre", "ramayana"],
    ["hi", "aw"],
    "Ramlila is a traditional performance of the Ramayana, UNESCO-listed, with many local forms.",
    """Ramlila is UNESCO-listed as traditional performance of the Ramayana. Forms differ by town. This card refuses a single national script dump and refuses to adjudicate sectarian disputes. UP is a discovery pin because many well-known Ramlilas are discussed there; performances exist elsewhere. Durga Puja and Ramlila are different festival/theatre complexes.""",
    [src("https://ich.unesco.org/en/RL/ramlila-the-traditional-performance-of-the-ramayana-00110", "Ramlila", "UNESCO ICH")],
    three(
        q("Ramlila is…", ["One identical script everywhere", "A family of local performances of the Ramayana", "A GI silk"], 1, "Local forms."),
        q("Sectarian adjudication in Ask is…", ["Required", "Refused", "Monetised"], 1, "Ethics."),
        q("Approximate seasonal note is…", ["Around Dussehra, locally variable", "A fake UTC timestamp"], 0, "Calendar."),
    ),
)

unesco_item(
    "mudiyettu",
    "Mudiyettu",
    "ritual",
    "kerala",
    "00345",
    "Bhagavati / temple-related ritual theatre calendar; omit restricted practice details.",
    ["unesco", "kerala", "ritual"],
    ["ml"],
    "Mudiyettu is a ritual theatre of Kerala inscribed by UNESCO. Tourist packaging is not the same as temple permission.",
    """Mudiyettu is UNESCO-listed ritual theatre in Kerala. This card describes it at a public ICH level only. Do not autoplay chanting. Do not generate a how-to for costume or possession. Kutiyattam is a related but distinct Kerala performing lineage.""",
    [src("https://ich.unesco.org/en/RL/mudiyettu-ritual-theatre-and-dance-drama-of-kerala-00345", "Mudiyettu", "UNESCO ICH")],
    three(
        q("Audio of chanting in this product should be…", ["Autoplayed", "User-initiated only, if present at all", "Loud always"], 1, "Sacred sound ethics."),
        q("How-to possession guides are…", ["MVP", "Omitted", "AR"], 1, "Sensitivity flag territory."),
        q("Type enum used here is…", ["ritual", "craft", "knowledge-only"], 0, "ritual."),
    ),
)

unesco_item(
    "vedic-chanting",
    "Tradition of Vedic chanting",
    "oral",
    "uttar-pradesh",
    "00062",
    "Living oral transmission; not a playlist product.",
    ["unesco", "oral", "veda"],
    ["sa"],
    "UNESCO lists the tradition of Vedic chanting. This card will not dump copyrighted recitations or closed-school secrets.",
    """The tradition of Vedic chanting is a UNESCO-listed oral heritage. Transmission is specialised. This MVP will not host full recitation audio, autoplay mantras, or claim to replace a teacher. The UP pin is a weak geographic convenience for the explorer, not a statement that chanting exists only there. Ask refuses to “translate secretly” unsourced verses.""",
    [src("https://ich.unesco.org/en/RL/tradition-of-vedic-chanting-00062", "Tradition of Vedic chanting", "UNESCO ICH")],
    three(
        q("Full recitation dumps are…", ["In MVP", "Out of MVP", "Required by RAG"], 1, "Oral ethics."),
        q("Type is…", ["oral", "craft", "festival-only"], 0, "oral."),
        q("Autoplay sacred audio is…", ["Allowed", "Against the a11y/ethics notes", "Needed for judges"], 1, "No autoplay chanting."),
    ),
)

unesco_item(
    "buddhist-chanting-ladakh",
    "Buddhist chanting of Ladakh",
    "oral",
    "ladakh",
    "00265",
    "Monastic calendars; visitor access is not guaranteed.",
    ["unesco", "ladakh", "chanting"],
    ["bo"],
    "UNESCO lists Buddhist chanting of Ladakh. Treat monasteries as living communities, not film sets.",
    """Buddhist chanting of Ladakh is UNESCO-listed. Learners should expect that recording rules are local. This card will not generate a “secret tantra tourist pack.” Ask refuses unsourced claims about specific rites. Related: Yoga is a different knowledge item.""",
    [src("https://ich.unesco.org/en/RL/buddhist-chanting-of-ladakh-recitation-of-sacred-buddhist-texts-in-the-trans-himalayan-ladakh-region-jammu-and-kashmir-india-00265", "Buddhist chanting of Ladakh", "UNESCO ICH")],
    three(
        q("Recording inside monasteries…", ["Is always free", "Depends on local rules; this card does not override them", "Is billed via Maps"], 1, "Respect."),
        q("Region pin is…", ["Ladakh", "Kerala", "Kanchipuram"], 0, "ladakh."),
        q("Secret tourist tantra packs are…", ["Product feature", "Rejected", "GI-tagged"], 1, "Ethics."),
    ),
)

add({
    "slug": "deepavali",
    "type": "festival",
    "title": "Deepavali",
    "region": "tamil-nadu",
    "unesco_id": "02312",
    "gi_flag": False,
    "calendar_note": "Lunar calendar; national public holiday dates are announced annually. Regional names and emphases differ (Deepavali / Diwali).",
    "tags": ["unesco", "festival", "diwali"],
    "languages": ["ta", "hi", "en"],
    "summary": "Deepavali was inscribed by UNESCO in 2025. This card stresses regional variation and refuses a single pan-India ritual script.",
    "body": """Deepavali (Diwali) is listed on UNESCO’s India ICH page as an inscribed element (2025 inscription referenced in the research brief). Practices differ by region: lamps, Lakshmi puja, new year associations, Jain and Sikh observances, and local foodways. Tamil Nadu is a discovery pin, not exclusive ownership.

This card will not generate fireworks safety law for every municipal ward, nor a shopping list. Ask may refuse “what does every Hindu must do.” Pongal is a separate Tamil festival item. Kanchipuram silk may appear in gift economies but is a craft node, not the festival itself.""",
    "sources": [
        src("https://ich.unesco.org/en/RL/deepavali-02312", "Deepavali", "UNESCO ICH"),
        src(UNESCO, "India ICH including Deepavali", "UNESCO"),
        src(MOC, "MoC ICH", "Ministry of Culture"),
        src(ICP, "ICP", "ICP"),
        src(SAHA, "Sahapedia", "Sahapedia"),
    ],
    "quiz": quiz("Deepavali — five checks", [
        q("Deepavali regional variation in this card is…", ["Denied", "Stated as fact", "Replaced by one Bollywood scene"], 1, "Variants."),
        q("UNESCO RL cited for Deepavali uses id…", ["02312", "00703", "01962"], 0, "deepavali-02312."),
        q("Fireworks legal advice city-by-city is…", ["Generated", "Refused as ungrounded operational law", "A Maps SKU"], 1, "Refuse."),
        q("Pongal is…", ["The same UNESCO row", "A separate Tamil festival card", "A Punjab craft"], 1, "Graph."),
        q("The Tamil Nadu pin means…", ["Only Tamils observe lamps", "A discovery convenience with explicit non-exclusivity", "ICP clone"], 1, "IA honesty."),
    ]),
})

# GI / crafts / festivals 17-40

def craft(slug, title, region, gi, tags, langs, summary, body, sources, questions, calendar="Workshop / market calendars vary."):
    add({
        "slug": slug, "type": "craft", "title": title, "region": region, "unesco_id": None,
        "gi_flag": gi, "calendar_note": calendar, "tags": tags, "languages": langs,
        "summary": summary, "body": body, "sources": sources,
        "quiz": quiz(f"{title} — checks", questions),
    })


def fest(slug, title, region, tags, langs, calendar, summary, body, sources, questions, typ="festival"):
    add({
        "slug": slug, "type": typ, "title": title, "region": region, "unesco_id": None,
        "gi_flag": False, "calendar_note": calendar, "tags": tags, "languages": langs,
        "summary": summary, "body": body, "sources": sources,
        "quiz": quiz(f"{title} — checks", questions),
    })


GI_SRC = [
    src("https://www.memeraki.com/blogs/posts/mapping-india-s-arts-and-crafts-heritage-through-g-i-tags", "Mapping arts and crafts through GI tags", "Memeraki"),
    src("https://presidencyuniversity.in/blog-details/safeguarding-traditional-art-forms-the-role-of-gi-tagged-handicrafts-and-artisans-in-sustainable-development", "GI-tagged handicrafts and artisans", "Presidency University"),
    src(ICP, "Indian Culture Portal", "ICP"),
    src(SAHA, "Sahapedia", "Sahapedia"),
    src("https://map.sahapedia.org/", "Sahapedia Map", "Sahapedia"),
]

craft("jaipur-blue-pottery", "Jaipur blue pottery", "rajasthan", True,
      ["gi", "craft", "jaipur"], ["hi"],
      "Blue-glazed pottery associated with Jaipur — a GI craft learner card, not a shop.",
      """Jaipur blue pottery is a distinctive glazed ceramic practice associated with Jaipur, often discussed in GI and handicraft narratives. Quartz-based bodies and turquoise-blue palettes appear in public craft writing. This card will not certify a stall’s GI status or invent a Mughal origin story beyond what sources support.

At a mela, the job-to-be-done is name, region, GI-as-authenticity-frame, and making-at-summary-level. Kalbelia is a performing neighbour in Rajasthan, not a glaze recipe. Payments and marketplaces are out of MVP.""",
      GI_SRC + [src(MOC, "MoC ICH (national frame)", "Ministry of Culture")],
      three(
          q("Blue pottery here is…", ["A Rajasthan craft card", "A UNESCO dance", "A chat app"], 0, "craft."),
          q("This app issues GI certificates?", ["Yes", "No", "On-chain only"], 1, "Learner tool."),
          q("Kalbelia vs blue pottery…", ["Same item", "Different types in one region graph", "Unrelated continents"], 1, "Graph."),
      ))

craft("banarasi-brocade", "Banarasi brocade weaving", "uttar-pradesh", True,
      ["gi", "silk", "varanasi"], ["hi"],
      "Varanasi brocade/silk weaving as a GI craft story for learners.",
      """Banarasi weaving is widely discussed as a GI-tagged silk/brocade tradition of Varanasi. This card explains place and craft at summary level. It will not set gold-zari prices or generate caste commentary. Ramlila and Kumbh share the UP node as different types. Do not scrape full commercial catalogues.""",
      GI_SRC + [src(ICP, "ICP", "ICP")],
      three(
          q("Banarasi weaving is pinned to…", ["Uttar Pradesh / Varanasi frame", "Ladakh only", "Kerala theatre"], 0, "region."),
          q("Price lists in Ask…", ["Are invented", "Are refused if not in sources", "Are required"], 1, "Not a shop."),
          q("GI-flag means…", ["Learner authenticity frame", "In-app checkout"], 0, "No payments."),
      ))

craft("channapatna-toys", "Channapatna lacquer toys", "karnataka", True,
      ["gi", "toys", "karnataka"], ["kn"],
      "Wood-lacquer toys of Channapatna, Karnataka — GI craft, child-object making, not a game app.",
      """Channapatna toys are lacquered wooden toys associated with a Karnataka GI craft cluster. Vegetable dyes and turning techniques appear in public craft explainers. This card will not claim EN-71 lab results. Mysore inlay is a separate Karnataka craft. Native apps and 3D toys are out of MVP.""",
      GI_SRC,
      three(
          q("Channapatna is…", ["Karnataka toy craft", "Punjab metal UNESCO element", "Manipur Sankirtana"], 0, "craft."),
          q("Safety certification numbers…", ["Hallucinated", "Refused unless sourced", "NFT"], 1, "Refuse."),
          q("Type…", ["craft", "oral", "ritual"], 0, "craft."),
      ))

craft("kanchipuram-silk", "Kanchipuram silk weaving", "tamil-nadu", True,
      ["gi", "silk", "tamil-nadu"], ["ta"],
      "Temple-town silk weaving associated with Kanchipuram, framed for learners not couture checkout.",
      """Kanchipuram silk is a GI-associated weaving tradition of Tamil Nadu. Contrast borders and temple-town identity appear in public writing. This card will not authenticate a sari label. Deepavali and Pongal are festival neighbours. No marketplace.""",
      GI_SRC + [src(ICP, "ICP", "ICP")],
      three(
          q("Kanchipuram silk is…", ["Tamil Nadu craft", "Ladakh chanting", "Chhau"], 0, "craft."),
          q("Label authentication is…", ["In scope", "Out of scope", "AR only"], 1, "Not a lab."),
          q("Pongal vs silk…", ["Same row", "Different items", "Both UNESCO Deepavali"], 1, "Graph."),
      ))

craft("bidriware", "Bidriware", "telangana", True,
      ["gi", "metal", "deccan"], ["ur", "te"],
      "Zinc-alloy inlay metalware associated with Bidar/Hyderabad Deccan GI narratives.",
      """Bidriware is a dark metal inlay craft of the Deccan, often GI-tagged in craft mapping. Silver inlay on a darkened alloy is the public visual signature. This card will not reconstruct a full chemical recipe. Telangana is the pin; historical Bidar geography is acknowledged as wider than one modern state label. Thathera is a different metal story in Punjab.""",
      GI_SRC,
      three(
          q("Bidriware is…", ["Deccan metal inlay craft", "Garba", "Yoga"], 0, "craft."),
          q("Full chemical recipes…", ["Published as lab notes", "Not dumped here", "Required"], 1, "Summary level."),
          q("Thathera vs Bidri…", ["Identical", "Different regional metalcrafts", "Both Kerala theatre"], 1, "Graph."),
      ))

craft("madhubani-painting", "Madhubani / Mithila painting", "bihar", True,
      ["gi", "painting", "mithila"], ["hi"],
      "Wall and paper painting of the Mithila region — GI craft, not an NFT drop.",
      """Madhubani (Mithila) painting is a well-known Bihar GI/art practice: ritual wall painting that also exists on paper for wider markets. Motifs and gender of traditional practitioners are often discussed in public arts writing; this card will not exoticise communities. No comments-as-forum. Contributions of family wall-painting memories stay pending.""",
      GI_SRC + [src(SAHA, "Sahapedia", "Sahapedia")],
      three(
          q("Madhubani is pinned to…", ["Bihar / Mithila", "Ladakh", "Kerala Kutiyattam"], 0, "bihar."),
          q("Exoticising copy is…", ["Encouraged", "Against inclusion notes", "Required GI law"], 1, "Ethics."),
          q("NFTs are…", ["MVP", "Out (Appendix B adjacent)", "UNESCO mandate"], 1, "Scope."),
      ))

craft("warli-painting", "Warli painting", "maharashtra", True,
      ["gi", "painting", "warli"], ["mr"],
      "Warli painting of Maharashtra — living graphic language, not a generic “tribal sticker pack.”",
      """Warli painting is associated with Warli communities in Maharashtra, with public-domain-adjacent visual tropes (white on earth grounds) that are often misused in design. This card names the community as sources do and refuses “exotic tribe” copy. Ganesh Utsav is a separate festival node. Ask refuses unsourced claims about sacred images you may not reproduce.""",
      GI_SRC + [src(SAHA, "Sahapedia", "Sahapedia")],
      three(
          q("Warli painting is…", ["Maharashtra-associated living art", "Punjab Phulkari", "Kutiyattam"], 0, "craft."),
          q("“Exotic tribe” language is…", ["Allowed", "Banned by the inclusion section", "GI-required"], 1, "Inclusion."),
          q("Ganesh Utsav is…", ["The same GI row", "A separate festival item", "UNESCO Chhau"], 1, "Graph."),
      ))

craft("pattachitra", "Pattachitra", "odisha", True,
      ["gi", "painting", "odisha"], ["or"],
      "Cloth/palm-leaf painting traditions of Odisha (and related Bengal pata), framed carefully as living craft.",
      """Pattachitra refers to painting on cloth (and related pata traditions) associated especially with Odisha in GI conversations, with Bengal pata as a related but not identical practice. This card will not collapse them. Chhau is a performing neighbour in Odisha. Copyright: do not paste entire illustrated manuscripts.""",
      GI_SRC + [src(SAHA, "Sahapedia", "Sahapedia")],
      three(
          q("Pattachitra in this MVP is pinned to…", ["Odisha", "Ladakh", "Gujarat Garba"], 0, "odisha."),
          q("Bengal pata is treated as…", ["Always identical", "Related, not automatically the same row", "Illegal"], 1, "Precision."),
          q("Whole manuscript copy-paste is…", ["Allowed", "Against content strategy", "Required RAG"], 1, "Attribution not scrape."),
      ))

craft("chikankari", "Lucknow Chikankari", "uttar-pradesh", True,
      ["gi", "embroidery", "lucknow"], ["hi", "ur"],
      "White-on-white embroidery associated with Lucknow — GI craft learner card.",
      """Chikankari is an embroidery practice associated with Lucknow, often GI-tagged. This card stays at summary making-level. It will not rank workshops. Banarasi weaving is a different UP textile. No checkout.""",
      GI_SRC,
      three(
          q("Chikankari is associated with…", ["Lucknow / UP", "Kanchipuram only", "Ladakh chanting"], 0, "region."),
          q("Workshop rankings…", ["Invented", "Not this product", "AR"], 1, "Not Yelp."),
          q("Type…", ["craft", "festival", "oral"], 0, "craft."),
      ))

craft("kalamkari", "Kalamkari", "andhra-pradesh", True,
      ["gi", "textile", "andhra"], ["te"],
      "Hand-painted or block-printed narrative textiles of the Andhra coast, GI-framed.",
      """Kalamkari is a narrative textile practice of Andhra Pradesh (Srikalahasti/Machilipatnam traditions are often distinguished in public writing). This card will not merge them into one fake technique. Kondapalli toys are a separate AP craft. Temple imagery reproduction rules are not generated here.""",
      GI_SRC + [src(SAHA, "Sahapedia", "Sahapedia")],
      three(
          q("Kalamkari is…", ["Andhra textile craft", "Kalbelia dance", "Kumbh Mela"], 0, "craft."),
          q("Srikalahasti vs Machilipatnam…", ["Must be collapsed", "Often distinguished; this card will not fake-merge them", "Both Punjab"], 1, "Precision."),
          q("Kondapalli is…", ["Same row", "Separate AP craft", "UNESCO Yoga"], 1, "Graph."),
      ))

craft("dhokra", "Dhokra / bell-metal casting", "chhattisgarh", True,
      ["gi", "metal", "dhokra"], ["hi"],
      "Lost-wax bell-metal casting associated with central Indian craft belts including Chhattisgarh.",
      """Dhokra (lost-wax metal casting) is discussed across central and eastern India. This MVP uses a Chhattisgarh pin as a discovery default and states that related practices exist in neighbouring states. It will not dump a foundry safety manual. Bidri and Thathera are different metal systems.""",
      GI_SRC,
      three(
          q("Dhokra is…", ["Lost-wax metal craft", "Garba", "Deepavali"], 0, "craft."),
          q("The Chhattisgarh pin…", ["Bans other states", "Is a discovery default with a wider-belt caveat", "Is ASI law"], 1, "Honest geo."),
          q("Foundry safety manuals…", ["Generated", "Refused", "Required"], 1, "Refuse."),
      ))

craft("phulkari", "Phulkari embroidery", "punjab", True,
      ["gi", "embroidery", "punjab"], ["pa"],
      "Floral embroidery of Punjab — GI textile, distinct from Thathera metalcraft.",
      """Phulkari is a Punjab embroidery tradition often present in GI maps. This card stays with public descriptions of darn-stitch floral fields. It will not dictate wedding custom law. Thathera is the UNESCO metal neighbour in Punjab.""",
      GI_SRC,
      three(
          q("Phulkari is…", ["Punjab embroidery", "Kerala Sanskrit theatre", "Ladakh chanting"], 0, "craft."),
          q("Wedding law generation…", ["In scope", "Out of scope", "Maps SKU"], 1, "Refuse."),
          q("Thathera vs Phulkari…", ["Same UNESCO metal row", "Different Punjab practices", "Both Garba"], 1, "Graph."),
      ))

craft("kashmir-pashmina", "Kashmir Pashmina", "jammu-kashmir", True,
      ["gi", "textile", "kashmir"], ["ks", "ur"],
      "Fine wool weaving associated with Kashmir — authenticity discourse without a fake lab.",
      """Pashmina is a Kashmir GI/authenticity story in craft writing. This card will not run a fibre lab or invent a microscopic test. It will not collapse politics into a shopping slogan. Ask refuses unsourced “always 100%” claims for a specific stall.""",
      GI_SRC + [src(ICP, "ICP", "ICP")],
      three(
          q("Pashmina here is…", ["J&K craft knowledge card", "Chhau", "Mudiyettu"], 0, "craft."),
          q("In-app fibre lab…", ["Ships in week 1", "Out of MVP", "UNESCO required"], 1, "Scope."),
          q("GI-flag…", ["Checkout", "Authenticity learning frame", "AR"], 1, "Learner."),
      ))

craft("mysore-rosewood-inlay", "Mysore rosewood inlay", "karnataka", True,
      ["gi", "wood", "mysore"], ["kn"],
      "Wood inlay craft associated with Mysore, distinct from Channapatna toys.",
      """Mysore inlay (and related wood crafts) appear in Karnataka GI conversations. This card will not certify antique furniture. Channapatna toys are a different object class. No 3D LiDAR twin.""",
      GI_SRC,
      three(
          q("Mysore inlay is…", ["Karnataka wood craft", "Kalbelia", "Sankirtana"], 0, "craft."),
          q("LiDAR twins…", ["MVP", "Out (Appendix B)", "Required"], 1, "No 3D."),
          q("Channapatna vs inlay…", ["Same toys", "Different Karnataka crafts", "Both UNESCO Deepavali"], 1, "Graph."),
      ))

craft("kondapalli-toys", "Kondapalli toys", "andhra-pradesh", True,
      ["gi", "toys", "andhra"], ["te"],
      "Painted wooden toys of Kondapalli, Andhra Pradesh.",
      """Kondapalli toys are a painted wood-toy GI cluster in Andhra Pradesh. Distinct from Channapatna lacquer. This card will not invent EN test IDs. Kalamkari is a textile neighbour.""",
      GI_SRC,
      three(
          q("Kondapalli is…", ["AP wooden toys", "Punjab Phulkari", "Yoga"], 0, "craft."),
          q("Channapatna is…", ["Automatically identical", "A different toy craft in Karnataka", "UNESCO Kumbh"], 1, "Precision."),
          q("Type…", ["craft", "oral", "ritual"], 0, "craft."),
      ))

craft("ajrakh", "Ajrakh printing", "gujarat", True,
      ["gi", "textile", "kutch"], ["gu"],
      "Resist-dyed block printing associated with Kutch / Sindh-Kutch corridors.",
      """Ajrakh is a block-printed, resist-dyed textile practice associated with Kutch (and a wider Thar–Sindh world). This card uses a Gujarat pin and notes cross-border historical geography without turning into foreign-policy content. Garba is a festival neighbour. Natural-dye chemistry is summary-level only.""",
      GI_SRC + [src(SAHA, "Sahapedia", "Sahapedia")],
      three(
          q("Ajrakh is…", ["Gujarati/Kutch textile craft", "Chhau", "Ramlila"], 0, "craft."),
          q("Garba vs Ajrakh…", ["Same UNESCO dance row", "Different items in Gujarat", "Both Ladakh"], 1, "Graph."),
          q("Full dye chemistry…", ["Lab dump", "Summary only / refuse recipes if unsourced", "AR"], 1, "Refuse extra."),
      ))

craft("muga-silk", "Muga silk of Assam", "assam", True,
      ["gi", "silk", "assam"], ["as"],
      "Golden Muga silk of Assam — GI craft beside Bihu, not a checkout flow.",
      """Muga silk is an Assam GI identity craft: a golden silk from Antheraea assamensis in public science/craft writing. This card will not run a sericulture course. Bihu is the festival neighbour. No marketplace.""",
      GI_SRC,
      three(
          q("Muga is…", ["Assam silk craft", "Kalbelia", "Bidri"], 0, "craft."),
          q("Bihu is…", ["The same GI silk row", "A separate Assam festival", "UNESCO Kutiyattam"], 1, "Graph."),
          q("Sericulture course…", ["MVP", "Out", "Required RAG"], 1, "Scope."),
      ))

fest("onam", "Onam", "kerala", ["festival", "kerala"], ["ml"],
     "Chingam (Malayalam calendar); national/regional holiday dates vary by year.",
     "Harvest / Malayali new year festival of Kerala with public and household forms.",
     """Onam is a major Kerala festival with pookalam, sadya, and public events. It is not UNESCO-listed on this card. Kutiyattam and Mudiyettu are different Kerala practices. This card will not invent a single “authentic sadya menu” for every household. Ask refuses unsourced caste jokes.""",
     [src(ICP, "ICP", "ICP"), src(SAHA, "Sahapedia", "Sahapedia"), src(MOC, "MoC", "Ministry of Culture"), src("https://map.sahapedia.org/", "Sahapedia Map", "Sahapedia")],
     three(
         q("Onam is typed as…", ["festival", "craft", "oral-only"], 0, "festival."),
         q("Kutiyattam vs Onam…", ["Identical", "Different Kerala items", "Both GI toys"], 1, "Graph."),
         q("One true sadya for all…", ["Published as law", "Refused as over-universal", "AR"], 1, "Variants."),
     ))

fest("bihu", "Bihu", "assam", ["festival", "assam"], ["as"],
     "Three Bihus in the agricultural year (Bohag, Kati, Magh) — seasonal, not a fake timestamp.",
     "Assamese seasonal festival cycle with dance, music, and community gathering.",
     """Bihu refers to a set of Assamese seasonal festivals, of which Bohag Bihu is the most widely known nationally. This card will not collapse all three into one Bollywood number. Muga silk is a craft neighbour. Ask refuses unsourced claims about “the only real Bihu district.”""",
     [src(ICP, "ICP", "ICP"), src(SAHA, "Sahapedia", "Sahapedia"), src(MOC, "MoC", "Ministry of Culture"), src("https://map.sahapedia.org/", "Sahapedia Map", "Sahapedia")],
     three(
         q("Bihu is…", ["An Assam festival cycle", "Jaipur blue pottery", "Ladakh chanting"], 0, "festival."),
         q("Three Bihus…", ["Are denied", "Are named as a seasonal set", "Are GI metal"], 1, "Calendar note."),
         q("Muga vs Bihu…", ["Same row", "Craft vs festival neighbours", "Both UNESCO Garba"], 1, "Graph."),
     ))

fest("pongal", "Pongal", "tamil-nadu", ["festival", "tamil-nadu"], ["ta"],
     "Thai month (mid-January in many public calendars); multi-day household and community forms.",
     "Tamil harvest festival, distinct from Deepavali.",
     """Pongal is a Tamil harvest festival with multi-day household practices. Deepavali is a separate festival card. Kanchipuram silk is a craft neighbour. This card will not generate a fire-safety code for sugarcane burning in every village.""",
     [src(ICP, "ICP", "ICP"), src(SAHA, "Sahapedia", "Sahapedia"), src(MOC, "MoC", "Ministry of Culture"), src("https://map.sahapedia.org/", "Sahapedia Map", "Sahapedia")],
     three(
         q("Pongal vs Deepavali…", ["Forced identical", "Separate Tamil Nadu festival cards", "Both Bidri"], 1, "Graph."),
         q("Type…", ["festival", "craft", "knowledge-yoga"], 0, "festival."),
         q("Village burning bylaws…", ["Hallucinated", "Refused", "UNESCO RL"], 1, "Refuse."),
     ))

fest("ganesh-utsav", "Ganesh Utsav", "maharashtra", ["festival", "mumbai", "pune"], ["mr", "hi"],
     "Bhadrapada; visarjan days are local. Do not invent a ghat minute.",
     "Public Ganesha festival especially associated with Maharashtra cities.",
     """Ganesh Utsav / Ganesh Chaturthi is a major public festival in Maharashtra with household and mandal forms. Sahapedia Map’s city mapping is a related research neighbour, not something we scrape wholesale. Warli is a craft neighbour. Exact visarjan minutes are local notices, not RAG fiction.""",
     [src(ICP, "ICP", "ICP"), src(SAHA, "Sahapedia", "Sahapedia"), src("https://map.sahapedia.org/", "Sahapedia Map", "Sahapedia"), src(MOC, "MoC", "Ministry of Culture")],
     three(
         q("Visarjan minutes…", ["Invented", "Local notices, not LLM", "Maps billed"], 1, "Calendar."),
         q("Warli vs Ganesh Utsav…", ["Same GI painting", "Craft vs festival in Maharashtra", "Both Punjab"], 1, "Graph."),
         q("Scraping all Sahapedia Map…", ["Allowed", "Against Appendix B", "Required"], 1, "No scrapeware."),
     ))

fest("theyyam", "Theyyam", "kerala", ["ritual", "kerala"], ["ml"],
     "Shrine season in northern Kerala; access and photography rules are local.",
     "Ritual performance of northern Kerala. Public ICH-level description only; no how-to.",
     """Theyyam is a ritual performance tradition of northern Kerala, often discussed in open heritage writing. This card uses type=ritual, omits restricted knowledge, and will not generate possession manuals. Photography ethics are local. Kutiyattam and Mudiyettu are different Kerala items. Autoplay audio is forbidden.""",
     [src(SAHA, "Sahapedia", "Sahapedia"), src(ICP, "ICP", "ICP"), src(MOC, "MoC", "Ministry of Culture"), src("https://map.sahapedia.org/", "Sahapedia Map", "Sahapedia")],
     three(
         q("Theyyam type in this schema…", ["ritual", "craft", "knowledge-yoga"], 0, "ritual."),
         q("Possession how-to…", ["MVP", "Omitted", "AR"], 1, "Sensitivity."),
         q("Autoplay shrine audio…", ["Yes", "No", "Required"], 1, "Ethics."),
     ), typ="ritual")

fest("nawrouz-mumbai-parsi", "Nawrouz (Parsi New Year in Indian cities)", "maharashtra", ["festival", "parsi", "nawrouz"], ["gu", "en"],
     "March equinox period for many Nowruz observances; Parsi Jamshedi Navroz follows the Shahenshahi calendar — do not fake a single date.",
     "Nowruz is a UNESCO-listed multinational element; this card only orients Indian Parsi civic observance at summary level.",
     """Nawrouz/Nowruz is on UNESCO’s lists as a shared multinational heritage. This student card does not claim India owns it. It only orients learners to Parsi community new-year observance in Indian cities (Mumbai pin as discovery). It will not adjudicate calendar sects. Inventing a single “correct Indian Nowruz date” is refused.""",
     [src(UNESCO, "UNESCO ICH (see Nawrouz as shared element)", "UNESCO"), src(SAHA, "Sahapedia", "Sahapedia"), src(ICP, "ICP", "ICP"), src(MOC, "MoC", "Ministry of Culture")],
     three(
         q("This card claims India exclusively owns Nowruz?", ["Yes", "No", "Only via GI"], 1, "Shared ICH."),
         q("Calendar sects…", ["Adjudicated here", "Not adjudicated; dates not faked", "AR"], 1, "Refuse."),
         q("Mumbai pin is…", ["Exclusive ownership", "Discovery convenience", "UNESCO capital"], 1, "IA."),
     ))

craft("kangra-painting", "Kangra painting", "himachal-pradesh", True,
      ["gi", "painting", "pahari"], ["hi"],
      "Pahari miniature painting associated with Kangra, Himachal Pradesh.",
      """Kangra painting is a Pahari miniature tradition discussed in GI and museum writing. This card will not dump entire collections or generate fake accession numbers. It is a hill-region craft/knowledge of making, not a replacement for IGNCA. Photography of living ritual is not implied.""",
      GI_SRC + [src(ICP, "ICP", "ICP")],
      three(
          q("Kangra painting is pinned to…", ["Himachal Pradesh", "Kerala theatre", "Kutch Ajrakh"], 0, "himachal."),
          q("Fake accession numbers…", ["OK", "Refused", "Required"], 1, "Refuse."),
          q("Type…", ["craft", "festival", "oral"], 0, "craft."),
      ))

craft("khurja-pottery", "Khurja pottery", "uttar-pradesh", True,
      ["gi", "ceramics", "khurja"], ["hi"],
      "Ceramic cluster of Khurja, Uttar Pradesh — GI craft distinct from Jaipur blue pottery.",
      """Khurja pottery is a large ceramic cluster in Uttar Pradesh, often GI-mapped. Distinct from Jaipur blue pottery (different body, glaze, and place). This card will not invent lead-test certificates. Banarasi weaving and Chikankari are textile neighbours in UP, not ceramics.""",
      GI_SRC,
      three(
          q("Khurja vs Jaipur blue pottery…", ["Forced identical", "Different ceramic traditions", "Both UNESCO Kalbelia"], 1, "Precision."),
          q("Lead-test certificates…", ["Hallucinated", "Refused unless sourced", "AR"], 1, "Refuse."),
          q("Region…", ["Uttar Pradesh", "Ladakh", "Manipur"], 0, "UP."),
      ))


def main():
    assert len(ITEMS) == 40, len(ITEMS)
    slugs = [i["slug"] for i in ITEMS]
    assert len(slugs) == len(set(slugs)), slugs

    regions = []
    for r in REGIONS:
        regions.append({**r, "id": uid("region:" + r["slug"])})

    languages = [
        {"code": "en", "name": "English"},
        {"code": "hi", "name": "Hindi"},
        {"code": "bn", "name": "Bengali"},
        {"code": "gu", "name": "Gujarati"},
        {"code": "ta", "name": "Tamil"},
        {"code": "te", "name": "Telugu"},
        {"code": "kn", "name": "Kannada"},
        {"code": "ml", "name": "Malayalam"},
        {"code": "or", "name": "Odia"},
        {"code": "pa", "name": "Punjabi"},
        {"code": "mr", "name": "Marathi"},
        {"code": "as", "name": "Assamese"},
        {"code": "ur", "name": "Urdu"},
        {"code": "sa", "name": "Sanskrit"},
        {"code": "mni", "name": "Manipuri"},
        {"code": "raj", "name": "Rajasthani"},
        {"code": "aw", "name": "Awadhi"},
        {"code": "bo", "name": "Tibetan/Ladakhi (public label)"},
        {"code": "ks", "name": "Kashmiri"},
    ]

    items_out = []
    for it in ITEMS:
        iid = uid("item:" + it["slug"])
        rid = uid("region:" + it["region"])
        qid = uid("quiz:" + it["slug"])
        questions = []
        for idx, qq in enumerate(it["quiz"]["questions"]):
            questions.append({**qq, "id": uid(f"q:{it['slug']}:{idx}"), "sort_order": idx})
        items_out.append({
            "id": iid,
            "slug": it["slug"],
            "type": it["type"],
            "title": it["title"],
            "summary": it["summary"],
            "body": it["body"].strip(),
            "unesco_id": it["unesco_id"],
            "gi_flag": it["gi_flag"],
            "region_id": rid,
            "region_slug": it["region"],
            "calendar_note": it["calendar_note"],
            "sensitivity_flag": it["type"] in {"ritual", "oral"},
            "published": True,
            "tags": it["tags"],
            "languages": it["languages"],
            "sources": [{**s, "id": uid(f"src:{it['slug']}:{s['url']}")} for s in it["sources"]],
            "quiz": {
                "id": qid,
                "item_id": iid,
                "title": it["quiz"]["title"],
                "questions": questions,
            },
        })

    catalogue = {
        "generated_on": ACCESSED,
        "disclaimer": "Unofficial student learner tool. Not affiliated with the Ministry of Culture, UNESCO, AICTE, or Sahapedia.",
        "regions": regions,
        "languages": languages,
        "items": items_out,
    }

    root = Path(__file__).resolve().parents[1]
    data = root / "src" / "data"
    data.mkdir(parents=True, exist_ok=True)
    json_path = data / "catalogue.json"
    json_path.write_text(json.dumps(catalogue, ensure_ascii=False, indent=2), encoding="utf-8")

    csv_path = root / "data" / "seed-heritage-cards.csv"
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    with csv_path.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow([
            "slug", "title", "type", "region_slug", "unesco_id", "gi_flag",
            "summary", "body", "calendar_note", "tags", "source_urls", "quiz_title",
        ])
        for it in items_out:
            w.writerow([
                it["slug"], it["title"], it["type"], it["region_slug"],
                it["unesco_id"] or "", it["gi_flag"], it["summary"], it["body"],
                it["calendar_note"], "|".join(it["tags"]),
                " | ".join(s["url"] for s in it["sources"]),
                it["quiz"]["title"],
            ])

    print("items", len(items_out), "json", json_path, "csv", csv_path)


if __name__ == "__main__":
    main()
