const CACHE_NAME = 'ocs-pwa-v1';
const OFFLINE_URL = '/mobile/';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/mobile/',
  '/mobile/index.html',
  '/assets/mobile.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.map((n) => {
        if (n !== CACHE_NAME) return caches.delete(n);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      }).catch(() => caches.match(OFFLINE_URL));
    })
  );
});
