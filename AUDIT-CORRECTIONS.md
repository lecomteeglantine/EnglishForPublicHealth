# EnglishForPublicHealth · Group Activity deep audit · V25

Audit date: 15 September 2026
Scope: `https://lecomteeglantine.github.io/EnglishForPublicHealth/#groupactivity`

## Deterministic parity verified

- Session 1 uses fixed A–E choices and fixed score deltas. Its group-game path does not use randomisation.
- Sessions 2–7 use fixed option arrays and deterministic score recalculation.
- `group-sessions.js` contains no `Math.random()` and no shuffle call.
- For Sessions 2–7, stored choices are validated as one contiguous sequence before scores and progress are rebuilt.
- Same confirmed choice sequence therefore produces the same decision code, scores and final profile on different devices running the same deployment.

## Inconsistencies found and corrected

1. **Origin-wide cache deletion risk**
   The deployed service-worker logic deleted every cache key except its own. GitHub Pages projects under the same `lecomteeglantine.github.io` origin share Cache Storage, so this could remove caches used by other course sites. V25 deletes only cache names beginning with `ph-english-`.

2. **Mixed-version / stale-device risk**
   V25 forces revalidation of same-origin files, installs a new cache, claims open clients and reloads pages already open when the new worker activates. This prevents one phone/computer from temporarily running an older ruleset than another.

3. **Session 1 interrupted-final-save inconsistency**
   Sessions 2–7 already restore the final consequence if all choices survive but the last outcome/completion flag is missing. Session 1 did not. V25 applies the same recovery rule so the final Pitch Checkpoint cannot be skipped after that edge case.

4. **Completion-counter desynchronisation**
   Session completion markers can otherwise become stale after some reset/replay paths. V25 reconciles Session 1–7 completion markers with the engines' current status and removes Session 1's marker when Session 1 is reset/replayed, matching Sessions 2–7 semantics.

5. **Session 7 course-sequence wording**
   Two stale labels referred to a non-existent “Session 8”. The V25 patch removes those references and keeps the wording tied to the final campaign/final presentation in the seven-session course.

6. **Optional image failure during service-worker install**
   Session 2 portraits are now best-effort cache assets. A temporary image-fetch problem can no longer block the whole service-worker update; core HTML/CSS/JS files remain mandatory.

## What is deliberately unchanged

- scenario content;
- option order;
- score values;
- score formulas;
- decision codes;
- 2:00 whole-team pitch rule;
- Session 2 sound cues;
- Session 7's deliberately different 1–3-person campaign-rehearsal setting.

## Files to upload

Upload both files below to the repository root, replacing `sw.js`:

- `sw.js`
- `groupactivity-v25-fixes.js`

`AUDIT-CORRECTIONS.md` is documentation and may also be uploaded.

The first visit after deployment may reload once automatically when the new service worker activates. That is intentional.
