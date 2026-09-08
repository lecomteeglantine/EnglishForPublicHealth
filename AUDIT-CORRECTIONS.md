# Session 2 — The Postcode Lottery — V20 audit

## Functional fixes added in V20

1. **Timer UI after tab/background change**
   - V19 correctly stopped the two-minute timer when the tab became hidden, but the visible Start/Pause label could remain stale when the student returned.
   - V20 stops the interval and immediately repaints the timer controls, so the button correctly shows **Start**.

2. **Interrupted final save / final checkpoint protection**
   - A damaged/interrupted saved state containing all six valid choices but neither `completed=true` nor the final outcome could jump directly to the result screen.
   - V20 reconstructs Decision 6's consequence in that exceptional state. Students must still see the last consequence and complete the final Pitch Checkpoint before the final briefing is built.

## Revalidated

- 6 decisions; 5 fixed options A–E per decision.
- 15,625 possible paths and 15,625 unique decision codes.
- Deterministic scores, bounded 0–100.
- Normal storage and blocked-storage fallback.
- Four realistic local WebP images load correctly.
- Sounds ON/OFF.
- Pitch Builder reaches 4/4.
- Two-minute final timer.
- Responsive layouts at 320, 390, 768, 1024 and 1440 px.
- No duplicate HTML IDs or missing local/service-worker assets.
- JavaScript syntax checks pass.

## Session 1 protection

`app.js` and `styles.css` are byte-for-byte unchanged from V19. Session 1 scoring and S1-R10 were not modified.
