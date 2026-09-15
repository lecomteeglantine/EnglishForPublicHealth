/* EnglishForPublicHealth · V28 · distinct course sessions + Session 4 clarity
   This worker keeps one coherent classroom build on every device and injects
   the V28 UI/state patch without changing scenario choices or scoring. */

const CACHE = 'efph-v28-20260915-distinct-sessions';
const BUILD = '20260915-28';
const PATCH_SCRIPT = `./groupactivity-v28-session-separation.js?v=${BUILD}`;
const APP_SCOPE_PATH = new URL('./', self.location.href).pathname;

const CORE_ASSETS = [
  './',
  './index.html',
  `./styles.css?v=${BUILD}`,
  `./group-sessions.css?v=${BUILD}`,
  `./app.js?v=${BUILD}`,
  `./group-sessions.js?v=${BUILD}`,
  PATCH_SCRIPT
];

const OPTIONAL_ASSETS = [
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './s2-maya.webp',
  './s2-luca.webp',
  './s2-aisha.webp',
  './s2-noah.webp'
];

const LEGACY_EFPH_CACHES = new Set([
  'ph-english-v24-20260915-groupactivity-parity-lock',
  'ph-english-v25-20260915-groupactivity-deep-audit',
  'ph-english-v26-20260915-groupactivity-functional-audit',
  'ph-english-v27-20260915-session2-consistency'
]);

function isThisApp(url) {
  try {
    return url.origin === self.location.origin && url.pathname.startsWith(APP_SCOPE_PATH);
  } catch (_) {
    return false;
  }
}

async function fetchFresh(input) {
  return fetch(input, { cache: 'reload' });
}

function patchHtmlText(source) {
  let text = String(source || '');

  // Remove earlier runtime group-activity patches so only V28 runs.
  text = text.replace(
    /<script\b[^>]*\bsrc=["'][^"']*groupactivity-v(?:25|26|27|28)(?:-[^"']*)?\.js[^"']*["'][^>]*>\s*<\/script>\s*/gi,
    ''
  );

  // Cache-bust the main engine uniformly across classroom devices.
  text = text
    .replace(/styles\.css\?v=[^"'\s<>]+/gi, `styles.css?v=${BUILD}`)
    .replace(/group-sessions\.css\?v=[^"'\s<>]+/gi, `group-sessions.css?v=${BUILD}`)
    .replace(/app\.js\?v=[^"'\s<>]+/gi, `app.js?v=${BUILD}`)
    .replace(/group-sessions\.js\?v=[^"'\s<>]+/gi, `group-sessions.js?v=${BUILD}`);

  const tag = `<script src="${PATCH_SCRIPT}"></script>`;
  if (/<\/body>/i.test(text)) return text.replace(/<\/body>/i, `${tag}\n</body>`);
  return `${text}\n${tag}`;
}

async function patchedHtmlResponse(response) {
  if (!response || !response.ok) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  return new Response(patchHtmlText(await response.text()), {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function putSafe(cache, request, response) {
  if (!response || !response.ok) return;
  try { await cache.put(request, response.clone()); } catch (_) {}
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const asset of CORE_ASSETS) {
      const response = await fetchFresh(asset);
      if (!response.ok) throw new Error(`Could not cache core asset ${asset}: ${response.status}`);
      await cache.put(asset, response.clone());
    }
    await Promise.all(OPTIONAL_ASSETS.map(async asset => {
      try {
        const response = await fetchFresh(asset);
        if (response.ok) await cache.put(asset, response.clone());
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE && (LEGACY_EFPH_CACHES.has(key) || key.startsWith('efph-'))).map(key => caches.delete(key)));
    await self.clients.claim();

    // Reload only this GitHub Pages project so an already-open classroom device
    // immediately receives the same V28 build. Other projects are untouched.
    const windows = await self.clients.matchAll({ type:'window', includeUncontrolled:true });
    await Promise.all(windows.map(async client => {
      try {
        const url = new URL(client.url);
        if (isThisApp(url)) await client.navigate(client.url);
      } catch (_) {}
    }));
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (!isThisApp(url)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      let response = await fetchFresh(request);
      if (request.mode === 'navigate') response = await patchedHtmlResponse(response);
      await putSafe(cache, request, response);
      return response;
    } catch (_) {
      let cached = await cache.match(request, {ignoreSearch:false});
      if (!cached && request.mode === 'navigate') cached = (await cache.match('./index.html')) || (await cache.match('./'));
      if (cached && request.mode === 'navigate') return patchedHtmlResponse(cached);
      if (cached) return cached;
      return Response.error();
    }
  })());
});
