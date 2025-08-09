self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('pwa-dt-v2').then(cache => {
      return cache.addAll([
        '/', // HOME
        '/?utm_source=homescreen',
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEinWQx-YTgrISjMnxHBD2AB5BVgQK2I2r-HyShxdoA1Uq8TddQwcHX73oDOlOd8xiDzaez1xlDMhCF7MDRdsUx1pDzTEl-dQMJy0HjH-mfmEtqNywMPhAEkTBm_qB-_tCow7Ka5kv88lDvMb2i1dqPs71Phjagv4FpWFpftjXu3Lgmnk9Zogn89Mdrh/w192-h192-p-k-no-nu/ICON.png',
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEinWQx-YTgrISjMnxHBD2AB5BVgQK2I2r-HyShxdoA1Uq8TddQwcHX73oDOlOd8xiDzaez1xlDMhCF7MDRdsUx1pDzTEl-dQMJy0HjH-mfmEtqNywMPhAEkTBm_qB-_tCow7Ka5kv88lDvMb2i1dqPs71Phjagv4FpWFpftjXu3Lgmnk9Zogn89Mdrh/w512-h512-p-k-no-nu/ICON.png',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== 'pwa-dt-v2').map(key => caches.delete(key))
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
          return caches.open('pwa-dt-v2').then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});
