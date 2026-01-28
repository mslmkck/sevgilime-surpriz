// 1. AOS Init (Scroll Animations)
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Start Timer
    setInterval(updateTimer, 1000);
});

// 2. Şifreli Giriş
const correctPassword = "prenses"; // Şifreyi buradan değiştirebilirsin
function checkPassword() {
    const input = document.getElementById('password').value.trim().toLowerCase();
    const errorMsg = document.getElementById('error-msg');
    const loginOverlay = document.getElementById('login-overlay');
    const mainContent = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-btn');

    if (input === correctPassword) {
        // Efektle kapat
        loginOverlay.style.opacity = '0';
        loginOverlay.style.transition = 'opacity 1s ease';

        // Müzik başlat (Kullanıcı etkileşimi olduğu için çalışır)
        audio.play().then(() => {
            isPlaying = true;
            musicBtn.innerHTML = '⏸️ Müziği Durdur';
        }).catch(err => console.log("Otomatik oynatma hatası:", err));

        setTimeout(() => {
            loginOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            musicBtn.style.display = 'block'; // Müzik butonunu göster
            AOS.refresh();
        }, 1000);
    } else {
        errorMsg.classList.remove('hidden');
        // Titreme efekti
        const container = document.querySelector('.login-container');
        container.style.transform = 'translate(10px)';
        setTimeout(() => {
            container.style.transform = 'translate(-10px)';
        }, 100);
        setTimeout(() => {
            container.style.transform = 'translate(0)';
        }, 200);
    }
}

// Enter tuşu ile giriş
document.getElementById('password').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// 3. Müzik Kontrol
let isPlaying = false;
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        musicBtn.innerHTML = '🎵 Müziği Başlat';
    } else {
        audio.play().catch(error => {
            console.log("Otomatik oynatma engellendi, kullanıcı etkileşimi bekleniyor.");
        });
        musicBtn.innerHTML = '⏸️ Müziği Durdur';
    }
    isPlaying = !isPlaying;
}

// 4. Zaman Sayacı
// Tarihi buradan değiştirin: YIL, AY (0-11 arası), GÜN
const startDate = new Date(1900, 0, 1); // 1 Ocak 1900

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('minutes').innerText = minutes;
    document.getElementById('seconds').innerText = seconds;
}

// 5. Kart Çevirme Efekti
const cards = document.querySelectorAll('.flip-card');
cards.forEach(card => {
    card.addEventListener('click', function () {
        this.classList.toggle('flipped');
    });
});

// 6. Mini Oyun Logic
let heartsCollected = 0;
const totalHearts = 5;

function collectHeart(element) {
    if (!element.classList.contains('collected')) {
        element.classList.add('collected');
        heartsCollected++;
        document.getElementById('score').innerText = heartsCollected;

        // Küçük konfeti patlatma (her kalp için)
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
        });

        if (heartsCollected === totalHearts) {
            setTimeout(() => {
                const gameMsg = document.getElementById('game-msg');
                gameMsg.classList.remove('hidden');
                // Büyük konfeti
                triggerBigConfetti();
            }, 500);
        }
    }
}

// 7. Final Konfeti
function triggerBigConfetti() {
    var end = Date.now() + (2 * 1000); // 2 saniye sürsün

    // Konfeti renkleri
    var colors = ['#d4a5a5', '#9da9e5', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Finale bölümü görünür olduğunda da konfeti patlat
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            triggerBigConfetti();
        }
    });
});

observer.observe(document.getElementById('finale'));
