import type { DestinationBundle, LocalPartner } from "@/lib/place-types";

const src = (
  id: string,
  title: string,
  url: string,
  publisher: string,
  accessed_on = "2026-11-19",
) => ({ id, title, url, publisher, accessed_on });

const VERIFIED = "2026-11-19";

export const udaipurBundle: DestinationBundle = {
  destination: {
    id: "dest-udaipur",
    slug: "udaipur",
    kind: "city",
    name: "Udaipur",
    parent_slug: "rajasthan",
    state_ut: "Rajasthan",
    lat: 24.5854,
    lng: 73.7125,
    summary:
      "Udaipur is a lake city of palaces, temples, craft lanes, and living music. Walk a suggested heritage route, then open food, travel, and modern India layers with sources on every stop.",
    hero_image: {
      src: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
      alt: "Lake Pichola and palace skyline in Udaipur",
      credit: "Photo via Unsplash (Udaipur lakeside)",
    },
    related_card_slugs: ["kalbelia"],
  },
  places: [
    {
      id: "pl-udaipur-city-palace",
      slug: "city-palace-udaipur",
      destination_slug: "udaipur",
      name: "City Palace",
      category: "palace",
      what_it_is:
        "A large palace complex on the east bank of Lake Pichola, built and expanded by the Mewar rulers. Parts operate as museums open to visitors under official ticket rules.",
      why_it_matters:
        "It anchors Udaipur’s court history and shows how lake, fortification, and ceremonial spaces were planned together. Keeping museums funded and respectful keeps public access to that story.",
      what_to_notice: [
        "Mor Chowk peacock mosaics and mirror work",
        "Sequential courtyards stepping down toward the lake",
        "Jali screens filtering light into private and public rooms",
      ],
      respectful_visit:
        "Follow museum photography rules, keep voices low in gallery rooms, and do not touch painted or inlaid surfaces. Confirm ticket and timing on the official museum site before you go.",
      lat: 24.5764,
      lng: 73.6835,
      route_order: 1,
      nearby_lesser_known_slugs: ["bagore-ki-haveli", "old-city-lanes-udaipur"],
      sources: [
        src(
          "s-cp-1",
          "City Palace Museum, Udaipur",
          "https://www.eternalmewar.in/city-palace-museum",
          "Eternal Mewar / City Palace Museum",
        ),
        src(
          "s-cp-2",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: [
          "Use official ticket counters",
          "Support museum shops that credit local artisans when labelled",
          "Ask before photographing staff or living ceremonies",
        ],
        official_support_links: [
          {
            label: "City Palace Museum",
            url: "https://www.eternalmewar.in/city-palace-museum",
          },
        ],
      },
    },
    {
      id: "pl-udaipur-pichola",
      slug: "lake-pichola",
      destination_slug: "udaipur",
      name: "Lake Pichola",
      category: "nature",
      what_it_is:
        "An artificial lake that frames Udaipur’s palaces and island buildings. Boat services and lakeside walks are regulated by local operators and authorities.",
      why_it_matters:
        "The lake is the city’s visual and ecological centre. Water levels and access change with season and regulation, so visitor plans should follow current notices.",
      what_to_notice: [
        "Palace silhouettes reflected at calm water",
        "Island structures such as Jag Mandir from the water",
        "Ghats used for everyday lake edge life",
      ],
      respectful_visit:
        "Use authorised boats only, avoid littering, and do not feed wildlife. Photography of private boats or people needs a clear yes first.",
      lat: 24.5726,
      lng: 73.6803,
      route_order: 2,
      nearby_lesser_known_slugs: ["saheliyon-ki-bari", "shilpgram-udaipur"],
      sources: [
        src(
          "s-lp-1",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: [
          "Choose licensed boat operators",
          "Carry waste out of the lake edge",
        ],
      },
    },
    {
      id: "pl-udaipur-jagdish",
      slug: "jagdish-temple",
      destination_slug: "udaipur",
      name: "Jagdish Temple",
      category: "temple",
      what_it_is:
        "A busy Hindu temple near the City Palace, known for carved stone and an active worship schedule. It is a living religious place first, a tourist stop second.",
      why_it_matters:
        "The temple shows continuous devotion in the old city. Visitors who treat it only as a photo set miss why the community keeps it open and cared for.",
      what_to_notice: [
        "Stone carving on outer walls and shikhara",
        "Queue patterns and offering practices of devotees",
        "Footwear and dress expectations at the entrance",
      ],
      respectful_visit:
        "Remove shoes where asked, cover shoulders, stay outside sanctum rules, and never interrupt prayer for photos. This site may raise a Handle with care note for active ritual.",
      lat: 24.5795,
      lng: 73.6839,
      route_order: 3,
      sensitivity_flag: true,
      nearby_lesser_known_slugs: ["old-city-lanes-udaipur"],
      sources: [
        src(
          "s-jt-1",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: [
          "Donate only through temple-authorised channels if you choose to",
          "Do not tip people who claim unofficial access",
        ],
      },
    },
    {
      id: "pl-udaipur-bagore",
      slug: "bagore-ki-haveli",
      destination_slug: "udaipur",
      name: "Bagore ki Haveli",
      category: "heritage_site",
      what_it_is:
        "A lakeside haveli museum with restored rooms and an evening cultural programme in many seasons. Check the operator’s current schedule rather than assuming nightly shows.",
      why_it_matters:
        "It preserves domestic-scale Mewar architecture and hosts performance that can employ local artists. Programmes vary; treat listings as changeable.",
      what_to_notice: [
        "Courtyard proportions of a noble household",
        "Museum rooms interpreting daily courtly life",
        "Evening stage setup if a programme is running",
      ],
      respectful_visit:
        "Buy tickets from the official counter, keep aisles clear during shows, and ask before photographing performers.",
      lat: 24.5802,
      lng: 73.6821,
      route_order: 4,
      lesser_known: true,
      related_card_slugs: ["kalbelia"],
      sources: [
        src(
          "s-bh-1",
          "West Zone Cultural Centre",
          "https://www.wzccindia.com/",
          "West Zone Cultural Centre",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: [
          "Applaud performers; do not demand encores that break house rules",
          "Prefer programme tickets that credit artists",
        ],
      },
    },
    {
      id: "pl-udaipur-shilpgram",
      slug: "shilpgram-udaipur",
      destination_slug: "udaipur",
      name: "Shilpgram",
      category: "craft_street",
      what_it_is:
        "An open-air craft complex associated with the West Zone Cultural Centre, with regional huts and periodic crafts fairs. Opening patterns follow centre schedules.",
      why_it_matters:
        "It was designed to spotlight crafts from western India and give makers a public platform. Buying through fair or centre channels supports that intent when labelled clearly.",
      what_to_notice: [
        "Regional hut architecture for different states",
        "Live craft demonstrations during fair periods",
        "Labels that name the artisan or cooperative",
      ],
      respectful_visit:
        "Ask before photographing makers at work, pay fair posted prices, and do not treat workshops as free product studios.",
      lat: 24.569,
      lng: 73.666,
      route_order: 5,
      nearby_lesser_known_slugs: ["hathi-pol-craft-street"],
      sources: [
        src(
          "s-sg-1",
          "West Zone Cultural Centre",
          "https://www.wzccindia.com/",
          "West Zone Cultural Centre",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: [
          "Buy direct from labelled artisan stalls",
          "Carry cash as a backup when card networks fail at fairs",
        ],
        official_support_links: [
          { label: "West Zone Cultural Centre", url: "https://www.wzccindia.com/" },
        ],
      },
    },
    {
      id: "pl-udaipur-saheliyon",
      slug: "saheliyon-ki-bari",
      destination_slug: "udaipur",
      name: "Saheliyon ki Bari",
      category: "heritage_site",
      what_it_is:
        "A garden complex with fountains, marble kiosks, and lotus pools, presented as a pleasure garden of the Mewar court. It is a ticketed public garden under municipal or tourism management patterns that can change.",
      why_it_matters:
        "It shows garden design as court culture, not only fortress stone. Quiet walking keeps the place usable for residents and visitors alike.",
      what_to_notice: [
        "Fountain axes and water channels",
        "Marble elephant and kiosk detailing",
        "Seasonal flower beds when maintained",
      ],
      respectful_visit:
        "Stay on paths, do not enter fenced fountain basins, and confirm ticket rules at the gate.",
      lat: 24.6002,
      lng: 73.6834,
      route_order: 6,
      lesser_known: true,
      sources: [
        src(
          "s-skb-1",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: ["Use bins; gardens suffer most from casual litter"],
      },
    },
    {
      id: "pl-udaipur-old-city",
      slug: "old-city-lanes-udaipur",
      destination_slug: "udaipur",
      name: "Old city lanes",
      category: "market",
      what_it_is:
        "A dense maze of residential and shop lanes between the City Palace ridge and lake edges. Everyday life, small temples, and craft shops share the same streets.",
      why_it_matters:
        "The lanes keep Udaipur’s living city visible beyond palace tickets. Spending in small shops spreads benefit beyond the main monuments.",
      what_to_notice: [
        "Painted door frames and jharokha windows",
        "Neighbourhood shrines set into walls",
        "Morning delivery rhythms before tourist crowds",
      ],
      respectful_visit:
        "Keep lanes clear for residents, ask before photographing people at doorways, and do not block shop fronts for selfies.",
      lat: 24.5788,
      lng: 73.6848,
      route_order: 7,
      lesser_known: true,
      nearby_lesser_known_slugs: ["hathi-pol-craft-street"],
      sources: [
        src(
          "s-oc-1",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: [
          "Buy from family shops with clear prices",
          "Hire guides who show credentials when you want interpretation",
        ],
      },
    },
    {
      id: "pl-udaipur-hathi-pol",
      slug: "hathi-pol-craft-street",
      destination_slug: "udaipur",
      name: "Hathi Pol craft street",
      category: "craft_street",
      what_it_is:
        "A craft and textile shopping belt near the old city approaches, with miniature painting, textiles, and souvenir workshops of uneven quality.",
      why_it_matters:
        "It is where many visitors first meet Udaipur crafts. Choosing makers who explain materials and credit artists helps keep skilled work viable.",
      what_to_notice: [
        "Miniature painting boards and brush sets",
        "Block-print and bandhani textile stacks",
        "Workshop rooms behind retail fronts when open to guests",
      ],
      respectful_visit:
        "Ask before filming painters, agree prices clearly, and decline wildlife products or dubious “antique” claims without paperwork.",
      lat: 24.5825,
      lng: 73.6865,
      route_order: 8,
      lesser_known: true,
      sources: [
        src(
          "s-hp-1",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: [
          "Prefer workshops that name the painter",
          "Skip pressure tactics; walk away kindly",
        ],
      },
    },
    {
      id: "pl-udaipur-jag-mandir",
      slug: "jag-mandir",
      destination_slug: "udaipur",
      name: "Jag Mandir",
      category: "palace",
      what_it_is:
        "An island palace on Lake Pichola, reached by authorised boat. Parts have operated as heritage hospitality and garden viewing under private management rules.",
      why_it_matters:
        "Island palaces show how Mewar used the lake as a ceremonial landscape. Access depends on boat and venue rules, so check before promising a visit.",
      what_to_notice: [
        "Elephant statues at the landing",
        "Garden courts set for water views",
        "Stone carving facing the open lake",
      ],
      respectful_visit:
        "Use authorised boats, follow venue dress and photography rules, and treat staff areas as closed.",
      lat: 24.5675,
      lng: 73.678,
      route_order: 9,
      nearby_lesser_known_slugs: ["saheliyon-ki-bari"],
      sources: [
        src(
          "s-jm-1",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: ["Keep plastic off the island and boats"],
      },
    },
    {
      id: "pl-udaipur-monsoon",
      slug: "monsoon-palace-sajjangarh",
      destination_slug: "udaipur",
      name: "Monsoon Palace (Sajjangarh)",
      category: "palace",
      what_it_is:
        "A hilltop palace overlook above Udaipur, often visited at sunset for the city and lake panorama. Road access and park rules are set by local authorities.",
      why_it_matters:
        "The viewpoint explains why lake cities were sited in bowl valleys. Crowds at sunset need patience and litter discipline.",
      what_to_notice: [
        "City and lake grid from above",
        "Wind and cloud movement before monsoon",
        "Palace silhouette against western light",
      ],
      respectful_visit:
        "Stay behind barriers, avoid drones where banned, and confirm park hours at the gate. This app does not invent opening hours.",
      lat: 24.5935,
      lng: 73.6395,
      route_order: 10,
      lesser_known: true,
      sources: [
        src(
          "s-mp-1",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: ["Carry water bottles back down; hill sites collect trash fast"],
      },
    },
    {
      id: "pl-udaipur-fateh-sagar",
      slug: "fateh-sagar-lake",
      destination_slug: "udaipur",
      name: "Fateh Sagar Lake",
      category: "nature",
      what_it_is:
        "A large lake north of the old city with a promenade, island garden access by boat in many seasons, and local evening walking culture.",
      why_it_matters:
        "Residents use it as an everyday public space. Visitors who share the path calmly help keep it welcoming.",
      what_to_notice: [
        "Promenade lighting at dusk",
        "Island Nehru Garden boat traffic when running",
        "Local families walking after heat breaks",
      ],
      respectful_visit:
        "Yield space to walkers, use authorised boats only, and skip loud portable speakers.",
      lat: 24.6008,
      lng: 73.6785,
      route_order: 11,
      lesser_known: true,
      sources: [
        src(
          "s-fs-1",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: ["Support lakeside cart vendors with fair payment; skip plastic when possible"],
      },
    },
    {
      id: "pl-udaipur-vintage",
      slug: "vintage-car-museum-udaipur",
      destination_slug: "udaipur",
      name: "Vintage car collection (Garden Hotel area)",
      category: "heritage_site",
      what_it_is:
        "A publicly advertised vintage automobile collection associated with the Mewar household’s historic cars, typically visited with a separate ticket. Confirm location and hours on the operator’s page.",
      why_it_matters:
        "It shows twentieth-century court mobility as part of modern heritage, not only medieval stone. Collections change display; rely on the venue’s own list.",
      what_to_notice: [
        "Coachwork and royal insignia on cars",
        "Labels that name year and make when provided",
        "How transport tech entered palace life",
      ],
      respectful_visit:
        "Do not touch vehicles, follow indoor photography rules, and buy tickets only at the official desk.",
      lat: 24.576,
      lng: 73.698,
      route_order: 12,
      lesser_known: true,
      sources: [
        src(
          "s-vc-1",
          "Eternal Mewar",
          "https://www.eternalmewar.in/",
          "Eternal Mewar",
        ),
      ],
      last_verified: VERIFIED,
      give_back: {
        tips: ["Ticket revenue supports upkeep when bought through official channels"],
      },
    },
  ],
  experiences: [
    {
      id: "ex-food-dal-baati",
      slug: "dal-baati-churma",
      destination_slug: "udaipur",
      type: "food",
      title: "Dal baati churma",
      story:
        "A Rajasthan thali staple of baked wheat balls, lentil dal, and sweet crumbled churma. In Udaipur it appears in family kitchens and simple eateries more than in palace menus.",
      details:
        "Look for places that bake baati in a traditional oven when labelled. This app does not invent prices or “best restaurant” ranks; ask locals and check recent reviews yourself.",
      dietary_labels: ["vegetarian"],
      sources: [
        src(
          "s-food-1",
          "Rajasthan cuisine notes (tourism)",
          "https://tourism.rajasthan.gov.in/",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "ex-food-gatte",
      slug: "gatte-ki-sabzi",
      destination_slug: "udaipur",
      type: "food",
      title: "Gatte ki sabzi",
      story:
        "Gram-flour dumplings cooked in a spiced yogurt or tomato gravy, common across Rajasthan households and thali counters.",
      details:
        "Often vegetarian and widely available. Spice levels vary; ask before ordering if you need milder food.",
      dietary_labels: ["vegetarian"],
      sources: [
        src(
          "s-food-2",
          "Rajasthan cuisine notes (tourism)",
          "https://tourism.rajasthan.gov.in/",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "ex-food-ker-sangri",
      slug: "ker-sangri",
      destination_slug: "udaipur",
      type: "food",
      title: "Ker sangri",
      story:
        "A desert bean and berry dish tied to arid-zone foraging and preservation knowledge. It appears on Rajasthan thalis when in season or when kitchens keep dried stock.",
      details:
        "Ask whether the kitchen uses traditionally dried ker and sangri. Availability is seasonal; absence is normal outside supply windows.",
      dietary_labels: ["vegetarian", "vegan_friendly"],
      sources: [
        src(
          "s-food-3",
          "Rajasthan cuisine notes (tourism)",
          "https://tourism.rajasthan.gov.in/",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "ex-food-laal-maas",
      slug: "laal-maas-note",
      destination_slug: "udaipur",
      type: "food",
      title: "Laal maas (non-vegetarian classic)",
      story:
        "A red, chilli-forward mutton curry associated with Rajasthan court and hunting-camp cooking stories in popular food writing. Recipes and heat levels differ widely by cook.",
      details:
        "Order only where kitchens clearly label meat handling. Vegetarian travellers can skip without missing the rest of the city’s food map.",
      dietary_labels: ["non_vegetarian"],
      sources: [
        src(
          "s-food-4",
          "Rajasthan cuisine notes (tourism)",
          "https://tourism.rajasthan.gov.in/",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "ex-food-mirchi-vada",
      slug: "mirchi-vada-snack",
      destination_slug: "udaipur",
      type: "food",
      title: "Mirchi vada and street snacks",
      story:
        "Chilli fritters and tea-time snacks appear at carts near markets and lake promenades. Street food is local livelihood; hygiene varies by stall.",
      details:
        "Choose busy stalls with visible frying, carry hand sanitiser, and skip raw garnish if your stomach is sensitive. No inventing “safest stall” claims here.",
      dietary_labels: ["vegetarian"],
      related_place_slugs: ["old-city-lanes-udaipur", "fateh-sagar-lake"],
      sources: [
        src(
          "s-food-5",
          "Rajasthan cuisine notes (tourism)",
          "https://tourism.rajasthan.gov.in/",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "ex-food-malpua",
      slug: "malpua-rabri",
      destination_slug: "udaipur",
      type: "food",
      title: "Malpua and rabri sweets",
      story:
        "Sweet shops serve fried malpua pancakes with thickened milk rabri, especially around festivals and winter evenings.",
      details:
        "Share portions; sweets are dense. Ask about ghee and milk if you have dietary limits.",
      dietary_labels: ["vegetarian"],
      sources: [
        src(
          "s-food-6",
          "Rajasthan cuisine notes (tourism)",
          "https://tourism.rajasthan.gov.in/",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "ex-travel-reach",
      slug: "how-to-reach-udaipur",
      destination_slug: "udaipur",
      type: "travel",
      title: "How to reach Udaipur",
      story:
        "Udaipur is linked by road, rail, and Maharana Pratap Airport (UDR). Long-distance travellers often combine train or flight with a short taxi or bus into the lake city.",
      details:
        "Confirm live schedules on official IRCTC, airline, and airport channels. This app never invents departure times or fares.",
      sources: [
        src(
          "s-tr-1",
          "Airports Authority of India",
          "https://www.aai.aero/",
          "Airports Authority of India",
        ),
        src(
          "s-tr-2",
          "IRCTC",
          "https://www.irctc.co.in/",
          "IRCTC",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "ex-travel-local",
      slug: "getting-around-udaipur",
      destination_slug: "udaipur",
      type: "travel",
      title: "Getting around the city",
      story:
        "Auto-rickshaws, taxis, and walking cover the old city; hills and lake edges need paced plans in heat.",
      details:
        "Agree fares before rides when meters are absent, prefer daylight for steep lanes, and ask hotels for current strike or road-closure notes.",
      sources: [
        src(
          "s-tr-3",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "ex-travel-season",
      slug: "best-season-udaipur",
      destination_slug: "udaipur",
      type: "travel",
      title: "Best season and heat notes",
      story:
        "October to March is the most visited cool season. Summers are hot; monsoon brings lake drama and slippery stones.",
      details:
        "Carry water, sun cover, and non-slip shoes for ghats. Festival crowds change hotel availability; book through transparent channels.",
      sources: [
        src(
          "s-tr-4",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "ex-travel-access",
      slug: "safety-access-udaipur",
      destination_slug: "udaipur",
      type: "travel",
      title: "Safety and accessibility notes",
      story:
        "Palace complexes and old lanes include stairs, uneven stone, and limited lift access. Lake edges can be crowded at sunset.",
      details:
        "Ask venues about step-free routes before buying tickets. Keep valuables close in markets. Emergency numbers and hospital choices should come from current local advice, not this static note.",
      sources: [
        src(
          "s-tr-5",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
  ],
  modern_items: [
    {
      id: "mod-udaipur-studios",
      slug: "design-studios-udaipur",
      destination_slug: "udaipur",
      theme: "design",
      title: "Design studios reworking local print and metal",
      summary:
        "Independent studios in and around Udaipur reinterpret block print, miniature motifs, and metal craft for contemporary products. Look for makers who name the craft lineage they borrow from.",
      related_place_slugs: ["hathi-pol-craft-street", "shilpgram-udaipur"],
      related_card_slugs: ["jaipur-blue-pottery"],
      sources: [
        src(
          "s-mod-1",
          "West Zone Cultural Centre",
          "https://www.wzccindia.com/",
          "West Zone Cultural Centre",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "mod-udaipur-cafes",
      slug: "cafe-food-entrepreneurs-udaipur",
      destination_slug: "udaipur",
      theme: "cafe",
      title: "Cafes and food entrepreneurs by the lakes",
      summary:
        "Lakeside and old-city cafes mix regional snacks with newer menus. Many are small family or first-generation businesses; check allergen labelling yourself.",
      related_place_slugs: ["lake-pichola", "old-city-lanes-udaipur"],
      sources: [
        src(
          "s-mod-2",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "mod-udaipur-cowork",
      slug: "cowork-startups-udaipur",
      destination_slug: "udaipur",
      theme: "startup",
      title: "Co-working and small startups",
      summary:
        "A thin but growing layer of co-working desks and tourism-tech or craft-commerce startups sits outside the palace belt. Listings change quickly; verify addresses on the venue’s own site.",
      sources: [
        src(
          "s-mod-3",
          "Startup India",
          "https://www.startupindia.gov.in/",
          "Government of India",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "mod-udaipur-music",
      slug: "music-events-udaipur",
      destination_slug: "udaipur",
      theme: "music",
      title: "Festivals and music nights",
      summary:
        "Seasonal festivals and haveli programmes host folk and fusion sets. Confirm dates on organiser pages; do not assume nightly shows year-round.",
      related_place_slugs: ["bagore-ki-haveli"],
      related_card_slugs: ["kalbelia"],
      sources: [
        src(
          "s-mod-4",
          "West Zone Cultural Centre",
          "https://www.wzccindia.com/",
          "West Zone Cultural Centre",
        ),
      ],
      last_verified: VERIFIED,
    },
    {
      id: "mod-udaipur-sustain",
      slug: "craft-revival-sustainability-udaipur",
      destination_slug: "udaipur",
      theme: "sustainability",
      title: "Craft revival and lake-care projects",
      summary:
        "NGO and civic efforts periodically address lake cleanliness and craft livelihoods. Support only through verified organisation pages; ignore cash collectors without credentials.",
      related_place_slugs: ["lake-pichola", "shilpgram-udaipur"],
      sources: [
        src(
          "s-mod-5",
          "Rajasthan Tourism",
          "https://tourism.rajasthan.gov.in/",
          "Rajasthan Tourism",
        ),
      ],
      last_verified: VERIFIED,
    },
  ],
  meanings: [
    {
      id: "mn-jali",
      slug: "jali-screen",
      name: "Jali screen",
      object_type: "architectural motif",
      visual_hints: ["jali", "lattice", "stone screen", "pierced screen", "jaali"],
      destination_slugs: ["udaipur", "rajasthan"],
      symbolises:
        "Pierced stone or wood screens filter light and sight while keeping airflow, a practical climate and privacy device in court and house architecture.",
      community_context:
        "Makers and builders across Rajasthan cities use jali in palaces, havelis, and temples. Meanings beyond climate and privacy should come from site labels or scholars, not guesswork.",
      sentiment: "Quiet protection and patterned light",
      related_place_slugs: ["city-palace-udaipur", "bagore-ki-haveli"],
      sources: [
        src(
          "s-mn-1",
          "City Palace Museum, Udaipur",
          "https://www.eternalmewar.in/city-palace-museum",
          "Eternal Mewar / City Palace Museum",
        ),
      ],
    },
    {
      id: "mn-peacock",
      slug: "peacock-mosaic",
      name: "Peacock mosaic (Mor Chowk)",
      object_type: "palace ornament",
      visual_hints: ["peacock", "mor", "mosaic", "mor chowk", "glass inlay"],
      destination_slugs: ["udaipur"],
      symbolises:
        "Peacock imagery in Mor Chowk is a celebrated palace ornament. Public museum interpretation treats it as courtly decoration tied to the palace’s ceremonial courtyards.",
      community_context:
        "Visitors see restored mosaic work inside museum circuits. Do not invent secret ritual readings the museum does not publish.",
      sentiment: "Courtly splendour and careful craft",
      related_place_slugs: ["city-palace-udaipur"],
      sources: [
        src(
          "s-mn-2",
          "City Palace Museum, Udaipur",
          "https://www.eternalmewar.in/city-palace-museum",
          "Eternal Mewar / City Palace Museum",
        ),
      ],
    },
    {
      id: "mn-haveli",
      slug: "haveli-courtyard",
      name: "Haveli courtyard",
      object_type: "building type",
      visual_hints: ["haveli", "courtyard", "chowk", "jharokha"],
      destination_slugs: ["udaipur", "rajasthan"],
      symbolises:
        "Courtyard houses organise family, climate, and display around an open centre. They are domestic architecture, not temples by default.",
      community_context:
        "Many Udaipur havelis are homes, hotels, or museums. Always follow the venue’s visitor rules.",
      sentiment: "Inward gathering and shade",
      related_place_slugs: ["bagore-ki-haveli", "old-city-lanes-udaipur"],
      sources: [
        src(
          "s-mn-3",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
    },
    {
      id: "mn-lake-palace",
      slug: "lake-palace-silhouette",
      name: "Lake palace silhouette",
      object_type: "city landmark",
      visual_hints: ["lake palace", "pichola", "island palace", "white palace", "jag mandir"],
      destination_slugs: ["udaipur"],
      symbolises:
        "Island and shore palaces mark Udaipur’s identity as a lake city built around controlled water and court display.",
      community_context:
        "Some island buildings are hospitality venues today. Access is ticketed or guest-only; skyline photos from public ghats are the open option.",
      sentiment: "Water-held grandeur",
      related_place_slugs: ["lake-pichola", "jag-mandir", "city-palace-udaipur"],
      sources: [
        src(
          "s-mn-4",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
    },
    {
      id: "mn-shikhara",
      slug: "temple-shikhara",
      name: "Temple shikhara",
      object_type: "temple form",
      visual_hints: ["shikhara", "temple tower", "jagdish", "carved temple"],
      destination_slugs: ["udaipur"],
      symbolises:
        "The rising tower marks a Hindu temple’s vertical axis in North Indian forms. Exact theological readings belong to tradition holders, not tourist captions.",
      community_context:
        "At Jagdish Temple and neighbourhood shrines, the tower signals an active worship place.",
      sentiment: "Devotion and public landmark",
      sensitivity_flag: true,
      related_place_slugs: ["jagdish-temple"],
      sources: [
        src(
          "s-mn-5",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
    },
    {
      id: "mn-block-print",
      slug: "block-print-textile",
      name: "Block-printed textile",
      object_type: "craft",
      visual_hints: ["block print", "bagru", "sanganer", "wooden block", "printed cloth"],
      destination_slugs: ["udaipur", "rajasthan"],
      symbolises:
        "Hand block printing is a living craft economy. Patterns identify workshops and regions more than secret codes.",
      community_context:
        "Rajasthan printers and dyers keep the craft employed. Buying labelled work supports that chain.",
      sentiment: "Handmade repetition and colour",
      related_card_slugs: ["jaipur-blue-pottery"],
      related_place_slugs: ["hathi-pol-craft-street", "shilpgram-udaipur"],
      sources: [
        src(
          "s-mn-6",
          "Geographical Indications Registry (India)",
          "https://ipindia.gov.in/gi.htm",
          "Office of the Controller General of Patents, Designs and Trade Marks",
        ),
      ],
    },
    {
      id: "mn-miniature",
      slug: "miniature-painting",
      name: "Miniature painting",
      object_type: "craft",
      visual_hints: ["miniature painting", "paint brush board", "mewar painting", "fine brush"],
      destination_slugs: ["udaipur"],
      symbolises:
        "Fine-brush painting traditions in Mewar and related schools narrate courtly and religious themes on paper or board.",
      community_context:
        "Working painters in Udaipur markets continue the skill at many quality levels. Ask who painted the piece you buy.",
      sentiment: "Patience and narrative detail",
      related_place_slugs: ["hathi-pol-craft-street"],
      sources: [
        src(
          "s-mn-7",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
    },
    {
      id: "mn-kalbelia-skirt",
      slug: "kalbelia-performance-dress",
      name: "Kalbelia performance dress",
      object_type: "performance costume",
      visual_hints: ["kalbelia", "black skirt", "mirror work dress", "snake dance costume"],
      destination_slugs: ["udaipur", "rajasthan"],
      symbolises:
        "Popular descriptions note swirling skirts and snake-related imagery in Kalbelia performance. Visuals are not a license to invent ritual rules.",
      community_context:
        "Kalbelia communities keep a living song-and-dance practice inscribed by UNESCO. Stage shows for tourists can be skilled paid work without being community ceremony.",
      sentiment: "Living performance identity",
      related_card_slugs: ["kalbelia"],
      related_place_slugs: ["bagore-ki-haveli"],
      sources: [
        src(
          "s-mn-8",
          "Kalbelia folk songs and dances of Rajasthan",
          "https://ich.unesco.org/en/RL/kalbelia-folk-songs-and-dances-of-rajasthan-00340",
          "UNESCO ICH",
        ),
      ],
    },
    {
      id: "mn-stepwell-note",
      slug: "water-architecture-note",
      name: "Water architecture (lakes and channels)",
      object_type: "landscape system",
      visual_hints: ["lake", "ghat", "fountain channel", "stepwell", "water palace"],
      destination_slugs: ["udaipur"],
      symbolises:
        "Lakes, channels, and garden fountains show how arid-region cities engineered water for beauty and use.",
      community_context:
        "Udaipur’s lakes remain civic and ecological infrastructure. Litter and unauthorised dumping harm the shared system.",
      sentiment: "Shared water and civic care",
      related_place_slugs: ["lake-pichola", "fateh-sagar-lake", "saheliyon-ki-bari"],
      sources: [
        src(
          "s-mn-9",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
    },
    {
      id: "mn-elephant-statue",
      slug: "elephant-landing-statue",
      name: "Elephant landing statues",
      object_type: "sculptural motif",
      visual_hints: ["elephant statue", "stone elephant", "jag mandir elephant", "landing elephant"],
      destination_slugs: ["udaipur"],
      symbolises:
        "Stone elephants at island landings are a welcoming sculptural motif in palace water approaches. Treat them as architectural ornament unless a site label says more.",
      community_context:
        "Seen at Jag Mandir landings and related palace approaches. Do not climb sculptures for photos.",
      sentiment: "Ceremonial welcome",
      related_place_slugs: ["jag-mandir", "saheliyon-ki-bari"],
      sources: [
        src(
          "s-mn-10",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
    },
  ],
  itineraries: [
    {
      id: "it-udaipur-1d",
      slug: "udaipur-one-day",
      destination_slug: "udaipur",
      title: "One day in Udaipur",
      duration_days: 1,
      summary:
        "Palace and temple morning, lake afternoon, craft or cafe evening. Mix heritage, food, and one modern stop without inventing timings.",
      stops: [
        {
          order: 1,
          title: "City Palace museums",
          kind: "heritage",
          place_slug: "city-palace-udaipur",
          note: "Start with cited palace rooms and peacock courtyard views.",
        },
        {
          order: 2,
          title: "Jagdish Temple",
          kind: "heritage",
          place_slug: "jagdish-temple",
          note: "Short respectful visit; follow temple rules.",
        },
        {
          order: 3,
          title: "Dal baati lunch",
          kind: "food",
          experience_slug: "dal-baati-churma",
          note: "Simple thali stop; confirm vegetarian labels yourself.",
        },
        {
          order: 4,
          title: "Lake Pichola edge",
          kind: "heritage",
          place_slug: "lake-pichola",
          note: "Authorised boat or ghat walk only.",
        },
        {
          order: 5,
          title: "Cafe or design browse",
          kind: "modern",
          modern_slug: "cafe-food-entrepreneurs-udaipur",
          note: "One modern India stop before evening crowds peak.",
        },
      ],
      sources: [
        src(
          "s-it-1",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
    },
    {
      id: "it-udaipur-2d",
      slug: "udaipur-two-day",
      destination_slug: "udaipur",
      title: "Two days in Udaipur",
      duration_days: 2,
      summary:
        "Day one covers the palace-lake core. Day two spreads benefit to gardens, craft, and a hill or second lake, plus a music or studio modern stop.",
      stops: [
        {
          order: 1,
          title: "City Palace and old lanes",
          kind: "heritage",
          place_slug: "city-palace-udaipur",
          note: "Day 1 morning core.",
        },
        {
          order: 2,
          title: "Bagore ki Haveli",
          kind: "heritage",
          place_slug: "bagore-ki-haveli",
          note: "Museum rooms; evening programme only if listed that day.",
        },
        {
          order: 3,
          title: "Ker sangri or gatte dinner",
          kind: "food",
          experience_slug: "ker-sangri",
          note: "Regional dish when available.",
        },
        {
          order: 4,
          title: "Saheliyon ki Bari",
          kind: "heritage",
          place_slug: "saheliyon-ki-bari",
          note: "Day 2 garden morning.",
        },
        {
          order: 5,
          title: "Shilpgram or craft street",
          kind: "heritage",
          place_slug: "shilpgram-udaipur",
          note: "Buy direct when stalls are open.",
        },
        {
          order: 6,
          title: "Craft revival / studio note",
          kind: "modern",
          modern_slug: "design-studios-udaipur",
          note: "Link modern design back to print and metal crafts.",
        },
        {
          order: 7,
          title: "Fateh Sagar or Monsoon Palace",
          kind: "heritage",
          place_slug: "fateh-sagar-lake",
          note: "Choose based on energy and daylight left.",
        },
      ],
      sources: [
        src(
          "s-it-2",
          "Udaipur tourism overview",
          "https://tourism.rajasthan.gov.in/udaipur.html",
          "Rajasthan Tourism",
        ),
      ],
    },
  ],
};

export const udaipurPartners: LocalPartner[] = [
  {
    id: "lp-ud-1",
    destination_slug: "udaipur",
    kind: "artisan",
    name: "Miniature painters and textile workshops (Hathi Pol belt)",
    tip: "Ask who painted or printed the piece, buy direct, and skip wildlife products.",
    related_place_slugs: ["hathi-pol-craft-street"],
    sources: [
      src(
        "s-lp-ud-1",
        "Udaipur tourism overview",
        "https://tourism.rajasthan.gov.in/udaipur.html",
        "Rajasthan Tourism",
      ),
    ],
    last_verified: VERIFIED,
  },
  {
    id: "lp-ud-2",
    destination_slug: "udaipur",
    kind: "community_experience",
    name: "Shilpgram fair stalls (when scheduled)",
    tip: "Prefer labelled cooperative or artisan stalls at West Zone Cultural Centre events.",
    related_place_slugs: ["shilpgram-udaipur"],
    sources: [
      src(
        "s-lp-ud-2",
        "West Zone Cultural Centre",
        "https://www.wzccindia.com/",
        "West Zone Cultural Centre",
      ),
    ],
    last_verified: VERIFIED,
  },
  {
    id: "lp-ud-3",
    destination_slug: "udaipur",
    kind: "family_eatery",
    name: "Old-city vegetarian thali kitchens",
    tip: "Choose busy family counters; agree the thali contents before paying; no invented price list here.",
    related_place_slugs: ["old-city-lanes-udaipur"],
    sources: [
      src(
        "s-lp-ud-3",
        "Rajasthan Tourism",
        "https://tourism.rajasthan.gov.in/",
        "Rajasthan Tourism",
      ),
    ],
    last_verified: VERIFIED,
  },
  {
    id: "lp-ud-4",
    destination_slug: "udaipur",
    kind: "certified_guide",
    name: "Credentialed local guides at museum desks",
    tip: "Hire guides who show credentials at official museum or tourism desks; refuse unsolicited “special access” claims.",
    related_place_slugs: ["city-palace-udaipur"],
    sources: [
      src(
        "s-lp-ud-4",
        "City Palace Museum, Udaipur",
        "https://www.eternalmewar.in/city-palace-museum",
        "Eternal Mewar / City Palace Museum",
      ),
    ],
    last_verified: VERIFIED,
  },
];
