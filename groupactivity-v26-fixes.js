/* EnglishForPublicHealth · Group Activity V26 functional hardening
   Scope: state consistency, deterministic display consistency and stale wording only.
   Scenario choices, option order and scoring values are NOT changed. */
(() => {
  'use strict';

  const PATCH_VERSION = 'V26-20260915';
  const SESSION_COUNTS = {2:6, 3:4, 4:4, 5:4, 6:4, 7:4};

  function sameArray(a, b) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
  }

  function persistActivity() {
    try {
      if (typeof saveState === 'function') saveState();
    } catch (_) {}
  }

  function sessionCompletedFromStorage(n) {
    try {
      const key = n === 2 ? 'pheng_group_session_2_postcode_v2' : `pheng_group_session_${n}_v1`;
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      return Boolean(
        raw &&
        typeof raw === 'object' &&
        raw.completed === true &&
        Array.isArray(raw.choices) &&
        raw.choices.length === SESSION_COUNTS[n]
      );
    } catch (_) {
      return false;
    }
  }

  function syncCompletionSignals() {
    try {
      if (typeof activity === 'undefined' || !activity) return;
      if (!Array.isArray(activity.group)) activity.group = [];

      // Keep non-course markers, rebuild Session 1–7 completion from the actual
      // engines/storage so stale progress cannot survive a reset or interrupted save.
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
        const domComplete = Boolean(status && status.textContent.trim() === 'Completed on this device');
        if (domComplete || sessionCompletedFromStorage(n)) completed.push(`session${n}`);
      }

      const next = [...new Set([...keep, ...completed])];
      if (!sameArray(activity.group, next)) {
        activity.group = next;
        persistActivity();
      }
    } catch (_) {
      // Consistency hardening must never make the platform unusable.
    }
  }

  // Session 1: if all six choices were written but the browser was interrupted
  // before the final consequence/completion flag was saved, restore that final
  // consequence instead of skipping the last Pitch Checkpoint.
  try {
    if (typeof normaliseGroupSession1 === 'function') {
      const baseNormaliseGroupSession1 = normaliseGroupSession1;
      normaliseGroupSession1 = function patchedNormaliseGroupSession1V26() {
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

  // Reset/replay must remove Session 1 from the global completion counter.
  try {
    if (typeof clearSession1 === 'function') {
      const baseClearSession1 = clearSession1;
      clearSession1 = function patchedClearSession1V26() {
        const result = baseClearSession1();
        try {
          if (typeof activity !== 'undefined' && activity) {
            if (!Array.isArray(activity.group)) activity.group = [];
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

  // Session 7 is the final course workshop. Remove old Session 8 references and
  // one duplicated "because" that survived in dynamically-rendered text.
  const WORDING_REPLACEMENTS = [
    ['Final Campaign Workshop · before Session 8', 'Final Campaign Workshop'],
    ['real Session 8 campaign', 'real final campaign'],
    ['final Session 8 presentation', 'final presentation'],
    ['Session 8 campaign', 'final campaign'],
    ['Session 8 presentation', 'final presentation'],
    ['because they are a priority because …', 'because this group is a priority due to …']
  ];

  function fixSession7Wording() {
    try {
      const roots = [
        document.querySelector('#session7CardButton'),
        document.querySelector('#session7Detail')
      ].filter(Boolean);

      for (const root of roots) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          let next = node.nodeValue || '';
          const original = next;
          for (const [from, to] of WORDING_REPLACEMENTS) next = next.split(from).join(to);
          if (next !== original) node.nodeValue = next;
        }
      }
    } catch (_) {}
  }

  // If another tab changes one of the group-session records, refresh this page's
  // consistency signals. The engine remains local-device only by design.
  function relevantStorageKey(key) {
    return key === 'pheng_group_session_2_postcode_v2' ||
      /^pheng_group_session_[3-7]_v1$/.test(String(key || '')) ||
      key === 'pheng_state';
  }

  function applyConsistencyFixes() {
    syncCompletionSignals();
    fixSession7Wording();
  }

  let syncQueued = false;
  function scheduleSync() {
    if (syncQueued) return;
    syncQueued = true;
    setTimeout(() => {
      syncQueued = false;
      applyConsistencyFixes();
    }, 0);
  }

  try {
    document.addEventListener('click', scheduleSync, true);
    window.addEventListener('pageshow', scheduleSync);
    window.addEventListener('hashchange', scheduleSync);
    window.addEventListener('storage', event => {
      if (relevantStorageKey(event.key)) scheduleSync();
    });

    const groupRoot = document.querySelector('#groupactivity');
    if (groupRoot && 'MutationObserver' in window) {
      const observer = new MutationObserver(scheduleSync);
      observer.observe(groupRoot, {subtree:true, childList:true, characterData:true});
    }
  } catch (_) {}

  scheduleSync();

  try {
    document.documentElement.dataset.groupActivityPatch = PATCH_VERSION;
  } catch (_) {}
})();
