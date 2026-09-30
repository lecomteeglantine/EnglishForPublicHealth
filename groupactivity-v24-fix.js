/* EnglishForPublicHealth – Group Activity UX hardening
   2026-09-30 · additive patch (does not alter scoring or saved choices)
   Purpose:
   - simplify repeated student-facing instructions
   - preserve deterministic choice/score logic
   - improve mobile readability/focus
*/
(() => {
  'use strict';

  const shortTexts = {
    // Static Session 1 instruction block
    '#session1Detail .group-activity-intro p': null
  };

  function replaceExact(root, selector, from, to) {
    root.querySelectorAll(selector).forEach(el => {
      if ((el.textContent || '').trim() === from.trim()) el.textContent = to;
    });
  }

  function tidySession1(root=document) {
    // Keep only one prominent timing rule in the static intro.
    root.querySelectorAll('#session1Detail p, #groupMissionWorkspace p, #groupMissionWorkspace small').forEach(el => {
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t === 'Important: the whole team shares one 2:00 limit — it is not 2 minutes per student. This is not an improvised recap at the end: every confirmed decision adds material to your Pitch Builder. After each consequence, agree on one sentence you could say aloud.') {
        el.textContent = 'Build the pitch as you go: after each consequence, agree on one short sentence. The whole team shares one 2:00 limit.';
      }
      if (t === 'Whole-team time rule: aim for roughly 1:45–1:55. All speakers and all four parts must fit inside the same 2:00 total; the final seconds are your safety buffer.') {
        el.textContent = 'Aim for 1:45–1:55. Everyone speaks; stop at 2:00.';
      }
      if (t === '2:00 is the whole-team total, not a per-student allowance. Keep keywords and one clear sentence per checkpoint. Target 1:45–1:55; hard stop at 2:00.') {
        el.textContent = 'Whole-team limit: 2:00. Keep one clear sentence per checkpoint and aim for 1:45–1:55.';
      }
    });

    // Condense the numbered student instructions without changing task requirements.
    const heading = [...root.querySelectorAll('#session1Detail h3')].find(h => /Student instructions/i.test(h.textContent || ''));
    const list = heading?.nextElementSibling;
    if (list && list.tagName === 'OL' && list.children.length >= 6) {
      const items = [
        'Form a team of 3 or 4 and assign roles. Everyone must contribute.',
        'Read the scenario and country cards. Identify the shortage and the main constraints.',
        'Make 6 decisions together. Discuss all options, then confirm one shared choice.',
        'After each consequence, agree on one short Pitch Checkpoint sentence. Complete the Flash Missions after Decisions 1, 3 and 5.',
        'Do not chase a perfect score. Build an agreement you can defend.',
        'Rehearse one team pitch: use all four parts, at least four Session 1 terms, and stop before 2:00.'
      ];
      [...list.children].forEach((li, i) => { if (items[i]) li.textContent = items[i]; });
    }

    // Improve live choice hint.
    replaceExact(
      root,
      '#groupChoiceHint',
      'Discuss all five options, then select one shared answer. Only confirmed choices are saved.',
      'Discuss the options, select one shared answer, then confirm. Only confirmed choices are saved.'
    );

    // Add a compact deterministic badge once, near the workspace.
    const ws = root.querySelector('#groupMissionWorkspace');
    if (ws && !root.querySelector('#s1DeterministicBadge')) {
      const badge = document.createElement('div');
      badge.id = 's1DeterministicBadge';
      badge.className = 'groupactivity-audit-badge';
      badge.setAttribute('role', 'note');
      badge.innerHTML = '<strong>Fixed rules:</strong> same choices → same scores, decision code and next screens.';
      ws.parentNode?.insertBefore(badge, ws);
    }
  }

  function hardenButtons(root=document) {
    // Prevent accidental double-confirmation on slower/mobile devices.
    root.querySelectorAll('#confirmGroupChoice, [id^="s"][id$="Confirm"]').forEach(btn => {
      if (btn.dataset.doubleClickGuard) return;
      btn.dataset.doubleClickGuard = '1';
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btn.dataset.clickedAt = String(Date.now());
        setTimeout(() => {
          if (document.contains(btn)) delete btn.dataset.clickedAt;
        }, 500);
      }, {capture:true});
    });
  }

  function run() {
    tidySession1(document);
    hardenButtons(document);
  }

  const observer = new MutationObserver(() => run());
  observer.observe(document.documentElement, {subtree:true, childList:true});
  document.addEventListener('DOMContentLoaded', run, {once:true});
  run();
})();
