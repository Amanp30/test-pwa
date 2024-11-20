const CACHE_NAME = `pwa-cache-vWed Nov 20 2024 18:41:32 GMT+0530 (India Standard Time)`;
      const ASSETS_TO_CACHE = [
  "/index.html",
  "/assets/css/main.css",
  "/about.html",
  "/assets/js/main.js"
];

      self.addEventListener('install', (event) => {
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching Assets');
            return cache.addAll(ASSETS_TO_CACHE);
          })
        );
      });

      self.addEventListener('activate', (event) => {
        const cacheWhitelist = [CACHE_NAME];
        event.waitUntil(
          caches.keys().then((cacheNames) => {
            return Promise.all(
              cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                  console.log('Service Worker: Deleting old cache', cacheName);
                  return caches.delete(cacheName);
                }
              })
            );
          })
        );
      });

      self.addEventListener('fetch', (event) => {
        event.respondWith(
          caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('Service Worker: Returning cached response for', event.request.url);
              return cachedResponse;
            }
            return fetch(event.request).then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('Service Worker: Caching new resource', event.request.url);
              });
              return response;
            });
          })
        );
      });