# EnglishForPublicHealth – Group Activity final audit V11

## Scope
Audit of Session 1 — **Who Gets the Medicine?** on the deployed V10 codebase.

## Corrections in V11
1. **Valid session-card HTML** — replaced block-level `div/h3/p` content inside the session `<button>` with valid phrasing elements. This improves cross-browser and assistive-technology reliability.
2. **Valid option-button HTML** — A–E decision buttons no longer contain block-level paragraphs; option descriptions now use valid inline content.
3. **Dark/high-contrast CTA contrast** — `Open Session 1` now uses the theme-aware accent text colour rather than fixed white.
4. **Team-size persistence** — 3/4-student selection is stored locally and restored after reload.
5. **Session status in library** — card now shows Not started, In progress (x/6), or Completed on this device, with an appropriate Open/Resume/View result CTA.
6. **Direct exit controls** — decision and consequence screens now include a direct `Back to sessions` action without erasing progress.
7. **Decision progress** — Decision 1 now visibly starts at 1/6 instead of showing an empty progress bar. The visual track has progressbar semantics for assistive technology.
8. **State preservation** — navigating back to the session library does not erase confirmed choices; reopening the card resumes correctly.
9. **Direct-hash startup safety** — opening the site directly at `#groupactivity` can no longer invoke session-state rendering before the Session 1 engine has initialised.
10. **Version alignment** — app meta, JS/CSS query versions and PWA cache all use V11.

## Determinism guarantee
Scoring rules are deliberately unchanged from V10: **Ruleset S1-R10**. There is no `Math.random()`, `shuffle()`, date/time input, network input or device-specific input in the Session 1 decision/scoring engine. Therefore identical decision codes under S1-R10 produce identical scores and profiles on different devices.

## Static checks
- JavaScript syntax checked.
- 6 decision steps.
- 5 fixed options (A–E) at each step.
- No duplicate static HTML IDs.
- All PWA assets referenced by the service worker are present.
- No scoring-rule changes in V11.
