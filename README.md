# Public Health English – M1

Static learning site ready for GitHub Pages.

## Publish this corrected version

1. Open the GitHub repository `EnglishForPublicHealth`.
2. Replace the files at the repository root with the files from this ZIP.
3. Keep the same filenames and folder level: `index.html` must stay at the root.
4. Commit the changes to the branch used by GitHub Pages (usually `main`).
5. Reload the published site. The updated service worker uses a new cache version and takes control immediately.

## This revision

- Adds a direct **Group Activity** tab with six classroom missions for teams of 3–4.
- Fixes flashcard session completion and progress behaviour.
- Fixes pronunciation counters and separates pronunciation ratings from the saved-vocabulary notebook.
- Persists dark mode, high contrast, simple layout and reduced-motion preferences locally.
- Fixes initial online/offline status and PWA cache updating.
- Fixes browser-history/hash navigation and active navigation state.
- Removes reliance on browser-created global variables for element IDs.
- Refreshes dictionary cards after save/master/review actions.
- Adds defensive local-storage handling and small accessibility improvements.

The site uses no server-side database. Learning progress is stored locally in the browser.

## 1 September 2026 audit revision

This package includes the new **Group Activity** tab and the complete technical audit corrections. See `AUDIT-CORRECTIONS.md` for the detailed list of fixes and QA checks.


## Build verification

This package is build **2026-09-01-v3-live-audit**. The HTML includes an invisible application-version meta tag and the service-worker cache is `ph-english-v3-20260901-live-audit` so deployment can be verified unambiguously.
