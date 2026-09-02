# EnglishForPublicHealth — V7 correction

## Main correction
- Group Activity now displays a **large, immediately clickable Session 1 card**: **Who Gets the Medicine?**
- The card shows team size, estimated duration and the 90-second final briefing.
- Clicking the card opens the Session 1 simulation.

## Technical cleanup
- Removed the obsolete pre-Session-1 Group Activity engine and its six legacy missions.
- Migrates old numeric Group Activity progress out of local storage.
- Session 1 scoring remains deterministic: identical choices => identical consequences, decision code, scores and final profile on every device.
- Added a new cache/version namespace to force browsers away from stale GitHub Pages/PWA files.

## Version
- HTML build: 2026-09-02-v7-session-library
- CSS/JS query version: 20260902-7
- Cache: ph-english-v7-20260902-session-library
