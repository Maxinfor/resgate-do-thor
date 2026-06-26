self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('thor-store').then((cache) => cache.addAll([
    'index.html', 'style.css', 'script.js', 'capa.jpg', 'helo.jpg', 'liz.jpg', 'thor.jpg', 'latido thor.mp3'
  ])));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
