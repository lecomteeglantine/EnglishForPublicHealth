/* EnglishForPublicHealth · Group Activity V29 · Session 4 hardening
   Scope: state consistency, deterministic display consistency and stale wording only.
   Scenario choices, option order and scoring values are NOT changed. */
(() => {
  'use strict';

  const PATCH_VERSION = 'V29-20260915';
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
      const key = n === 2 ? 'pheng_group_session_2_postcode_v2' : n === 4 ? 'pheng_group_session_4_v2' : `pheng_group_session_${n}_v1`;
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
      key === 'pheng_group_session_4_v2' ||
      /^pheng_group_session_(?:3|5|6|7)_v1$/.test(String(key || '')) ||
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

/* --------------------------------------------------------------------------
   V29 · Clear session separation + concise Session 4 onboarding
   UI-only hardening. No scenario option, score value or option order changes.
   -------------------------------------------------------------------------- */
(() => {
  'use strict';

  const VERSION = 'V29-20260915';
  const GROUP = document.querySelector('#groupactivity');
  if (!GROUP) return;

  const SESSION_INFO = {
    1: {short:'Global health', title:'Who Gets the Medicine?', icon:'💊'},
    2: {short:'Health inequalities', title:'The Postcode Lottery', icon:'📍'},
    3: {short:'Epidemiology', title:'Outbreak Detective Room', icon:'🕵️'},
    4: {short:'Vaccination', title:'Vaccine Confidence Crisis', icon:'💉'},
    5: {short:'Nutrition & environment', title:'The Obesogenic City Lab', icon:'🥗'},
    6: {short:'Mental health', title:'Youth Wellbeing Response', icon:'🧠'},
    7: {short:'Final campaign', title:'Campaign Rehearsal Lab', icon:'🎯'}
  };

  const STYLE_ID = 'groupactivity-v29-session-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #groupactivity{--v28-s1:#0f766e;--v28-s2:#2563eb;--v28-s3:#7c3aed;--v28-s4:#c2410c;--v28-s5:#15803d;--v28-s6:#be185d;--v28-s7:#a16207}
      .v28-session-switcher{margin:1rem 0 1.2rem;padding:1rem;border:1px solid var(--border);border-radius:22px;background:var(--surface);box-shadow:var(--shadow)}
      .v28-session-switcher-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:.75rem}
      .v28-session-switcher-head strong{display:block;font-size:1.05rem}
      .v28-session-switcher-head small{display:block;color:var(--muted);margin-top:.18rem;line-height:1.35}
      .v28-session-switcher-grid{display:grid;grid-template-columns:repeat(7,minmax(118px,1fr));gap:.55rem;overflow-x:auto;padding:.15rem .05rem .35rem;scrollbar-width:thin}
      .v28-session-tab{--v28-accent:var(--accent);min-height:88px;text-align:left;border:1px solid color-mix(in srgb,var(--v28-accent) 34%,var(--border));border-radius:16px;background:color-mix(in srgb,var(--v28-accent) 6%,var(--surface));padding:.68rem;display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:.55rem;align-content:center;color:var(--text);cursor:pointer}
      .v28-session-tab:hover,.v28-session-tab:focus-visible{border-color:var(--v28-accent);transform:translateY(-1px)}
      .v28-session-tab[aria-current="true"]{box-shadow:inset 0 0 0 2px var(--v28-accent);background:color-mix(in srgb,var(--v28-accent) 12%,var(--surface))}
      .v28-session-tab .v28-num{grid-row:1/3;align-self:center;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--v28-accent);color:white;font-weight:900;font-size:.92rem}
      .v28-session-tab strong{font-size:.78rem;line-height:1.1}
      .v28-session-tab small{font-size:.68rem;line-height:1.15;color:var(--muted);margin-top:.16rem}
      .v28-session-tab[data-session="1"]{--v28-accent:var(--v28-s1)}
      .v28-session-tab[data-session="2"]{--v28-accent:var(--v28-s2)}
      .v28-session-tab[data-session="3"]{--v28-accent:var(--v28-s3)}
      .v28-session-tab[data-session="4"]{--v28-accent:var(--v28-s4)}
      .v28-session-tab[data-session="5"]{--v28-accent:var(--v28-s5)}
      .v28-session-tab[data-session="6"]{--v28-accent:var(--v28-s6)}
      .v28-session-tab[data-session="7"]{--v28-accent:var(--v28-s7)}

      #groupSessionLibrary .session-library-heading{padding:.95rem 1rem;border-left:5px solid var(--accent);border-radius:14px;background:color-mix(in srgb,var(--accent) 6%,var(--surface))}
      #groupSessionLibrary .session-library-heading h3{margin:.12rem 0 .28rem}
      #groupSessionLibrary .session-launch-grid{align-items:stretch}
      #groupSessionLibrary .session-launch-card{position:relative;overflow:hidden;border-width:2px!important}
      #groupSessionLibrary .session-launch-card::before{content:"";position:absolute;inset:0 auto 0 0;width:7px;background:var(--v28-card-accent,var(--accent))}
      #session1CardButton{--v28-card-accent:var(--v28-s1)}
      #session2CardButton{--v28-card-accent:var(--v28-s2)}
      #session3CardButton{--v28-card-accent:var(--v28-s3)}
      #session4CardButton{--v28-card-accent:var(--v28-s4)}
      #session5CardButton{--v28-card-accent:var(--v28-s5)}
      #session6CardButton{--v28-card-accent:var(--v28-s6)}
      #session7CardButton{--v28-card-accent:var(--v28-s7)}
      #groupSessionLibrary .session-number{display:inline-flex!important;width:max-content;padding:.28rem .5rem;border-radius:999px;background:var(--v28-card-accent,var(--accent));color:#fff!important;font-weight:900!important;letter-spacing:.06em}
      #groupSessionLibrary .session-open-cta{font-weight:900!important;color:var(--v28-card-accent,var(--accent))!important}
      #groupSessionLibrary .session-card-description{line-height:1.42}

      .v28-detail-identity{--v28-detail-accent:var(--accent);display:grid;grid-template-columns:auto 1fr;gap:.7rem;align-items:center;margin:.75rem 0 1rem;padding:.75rem .9rem;border:1px solid color-mix(in srgb,var(--v28-detail-accent) 35%,var(--border));border-left:7px solid var(--v28-detail-accent);border-radius:16px;background:color-mix(in srgb,var(--v28-detail-accent) 7%,var(--surface))}
      .v28-detail-identity[data-session="1"]{--v28-detail-accent:var(--v28-s1)}
      .v28-detail-identity[data-session="2"]{--v28-detail-accent:var(--v28-s2)}
      .v28-detail-identity[data-session="3"]{--v28-detail-accent:var(--v28-s3)}
      .v28-detail-identity[data-session="4"]{--v28-detail-accent:var(--v28-s4)}
      .v28-detail-identity[data-session="5"]{--v28-detail-accent:var(--v28-s5)}
      .v28-detail-identity[data-session="6"]{--v28-detail-accent:var(--v28-s6)}
      .v28-detail-identity[data-session="7"]{--v28-detail-accent:var(--v28-s7)}
      .v28-detail-number{display:grid;place-items:center;width:58px;height:58px;border-radius:15px;background:var(--v28-detail-accent);color:#fff;font-size:1.35rem;font-weight:950;line-height:1}
      .v28-detail-identity strong{display:block;font-size:1rem;line-height:1.2}
      .v28-detail-identity small{display:block;color:var(--muted);margin-top:.2rem;line-height:1.3}

      #session4Detail{--v28-session-accent:var(--v28-s4)}
      #session4Detail .extra-session-hero{border-top:6px solid var(--v28-session-accent);background:linear-gradient(135deg,var(--surface),color-mix(in srgb,var(--v28-session-accent) 8%,var(--surface2)))}
      #session4Detail .extra-session-meta span:last-child{border-color:color-mix(in srgb,var(--v28-session-accent) 30%,var(--border));background:color-mix(in srgb,var(--v28-session-accent) 8%,var(--surface))}
      .v28-s4-quickstart{margin:0 0 1rem;border:2px solid color-mix(in srgb,var(--v28-s4) 30%,var(--border));border-radius:20px;background:color-mix(in srgb,var(--v28-s4) 5%,var(--surface));padding:1rem}
      .v28-s4-quickstart .eyebrow{color:var(--v28-s4)}
      .v28-s4-quickstart h4{margin:.15rem 0 .75rem;font-size:1.15rem}
      .v28-s4-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem}
      .v28-s4-step{border:1px solid var(--border);border-radius:15px;padding:.72rem;background:var(--surface)}
      .v28-s4-step span{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--v28-s4);color:white;font-weight:900;margin-bottom:.45rem}
      .v28-s4-step strong{display:block;font-size:.82rem;line-height:1.25}
      .v28-s4-parity{margin:.75rem 0 0;padding:.62rem .75rem;border-radius:13px;background:color-mix(in srgb,var(--v28-s4) 9%,var(--surface2));font-size:.84rem;line-height:1.35}
      .v28-s4-parity strong{color:var(--text)}

      @media(max-width:1050px){.v28-session-switcher-grid{grid-template-columns:repeat(7,minmax(145px,1fr))}.v28-s4-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:620px){.v28-session-switcher{padding:.75rem}.v28-session-switcher-head{display:block}.v28-session-switcher-grid{grid-template-columns:repeat(7,minmax(132px,1fr))}.v28-s4-steps{grid-template-columns:1fr}.v28-detail-number{width:48px;height:48px;font-size:1.1rem}}
      html.simple-layout .v28-session-tab,html.simple-layout .v28-detail-identity,html.simple-layout .v28-s4-quickstart{box-shadow:none!important}
    `;
    document.head.appendChild(style);
  }

  function launchSession(n) {
    if (n === 1) {
      const card = document.querySelector('#session1CardButton');
      if (card) card.click();
      return;
    }
    if (typeof window.openPublicHealthGroupSession === 'function') {
      window.openPublicHealthGroupSession(n);
    } else {
      document.querySelector(`#session${n}CardButton`)?.click();
    }
    setTimeout(refreshAll, 0);
  }

  function buildSwitcher() {
    if (document.querySelector('.v28-session-switcher')) return;
    const pageTitle = GROUP.querySelector('.page-title');
    if (!pageTitle) return;

    const nav = document.createElement('nav');
    nav.className = 'v28-session-switcher';
    nav.setAttribute('aria-label', 'Choose a group activity session');
    nav.innerHTML = `
      <div class="v28-session-switcher-head">
        <div><strong>Choose the session announced in class</strong><small>Each number opens a different group activity. Your progress is saved separately for each session.</small></div>
      </div>
      <div class="v28-session-switcher-grid">
        ${Object.entries(SESSION_INFO).map(([n, info]) => `
          <button type="button" class="v28-session-tab" data-session="${n}" aria-label="Open Session ${n}: ${info.title}">
            <span class="v28-num">${n}</span><strong>${info.icon} ${info.short}</strong><small>${info.title}</small>
          </button>`).join('')}
      </div>`;
    pageTitle.insertAdjacentElement('afterend', nav);
    nav.querySelectorAll('.v28-session-tab').forEach(btn => {
      btn.addEventListener('click', () => launchSession(Number(btn.dataset.session)));
    });
  }

  function improveLibraryHeading() {
    const heading = document.querySelector('#groupSessionLibrary .session-library-heading');
    if (!heading) return;
    const eyebrow = heading.querySelector('.eyebrow');
    const h3 = heading.querySelector('h3');
    const p = heading.querySelector('p');
    if (eyebrow) eyebrow.textContent = '7 separate activities';
    if (h3) h3.textContent = 'Pick your class session';
    if (p) p.textContent = 'Do not continue an earlier game: choose the session number your teacher gives you.';
  }

  function markCards() {
    for (let n = 1; n <= 7; n++) {
      const card = document.querySelector(`#session${n}CardButton`);
      if (!card) continue;
      card.dataset.sessionNumber = String(n);
      const cta = card.querySelector('.session-open-cta');
      if (cta && !/Completed|result/i.test(cta.textContent || '')) cta.textContent = `Open Session ${n} →`;
    }
  }

  function addIdentity(n) {
    const detail = document.querySelector(`#session${n}Detail`);
    if (!detail || detail.querySelector('.v28-detail-identity')) return;
    const toolbar = detail.querySelector('.session-detail-toolbar');
    const info = SESSION_INFO[n];
    if (!info) return;
    const identity = document.createElement('div');
    identity.className = 'v28-detail-identity';
    identity.dataset.session = String(n);
    identity.innerHTML = `<span class="v28-detail-number">S${n}</span><div><strong>SESSION ${n} · ${info.short}</strong><small>${info.title} — this activity is independent from the other sessions.</small></div>`;
    if (toolbar) toolbar.insertAdjacentElement('afterend', identity);
    else detail.prepend(identity);
  }

  function friendlierParityLabel() {
    GROUP.querySelectorAll('.extra-session-meta span').forEach(span => {
      const txt = (span.textContent || '').trim().toLowerCase();
      if (txt.includes('deterministic choices')) span.textContent = '🔒 Same choices → same result';
    });
  }

  function session4QuickStart() {
    const detail = document.querySelector('#session4Detail');
    const ws = document.querySelector('#s4Workspace');
    if (!detail || !ws) return;

    // The quick-start belongs on the overview only. V28 re-added the large box
    // on every decision/consequence screen because the workspace is re-rendered.
    // That made the mission feel longer and less clear.
    const isOverview = Boolean(ws.querySelector('.extra-session-overview-grid') || ws.querySelector('#s4TeamSize'));
    if (!isOverview) {
      ws.querySelector('.v28-s4-quickstart')?.remove();
      return;
    }

    let box = ws.querySelector('.v28-s4-quickstart');
    if (!box) {
      box = document.createElement('section');
      box.className = 'v28-s4-quickstart';
      box.setAttribute('aria-label', 'Session 4 quick instructions');
      const article = ws.querySelector(':scope > article');
      if (article) article.prepend(box);
      else ws.prepend(box);
    }
    box.dataset.s4Ruleset = 'S4-R2';
    box.innerHTML = `
      <span class="eyebrow">Session 4 · How to play</span>
      <h4>4 decisions. One team answer each time.</h4>
      <div class="v28-s4-steps">
        <div class="v28-s4-step"><span>1</span><strong>Choose 3 or 4 students and assign the roles.</strong></div>
        <div class="v28-s4-step"><span>2</span><strong>Discuss the 4 options. Select ONE team answer and confirm.</strong></div>
        <div class="v28-s4-step"><span>3</span><strong>Read the consequence, say the Pitch Checkpoint, then continue.</strong></div>
      </div>
      <p class="v28-s4-parity"><strong>Same 4-choice sequence on any device → same screens, scores and final result.</strong> Final task: one <strong>2:00 team briefing</strong>.</p>`;

    // Remove repeated wording in the overview without changing game logic.
    const mission = ws.querySelector('.extra-session-overview-grid .extra-session-panel');
    if (mission) {
      const h4 = mission.querySelector('h4');
      const para = mission.querySelector('p');
      if (h4) h4.textContent = '4 decisions → one crisis briefing';
      if (para) para.textContent = 'Discuss → choose ONE answer → confirm. Then read the consequence and say the checkpoint.';
    }
    ws.querySelectorAll('p').forEach(p => {
      const text = (p.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.startsWith('Time rule: 2:00 is the total for the whole group')) {
        p.innerHTML = '<strong>Final briefing:</strong> 2:00 total for the whole group. Build it one checkpoint at a time.';
      } else if (text.startsWith('Same choices = same scores and same decision code')) {
        p.innerHTML = '<strong>Same 4-choice sequence on different devices → same screens, scores and final result.</strong>';
      }
    });
  }

  function activeSessionNumber() {
    for (let n = 1; n <= 7; n++) {
      const detail = document.querySelector(`#session${n}Detail`);
      if (detail && !detail.hidden && getComputedStyle(detail).display !== 'none') return n;
    }
    return null;
  }

  function updateSwitcherState() {
    const active = activeSessionNumber();
    document.querySelectorAll('.v28-session-tab').forEach(btn => {
      const on = Number(btn.dataset.session) === active;
      if (on) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
  }

  function refreshAll() {
    buildSwitcher();
    improveLibraryHeading();
    markCards();
    for (let n = 1; n <= 7; n++) addIdentity(n);
    friendlierParityLabel();
    session4QuickStart();
    updateSwitcherState();
  }

  let queued = false;
  function scheduleRefresh() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      refreshAll();
    });
  }

  refreshAll();
  document.addEventListener('click', scheduleRefresh, true);
  window.addEventListener('hashchange', scheduleRefresh);
  window.addEventListener('pageshow', scheduleRefresh);
  if ('MutationObserver' in window) {
    new MutationObserver(scheduleRefresh).observe(GROUP, {subtree:true, childList:true, attributes:true, attributeFilter:['hidden','class']});
  }

  document.documentElement.dataset.groupActivityUi = VERSION;
})();


/* --------------------------------------------------------------------------
   V29 · Session 4 deterministic classroom lock
   The service worker gives Session 4 its own S4-R2 storage key. This prevents
   old progress from a previous classroom build from changing the first screen
   seen on one device. Options, order, consequences and scores stay unchanged.
   -------------------------------------------------------------------------- */
(() => {
  'use strict';

  const RULESET = 'S4-R2';
  const GROUP = document.querySelector('#groupactivity');
  if (!GROUP) return;

  // The engine now uses pheng_group_session_4_v2. Remove only the obsolete
  // Session 4 record; no other session or learner data is touched.
  try {
    localStorage.removeItem('pheng_group_session_4_v1');
    localStorage.setItem('pheng_group_session_4_ruleset', RULESET);
  } catch (_) {}

  function ensureRulesetBadge() {
    const toolbar = document.querySelector('#session4Detail .session-detail-toolbar');
    if (!toolbar || toolbar.querySelector('.s4-ruleset-badge')) return;
    const badge = document.createElement('span');
    badge.className = 'badge s4-ruleset-badge';
    badge.textContent = `${RULESET} · fixed choices`;
    badge.title = 'Same four choices in the same order give the same screens and scores on every device.';
    toolbar.appendChild(badge);
  }

  function tuneSession4Screen() {
    const detail = document.querySelector('#session4Detail');
    const ws = document.querySelector('#s4Workspace');
    if (!detail || !ws) return;

    ensureRulesetBadge();

    const confirm = ws.querySelector('#s4Confirm');
    if (confirm) confirm.textContent = 'Confirm team choice';

    ws.querySelectorAll('#s4Overview, #s4OutcomeOverview, #s4FinalOverview').forEach(btn => {
      btn.textContent = 'Instructions / overview';
    });

    const hint = ws.querySelector('#s4ChoiceHint');
    if (hint && !/Selected option/i.test(hint.textContent || '')) {
      hint.textContent = 'Discuss the 4 options. Select ONE team answer, then confirm.';
    }

    const progress = ws.querySelector('.extra-progress');
    if (progress && !progress.querySelector('.s4-parity-note')) {
      const note = document.createElement('small');
      note.className = 's4-parity-note';
      note.textContent = `${RULESET} · fixed option order · no random scoring`;
      progress.appendChild(note);
    }

    const cont = ws.querySelector('#s4Continue');
    if (cont) {
      const count = ws.querySelector('.extra-progress-count')?.textContent?.trim() || '';
      cont.textContent = count === '4/4' ? 'Checkpoint done → final briefing' : 'Checkpoint done → next decision';
    }
  }

  function addSession4Style() {
    if (document.getElementById('s4-v29-style')) return;
    const style = document.createElement('style');
    style.id = 's4-v29-style';
    style.textContent = `
      #session4Detail .s4-ruleset-badge{font-weight:850}
      #session4Detail .s4-parity-note{display:block;grid-column:1/-1;color:var(--muted);font-size:.72rem;line-height:1.25;margin-top:.2rem}
      #session4Detail #s4ChoiceHint{font-weight:650}
    `;
    document.head.appendChild(style);
  }

  let queued = false;
  function refresh() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      addSession4Style();
      tuneSession4Screen();
    });
  }

  refresh();
  document.addEventListener('click', refresh, true);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('hashchange', refresh);
  if ('MutationObserver' in window) {
    new MutationObserver(refresh).observe(GROUP, {subtree:true, childList:true, attributes:true, attributeFilter:['hidden','class']});
  }
  document.documentElement.dataset.session4Ruleset = RULESET;
})();
