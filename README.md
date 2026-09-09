# EnglishForPublicHealth — V22

GitHub-ready full package. Upload every file from this ZIP to the repository root and replace the matching files.

## V22 focus — illustrated Flash Missions + full group-flow audit

- Session 1 keeps its deterministic **S1-R10** scoring and the same 6 core decisions.
- Three new **illustrated Flash Missions** appear after Decisions 1, 3 and 5:
  - **Supply Scan** — identify the figure that proves the access shortage.
  - **Trade-off Detective** — choose a defensible policy compromise sentence.
  - **Crisis Desk** — prepare responsible emergency-response wording.
- Flash Missions are deliberately **score-neutral**: they do not modify scores, saved choices or the deterministic decision code.
- Each Flash Mission gives the team language/evidence that can be reused in the final pitch.
- The existing **Pitch Checkpoints** remain after every consequence.
- The final pitch remains **2:00 total for the whole group**, not 2 minutes per student.
- Sessions 2–7 are unchanged in content/logic and were replayed through their final screen to verify that V22 does not break them.
- Cache-busting references for `styles.css`, `app.js`, `group-sessions.js` and the service-worker cache have been refreshed for deployment.

See `AUDIT-CORRECTIONS.md` for the validation performed.


## V23 deployment coherence hardening
All index asset URLs and service-worker precache URLs now use the same 20260909-23 revision. This prevents mixed-cache/offline failures after deployment. Session 1 includes the V22 illustrated Flash Missions and preserves S1-R10 deterministic scoring.
