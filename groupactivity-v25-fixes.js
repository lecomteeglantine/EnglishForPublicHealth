/* EnglishForPublicHealth · Group Activity V25 deep-audit fixes
   Loaded by sw.js after app.js and group-sessions.js.
   Scope: state consistency only. No scenario text, option order or score values are changed. */
(() => {
  'use strict';

  const PATCH_VERSION = 'V25-20260915';

  function sameArray(a, b) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
  }

  function persistActivity() {
    try {
      if (typeof saveState === 'function') saveState();
    } catch (_) {}
  }

  function syncCompletionSignals() {
    try {
      if (typeof activity === 'undefined' || !activity || !Array.isArray(activity.group)) return;

      // Keep any future/non-session activity markers, but rebuild Session 1–7
      // completion markers from the engines' current UI/state instead of stale history.
      const keep = activity.group.filter(id => !/^session[1-7]$/.test(String(id)));
      const completed = [];

      if (
        typeof groupSession1 !== 'undefined' &&
        groupSession1 &&
        groupSession1.completed === true &&
        Array.isArray(groupSession1.choices) &&
        typeof SESSION1_STEPS !== 'undefined' &&
        groupSession1.choices.length === SESSION1_STEPS.length
      ) {
        completed.push('session1');
      }

      for (let n = 2; n <= 7; n++) {
        const status = document.querySelector(`#session${n}CardStatus`);
        if (status && status.textContent.trim() === 'Completed on this device') {
          completed.push(`session${n}`);
        }
      }

      const next = [...new Set([...keep, ...completed])];
      if (!sameArray(activity.group, next)) {
        activity.group = next;
        persistActivity();
      }
    } catch (_) {
      // A consistency patch must never make the learning platform unusable.
    }
  }

  // Session 1 hardening: Sessions 2–7 already restore the final consequence
  // when all choices exist but an interrupted save lost the completion/outcome flag.
  // Give Session 1 the same behaviour so its final Pitch Checkpoint cannot be skipped.
  try {
    if (typeof normaliseGroupSession1 === 'function') {
      const baseNormaliseGroupSession1 = normaliseGroupSession1;
      normaliseGroupSession1 = function patchedNormaliseGroupSession1() {
        baseNormaliseGroupSession1();

        if (
          typeof groupSession1 !== 'undefined' &&
          groupSession1 &&
          Array.isArray(groupSession1.choices) &&
          typeof SESSION1_STEPS !== 'undefined' &&
          groupSession1.choices.length === SESSION1_STEPS.length &&
          groupSession1.completed !== true &&
          !groupSession1.outcome
        ) {
          const last = SESSION1_STEPS.length - 1;
          const choiceId = groupSession1.choices[last];
          const valid = typeof session1Option === 'function' ? session1Option(last, choiceId) : null;
          if (valid) {
            groupSession1.step = last;
            groupSession1.outcome = {
              stepIndex: last,
              choiceId,
              consistency: typeof compatibilityNote === 'function' ? compatibilityNote(last, choiceId) : ''
            };
            if (typeof saveGroupSession1 === 'function') saveGroupSession1();
          }
        }
        return groupSession1;
      };
    }
  } catch (_) {}

  // Keep Session 1's progress marker semantics aligned with Sessions 2–7:
  // resetting/replaying the session removes its current-completion marker.
  try {
    if (typeof clearSession1 === 'function') {
      const baseClearSession1 = clearSession1;
      clearSession1 = function patchedClearSession1() {
        const result = baseClearSession1();
        try {
          if (typeof activity !== 'undefined' && activity && Array.isArray(activity.group)) {
            const next = activity.group.filter(id => id !== 'session1');
            if (!sameArray(activity.group, next)) {
              activity.group = next;
              persistActivity();
            }
          }
        } catch (_) {}
        return result;
      };
    }
  } catch (_) {}

  // Session 7 belongs to the seven-session course. Remove two stale references
  // to a non-existent Session 8 without touching the scenario engine itself.
  function fixSession7Wording() {
    try {
      const replacements = [
        ['Final Campaign Workshop · before Session 8', 'Final Campaign Workshop'],
        ['real Session 8 campaign', 'real final campaign'],
        ['final Session 8 presentation', 'final presentation']
      ];
      const nodes = document.querySelectorAll(
        '#session7CardDesc, #session7Detail .eyebrow, #session7Detail p, #session7Detail small, #session7Detail h4, #session7Detail span'
      );
      nodes.forEach(node => {
        if (node.children && node.children.length) return;
        let text = node.textContent || '';
        let next = text;
        for (const [from, to] of replacements) next = next.split(from).join(to);
        if (next !== text) node.textContent = next;
      });
    } catch (_) {}
  }

  // Reconcile once after both engines have injected their cards, and after user
  // actions that may change completion/reset state. The delay lets the original
  // click handler finish first.
  const applyConsistencyFixes = () => {
    syncCompletionSignals();
    fixSession7Wording();
  };
  const scheduleSync = () => setTimeout(applyConsistencyFixes, 0);
  try {
    document.addEventListener('click', scheduleSync, true);
    window.addEventListener('pageshow', scheduleSync);
    window.addEventListener('storage', scheduleSync);
  } catch (_) {}

  scheduleSync();

  try {
    document.documentElement.dataset.groupActivityPatch = PATCH_VERSION;
  } catch (_) {}
})();
