# EnglishForPublicHealth — Group Activity V8 audit

## Main UX correction
- **Group Activity now opens as a session library only.**
- On first arrival, students see the **Session 1 — Who Gets the Medicine?** card and no Session 1 scenario content below it.
- The Session 1 detail view is hidden until the card is clicked.
- A **Back to sessions** control returns to the clean session-library view.

## Activity audit and corrections
1. **Hidden-before-click bug fixed** — the V7 rendered Session 1 content underneath the session card and pre-filled the simulation workspace during page initialisation. V8 does neither.
2. **Scoring rebalanced** — V7 allowed an almost perfect path (100 / 100 / 98 / 100). V8 makes genuine trade-offs unavoidable. Exhaustive test of all **15,625** decision codes found a highest possible weakest score of **74/100**; there is no near-perfect four-score solution.
3. **Cross-device determinism hardened** — the Session 1 engine contains no random choice ordering or random score calculation. Every step always presents A–E in the same order.
4. **Old-state migration added** — saved V7 sessions are automatically recalculated from their decision code under V8. This prevents one device from keeping obsolete V7 points while another uses V8 points.
5. **Scenario arithmetic fixed** — the five population cards total **33 million eligible patients**, so the scenario headline now also says 33 million (not 38 million).
6. **Licensing logic improved** — every Step 3 option now involves a defined licensing model, so Step 4 royalties makes sense.
7. **Licence/manufacturing consistency warnings added** — if a production network is broader than the licence selected earlier, the simulation flags that the agreement would need to be renegotiated.
8. **Roles made reproducible** — role assignment is fixed by team size instead of random.
9. **Reset safety added** — an in-progress simulation asks for confirmation before current decisions are erased.
10. **Completed-session recovery improved** — students can view their previous result before starting again.
11. **Final instructions clarified** — every student must speak; students refer to at least two choices from the decision code; “Teacher support” was replaced with student-facing “Briefing support”.
12. **Accessibility improved** — selected choices expose `aria-pressed`, live choice feedback is announced, keyboard focus is moved to the Session 1 heading after opening, and the session card/back button have visible focus states.
13. **Progress wording corrected** — “group missions explored” is now “group sessions completed”.
14. **Version/cache aligned** — HTML, CSS, JS and service-worker cache all use V8 identifiers.

## Validation checks
- JavaScript syntax: PASS (`node --check`)
- Duplicate HTML IDs: **0**
- Session steps: **6**
- Options per step: **A, B, C, D, E** on all 6 steps
- Session engine uses `Math.random()`: **No**
- Session engine uses shuffle: **No**
- Service-worker assets missing: **0**
- Best balanced tested code: **BBCBED → (82, 76, 74, 75)**
- Session detail hidden by default: **Yes**

## Version
- Application: `2026-09-02-v8-groupactivity-audit`
- CSS/JS: `20260902-8`
- Cache: `ph-english-v8-20260902-groupactivity-audit`
