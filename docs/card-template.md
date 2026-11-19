# Heritage card template (breadth rollout)

Use this checklist before adding a card. Prefer extending `scripts/merge-breadth-cards.mjs` or `scripts/generate_seed.py`, then regenerate reports with `node scripts/coverage-report.mjs`.

## Required fields

| Field | Rule |
|-------|------|
| `slug` | lowercase-hyphen, unique |
| `type` | `festival` \| `craft` \| `performing` \| `oral` \| `ritual` \| `knowledge` |
| `title` | Plain language, no invented honorifics |
| `region_slug` | Must match an India state/UT slug |
| `summary` | 40+ characters, what / who / place |
| `body` | Cited facts only; include a respectful-visit paragraph |
| `sources` | ≥1 primary (UNESCO / MoC / ASI / GI registry / state dept) + `accessed_on` |
| `quiz` | 5 questions answerable only from this card + sources |
| `gi_flag` / `unesco_id` | Set only when a real registration/inscription exists |
| `sensitivity_flag` | True for sacred, restricted, or Indigenous practices |

## Source checklist

1. Open the primary URL and confirm it still describes this practice.
2. Record `accessed_on` as YYYY-MM-DD.
3. Do **not** use a homepage-only link as the sole citation for a new card.
4. If no verified primary source exists, leave the state empty. Never invent.

## Review

- Staff desk accept/reject still applies to learner contributions.
- Breadth cards ship unpublished until you set `published: true` in the merge script (default true only after human check of sources).
