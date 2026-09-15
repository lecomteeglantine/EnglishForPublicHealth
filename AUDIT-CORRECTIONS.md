# EnglishForPublicHealth — Group Activity V26 functional audit

Audit target: the live `#groupactivity` deployment on 15 September 2026.

## What was verified

- Session 1 uses six fixed decisions and deterministic score effects.
- Sessions 2–7 use fixed option arrays and deterministic score recalculation; no `Math.random()` is used by their engine.
- Saved choices are normalised to a contiguous valid sequence before a session is resumed.
- Sessions 2–7 restore the last consequence if the browser was interrupted after writing the final choice but before writing completion.
- Session 1 receives the same interrupted-final-choice protection in the V26 patch.
- Reset/replay removes the corresponding current-completion marker.
- The global completion counter is rebuilt from current Session 1 state and current Session 2–7 saved state/card status.
- Session 7 stale references to a non-existent Session 8 are removed from dynamically-rendered screens.
- The duplicated Session 7 phrase `because they are a priority because…` is cleaned up.
- The current Session 2 portrait assets are optional for service-worker installation, so a missing portrait cannot block the whole app update.

## Functional corrections in V26

### 1. Service-worker reload is scoped to this app

The previous worker matched clients by origin only. On GitHub Pages, several projects share `lecomteeglantine.github.io`. V26 reloads only client URLs whose pathname is inside the current service-worker scope (`/EnglishForPublicHealth/`).

### 2. Offline fallback cannot resurrect an older deployment

The previous worker used origin-wide `caches.match(...)` on fallback. V26 reads only the current V26 cache. This prevents a stale matching URL from an older cache from being returned after a deployment change.

### 3. One active patch only

HTML navigation responses remove injected V24/V25 group-activity patch tags before V26 is injected. This prevents stacked monkey-patches and duplicate click/storage handlers after upgrades.

### 4. Completion state is hardened

V26 keeps the Session 1 interrupted-final-choice repair and reset cleanup from V25, while rebuilding Session 2–7 completion signals from saved state as well as the launch-card status.

### 5. Session 7 wording is corrected everywhere

The correction now scans dynamically-rendered Session 7 text, so the final screen cannot reintroduce `Session 8` after a later render.

## Files to upload to repository root

- `sw.js` — replace the existing file.
- `groupactivity-v26-fixes.js` — add this file.

The previous `groupactivity-v25-fixes.js` can remain in the repository; V26 no longer injects it. It may be deleted later if desired, but deletion is not required for correct functioning.

## Deployment behaviour

When V26 activates, an already-open EnglishForPublicHealth page may reload once. This is intentional so the page, app scripts and patch all belong to the same deployed ruleset.
