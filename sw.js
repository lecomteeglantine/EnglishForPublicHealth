/* EnglishForPublicHealth · V24 group-activity deployment coherence
   Goal: every classroom device should run the same current ruleset after a deployment.
   The group-activity engines themselves remain deterministic; this service worker
   removes stale-cache version drift between devices. */

const CACHE = 'ph-english-v24-20260915-groupactivity-parity-lock';
const ASSETS = [
  './',
  './index.html',
  './styles.css?v=20260909-23',
  './group-sessions.css?v=20260909-23',
  './app.js?v=20260909-23',
  './group-sessions.js?v=20260909-23',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './s2-maya.webp',
  './s2-luca.webp',
  './s2-aisha.webp',
  './s2-noah.webp'
];

async function fetchFresh(input) {
  const request = input instanceof Request
    ? new Request(input, { cache: 'reload' })
    : new Request(input, { cache: 'reload' });
  return fetch(request);
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const asset of ASSETS) {
      const response = await fetchFresh(asset);
      if (!response.ok) throw new Error(`Could not cache ${asset}: ${response.status}`);
      await cache.put(asset, response.clone());
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key.startsWith('ph-english-') && key !== CACHE)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();

    // A page that was already open may have loaded the previous app.js before
    // this worker activated. Reload each open same-origin page once on V24
    // activation so every device immediately runs the same deployed ruleset.
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(windows.map(async client => {
      try {
        const url = new URL(client.url);
        if (url.origin === self.location.origin) await client.navigate(client.url);
      } catch (_) {
        // Navigation failure must never block activation.
      }
    }));
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      // Revalidate same-origin files instead of trusting a browser HTTP-cache copy.
      const response = await fetchFresh(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      const cached = await caches.match(request, { ignoreSearch: false });
      if (cached) return cached;

      if (request.mode === 'navigate') {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
      return Response.error();
    }
  })());
});
