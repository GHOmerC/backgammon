// Service Worker — caches all game files for offline play
const CACHE = 'backgammon-v3';
const ASSETS = [
  'backgammon.html',
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

// Install: cache everything
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

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
