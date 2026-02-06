const CACHE_NAME = 'romantic-v13'; // Versiyon artırıldı (v13)
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './css/games.css',
    './css/extra.css',
    './js/main.js',
    './js/music-db.js',
    './manifest.json',
    './js/quiz-game.js?v=8',
    './js/trivia-game.js?v=8',
    './js/study-room.js?v=8',
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
                    // Eski cache'leri SİL
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Force control
});

// NETWORK FIRST STRATEGİSİ (Önce internete bak, yoksa cache'e bak)
// Bu strateji güncellemelerin anında görünmesini garanti eder.
self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request)
            .then(function (response) {
                // İnternetten başarılı cevap geldiyse, onu dönerken cache'i de güncelle
                // Ancak dinamik dosyalarda dikkatli olmak gerek.
                // Şimdilik sadece cevabı dönelim, cache'i elle güncellemeyelim 
                // (Asset'ler install'da güncelleniyor zaten)

                // NOT: Gerçek bir Network First için dönen cevabı cache'e de atabiliriz
                // ama basitlik ve güvenilirlik için sadece return response yeterli.
                // Eğer offline destek çok kritik değilse bu en temizidir.
                return response;
            })
            .catch(function () {
                // İnternet yoksa cache'den dön
                return caches.match(event.request);
            })
    );
});
