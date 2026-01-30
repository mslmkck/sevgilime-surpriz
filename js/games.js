// ============================================
// OYUN ODASI MANTIĞI - ULTRA MODERN
// ============================================

// Oyun Odası Elementleri
const btnGameRoom = document.getElementById('btn-game');
const gameRoom = document.getElementById('game-room');
const gamesMenu = document.querySelector('.games-menu');

// Oyun Seçim Butonları
const btnWheelGame = document.getElementById('btn-wheel-game');
const btnWordsGame = document.getElementById('btn-words-game');

// Oyun Containerları
const wheelGameContainer = document.getElementById('wheel-game-container');
const wordsGameContainer = document.getElementById('words-game-container');

// Geri Butonları
const wheelBackBtn = document.getElementById('wheel-back-btn');
const wordsBackBtn = document.getElementById('words-back-btn');

// Oyun Odası Açma
if (btnGameRoom) {
    btnGameRoom.addEventListener('click', () => {
        window.openRoom(gameRoom);

        // GSAP animasyon ile menüyü göster
        if (gamesMenu) {
            gamesMenu.classList.remove('hidden');
            gsap.from('.games-title', {
                y: -50,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
            gsap.from('.game-select-btn', {
                scale: 0,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            });
        }
    });
}

// Oyun Seçimleri
if (btnWheelGame) {
    btnWheelGame.addEventListener('click', () => {
        gsap.to(gamesMenu, {
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            onComplete: () => {
                gamesMenu.classList.add('hidden');
                wheelGameContainer.classList.remove('hidden');

                gsap.from(wheelGameContainer, {
                    opacity: 0,
                    y: 50,
                    duration: 0.5,
                    ease: 'power2.out'
                });

                initWheel();
            }
        });
    });
}

if (btnWordsGame) {
    btnWordsGame.addEventListener('click', () => {
        gsap.to(gamesMenu, {
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            onComplete: () => {
                gamesMenu.classList.add('hidden');
                wordsGameContainer.classList.remove('hidden');

                gsap.from(wordsGameContainer, {
                    opacity: 0,
                    y: 50,
                    duration: 0.5,
                    ease: 'power2.out'
                });

                initWordsGame();
            }
        });
    });
}

// Oyunlardan Menüye Dönme
if (wheelBackBtn) {
    wheelBackBtn.addEventListener('click', () => {
        gsap.to(wheelGameContainer, {
            opacity: 0,
            y: 30,
            duration: 0.3,
            onComplete: () => {
                wheelGameContainer.classList.add('hidden');
                gamesMenu.classList.remove('hidden');
                gamesMenu.style.opacity = 1;
                gamesMenu.style.transform = 'scale(1)';

                const wheelResult = document.getElementById('wheel-result');
                if (wheelResult) wheelResult.classList.add('hidden');
            }
        });
    });
}

if (wordsBackBtn) {
    wordsBackBtn.addEventListener('click', () => {
        gsap.to(wordsGameContainer, {
            opacity: 0,
            y: 30,
            duration: 0.3,
            onComplete: () => {
                wordsGameContainer.classList.add('hidden');
                gamesMenu.classList.remove('hidden');
                gamesMenu.style.opacity = 1;
                gamesMenu.style.transform = 'scale(1)';

                const playground = document.getElementById('words-playground');
                if (playground) playground.innerHTML = '';
                const wordsResult = document.getElementById('words-result');
                if (wordsResult) wordsResult.classList.add('hidden');
            }
        });
    });
}

// ============================================
// KADER ÇARKI OYUNU - İYİLEŞTİRİLMİŞ
// ============================================

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const spinBtn = document.getElementById('spin-btn');
const wheelResultDiv = document.getElementById('wheel-result');

const segments = [
    { text: '☕ Kahve', color: '#FF6B6B' },
    { text: '🎬 Sinema', color: '#4ECDC4' },
    { text: '💋 Öpücük', color: '#FF69B4' },
    { text: '🤫 Sır', color: '#95E1D3' },
    { text: '🎶 Şarkı', color: '#F38181' },
    { text: '🚔 Kelepçe', color: '#FFA07A' }
];

let currentAngle = 0;
let isSpinning = false;

function initWheel() {
    if (!ctx || !canvas) return;

    // Canvas boyutunu responsive yap
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    drawWheel();
}

function resizeCanvas() {
    // Ekran boyutuna göre canvas boyutunu ayarla
    const size = Math.min(window.innerWidth * 0.9, 450);
    canvas.width = size;
    canvas.height = size;
    drawWheel();
}

function drawWheel() {
    if (!ctx || !canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    const anglePerSegment = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gölge ekle
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    segments.forEach((segment, index) => {
        const startAngle = currentAngle + (index * anglePerSegment);
        const endAngle = startAngle + anglePerSegment;

        // Gradient oluştur
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, segment.color);
        gradient.addColorStop(1, shadeColor(segment.color, -20));

        // Dilim çiz
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Parlak kenar
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Metin çiz
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${canvas.width / 25}px Arial`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText(segment.text, radius - 25, 7);
        ctx.restore();
    });

    // Merkez daire - gradient
    ctx.shadowBlur = 0;
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    centerGradient.addColorStop(0, '#FFD700');
    centerGradient.addColorStop(1, '#FFA500');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Ok işareti
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${canvas.width / 20}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('▼', centerX, centerY);
}

// Renk koyulaştırma fonksiyonu
function shadeColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    if (spinBtn) spinBtn.disabled = true;
    if (wheelResultDiv) wheelResultDiv.classList.add('hidden');

    // Confetti efekti
    if (window.confetti) {
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }, 3000);
    }

    const totalRotation = 360 * 6 + Math.random() * 360;
    const duration = 4000;

    gsap.to({ angle: 0 }, {
        angle: totalRotation,
        duration: duration / 1000,
        ease: 'power4.out',
        onUpdate: function () {
            currentAngle = (this.targets()[0].angle * Math.PI / 180);
            drawWheel();
        },
        onComplete: () => {
            isSpinning = false;
            if (spinBtn) spinBtn.disabled = false;
            setTimeout(showResult, 300);
        }
    });
}

function showResult() {
    const resultText = 'Kazanan: BİZİZ! 💕';

    if (wheelResultDiv) {
        wheelResultDiv.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 20px;">🎉</div>
            <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color); margin-bottom: 15px;">
                ${resultText}
            </div>
            <div style="margin-top: 15px; font-size: 1.2rem; opacity: 0.9;">
                Çünkü gerçek kazanan her zaman birlikte olmaktır.
            </div>
        `;
        wheelResultDiv.classList.remove('hidden');

        gsap.from(wheelResultDiv, {
            scale: 0.5,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(2)'
        });

        // Telegram bildirimi
        if (window.telegramNotifications) {
            window.telegramNotifications.notifyGamePlayed('wheel', resultText);
        }
    }
}

// Touch event desteği
if (spinBtn) {
    spinBtn.addEventListener('click', spinWheel);
    spinBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        spinWheel();
    }, { passive: false });
}

// ============================================
// YASAK KELİMELER OYUNU - İYİLEŞTİRİLMİŞ
// ============================================

const words = ['İmkansız', 'Olmaz', 'Gidemem', 'Acı', 'Engel'];
let wordsRemaining = words.length;

function initWordsGame() {
    const playground = document.getElementById('words-playground');
    const wordsResult = document.getElementById('words-result');

    if (!playground) return;

    playground.innerHTML = '';
    if (wordsResult) wordsResult.classList.add('hidden');
    wordsRemaining = words.length;

    // Kelime balonlarını animasyonla yerleştir
    words.forEach((word, index) => {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.className = 'word-bubble';
            bubble.innerText = word;
            bubble.dataset.word = word;

            // Rastgele pozisyon
            const x = Math.random() * 65 + 5;
            const y = Math.random() * 55 + 10;
            bubble.style.left = x + '%';
            bubble.style.top = y + '%';
            bubble.style.animationDelay = (Math.random() * 2) + 's';

            // Touch event desteği
            bubble.addEventListener('click', (e) => {
                e.stopPropagation();
                burstWord(bubble);
            });

            bubble.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                burstWord(bubble);
            }, { passive: false });

            playground.appendChild(bubble);

            // GSAP ile giriş animasyonu
            gsap.from(bubble, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                ease: 'back.out(2)'
            });
        }, index * 150);
    });
}

function burstWord(bubble) {
    const playground = document.getElementById('words-playground');
    if (!playground) return;

    const rect = bubble.getBoundingClientRect();
    const playRect = playground.getBoundingClientRect();

    // Patlama animasyonu
    gsap.to(bubble, {
        scale: 1.5,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(2)',
        onComplete: () => {
            bubble.remove();
            wordsRemaining--;

            // Kalpleri oluştur
            for (let i = 0; i < 8; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart-explosion';
                heart.innerText = '❤️';
                heart.style.left = (rect.left - playRect.left + rect.width / 2) + 'px';
                heart.style.top = (rect.top - playRect.top + rect.height / 2) + 'px';

                // Rastgele yönlere saçılmayı simüle et
                const angle = (Math.random() * 360) * Math.PI / 180;
                const distance = 50 + Math.random() * 100;

                gsap.set(heart, { rotation: Math.random() * 360 });

                playground.appendChild(heart);

                gsap.to(heart, {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance - 100,
                    opacity: 0,
                    scale: 2,
                    rotation: Math.random() * 720,
                    duration: 1.2,
                    ease: 'power2.out',
                    onComplete: () => heart.remove()
                });
            }

            // Tüm kelimeler bitti mi?
            if (wordsRemaining === 0) {
                setTimeout(showWordsResult, 800);
            }
        }
    });
}

function showWordsResult() {
    const wordsResult = document.getElementById('words-result');
    const resultText = 'Tüm engeller kaldırıldı! 🎊';

    if (wordsResult) {
        wordsResult.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 20px;">🎉</div>
            <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 15px;">
                Harika İş! 🎊
            </div>
            <div style="font-size: 1.2rem; line-height: 1.6;">
                Bak, engelleri kaldırmak bir parmak hareketine bakıyor.<br>
                Zor değilmiş, değil mi? 💕
            </div>
        `;
        wordsResult.classList.remove('hidden');

        gsap.from(wordsResult, {
            scale: 0.5,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(2)'
        });

        // Confetti
        if (window.confetti) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        }

        // Telegram bildirimi
        if (window.telegramNotifications) {
            window.telegramNotifications.notifyGamePlayed('words', resultText);
        }
    }
}
