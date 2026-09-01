# Live deployment audit — 1 September 2026

The public GitHub Pages site and the repository were checked after deployment. The repository currently contains the original V1 files rather than the previous corrected package: Group Activity is absent, the service-worker cache is still `ph-english-v1`, and the earlier V1 interaction/accessibility issues are therefore still present.

This V3 package re-applies the full correction set and uses a new build/cache identifier so the deployment can be verified after upload.

# English for Public Health — audit and corrections

Revision: 1 September 2026

## Added: Group Activity

A new top-level **Group Activity** tab has been added. It contains a complete collaborative **Public Health Action Room** for teams of 3–4 students:

- 6 public-health missions;
- random mission selection;
- automatic role draw for teams of 3 or 4;
- Evidence, Equity, Communication and Policy roles;
- fictional teaching data clearly labelled as fictional;
- a five-step workflow;
- a 90-second evidence-based briefing;
- a peer-challenge stage;
- useful language for evidence, priorities, challenge and recommendations;
- a model briefing that can be revealed after discussion;
- local tracking of missions explored.

The six missions cover heat and health equity, measles surveillance, screening inequalities, nutrition and health promotion, air pollution near schools, and vaccination communication.

## Functional bugs fixed

1. **Flashcard sessions could continue indefinitely.** Sessions now end correctly and display a final summary.
2. **Flashcard progress was one step behind.** The first card now shows the correct progress and completed sessions reach 100%.
3. **Practice progress was one step behind.** A five-question session now begins at 20%, then progresses correctly.
4. **Practice answers remained interactive after a response.** Answer buttons are now disabled after answering, preventing accidental repeated interaction.
5. **Pronunciation counters did not update.** Rated and review/tricky counters now update immediately.
6. **Pronunciation ratings could unintentionally add a word to My Vocabulary.** Pronunciation ratings are now stored separately from saved vocabulary.
7. **Pronunciation review omitted words marked “Tricky”.** Review now includes both “Review” and “Tricky” pronunciation items.
8. **Saving/removing a word from Dictionary did not immediately refresh its card state.** The visible dictionary results now refresh correctly.
9. **Some controls relied on browser-created global variables from element IDs.** Explicit DOM references are now used instead, improving cross-browser reliability.
10. **Case and Communication workspace close buttons relied on implicit globals.** They now use explicit, robust event handlers.
11. **Browser Back/Forward navigation could leave the wrong section visible.** Hash changes now update the active page correctly.
12. **The learning recommendation could stop progressing after Cases.** It now accounts for Communication Lab, Group Activity, Check-up and Pronunciation.
13. **Old locally stored progress could have an incomplete activity schema.** Stored data are now normalised safely when the site evolves.
14. **Local-storage write failures could interrupt interactions.** Storage writes are now safely handled.
15. **The CSV export object URL could be revoked too early on some browsers.** Revocation is now delayed safely.

## Accessibility and UX bugs fixed

1. **Accessibility preferences were not persistent**, despite the site explaining that preferences are stored locally. Dark mode, high contrast, simplified layout and reduced motion are now remembered on the device.
2. Accessibility toggle buttons now expose their state with `aria-pressed`.
3. Flashcards can now be revealed with **Enter or Space**, and expose button-like keyboard semantics.
4. Hidden workspaces now use an explicit global `[hidden]` CSS rule for reliable behaviour.
5. The parent navigation menu now remains visually active when one of its child sections is open.
6. **Mobile horizontal overflow** was fixed for Lexicon, Flashcards and Group Activity. The complete site was checked at 320 px, 375 px, 768 px and 1440 px widths with no page-level horizontal overflow.

## Offline / PWA bugs fixed

1. The service-worker cache has been versioned again so an old GitHub Pages cache is less likely to keep a previous build visible.
2. The new service worker uses `skipWaiting()` and `clients.claim()` so updates take control more reliably.
3. Old application caches are removed on activation.
4. The offline fallback is now restricted to navigation requests instead of returning the HTML home page for arbitrary missing assets.
5. The initial Online/Offline label now checks the browser's actual connection state instead of always starting as “Online”.
6. The manifest now includes an app `id`, `scope`, `lang: en-GB` and education category.

## Content/data integrity checks

- 100 vocabulary terms loaded.
- 10 chapters loaded.
- 9 Public Health Cases loaded.
- 8 Communication Lab tasks loaded.
- 6 Group Activity missions loaded.
- No duplicate vocabulary entries detected.
- No missing required fields detected in the 100 vocabulary entries.
- All vocabulary chapter references resolve to an existing chapter.
- All vocabulary terms requested by the case activities exist in the lexicon.
- No empty case or Communication Lab records detected.
- All mission statistics in Group Activity are explicitly identified as **fictional classroom data**.

## Browser/interaction QA

A final Chromium DOM/interactivity test confirmed:

- all 12 site sections can be activated;
- no JavaScript page errors or console errors in the tested flows;
- the Group Activity mission selector contains 6 missions plus the placeholder;
- a mission renders its three evidence cards;
- the role draw returns exactly three roles for a team of three;
- completing a group mission updates progress;
- a 10-card flashcard session finishes at 10/10;
- a five-question Practice session begins at 20% and locks answer choices after a response;
- a pronunciation rating updates the pronunciation counter without changing the saved-word count;
- accessibility toggle handlers update their pressed states;
- hash navigation responds correctly;
- no horizontal overflow was detected at 320, 375, 768 or 1440 px across all 12 pages.

## Deployment

Replace the files at the **root of the GitHub repository** with the files in this ZIP. Keep `index.html` at repository root. The ZIP is intentionally structured without an extra enclosing folder.
