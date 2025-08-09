self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('pwa-cache-v1').then(cache => {
      return cache.addAll([
        '/', // الصفحة الرئيسية
        '/?utm_source=homescreen',
        'https://cdn.jsdelivr.net/gh/BuddyOfficial/blogger-pwa@main/bucket/icons/android-icon-192x192.png',
        'https://cdn.jsdelivr.net/gh/BuddyOfficial/blogger-pwa@main/bucket/icons/android-icon-512x512.png',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== 'pwa-cache-v1').map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(fetchResponse => {
          return caches.open('pwa-cache-v1').then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});
