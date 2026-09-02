# EnglishForPublicHealth — Group Activity full audit V10

Audit date: 2026-09-02
Target: **Group Activity → Session 1 — Who Gets the Medicine?**

## Corrections made

### 1. Determinism hardened
The V9 engine already used fixed choices, but it could still trust a saved score object when the saved engine version matched. A stale or corrupted local-storage score could therefore disagree with the score generated on a clean device.

V10 **always recalculates the four scores from the decision code**. Saved numeric scores are no longer authoritative.

### 2. Inconsistent saved progress repaired
A malformed saved state could contain a `step` value that did not match the number of valid choices. V10 derives the current step from the validated decision sequence and only restores a pending consequence when it belongs to the latest valid choice.

### 3. Score-change display corrected
Scores are capped at 0–100. V9 displayed the theoretical option delta even when a score hit a cap. Example: a nominal `+18` could increase a score from 94 to only 100 while still displaying `+18`.

V10 displays the **actual applied change after the 0–100 limits**.

### 4. Progress made explicit
Each decision screen now displays **Decision X of 6** with a progress bar. Consequence screens clearly state that the current decision is complete.

### 5. Keyboard / screen-reader flow improved
New decision, consequence and result headings receive programmatic focus after dynamic screen changes. Choice cards retain `aria-pressed` state and the selected option is announced through the live status region.

### 6. Team-size role display fixed
If a team changes from 4 students to 3 (or back) after assigning roles, the displayed role assignment now updates immediately instead of showing stale roles.

### 7. Session controls clarified
The hero button is now labelled **Go to decision board** rather than suggesting that it opens a second hidden activity.

### 8. Cross-device version guard added
The activity displays **Ruleset S1-R10**. Groups comparing results can immediately verify that both devices are using the same ruleset rather than an old cached tab.

### 9. Mobile / large-text hardening
Group cards, decision codes and session containers now use explicit min-width/overflow protection. Action buttons meet a 44px minimum target height. Score-impact pills collapse to 2 columns and then 1 column on very narrow screens.

### 10. Version/cache alignment
All identifiers are aligned to V10:
- app metadata: `2026-09-02-v10-groupactivity-full-audit`
- CSS / JS: `20260902-10`
- cache: `ph-english-v10-20260902-groupactivity-full-audit`

## Automated structural tests
- JavaScript syntax: **PASS** (`node --check`)
- Session 1 steps: **6**
- Options per step: **5**
- Option IDs on every step: **A, B, C, D, E**
- Randomness inside Session 1 engine: **none**
- Possible decision codes tested: **15,625 / 15,625 unique**
- Same code recomputed twice: **identical scores for every code**
- Score range: **0–100**
- HTML duplicate IDs: **0**
- Required Group Activity IDs missing: **0**
- CSS braces balanced: **PASS**
- Service-worker referenced local assets missing: **0**

## Scoring balance check
Across all 15,625 possible paths:
- highest average of the four scores: **82.5** (`EBBCED`: 96 / 100 / 65 / 69)
- strongest minimum score across all four dimensions: **74** (`BBCBED`: 82 / 76 / 74 / 75)

This confirms that no route produces a near-perfect score in all four dimensions. The trade-off design remains intact.

## Content consistency checked
- Five setting cards total **33 million eligible patients**, matching the scenario figure.
- Initial supply is **12 million treatments**, so scarcity is explicit and internally consistent.
- Licensing/manufacturing incompatibilities produce an **Agreement check** warning rather than silently pretending the choices are compatible.
- The activity remains explicitly fictional teaching material.
