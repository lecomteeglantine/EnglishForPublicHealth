# English for Public Health — V4 audit and corrections

Audit date: **1 September 2026**  
Build: **2026-09-01-v4-full-audit**

## Deployment checked

The current repository source was checked after the V3 upload. The repository contains the V3 build, including the top-level **Group Activity** navigation entry and the V3 service-worker cache. The V4 package in this ZIP starts from that corrected build and adds the fixes found during the new audit.

## Critical / functional fixes in V4

### 1. Public Health Gap could produce questions with no gap

The V3 game used an exact string replacement. Seventeen examples either used an inflected form, a plural, a hyphenated variant, or a different grammatical form. Examples included:

- `cost-effectiveness` → example contained `cost-effective`;
- `health inequality` → example contained `health inequalities`;
- `to suggest` → example contained `suggest`;
- `to account for` → example contained `accounted for`;
- `to be associated with` → example contained `was associated with`;
- singular terms whose examples used plurals such as `stakeholder`, `policy-maker` and `vulnerable population`.

This could leave the sentence unchanged or produce awkward forms such as `_____s`.

**Fix:** the affected examples were rewritten so the target expression occurs naturally and exactly. The question engine also now has a defensive fallback if a future example no longer contains the target expression.

**QA result:** all **100 vocabulary terms** now generate a valid gap question, with one usable blank and no stray alphabetical suffix attached to the blank.

### 2. Practice final statistics were stale

After the final answer in a Practice session, the score card was correct but the statistics bar could still display the values from the previous question.

**Fix:** the completion branch now updates correct, missed, streak, progress text and the 100% progress bar before displaying the final score.

**QA result:** every tested 5-question mode finishes with `correct + missed = 5` and displays `Session complete · 5 questions`.

### 3. Flashcard progress could be counted twice

A student could rate a card, use **Previous**, then rate the same card again. V3 added another rating to progress, inflating the flashcard activity count and the session statistics.

**Fix:** each word now has one current rating per flashcard session. Re-rating a previous card updates the old rating instead of adding a second activity count.

The **Again** helper text was also changed from “Bring it back soon” to **“Keep for review”**, which accurately describes the behaviour: difficult words are stored in the review deck rather than silently lengthening the current session.

### 4. Case / Communication support mode could become visually inconsistent

If a Case or Communication task was already open, changing the support level could leave the old workspace visible. A student could therefore select **Challenge** while still looking at content generated under **Guided**.

**Fix:** changing the area/skill or support mode closes the existing workspace. The student then opens a fresh task with the selected mode.

### 5. Random task defensive guards

Random Case and Communication actions now check that data exist before attempting to open an item. This prevents a JavaScript exception if a future edit accidentally removes those datasets.

## Accessibility / responsive fixes in V4

### 6. Dark Mode Word of the Day contrast

V3 used a translucent white Word-of-the-Day panel while Dark Mode changed the text to near-white. This could create very light text on a very light panel.

**Fix:** Dark Mode now uses the theme surface colour for the Word-of-the-Day panel.

### 7. High Contrast Mode was not consistently high contrast

The hero retained its pastel gradient and primary buttons used white text on cyan. Those combinations did not provide the intended high-contrast experience.

**Fixes:** High Contrast now uses a black hero/header, black text on cyan action buttons, and a black Word-of-the-Day panel with white text. Correct/wrong answer states also receive explicit high-contrast borders.

### 8. Secondary accent contrast

The coral accent (`#e27d60`) with white text did not provide sufficient contrast for normal-size text.

**Fix:** coral action buttons now use dark text, while coral used as foreground text is replaced by a darker accessible coral in the light theme. Dark and High Contrast themes have their own readable variants.

### 9. 150% text-size overflow on mobile

At 150% text size, V3 could overflow horizontally on narrow screens in Lexicon, Flashcards, Communication Lab, My Vocabulary and Dictionary.

**Fixes:** inputs and selects can shrink within their grids; page-title text containers can wrap; mobile page headings use a robust two-column grid; controls are capped to their container width.

**QA result:** no page-level horizontal overflow detected across all 12 sections at **320, 375, 620, 768, 1024 and 1440 px**, with the site text scale set to **150%**.

### 10. Reduced Motion did not fully stop smooth scrolling

The toggle disabled CSS transitions/animations but programmatic `scrollTo()` and `scrollIntoView()` calls still requested smooth motion.

**Fix:** all programmatic scrolling now chooses `auto` when the site Reduced Motion setting is enabled or when the operating system requests `prefers-reduced-motion: reduce`. Button hover movement is also disabled in reduced-motion mode.

### 11. Simple Layout decorative bubbles

The CSS attempted to hide `.hero-bubble`, but the actual decorative elements are `.bubble-one` and `.bubble-two`.

**Fix:** Simple Layout now hides the real decorative bubble elements.

## Pronunciation improvement

V3 set the utterance language to `en-GB`, but did not explicitly prefer an installed British English voice.

**Fix:** the speech function now looks for an installed `en-GB` voice and selects it when available, while retaining `u.lang = 'en-GB'` as the fallback. Pronunciation remains dependent on voices installed by the device/browser.

## Data and structural checks

Verified in V4:

- **100** vocabulary terms;
- **10** chapters, with 10 terms per chapter;
- **41** topic sections;
- **9** Public Health Cases;
- **8** Communication Lab tasks;
- **6** Group Activity missions;
- no duplicate vocabulary words;
- no missing required vocabulary fields;
- no duplicate HTML IDs;
- all 12 application page sections are present;
- all local stylesheet/script/manifest references resolve to files included in the package;
- PWA icon files have the declared dimensions: 192×192, 512×512 and 180×180 Apple touch icon;
- `manifest.webmanifest` parses as valid JSON;
- `app.js` and `sw.js` pass JavaScript syntax checks.

## Interaction QA

Chromium DOM/interactivity tests confirmed:

- all 12 sections activate correctly;
- Lexicon filtering works, including zero-result states;
- Dictionary search renders matching term cards;
- saving a word updates My Vocabulary;
- a 10-card flashcard session reaches **10 / 10** and displays the completion screen;
- going back and changing a flashcard rating does not increment the activity count twice;
- Definition, French → English, Public Health Gap, Listen & Spot, Collocation Match and Mix It Up all run as finite Practice sessions;
- Practice answer options are unique in the tested sessions;
- final Practice statistics include the last answer;
- Case and Communication workspaces open and close correctly;
- changing their support mode closes stale workspaces;
- Group Activity role draw returns exactly 3 assignments for a team of 3 and 4 assignments for a team of 4;
- marking a Group Activity mission updates group progress;
- Pronunciation completes a five-word workout and updates counters;
- the 24-question Check-up completes and displays a score;
- no JavaScript page errors occurred in the tested core flows.

## PWA / cache

The service worker has been bumped to:

`ph-english-v4-20260901-full-audit`

The HTML now loads:

- `styles.css?v=20260901-4`
- `app.js?v=20260901-4`

This prevents V3 CSS/JavaScript from remaining attached to the new HTML after the GitHub Pages update.

## Upload instructions

Upload **all files from this ZIP to the repository root**, replacing the corresponding existing files. Do not upload the enclosing local folder. `index.html` must remain at the repository root.
