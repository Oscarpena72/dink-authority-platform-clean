const CACHE_NAME = 'dink-authority-v5';
const OFFLINE_URL = '/offline.html';

// Install — pre-cache only the offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL]))
  );
  self.skipWaiting();
});

// Activate — clean ALL old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — ONLY handle offline fallback for page navigations
// Let all other requests pass through to the network untouched
self.addEventListener('fetch', (event) => {
  // Only intercept actual page navigations (not RSC, not API, not assets)
  if (event.request.mode !== 'navigate') return;

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(OFFLINE_URL))
  );
});
