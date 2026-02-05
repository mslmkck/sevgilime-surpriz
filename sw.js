const CACHE_NAME = 'my-site-cache-v3';
const urlsToCache = [
    './',
    './index.html',
    './css/style.css?v=3',
    './css/games.css?v=3',
    './css/extra.css?v=3',
    './js/main.js?v=3',
    './js/games.js?v=3',
    './js/quiz-game.js?v=3',
    './js/trivia-game.js?v=3',
    './js/study-room.js?v=3',
    './js/telegram-notifications.js',
    './js/supabase-client.js',
    './assets/img/icon.png'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting(); // Force activation
});

self.addEventListener('activate', function (event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Force control
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
