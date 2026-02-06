const CACHE_NAME = 'romantic-v11'; // Versiyon artırıldı (v11)
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './css/games.css',
    './css/extra.css',
    './js/main.js',
    './js/music-db.js',
    './manifest.json',
    './js/quiz-game.js?v=4',
    './js/trivia-game.js?v=4',
    './js/study-room.js?v=4',
    './js/telegram-notifications.js',
    './js/supabase-client.js',
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
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
