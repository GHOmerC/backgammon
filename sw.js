// Service Worker — caches assets for offline play
const CACHE = 'backgammon-v5';
const ASSETS = [
  'manifest.json',
  'icon.svg',
  'Dice rolling 1.m4a',
  'Dice rolling 2.m4a',
  'Dice rolling 3.m4a',
  'Dice rolling 4.m4a',
  'Dice rolling 5.m4a',
  'drag man 1.m4a',
  'drag man 2.m4a',
  'drag man 3.m4a',
  'drag man 5.m4a',
  'drag man 6.m4a',
  'drag man 7.m4a',
  'drag man 8.m4a'
];

// Install: cache assets (NOT the HTML — always fetch that fresh)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for HTML (always get latest), cache-first for assets
self.addEventListener('fetch', e => {
  if (e.request.url.endsWith('.html')) {
    // Always fetch HTML fresh — fall back to cache only if offline
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  // Assets: serve from cache, fall back to network
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
