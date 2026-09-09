# Group Activity — V22 audit and corrections

Date: 9 September 2026

## Requested outcome

1. Verify the deployed Group Activity for functional problems.
2. Keep the final speaking task unambiguous: **one structured mini-pitch of no more than 2:00 total for the whole group**.
3. Make the activity more playful and visual without destabilising the deterministic score engine.

## What was already sound in the deployed build

- Session 1 clearly states that 2:00 is the whole-team limit.
- The pitch is built progressively through Pitch Checkpoints and a four-part Pitch Builder.
- Session 1 uses deterministic Ruleset **S1-R10**.
- Sessions 2–7 are present in the same Group Activity library and use deterministic confirmed choices.
- The final screens use a 120-second hard-stop timer.

## V22 additions

### 1. Three illustrated Flash Missions in Session 1

The six scored decisions are unchanged. V22 inserts three short, score-neutral challenges after selected consequences:

- **After Decision 1 — Supply Scan**
  - visual comparison of supply vs eligible population;
  - students choose the figure that best proves the shortage;
  - successful completion reveals a concise evidence sentence for the pitch.

- **After Decision 3 — Trade-off Detective**
  - illustrated balance between access and innovation;
  - students identify the sentence that states both a benefit and a cost/risk;
  - successful completion reveals usable trade-off language.

- **After Decision 5 — Crisis Desk**
  - illustrated emergency-response scene;
  - students select the responsible crisis briefing;
  - successful completion prepares the transition into Decision 6 and the final response section.

All three allow a wrong answer followed by another attempt. They do **not** change score values, saved decisions, completion state or the decision code.

### 2. Student instructions tightened

- The overview now announces the three Flash Missions before the simulation starts.
- Instructions explain when they appear and why they matter.
- The mission preview specifies their approximate 30-second duration.
- The final pitch rule remains unchanged: **2:00 total for the entire group**.

### 3. Version/cache hardening

- Visible Session 1 badge now identifies the stable ruleset and V22 gameplay layer: `S1-R10 · V22 GAMEPLAY`.
- `styles.css`, `app.js` and `group-sessions.js` use V22 cache-busting references.
- Service-worker cache name updated to `ph-english-v22-20260909-illustrated-flash-missions`.
- No external illustration dependency was added: the new mission art is inline vector artwork, so there are no new image URLs that can break.

## Functional validation performed

### Static checks

- `app.js` JavaScript syntax — PASS.
- `group-sessions.js` JavaScript syntax — PASS.
- `sw.js` JavaScript syntax — PASS.
- Duplicate HTML IDs — none found.
- Referenced local HTML assets — none missing.
- Service-worker cached local assets — none missing.
- HTML/service-worker V22 query references — aligned.

### Browser-flow checks

Session 1 was replayed in a fresh Chromium execution context:

- Session card opens correctly — PASS.
- 3-student mode — PASS.
- 6/6 decisions selected and confirmed — PASS.
- 6/6 consequence screens — PASS.
- Flash Mission 1: wrong answer → retry → correct answer — PASS.
- Flash Mission 2: wrong answer → retry → correct answer — PASS.
- Flash Mission 3: wrong answer → retry → correct answer — PASS.
- Decision code after test path `A-B-C-D-E-A` — PASS.
- Final Pitch Builder and 3-speaker plan — PASS.
- Final timer starts at 2:00, counts down and resets — PASS.

Sessions 2–7 were each replayed from first decision to final screen:

- Session 2: 6 decisions → final pitch/timer — PASS.
- Session 3: 4 decisions → final pitch/timer — PASS.
- Session 4: 4 decisions → final pitch/timer — PASS.
- Session 5: 4 decisions → final pitch/timer — PASS.
- Session 6: 4 decisions → final pitch/timer — PASS.
- Session 7: 4 decisions → final pitch/timer — PASS.
- Runtime exceptions during the clean browser harness — 0.
- Console errors during the clean browser harness — 0.

## Bug caught during V22 development

An initial draft of the new Flash Mission wiring used helper names belonging to the Sessions 2–7 module. The visual card rendered, but its answer buttons could have failed. This was caught by the browser harness **before packaging V22** and corrected to use Session 1's own DOM selectors. The corrected build was then replayed successfully.

## Logic intentionally preserved

- Session 1 score effects, consequences and Ruleset **S1-R10** were not modified.
- Sessions 2–7 score data, consequences and deterministic-choice logic were not modified.
- The 2:00 whole-group speaking limit was not relaxed or reinterpreted.


## V23 deployment coherence hardening
All index asset URLs and service-worker precache URLs now use the same 20260909-23 revision. This prevents mixed-cache/offline failures after deployment. Session 1 includes the V22 illustrated Flash Missions and preserves S1-R10 deterministic scoring.
