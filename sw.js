/* EnglishForPublicHealth · V26 group-activity functional audit
   Network-first, app-scoped cache, deterministic patch injection. */

const CACHE_PREFIX = 'ph-english-';
const CACHE = 'ph-english-v26-20260915-groupactivity-functional-audit';
const PATCH_SCRIPT = './groupactivity-v26-fixes.js?v=20260915-26';
const SCOPE_URL = new URL(self.registration.scope);
const SCOPE_PATH = SCOPE_URL.pathname.endsWith('/') ? SCOPE_URL.pathname : `${SCOPE_URL.pathname}/`;

const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css?v=20260909-23',
  './group-sessions.css?v=20260909-23',
  './app.js?v=20260909-23',
  './group-sessions.js?v=20260909-23',
  PATCH_SCRIPT,
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

const OPTIONAL_ASSETS = [
  './s2-maya.webp',
  './s2-luca.webp',
  './s2-aisha.webp',
  './s2-noah.webp'
];

function freshRequest(input) {
  return new Request(input, { cache: 'reload' });
}

async function fetchFresh(input) {
  return fetch(freshRequest(input));
}

function isInThisApp(url) {
  return url.origin === self.location.origin && url.pathname.startsWith(SCOPE_PATH);
}

function patchHtmlText(text) {
  // Do not stack multiple audit patches in one document.
  text = text.replace(/\s*<script[^>]+src=["'][^"']*groupactivity-v2[45]-fixes\.js[^"']*["'][^>]*><\/script>\s*/gi, '\n');
  if (text.includes('groupactivity-v26-fixes.js')) return text;

  const tag = `<script src="${PATCH_SCRIPT}"></script>`;
  const version = '<meta name="application-version" content="2026-09-15-v26-groupactivity-functional-audit">';
  if (/<meta\s+name=["']application-version["'][^>]*>/i.test(text)) {
    text = text.replace(/<meta\s+name=["']application-version["'][^>]*>/i, version);
  }

  if (/<\/body>/i.test(text)) return text.replace(/<\/body>/i, `${tag}\n</body>`);
  return `${text}\n${tag}`;
}

async function patchedHtmlResponse(response) {
  if (!response || !response.ok) return response;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const body = patchHtmlText(await response.text());
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');

  return new Response(body, {
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

    // A service-worker update is accepted only if all functional core files can
    // be fetched from the same deployment. Optional portraits cannot block it.
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

    // Cache Storage is origin-wide on GitHub Pages. Delete only this app's caches.
    await Promise.all(
      keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();

    // Reload only pages inside /EnglishForPublicHealth/. Do not touch another
    // course/site that happens to be open on lecomteeglantine.github.io.
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(windows.map(async client => {
      try {
        const url = new URL(client.url);
        if (isInThisApp(url)) await client.navigate(client.url);
      } catch (_) {}
    }));
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!isInThisApp(url)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);

    try {
      let response = await fetchFresh(request);
      if (request.mode === 'navigate') response = await patchedHtmlResponse(response);
      await putSafe(cache, request, response);
      return response;
    } catch (_) {
      // Read only this deployment's cache. Searching every origin-wide cache can
      // resurrect a stale file from an older deployment.
      let cached = await cache.match(request, { ignoreSearch: false });

      if (!cached && request.mode === 'navigate') {
        cached = (await cache.match('./index.html')) || (await cache.match('./'));
      }

      if (cached && request.mode === 'navigate') return patchedHtmlResponse(cached);
      if (cached) return cached;
      return Response.error();
    }
  })());
});
