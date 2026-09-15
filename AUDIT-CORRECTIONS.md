# EnglishForPublicHealth — Session 4 audit & correction V29

Date: 15 September 2026
Scope: Session 4 — **Vaccine Confidence Crisis** only, plus the cache/version layer needed to keep classroom devices on the same build.

## Functional audit

The live Session 4 engine contains 4 decisions. Each decision has four fixed options (A–D). The option order is static and the group-session engine contains no `Math.random()` call.

The displayed scores are recalculated from the saved choice sequence. Consequence text is attached directly to each fixed option. Therefore, on the same ruleset, the same sequence of choices produces the same consequence screens, score changes, decision code and final result.

An exhaustive check of all 4^4 = **256 possible Session 4 choice sequences** was run against the published score deltas. All 256 paths produced valid integer scores between 0 and 100. No invalid/NaN score path was found.

## Corrections in V29

1. **Session 4 gets its own ruleset: S4-R2.** The service worker patches the engine's Session 4 storage key to `pheng_group_session_4_v2`. This prevents an old saved Session 4 run from silently changing the starting state on one device.
2. The obsolete `pheng_group_session_4_v1` record is removed. No other session data is deleted.
3. **V28 Quick Start bug fixed:** the instruction box is shown on the Session 4 overview only. It is no longer re-added above every decision, consequence or final screen.
4. Instructions are shortened to three actions: assign roles → discuss/select/confirm → read consequence/say checkpoint/continue.
5. Decision text is shortened: `Confirm team choice`, `Instructions / overview`, and `Checkpoint done → next decision`.
6. Session 4 now displays `S4-R2 · fixed choices` and a concise parity reminder.
7. The service worker uses a new V29 cache/build and removes earlier runtime patches before injecting V29, so classroom devices receive one coherent version.

## Important parity rule

Two students who start Session 4 on S4-R2 and make the **same choices in the same order up to a given decision** receive the same options, consequence, cumulative scores, decision code and next screen. If their earlier choices differ, cumulative scores will naturally differ.

## Files to upload to the repository root

- `sw.js`
- `groupactivity-v29-session4-hardening.js`

The scenario content, answer order, consequences and score values were not changed.
