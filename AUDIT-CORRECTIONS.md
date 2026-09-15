# Group Activity audit — 15 September 2026

Scope: `https://lecomteeglantine.github.io/EnglishForPublicHealth/#groupactivity`

## Verified

- Session 1 uses fixed A–E options and score deltas. The same confirmed decision sequence produces the same decision code and scores.
- Sessions 2–7 use fixed option arrays and deterministic score recalculation.
- No `Math.random()` or shuffle function is used by the Sessions 2–7 group-activity engine.
- Saved Session 2–7 state is normalised before use: invalid or non-contiguous stored choices are discarded instead of creating a false completed game.
- Session 2–7 already restores the last consequence after an interrupted final save instead of silently skipping the last Pitch Checkpoint.
- Instructions explicitly require one shared choice, one consequence/checkpoint after each decision, and one two-minute whole-team briefing.

## Correction in this ZIP

The remaining source of apparent cross-device divergence was deployment/cache drift: a device with an older installed PWA cache can briefly run an older JavaScript ruleset after the GitHub Pages site has been updated.

`sw.js` V24 now:

1. creates a fresh deployment cache;
2. fetches core files with forced revalidation;
3. deletes older `ph-english-*` caches on activation;
4. claims open pages immediately;
5. reloads already-open same-origin pages once when the new worker activates, so they run the current scripts;
6. keeps network-first behaviour and an offline fallback after the current files have been cached.

## Upload

Upload `sw.js` to the repository root and replace the existing file. `AUDIT-CORRECTIONS.md` is documentation only and may also be uploaded if desired.
