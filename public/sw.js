const CACHE_PREFIX = 'yunote-';
const CACHE_NAME = 'yunote-v2';
const APP_SHELL = '/';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith(CACHE_PREFIX) &&
                key !== CACHE_NAME
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle requests for this website.
  if (url.origin !== self.location.origin) return;

  // Never cache authentication or application API requests.
  if (
    url.pathname.startsWith('/auth/') ||
    url.pathname.startsWith('/rest/') ||
    url.pathname.startsWith('/storage/') ||
    url.pathname.startsWith('/functions/')
  ) {
    return;
  }

  // Page navigation: network first, cached home page as fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedPage = await caches.match(APP_SHELL);
        return cachedPage || Response.error();
      })
    );
    return;
  }

  // Cache only public app assets, not arbitrary responses.
  const isPublicAsset =
    url.pathname === '/manifest.json' ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/_expo/static/');

  if (!isPublicAsset) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);

      if (cached) return cached;

      try {
        const response = await fetch(request);

        if (
          response.ok &&
          response.type === 'basic'
        ) {
          await cache.put(request, response.clone());
        }

        return response;
      } catch {
        return Response.error();
      }
    })
  );
});