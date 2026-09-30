EnglishForPublicHealth — Group Activity audit / corrective patch
Date: 30 September 2026

AUDIT RESULT
- No critical deterministic-scoring bug found in the published Group Activity logic.
- Session 1 uses a fixed S1-R10 ruleset and recomputes scores from confirmed choices.
- Sessions 2–7 use fixed option IDs and score deltas; no random scoring was found.
- Stored state is validated/normalised before resume, reducing corrupted-state problems.
- Main UX issue found: repeated timing/pitch instructions make the activity feel heavier than necessary.

WHAT THIS PATCH CHANGES
- Shortens repeated Session 1 instructions.
- Keeps every task requirement.
- Adds one compact “same choices = same result” reminder.
- Improves mobile button layout and minimum tap size.
- Does NOT alter decisions, scores, decision codes, saved choices, or session outcomes.

FILES
- groupactivity-v24-fix.js
- groupactivity-v24-fix.css

DEPLOYMENT
Add these two lines to index.html:
1) in <head>, after group-sessions.css:
   <link rel="stylesheet" href="groupactivity-v24-fix.css?v=20260930-24">

2) just before </body>, after the existing app/group-session scripts:
   <script src="groupactivity-v24-fix.js?v=20260930-24"></script>

Then upload index.html plus the two new files to the repository root.

CACHE
Because the site is a PWA/service-worker site, hard-refresh once after deployment.
If an older cached version persists on a device, close/reopen the tab or clear this site's cached data once.

NOTE
This is deliberately an additive patch: it avoids replacing the large existing app.js/group-sessions.js files and therefore avoids changing the tested scoring engines.
