# EnglishForPublicHealth — Group Activity V14

Final hardening audit after checking the deployed V13 build.

## Fixes in V14
- **Start / resume button:** now opens the actual decision flow immediately. If Session 1 is already complete, it opens the final result instead of adding an unnecessary intermediate click.
- **Pitch timer lifecycle:** the 2-minute rehearsal timer now stops automatically when the student leaves Group Activity through the main navigation, so it cannot continue running invisibly in the background.
- **Version synchronisation:** HTML, JavaScript, CSS cache-busting and service-worker cache are all V14.
- Ruleset **S1-R10 is unchanged**. No scoring values, options, consequences or decision order were modified.

## Validation
- JavaScript syntax: PASS
- Service-worker syntax: PASS
- Duplicate HTML IDs: 0
- Missing local references: 0
- Session 1: 6 decisions × 5 fixed options
- Exhaustive deterministic score audit: **15,625 / 15,625 combinations PASS**
- All computed score dimensions remain within 0–100
- No stale `90-second` / `90-sec` wording
- Final pitch remains **2:00 maximum**, progressively prepared through Pitch Checkpoints

Upload the files from this ZIP directly to the repository root and replace the existing files.
