# DESIGN.md

## Product
Parampara Path: Living Heritage Compass (web app UI). Place first culture and travel guide with a cited 8 minute learning loop.

## Visual theme
**Light theme only** (forced; no OS dark-mode switch). Warm cream field, saffron/marigold accents, terracotta secondary, indigo primary actions. Soft jali-style accents. Content carries heritage; ornament stays subtle.

## Imagery
All atmosphere and place photos must show **Indian regions only** (states, UTs, or clearly India-located festivals/cuisine). Each entry in `src/lib/home-visuals.ts` and place `hero_image` records carries a verified India place in alt text / `region`. Do not reuse generic Asia stock (Thai islands, Vietnamese dyeing scenes, non-India resorts).

## Page layout
Every content page uses `PageShell`: breadcrumb → eyebrow → title → one-line purpose → optional next actions → body. Narrow width for reading (cards, Ask, Quiz); wide for browse (Explore, Places, Map, About).

## Landing (Home)
Special composition (theme unchanged): living-heritage hero → Where are you + coverage → Camera look (`PhotoUnderstand`) → Hidden gems of the states → three-step journey list → passport stamp teaser → featured treasures. Camera and location are first-class entry points, not buried features.

## Passport stamps
Stamp-sheet layout with circular ink seals (state / quiz / badge). Empty dashed rings invite collection. Same component teases on Home and fills on Passport.

## Color
Strategy: Warm cultural, WCAG AA.

```css
--bg: oklch(0.975 0.015 85);
--surface: oklch(0.955 0.02 75);
--ink: oklch(0.25 0.04 275);
--muted: oklch(0.42 0.03 275);
--primary: oklch(0.4 0.1 275);
--saffron / terracotta accents
--verified: oklch(0.42 0.09 155);
```

Text on primary is near-white. Green only means "backed by sources". Red only for errors. Refused Ask answers are neutral ("Not covered by the cards"), not alarming.

## Trust signals
Cards show source count. Item pages show "N sources · checked date" linking to the source list. Places show last verified dates. Home explains cited sources, Ask from cards only, and human-reviewed contributions. Unofficial chip near logo; disclaimer in footer strip and About.

## Typography
Figtree for body, labels, nav. Fraunces for h1 to h3 only. Fixed rem scale. Body max ~70ch.

## Components
Rounded-full actions, 44px hit targets, outline-1 panels, soft two-layer shadow. One primary (filled indigo) action per group; others outlined. Loop stepper with done ticks.

## Layout
Max width 72rem. Top nav (sticky from md up): Home, Explore, Places, Map, Saved, Profile. Explore filters as sticky instant toolbar.
