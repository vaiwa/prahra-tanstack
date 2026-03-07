const CACHE_NAME = 'prahra-cache-v3';
const TILE_CACHE_NAME = 'prahra-tiles-v1';
const OFFLINE_URL = '/offline.html';
const MAX_TILE_CACHE_ENTRIES = 2000;

const OSM_TILE_PATTERN = /^https:\/\/[abc]\.tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/favicon.ico',
        '/logo192.png',
        '/logo512.png',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== TILE_CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/**
 * Trim tile cache to MAX_TILE_CACHE_ENTRIES by removing oldest entries.
 */
async function trimTileCache() {
  const cache = await caches.open(TILE_CACHE_NAME);
  const keys = await cache.keys();
  if (keys.length > MAX_TILE_CACHE_ENTRIES) {
    const toDelete = keys.length - MAX_TILE_CACHE_ENTRIES;
    for (let i = 0; i < toDelete; i++) {
      await cache.delete(keys[i]);
    }
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = event.request.url;

  // OSM map tiles — cache-first, cache on first play
  if (OSM_TILE_PATTERN.test(url)) {
    event.respondWith(
      caches.open(TILE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            trimTileCache();
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  const parsedUrl = new URL(url);
  if (parsedUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  const destination = event.request.destination;
  const cacheable = ['style', 'script', 'image', 'font'].includes(destination);
  if (!cacheable) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
