# V18 — Session 2 Postcode Lottery · detailed functional audit

Date: 2026-09-08

## Scope
Session 2 group activity only, plus regression protection for Session 1 and shared PWA assets.

## Functional corrections
1. **Final-profile wording corrected** — Session 2 has four score dimensions (Equity, Access, Wellbeing, Practicality). The balanced result now says “all 4 priorities”, not “all three priorities”.
2. **Saved-game recovery hardened** — localStorage choices are now validated step-by-step. Invalid, partial or stale data is truncated safely instead of being able to create an inconsistent/fake completed result.
3. **Outcome state normalised** — a saved consequence is restored only when its step and choice exactly match the validated confirmed choices.
4. **Team-size state normalised** — impossible saved values are reset to an allowed Session 2 team size.
5. **Back-navigation focus fixed** — returning from Session 2 now focuses the Session 2 card, rather than jumping to Session 1.
6. **Legacy Session 2 save cleaned** — obsolete V15 storage key is removed at startup; the V16/V17 Postcode Lottery save key remains the active compatible key.
7. **Accessibility hardening** — score bars and outcome progress bars now expose progressbar semantics and current values to assistive technology.
8. **Cache version bumped to V18** — HTML, Session 2 JS/CSS and service-worker cache names are synchronised to prevent V17 code from remaining mixed with V18.

## Regression protection
- `app.js` (Session 1 S1-R10 engine): byte-for-byte unchanged from V17/V16.
- `styles.css` (Session 1/base styles): byte-for-byte unchanged from V17/V16.
- Four realistic Session 2 WebP assets retained unchanged.
- Sessions 3–7 content/logic unchanged.

## Verification performed
- JavaScript syntax checks: app.js, group-sessions.js, sw.js — PASS.
- HTML IDs: 141 IDs, 0 duplicates.
- Static HTML refs: 0 missing.
- Service worker asset list: 14 entries, 0 missing.
- Four WebP images: valid, 840×1050 each.
- Session 2 structure: 6 decisions × 5 fixed options.
- Exhaustive deterministic test: 15,625/15,625 choice combinations; 15,625 unique decision codes; scores always clamped to 0–100.
- Browser interaction audit (Chromium build injected locally because external navigation is blocked in this environment): 68 checks, 0 JS/console errors.
- Browser flow covered: card/detail, realistic images, sound toggle, team roles, all 6 rounds, confirm/consequence/checkpoint, final 4/4 Pitch Builder, decision code, 2-minute timer, completion status, back focus, save/resume, corrupted-save recovery.
- Responsive widths checked: 320, 390, 768, 1024 px — no horizontal overflow.

## Deployment
Upload every file in the ZIP to the repository root and replace existing files. The service worker cache will move to V18 automatically after the new files are served.
