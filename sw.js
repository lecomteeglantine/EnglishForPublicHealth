/* EnglishForPublicHealth · V25 deep group-activity audit
   Goals:
   - keep every classroom device on the same deployed ruleset;
   - never delete Cache Storage belonging to other GitHub Pages projects;
   - inject the small V25 state-consistency patch without rewriting the large app files;
   - preserve offline use after the current version has been cached. */

const CACHE = 'ph-english-v25-20260915-groupactivity-deep-audit';
const PATCH_SCRIPT = './groupactivity-v25-fixes.js?v=20260915-25';

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
  return input instanceof Request
    ? new Request(input, { cache: 'reload' })
    : new Request(input, { cache: 'reload' });
}

async function fetchFresh(input) {
  return fetch(freshRequest(input));
}

function patchHtmlText(text) {
  if (text.includes('groupactivity-v25-fixes.js')) return text;
  const tag = `<script src="${PATCH_SCRIPT}"></script>`;
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

    // Core files must all belong to one coherent deployment.
    for (const asset of CORE_ASSETS) {
      const response = await fetchFresh(asset);
      if (!response.ok) throw new Error(`Could not cache core asset ${asset}: ${response.status}`);
      await cache.put(asset, response.clone());
    }

    // Portraits improve Session 2 but must not prevent a service-worker update.
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

    // IMPORTANT: Cache Storage is origin-wide. On GitHub Pages, other course
    // projects share lecomteeglantine.github.io. Delete only this app's caches.
    await Promise.all(
      keys
        .filter(key => key.startsWith('ph-english-') && key !== CACHE)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();

    // Pages already open may have loaded an older app.js/group-sessions.js.
    // Reload each controlled page once when V25 activates.
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(windows.map(async client => {
      try {
        const url = new URL(client.url);
        if (url.origin === self.location.origin) await client.navigate(client.url);
      } catch (_) {}
    }));
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);

    try {
      let response = await fetchFresh(request);
      if (request.mode === 'navigate') response = await patchedHtmlResponse(response);
      await putSafe(cache, request, response);
      return response;
    } catch (_) {
      let cached = await caches.match(request, { ignoreSearch: false });

      if (!cached && request.mode === 'navigate') {
        cached = (await caches.match('./index.html')) || (await caches.match('./'));
      }

      if (cached && request.mode === 'navigate') return patchedHtmlResponse(cached);
      if (cached) return cached;
      return Response.error();
    }
  })());
});
