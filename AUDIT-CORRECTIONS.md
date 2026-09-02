# EnglishForPublicHealth — Group Activity V9 runtime audit

## Critical bug fixed
V8 accidentally omitted the **Pronunciation** and **My Vocabulary** HTML sections while `app.js` still tried to bind their controls during startup. This produced a JavaScript `TypeError` before the Session 1 initialiser ran. The **Session 1 card was visible but could not open**.

## Corrections
- Restored the complete **Pronunciation Lab** section.
- Restored the complete **My Vocabulary** section.
- Made Pronunciation and My Vocabulary startup bindings defensive so a missing ancillary control cannot crash the entire application.
- Preserved the two-screen Group Activity flow: **session library only at first**, Session 1 content only after clicking the card.
- Preserved the fixed A–E option order and deterministic scoring.
- Added a safe Session 1 JavaScript entry point as a fallback.
- Bumped the Session 1 engine to **V9**, causing saved older runs to be normalised under the current rules.
- Bumped asset versions and the PWA cache.

## Verification
- JavaScript syntax: passed.
- Required sections `pronunciation`, `notebook`, `groupactivity`, `groupSessionLibrary`, `session1CardButton` and `session1Detail`: present.
- Duplicate HTML IDs: none.
- Simulation: 6 steps, exactly 5 fixed choices (A–E) per step.
- Session 1 engine contains no randomisation of choices, consequences or scores.
- Same six-choice decision code maps to the same score changes and final profile on every device.
- Exhaustive scoring check: all **15,625 possible six-choice paths** evaluated; no path maximises all four dimensions simultaneously.
- All service-worker assets are present in the ZIP.

## Version
- App: `2026-09-02-v9-groupactivity-runtime-fix`
- CSS/JS: `20260902-9`
- Cache: `ph-english-v9-20260902-groupactivity-runtime-fix`
