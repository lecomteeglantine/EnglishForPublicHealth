# EnglishForPublicHealth — V10 Group Activity full audit

## Publish on GitHub Pages
Upload the files in this ZIP **directly to the root of the repository** and replace the current files. Do not create an extra enclosing folder.

Main files:
- `index.html`
- `app.js`
- `styles.css`
- `sw.js`
- `manifest.webmanifest`
- icons

## Version identifiers
- App: `2026-09-02-v10-groupactivity-full-audit`
- CSS / JS query: `20260902-10`
- Service worker cache: `ph-english-v10-20260902-groupactivity-full-audit`
- Session 1 ruleset: `S1-R10`

## Group Activity guarantee
Session 1 is deterministic. The six decision screens use fixed A–E options and fixed scoring rules. Scores are rebuilt from the decision code rather than trusted from saved local values. Therefore two devices using Ruleset **S1-R10** and the same six choices receive the same scores and final profile.

See `AUDIT-CORRECTIONS.md` for the full audit.


## V11 final Group Activity audit
- Keeps scoring rules unchanged at **Ruleset S1-R10**.
- Fixes session-card HTML semantics and dark/high-contrast CTA readability.
- Persists team size (3 or 4) across reloads.
- Adds Not started / In progress / Completed status to Session 1 in the library.
- Adds direct Back to sessions controls during the simulation.
- Improves decision progress semantics and accessibility.
- App/cache version bumped to V11.
