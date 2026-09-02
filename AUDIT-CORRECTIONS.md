# EnglishForPublicHealth — Live/Session 1 Audit V6

## Main corrections
- Removed the obsolete pre-Session-1 **Group Activity** engine and its six old missions from `app.js`.
- Kept a single Session 1 simulation engine: **Who Gets the Medicine?**
- Added migration of old local progress so obsolete numeric group-mission IDs cannot inflate the Group Activity progress counter.
- Made team-role assignment fixed rather than random, so the Group Activity behaves consistently on different devices from the very beginning.
- The six decision steps remain fully deterministic: the same decision code always gives the same score changes, final scores and profile.
- Updated application/cache versions to V6 to force browsers/PWA installs to fetch the corrected files.
- Improved keyboard focus visibility for decision cards.
- Improved mobile stacking of simulation action buttons.
- Strengthened contrast treatment for positive/negative score-impact pills.

## Determinism guarantee
No `Math.random()` or shuffle operation is used in Session 1 decisions, scoring, consequences or profiles.
The choices are fixed A–E at each of the six steps. Therefore the same sequence (for example `C-B-B-E-C-D`) always yields the same:
- available choices,
- consequence text,
- score deltas,
- final Access / Equity / Innovation / Sustainability scores,
- decision code,
- final profile.

## Version identifiers
- Application: `2026-09-01-v6-session1-audit`
- CSS/JS query version: `20260901-6`
- PWA cache: `ph-english-v6-20260901-session1-audit`

## Upload note
The ZIP contains the site files directly at the archive root. Upload/replace these files at the repository root; do not create an extra folder in the GitHub repository.
