# Group Activity — V21 audit and corrections

Date: 9 September 2026

## Requested outcome

Every group activity must lead to **one structured mini-pitch lasting no more than 2:00 in total for the whole group**. The pitch must be prepared progressively during the game, not invented at the end.

## Corrections applied

1. **Shared time limit made explicit everywhere**
   - Replaced ambiguous “2 min max” labels with “2:00 total”.
   - Added repeated wording that the limit is for the **whole group**, not per student.
   - Clarified the rule in the Session 1 hero, instructions, Pitch Builder, role allocation and final screen.
   - Applied the same rule to Sessions 2–7 in the cards, overview, Pitch Builder and final speaking screen.

2. **Pitch built throughout the activity**
   - Kept a Pitch Checkpoint after every consequence.
   - Session 1 keeps its four-part roadmap (challenge/priority, agreement, trade-off, response/monitoring).
   - Sessions 2–7 now show four timed pitch parts while choices are being made.
   - Students are told to agree on the checkpoint sentence before continuing.

3. **Timing structure hardened**
   - Target: approximately **1:45–1:55**.
   - Hard stop: **2:00**.
   - The existing speaker split remains compatible with teams of 3 or 4; Session 7 retains its allowed 1–3 campaign-group sizes.

4. **Cache/version hardening**
   - Application version bumped to V21.
   - Changed JavaScript files have matching fresh query versions in `index.html` and `sw.js`.
   - Service-worker cache name changed so deployed browsers fetch the corrected build.

## Functional validation performed

- JavaScript syntax checks: `app.js`, `group-sessions.js`, `sw.js` — PASS.
- Static HTML duplicate IDs — none found.
- Referenced local HTML assets — none missing.
- Service-worker cached assets — none missing.
- HTML/service-worker JavaScript version references — aligned.
- Old ambiguous output labels “2 min max” / “2 minutes maximum” — none remaining.
- Session 1 complete browser flow: 6 decisions → 6 consequences/checkpoints → final pitch — PASS.
- Session 2 complete browser flow: 6 decisions → 6 consequences/checkpoints → final pitch — PASS.
- Sessions 3–7 complete browser flows: every decision → checkpoint → final pitch — PASS.
- Sessions 2–7 overview/navigation — PASS.
- Two-minute timer start / pause / reset — PASS.
- Browser runtime exceptions — 0.
- Browser console errors during the functional harness — 0.

## Logic preserved

- Session 1 deterministic scoring and Ruleset S1-R10 were not altered.
- Session 2–7 scoring data and decision consequences were not altered; this correction targets instructions, pitch construction and deployment/cache hardening.
