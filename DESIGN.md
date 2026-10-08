# DESIGN.md

## Product
Parampara Path — Living Heritage Compass (web app UI).

## Visual theme
Restrained product surface. Pure white field. Mineral teal (hue ~200) as the single brand fill. Copper accent for UNESCO/GI/status, not decoration. One sans (Figtree) for UI; Fraunces only on titles.

## Color
Strategy: Restrained.

```css
--bg: oklch(1.000 0.000 0);
--surface: oklch(0.965 0.008 200);
--ink: oklch(0.220 0.028 220);
--muted: oklch(0.450 0.018 220);
--primary: oklch(0.420 0.074 200);
--accent: oklch(0.480 0.130 48);
--on-primary: oklch(1.000 0.000 0);
```

Text on primary/accent fills is white.

## Typography
Figtree for body, labels, nav. Fraunces for h1–h3 only. Fixed rem scale. Body max ~70ch.

## Components
Rounded-full primary actions, 44px hit targets on mobile, outline-1 panels, refuse state uses accent label not alarm red theater.

## Layout
Max width 72rem. Top nav. Explore filters as a single toolbar, not nested cards.
