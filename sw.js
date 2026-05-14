const CACHE_NAME = 'ascend-v5';
const BASE = '/depo-test';

const PRECACHE = [
  BASE + '/',
  BASE + '/missions/',
  BASE + '/habits/',
  BASE + '/todo/',
  BASE + '/coach/',
  BASE + '/profile/',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then((list) => {
      if (list.length) return list[0].focus();
      return clients.openWindow(BASE + '/');
    })
  );
});
