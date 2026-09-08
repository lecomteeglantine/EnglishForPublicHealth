# EnglishForPublicHealth — V19

Session 2: **The Postcode Lottery** · hardened audited realistic edition.

## What changed from V18
- Stops the 2-minute rehearsal timer whenever the student returns to the Session overview.
- Adds an in-memory state fallback so Session 2 remains playable when browser localStorage is blocked, unavailable, or a write fails because of quota restrictions.
- The in-memory state is preferred during the current tab session, preventing stale persistent data from overwriting a newer choice after a failed storage write.
- Session 2 runtime/cache version bumped to V19.

## Protected
- Session 1 engine (`app.js`) is unchanged.
- Session 1 stylesheet (`styles.css`) is unchanged.
- Session 2 decision content and scoring are unchanged from V18.
- The four realistic Session 2 WebP illustrations are unchanged.

Upload every file in this ZIP to the repository root and replace existing files.
