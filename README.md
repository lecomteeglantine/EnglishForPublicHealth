# Public Health English – M1

Corrected static learning site for GitHub Pages.

## Publish this V4

1. Unzip this package.
2. Open the GitHub repository `EnglishForPublicHealth`.
3. Replace the files at the repository root with **all the files from this ZIP**.
4. Keep `index.html` at the repository root.
5. Commit the changes to the branch used by GitHub Pages (normally `main`).
6. Once GitHub Pages has redeployed, reload the public site. If a previously installed/offline copy still appears, use a hard refresh once or reopen the site in a new tab.

## Build identifier

- HTML application version: `2026-09-01-v4-full-audit`
- CSS / JS revision: `20260901-4`
- service-worker cache: `ph-english-v4-20260901-full-audit`

These identifiers make it possible to distinguish V4 from earlier cached builds.

## Main V4 corrections

- repairs all **Public Health Gap** questions so every item contains a genuine blank;
- adds a defensive fallback so a future vocabulary edit cannot silently create a gap question without a blank;
- fixes stale final Practice statistics;
- prevents a flashcard from being counted twice when a student goes back and changes a rating;
- clarifies the **Again** flashcard action as “Keep for review”;
- closes outdated Case / Communication workspaces when the support mode or filter changes;
- improves selection of a genuine `en-GB` speech-synthesis voice when one is installed;
- fixes Dark Mode and High Contrast readability problems;
- fixes large-text mobile overflow, including at 150% text size;
- makes Reduced Motion apply to programmatic scrolling and system reduced-motion preferences;
- fixes Simple Layout so decorative hero bubbles are actually removed;
- bumps the PWA cache so the corrected build replaces older cached files.

The site still stores student learning data locally in the browser and does not require an account or remote learning database.

See `AUDIT-CORRECTIONS.md` for the detailed audit.


## Session 1 update (2026-09-01)
- Rebuilt **Group Activity** as a true **Session 1** simulation: **Who Gets the Medicine?**
- Added fixed, deterministic choices so that the **same answers always produce the same consequences and scores on every device**.
- Added clearer student instructions, role cards, illustrated scenario overview and a 90-second group briefing task.


## V8 — Group Activity audit
Group Activity now behaves as a real session library: Session 1 content stays hidden until the student clicks its card. Session 1 scoring was rebalanced and versioned so that the same six choices always produce the same scores on every device, including after migration from older saved sessions.


## V9 critical runtime fix
Restores Pronunciation and My Vocabulary sections accidentally omitted in V8. Their missing DOM controls stopped JavaScript execution before Group Activity could register the Session 1 click handler. V9 also makes those ancillary bindings defensive.
