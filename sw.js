self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('velocity-motors-cache').then(cache => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/scripts.js',
        '/data/news.html'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
