export type Lang = "en" | "hi";

export const UI_COPY = {
  en: {
    navHome: "Home",
    navExplore: "Explore",
    navMap: "Map",
    navSaved: "Saved",
    navProfile: "Profile",
    brandTag: "Living Heritage Compass",
    unofficial: "Unofficial",
    heroTitle: "Living Heritage Compass",
    heroPurpose:
      "Visit any place in India and understand it deeply: the culture of the whole state, the heritage of your city, the meaning behind what you see, the best food and travel, and the modern India growing beside it.",
    heroFor: "Built for students and curious travellers who want cited culture, not invented stories.",
    ctaWhere: "Where are you?",
    ctaExplore: "Explore places",
    ctaDemo: "Try the 8 minute demo",
    ctaPhoto: "What am I looking at?",
    howTitle: "How it works",
    how1: "Choose a place",
    how1body: "Allow approximate location or search a city or state.",
    how2: "Read the layers",
    how2body: "State story, city heritage route, food, travel, then modern India.",
    how3: "Learn in 8 minutes",
    how3body: "Open a cited card, Ask, Quiz, and optionally Contribute.",
    nextAsk: "Next: Ask a question",
    nextQuiz: "Next: Take the quiz",
    nextContribute: "Finish: Share a note",
    answeredFromCards: "Answered from the cards",
    notCovered: "Not covered by the cards",
    deviceData: "Saved on this device only, unless you export.",
    langLabel: "English",
  },
  hi: {
    navHome: "होम",
    navExplore: "खोजें",
    navMap: "मानचित्र",
    navSaved: "सहेजे",
    navProfile: "प्रोफ़ाइल",
    brandTag: "जीवंत विरासत कम्पास",
    unofficial: "अनौपचारिक",
    heroTitle: "जीवंत विरासत कम्पास",
    heroPurpose:
      "भारत के किसी भी स्थान पर जाकर उसे गहराई से समझें: पूरे राज्य की संस्कृति, आपके शहर की विरासत, जो आप देखते हैं उसका अर्थ, श्रेष्ठ भोजन और यात्रा, और उसके साथ बढ़ता आधुनिक भारत।",
    heroFor: "विद्यार्थियों और जिज्ञासु यात्रियों के लिए, उद्धृत संस्कृति के साथ।",
    ctaWhere: "आप कहाँ हैं?",
    ctaExplore: "स्थान देखें",
    ctaDemo: "८ मिनट का डेमो आज़माएँ",
    ctaPhoto: "यह क्या है?",
    howTitle: "यह कैसे काम करता है",
    how1: "स्थान चुनें",
    how1body: "अनुमानित स्थान अनुमति दें या शहर/राज्य खोजें।",
    how2: "परतें पढ़ें",
    how2body: "राज्य कथा, शहर मार्ग, भोजन, यात्रा, फिर आधुनिक भारत।",
    how3: "८ मिनट में सीखें",
    how3body: "उद्धृत कार्ड खोलें, पूछें, प्रश्नोत्तरी, वैकल्पिक योगदान।",
    nextAsk: "अगला: प्रश्न पूछें",
    nextQuiz: "अगला: प्रश्नोत्तरी",
    nextContribute: "समाप्त: नोट साझा करें",
    answeredFromCards: "कार्डों से उत्तर",
    notCovered: "कार्डों में नहीं है",
    deviceData: "केवल इस डिवाइस पर सहेजा जाता है, जब तक आप निर्यात न करें।",
    langLabel: "हिन्दी",
  },
} as const;

export type UiKey = keyof (typeof UI_COPY)["en"];

export function t(lang: Lang, key: UiKey): string {
  return UI_COPY[lang][key] ?? UI_COPY.en[key];
}
