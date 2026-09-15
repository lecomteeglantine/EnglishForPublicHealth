# EnglishForPublicHealth · Group Activity V28

## What was wrong
The seven group activities existed, but the UI did not make them feel like seven clearly separate class sessions. Once a student opened a mission, the small `Session N` badge and the generic Back button were not enough to keep orientation clear. Session 4 also exposed several pieces of information before giving students a very short, explicit workflow.

## V28 changes
- Adds a permanent Session 1–7 selector at the top of Group Activity.
- Gives every session a distinct number, short theme and visual accent.
- Strengthens the identity of every detail page with an explicit `S1`…`S7` banner.
- Rewrites the library heading so students are told to choose the session number announced in class.
- Session 4 gets a four-step Quick Start:
  1. choose 3 or 4 students / assign roles;
  2. read and discuss all options;
  3. select ONE shared option and confirm it;
  4. read the consequence and say the Pitch Checkpoint before continuing.
- Replaces technical `deterministic choices` wording with `Same choices → same result`.
- Keeps the final Session 4 task explicit: one 2:00 briefing for the whole group.
- Preserves the V26 state-recovery/completion hardening.

## Device parity
No Session 4 scenario option, option order or score value is changed. The current engine stores a fixed option letter for each decision and recalculates scores from those fixed letters. V28 also cache-busts the main engine so two classroom devices do not remain on different deployed versions.

## Files
Upload these files together to the repository root:
- `sw.js`
- `groupactivity-v28-session-separation.js`

`AUDIT-CORRECTIONS.md` is documentation only.
