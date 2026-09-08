# V19 — Session 2 Postcode Lottery · detailed functional audit

## Bugs found and fixed

1. **Background timer after Final → Session overview**
   - V18 stopped the timer when leaving the Group Activity or returning to the session library, but `renderOverview()` itself did not stop it.
   - A student could therefore start the 2-minute timer on the final screen and then click **Session overview** while the interval continued invisibly until 0:00.
   - V19 calls `stopTimer()` whenever an overview is rendered.

2. **Game could lose progress when localStorage is unavailable**
   - V18 caught storage errors, but the next render immediately re-read localStorage. If storage access was blocked, the confirmed decision could disappear and the activity could jump back.
   - V19 keeps a validated same-tab in-memory snapshot as a fallback. The game therefore remains fully playable even when persistent browser storage is denied.

3. **Stale persistent state after a failed write**
   - If reading localStorage still worked but a new write failed (for example because of quota restrictions), V18 could read the older stored state on the next render.
   - V19 prefers the current in-memory snapshot during the tab session, so a newer confirmed choice cannot be overwritten by stale persistent data.

## Functional checks passed
- Chromium inline runtime audit: **61 standard checks passed**.
- Storage-denied audit: **4 checks passed**.
- Stale-storage/write-failure audit: **5 checks passed**.
- Session 1 isolation smoke test: **5 checks passed**.
- No JavaScript/page errors in those browser checks.
- Session 2: 6 decisions, exactly 5 fixed choices per decision.
- Exhaustive deterministic scoring audit: **15,625 / 15,625 choice combinations**.
- **15,625 unique decision codes**.
- Score range across all combinations: **8–100**, always clamped to the valid 0–100 interval.
- Final Pitch Builder reaches **4/4 parts ready**.
- Final 2-minute timer starts, pauses/resets and now stops on Overview.
- Four realistic resident images load correctly.
- Sound-effects ON/OFF control works.
- Team-role layouts for 3 and 4 students work.
- Resume after two confirmed choices returns to **Decision 3 of 6**.
- Responsive audit passed at **320, 390, 768, 1024 and 1440 px** without horizontal overflow.
- Service-worker asset list: no missing local asset.
- Session 1 opens, starts, offers five choices and produces its first consequence correctly after the V19 extension is loaded.

## Session 1 integrity
The protected Session 1 files remain byte-for-byte identical to V18:
- `app.js` SHA-256: `842df7994198f8177073c844c6acf90277ff7da340c206fca5151781c2c9c94f`
- `styles.css` SHA-256: `c33f68edf67e730c9c87f6c96c753388af651d946f8320c3d61d2d04d3addec3`

## Deployment
Upload all files from the ZIP to the repository root and replace the existing files. The service-worker cache name and Session 2 JS/CSS query versions are synchronised to V19.
