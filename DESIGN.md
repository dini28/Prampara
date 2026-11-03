# DESIGN.md

## Product
Parampara Path — Living Heritage Compass (web app UI).

## Visual theme
Neutral, credible reference tool. Near-white field, cool neutral surfaces, one deep blue for actions and links. Green is reserved for verification signals (sources, grounded answers). No cultural ornament; the content carries the heritage.

## Color
Strategy: Restrained.

```css
--bg: oklch(0.995 0.002 250);
--surface: oklch(0.967 0.006 250);
--ink: oklch(0.210 0.020 255);
--muted: oklch(0.440 0.020 255);
--primary: oklch(0.420 0.110 255);
--primary-tint: oklch(0.950 0.025 255);
--verified: oklch(0.450 0.090 155);
--verified-tint: oklch(0.950 0.035 155);
--danger: oklch(0.500 0.170 27);
```

Text on primary is white. Green only means "backed by sources". Red only for errors. Refused Ask answers are neutral ("Not covered by the cards"), not alarming.

## Trust signals
Cards show source count. Item pages show "N sources · checked <date>" linking to the source list. Home explains the three safeguards: cited sources, answers only from cards, human-reviewed contributions. `/about` and the five-step loop stepper make aims and requirement coverage visible for viva demos.

## Typography
Figtree for body, labels, nav. Fraunces for h1–h3 only. Fixed rem scale. Body max ~70ch.

## Components
Rounded-full actions, 44px hit targets, outline-1 panels, soft two-layer shadow. One primary (filled blue) action per group; others outlined.

## Layout
Max width 72rem. Top nav (sticky from md up). Explore filters as a single toolbar, not nested cards.
