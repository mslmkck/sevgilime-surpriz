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
    btnGameRoom.addEventListener('click', async () => {
        window.openRoom(gameRoom);

        // Son Oynanan Oyunları Yükle (Supabase)
        const recentScores = document.getElementById('recent-scores');
        if (recentScores && window.supabaseHelpers) {
            recentScores.innerHTML = '<p>Yükleniyor...</p>';
            const scores = await window.supabaseHelpers.getGameScores();

            if (scores && scores.length > 0) {
                let html = '<h3>🏆 Son Oyunlar</h3><ul style="list-style:none; padding:0;">';
                scores.forEach(s => {
                    const date = new Date(s.created_at).toLocaleDateString('tr-TR');
                    let icon = '🎮';
                    if (s.game_type === 'wheel') icon = '🎡';
                    if (s.game_type === 'words') icon = '🚫';
                    if (s.game_type === 'quiz') icon = '❤️';

                    html += `<li style="margin: 5px 0; background:rgba(255,255,255,0.1); padding:8px; border-radius:10px;">
                        ${icon} ${s.game_type.toUpperCase()} - Skor: ${s.score} <small>(${date})</small>
                    </li>`;
                });
                html += '</ul>';
                recentScores.innerHTML = html;
                recentScores.classList.remove('hidden');
            } else {
                recentScores.innerHTML = '<p>Henüz oyun oynanmadı.</p>';
            }
        }

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

            if (recentScores) {
                gsap.from(recentScores, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.3
                });
            }
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

const btnQuizGame = document.getElementById('btn-quiz-game');
const quizGameContainer = document.getElementById('quiz-game-container');

if (btnQuizGame) {
    btnQuizGame.addEventListener('click', () => {
        gsap.to(gamesMenu, {
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            onComplete: () => {
                gamesMenu.classList.add('hidden');
                quizGameContainer.classList.remove('hidden');

                gsap.from(quizGameContainer, {
                    opacity: 0,
                    y: 50,
                    duration: 0.5,
                    ease: 'power2.out'
                });

                if (typeof initQuizGame === 'function') initQuizGame();
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

const quizBackBtn = document.getElementById('quiz-back-btn');

if (quizBackBtn) {
    quizBackBtn.addEventListener('click', () => {
        gsap.to(quizGameContainer, {
            opacity: 0,
            y: 30,
            duration: 0.3,
            onComplete: () => {
                quizGameContainer.classList.add('hidden');
                gamesMenu.classList.remove('hidden');
                gamesMenu.style.opacity = 1;
                gamesMenu.style.transform = 'scale(1)';
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
    { text: '☕ Kahve', color: '#FF6B6B', msg: 'Hadi bir kahve yapalım! ☕' },
    { text: '🎬 Sinema', color: '#4ECDC4', msg: 'Film seçimi sende! 🍿' },
    { text: '💋 Öpücük', color: '#FF69B4', msg: 'Muck! 😘' },
    { text: '🤫 Sır', color: '#95E1D3', msg: 'Bana bir sırrını ver... 🗝️' },
    { text: '🎶 Şarkı', color: '#F38181', msg: 'Bana bir şarkı söyle! 🎤' },
    { text: '🚔 Kelepçe', color: '#FFA07A', msg: 'Bugün benimsin! 😈' }
];

let currentAngle = 0;
let isSpinning = false;

function initWheel() {
    if (!ctx || !canvas) return;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawWheel();
}

function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.9, 450);
    // Canvas PPI fix (bulanıklığı önlemek için 2 kat)
    const dpr = window.devicePixelRatio || 1;
    // CSS boyutu
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    // Gerçek boyut
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    // Scale
    ctx.scale(dpr, dpr);

    drawWheel();
}

function drawWheel() {
    if (!ctx || !canvas) return;

    // CSS boyutu üzerinden hesapla
    const width = parseFloat(canvas.style.width);
    const height = parseFloat(canvas.style.height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = (width / 2) - 15;
    const anglePerSegment = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, width, height);

    // Gölge
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    segments.forEach((segment, index) => {
        const startAngle = currentAngle + (index * anglePerSegment);
        const endAngle = startAngle + anglePerSegment;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = segment.color;
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Metin
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${width / 20}px Arial`;
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.fillText(segment.text, radius - 20, 5);
        ctx.restore();
    });

    // Merkez Nokta
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // OK İŞARETİ (ÜSTTE SABİT)
    // Canvasın en tepesinde, aşağı bakan bir üçgen
    ctx.save();
    ctx.translate(centerX, 0); // Üst orta
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(15, 0);
    ctx.lineTo(0, 30); // Ok ucu aşağı
    ctx.fillStyle = '#FFD700'; // Altın sarısı
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.restore();
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    if (spinBtn) spinBtn.disabled = true;
    if (wheelResultDiv) wheelResultDiv.classList.add('hidden');

    // Rastgele dönüş (en az 5 tur)
    const extraRounds = 5;
    const randomDegree = Math.random() * 360; // 0-360 arası rastgele bitiş
    const totalRotation = (360 * extraRounds) + randomDegree;

    // GSAP aslında 'angle' objesini değil, değişkeni animasyonlayabilir ama obje daha temiz.
    // currentAngle radians cinsinden. totalRotation degree cinsinden.
    // Dönüşüm yaparak ilerleyelim.

    // Başlangıç açısı (degree olarak düşünelim)
    let currentDeg = (currentAngle * 180 / Math.PI) % 360;

    const targetDeg = currentDeg + totalRotation;

    let animObj = { val: currentDeg };

    gsap.to(animObj, {
        val: targetDeg,
        duration: 4,
        ease: 'power4.out',
        onUpdate: function () {
            // Radyana çevir ve çiz
            currentAngle = (animObj.val * Math.PI / 180);
            drawWheel();
        },
        onComplete: () => {
            isSpinning = false;
            if (spinBtn) spinBtn.disabled = false;

            // KAZANANI HESAPLA
            // Ok (pointer) ÜSTTE (270 derece veya 1.5 PI). 
            // Canvas koordinatlarında 0 derece sağ, 90 aşağı, 180 sol, 270 üst.
            // Tekerin dönüşü (currentAngle) segmentleri kaydırıyor.

            // Etkin açı = (Ok Açısı - Çark Açısı) normalize edilmiş
            const pointerAngle = 1.5 * Math.PI; // 270 derece
            let relativeAngle = (pointerAngle - currentAngle) % (2 * Math.PI);
            if (relativeAngle < 0) relativeAngle += (2 * Math.PI);

            const anglePerSegment = (2 * Math.PI) / segments.length;
            const winningIndex = Math.floor(relativeAngle / anglePerSegment);

            const winner = segments[winningIndex];

            showResult(winner);
        }
    });
}

function showResult(winner) {
    if (wheelResultDiv) {
        wheelResultDiv.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 20px;">🎉</div>
            <div style="font-size: 1.8rem; font-weight: bold; color: ${winner.color}; margin-bottom: 15px;">
                ${winner.text}
            </div>
            <div style="margin-top: 15px; font-size: 1.2rem; opacity: 0.9;">
                ${winner.msg}
            </div>
        `;
        wheelResultDiv.classList.remove('hidden');

        gsap.from(wheelResultDiv, {
            scale: 0.5,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(2)'
        });

        // Konfeti
        if (window.confetti) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: [winner.color, '#ffffff']
            });
        }

        // Supabase & Telegram
        if (window.supabaseHelpers) {
            window.supabaseHelpers.saveGameScore('wheel', 10, { result: winner.text });
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

        // Supabase Kayıt
        if (window.supabaseHelpers) {
            window.supabaseHelpers.saveGameScore('words', 100, { result: 'cleared_all' });
        }
    }
}
