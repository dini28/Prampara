# Changelog: place first upgrade

Maps each change to the three jury issues.

## 1. Frontend looked too simple

- Warm cream / saffron / terracotta / indigo palette with Fraunces + Figtree (`globals.css`, `DESIGN.md` direction).
- Jali-style accent, unofficial chip, richer place heroes, type-coloured card placeholders (`ItemCard`).
- Sticky mini header + loop stepper with done ticks.
- Experience tabs, Heritage | Modern toggle, itinerary save UI.

## 2. Main purpose unclear

- One sentence purpose in hero, About, and metadata.
- Audience line for students and curious travellers.
- Unofficial disclaimer moved to slim footer strip + About; small Unofficial chip by logo.
- How it works 3-step strip under the hero.
- Jargon tooltips: UNESCO ICH, GI tag, Ask (answers only from the card).
- Place first journey: `/places`, Rajasthan state story, Udaipur city layers.

## 3. Users did not understand the next step

- Nav: Home, Explore, Places (desktop), Map, Saved, Profile (no Requirements / Analysis / Local name).
- Persistent Discover → Read → Ask → Quiz → Contribute stepper with one primary CTA per screen.
- Fixed map CTA label to open `/map`.
- Quiz “What next?” cards; onboarding 3 slides; “Try the 8 minute demo”.
- Where are you? (location + search) and photo “What am I looking at?” entry points.

## Trust and data

- Place models + Rajasthan/Udaipur pilot seed (12 places, 6 food, 4 travel, 5 modern, 10 meanings, 2 itineraries).
- Photo API grounds only in Meaning data; feedback stored without images; EXIF stripped via client resize.
- Profile export/import for device progress; device-data note.
- Staff desk remains auth + role session (existing); About documents demo reviewer for jury.
- `npm run check:dashes` fails build on em/en dashes.

## New files

- `src/lib/place-types.ts`, `src/lib/destinations.ts`, `src/lib/destinations-client.ts`, `src/lib/i18n.ts`, `src/lib/catalogue-labels.ts`
- `src/data/places/*` (rajasthan, udaipur, jaipur, jodhpur, jaisalmer)
- `src/app/places/**`, `src/app/api/locate`, `src/app/api/look`
- Components: WhereAreYou, PhotoUnderstand, OnboardingSlides, HeritageModernToggle, ExperienceTabs, SaveItineraryButton, ExploreInstantFilters, LanguageToggle, InfoTip, ProgressTransfer
- `scripts/check-dashes.mjs`, this changelog

## Dependencies

- None added. Still Next 15 + React 19 + Tailwind 4.

## Could not fully verify

- Live Rajasthan Tourism / Eternal Mewar / WZCC page contents may drift; access dates set to 2026-11-19.
- Unsplash hero photos are atmosphere stock, not ASI archive shots.
- Photo matching without a vision API uses hint + location against Meaning `visual_hints` (honest Low confidence when unsure).
- Lighthouse 90+ scores not measured in this session; run on mobile after deploy.
- Jaipur / Jodhpur / Jaisalmer are structural stubs (same data shape), not full routes yet.
- Hindi toggle covers nav/hero/button copy keys; not every string is translated yet.
- Additional oral/ritual cards for thin states were not bulk-authored in this pass (counts remain honest to catalogue).
