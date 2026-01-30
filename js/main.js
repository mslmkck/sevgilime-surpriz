// 1. AOS Init (Scroll Animations) & Music
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    const loginScreen = document.getElementById('login-screen');
    const enterBtn = document.getElementById('enter-btn');
    const envelopeOverlay = document.getElementById('envelope-overlay');

    // MÜZİK AYARLARI (Native Audio)
    // Şarkımızı tanımlayalım
    const audio = new Audio('assets/music/song.mp3');
    audio.loop = true;
    audio.volume = 0.5;

    // Global erişim (Diğer fonksiyonlar için)
    window.siteAudio = audio;

    // Hata ayıklama
    audio.addEventListener('error', (e) => {
        console.error("Müzik Hatası:", e);
        // alert("Müzik yüklenemedi! Dosya yolu: assets/music/song.mp3");
    });

    // Giriş Butonuna Tıklanınca
    if (enterBtn) {
        const startSite = () => {
            // Müzik Başlat
            // Promise yapısını kullanarak hatayı yakalayalım
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Müzik başladı.");
                }).catch(error => {
                    console.error("Müzik başlatılamadı:", error);
                    alert("Müzik başlatılamadı. Lütfen cihazınızın sessiz modunu kapatın ve ekrana dokunun.");
                });
            }

            // Ekran Geçişi
            loginScreen.style.opacity = '0';
            enterBtn.disabled = true;

            setTimeout(() => {
                loginScreen.style.display = 'none';
                if (envelopeOverlay) envelopeOverlay.classList.remove('hidden');
            }, 1000);
        };

        enterBtn.addEventListener('click', startSite);
        enterBtn.addEventListener('touchstart', (e) => {
            // Dokunma ile kesin başlat
            if (audio.paused) startSite();
        }, { passive: true });
    }

    // Envelope Interaction
    const envelope = document.getElementById('envelope-wrapper');
    if (envelope) {
        const handleInteraction = (e) => {
            openLetter();

            // Sesi yükselt
            if (window.siteAudio) {
                window.siteAudio.volume = 1.0;
            }

            envelope.removeEventListener('click', handleInteraction);
            envelope.removeEventListener('touchstart', handleInteraction);
        };

        envelope.addEventListener('click', handleInteraction);
        envelope.addEventListener('touchstart', handleInteraction, { passive: true });
    }
});

// 2. Mektup ve Parşomen Etkileşimi
function openLetter() {
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const parchmentModal = document.getElementById('parchment-modal');
    const parchmentContainer = document.querySelector('.parchment-container');

    // 1. Zarfı Aç (CSS Animasyonunu Tetikle)
    envelopeWrapper.classList.add('open');

    // Yedek çalma (Eğer başta çalmadıysa)
    if (window.siteAudio && window.siteAudio.paused) {
        window.siteAudio.play().catch(e => console.log("Yedek müzik başlatma:", e));
    }

    // 2. Biraz bekle, sonra parşomeni göster
    setTimeout(() => {
        // Parşomeni aç
        parchmentModal.classList.remove('hidden');

        // İstatistik/Bildirim Gönder
        if (typeof notifyVisit === 'function') {
            notifyVisit("Mektup Açıldı", true);
        }

        // Küçük bir gecikmeyle içeriği büyüt (animasyon için)
        setTimeout(() => {
            parchmentContainer.classList.add('active');
        }, 100);

    }, 800);
}

function closeParchment() {
    const parchmentModal = document.getElementById('parchment-modal');
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const mainContent = document.getElementById('main-content');
    const videoContainer = document.getElementById('video-container');
    const finalVideo = document.getElementById('final-video');

    // Parşomeni kapat
    parchmentModal.classList.add('hidden');

    // Zarf ekranını kaybet
    envelopeOverlay.style.opacity = '0';
    setTimeout(() => {
        envelopeOverlay.style.display = 'none';

        // Ana içeriği göster
        mainContent.classList.remove('hidden');

        // Arka plan müziğini durdur
        if (window.siteAudio) {
            window.siteAudio.pause();
        }

        // Videoyu göster ve oynat
        if (videoContainer && finalVideo) {
            videoContainer.classList.remove('hidden');
            finalVideo.play().catch(e => console.log("Video otomatik oynatılamadı:", e));
        }

        AOS.refresh();
    }, 1000);
}



// 4. Metin Animasyonu
function animateText() {
    const text = "Gölgede fısıldıyanlar güneşte konuşmaya cesaret edemezler";
    const container = document.getElementById('animated-text');
    if (!container) return;

    const words = text.split(' ');

    container.innerHTML = ''; // Clear just in case

    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + " ";

        span.className = 'word-span';
        span.style.transitionDelay = `${index * 300}ms`; // 300ms delay between words
        container.appendChild(span);

        setTimeout(() => {
            span.classList.add('visible');
        }, 50);
    });
}

// 5. Geri Sayım
function startCountdown() {
    const timerElement = document.getElementById('countdown');

    let targetTime = localStorage.getItem('targetTime');

    if (!targetTime) {
        const now = new Date().getTime();
        targetTime = now + (24 * 60 * 60 * 1000);
        localStorage.setItem('targetTime', targetTime);
    }

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
            clearInterval(interval);
            timerElement.innerHTML = "00:00:00";
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerElement.innerHTML =
            (hours < 10 ? "0" + hours : hours) + ":" +
            (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds < 10 ? "0" + seconds : seconds);

    }, 1000);
}

// 6. QUIZ OYUNU
const questions = [
    {
        q: "Bugün nasılsın?",
        options: ["Çok İyiyim! 🌟", "Biraz Yorgunum 😴"]
    },
    {
        q: "Dün gece herkes uyurken içinden geçen özlem hissi...",
        options: ["Sadece rüzgardı", "Derin bir gerçekti"]
    },
    {
        q: "Bir günlüğüne nereye kaçalım?",
        options: ["Deniz Kenarı 🌊", "Orman Kampı 🌲"]
    },
    {
        q: "Elinde bir silgi olsa yaşadığımız anıları mı silerdin ? yoksa aramızda ki mesafeleri mi ?",
        options: ["Anılar", "Mesafeler engeller"]
    },
    {
        q: "Beni seviyor musun? (Zor Soru!)",
        options: ["Evet, Çok! ❤️", "Tarif Edilemez! ♾️"]
    }
];

let currentQuestion = 0;
let userAnswers = [];

function openQuizModal() {
    const modal = document.getElementById('quiz-modal');
    modal.classList.remove('hidden');
    currentQuestion = 0;
    userAnswers = [];
    document.getElementById('quiz-content').classList.remove('hidden');
    document.getElementById('quiz-completed').classList.add('hidden');
    loadQuestion();
}

function closeQuizModal() {
    const modal = document.getElementById('quiz-modal');
    modal.classList.add('hidden');
}

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endQuiz();
        return;
    }

    const qData = questions[currentQuestion];
    document.getElementById('question-text').innerText = qData.q;

    const buttons = document.querySelectorAll('.option-btn');
    buttons[0].innerText = qData.options[0];
    buttons[1].innerText = qData.options[1];

    // Update progress bar
    const progress = ((currentQuestion) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function selectOption(optionIndex) {
    const qData = questions[currentQuestion];
    const selectedAnswer = qData.options[optionIndex];

    // Cevabı kaydet
    userAnswers.push({
        question: qData.q,
        answer: selectedAnswer
    });

    // Sonraki soruya geç
    currentQuestion++;
    loadQuestion();
}

function endQuiz() {
    document.getElementById('quiz-content').classList.add('hidden');
    document.getElementById('quiz-completed').classList.remove('hidden');
    document.getElementById('progress-fill').style.width = '100%';

    // Sonuçları Telegram'a gönder
    sendQuizResultsToTelegram();
}

function sendQuizResultsToTelegram() {
    // Tüm cevapları tek bir string'e dönüştür
    let resultMessage = "🎮 OYUN SONUÇLARI - FERİDE:\n\n";

    userAnswers.forEach((item, index) => {
        resultMessage += `${index + 1}. ${item.question}\n   Cevap: ${item.answer}\n\n`;
    });

    const botToken = "8010088130:AAGigZidvc2OX9oznuWEkgu47k6OWIC38M0";
    const chatId = "406305254";

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(resultMessage)}`;

    fetch(url)
        .then(res => console.log("Quiz sonuçları gönderildi"))
        .catch(err => console.error(err));
}

// 7. WhatsApp Entegrasyonu (Genel İletişim)
function contactWhatsApp() {
    const phoneNumber = "90501507327"; // Güncellendi
    const message = "Merhaba, bir konuda görüş/öneri iletmek istiyorum...";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Yeni Soru Talebi
function requestNewQuestion() {
    const phoneNumber = "90501507327"; // Güncellendi
    const message = "Merhaba, aklıma bir oyun sorusu geldi: \n\nSoru: ...\nSeçenekler: ...";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// WhatsApp (Quiz Sonuçları)
function openWhatsApp() {
    const phoneNumber = "90501507327"; // Güncellendi

    let message = "🎮 *Feride'nin Oyun Sonuçları:* 🎮\n\n";

    userAnswers.forEach((item, index) => {
        message += `*${index + 1}. ${item.question}*\n👉 ${item.answer}\n\n`;
    });

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}


// 8. Ziyaret Bildirimi
function notifyVisit(passwordAttempt, isSuccess) {
    const botToken = "8010088130:AAGigZidvc2OX9oznuWEkgu47k6OWIC38M0";
    const chatId = "406305254";

    if (botToken === "BURAYA_BOT_TOKEN_YAZ") return;

    let statusHeader = isSuccess ? "✅ BAŞARILI GİRİŞ" : "⛔ GİRİŞ ENGELLENDİ (Trip/Olumsuzluk)";

    const message = `${statusHeader}\n\n👤 Feride giriş yapmayı denedi.\n🔑 Denenen Şifre: "${passwordAttempt}"\n📅 Tarih: ${new Date().toLocaleString()}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(url).catch(err => console.error("Bağlantı hatası:", err));
}

// VIDEO İŞLEMLERİ
document.addEventListener('DOMContentLoaded', () => {
    const finalVideo = document.getElementById('final-video');
    if (finalVideo) {
        // Video bittiğinde otomatik kapat/bildir
        finalVideo.addEventListener('ended', () => {
            closeVideo();
        });
    }
});

function closeVideo() {
    const videoContainer = document.getElementById('video-container');
    const finalMsgContainer = document.getElementById('final-msg-container');
    const finalVideo = document.getElementById('final-video');

    // İzlenen süreyi al
    let watchedTime = 0;
    if (finalVideo) {
        watchedTime = Math.floor(finalVideo.currentTime);
        finalVideo.pause();
    }

    // Telegram'a bildir
    notifyVideoWatched(watchedTime);

    // Videoyu gizle
    videoContainer.classList.add('hidden');

    // Son mesajı göster ("Seni bekliyorum...")
    finalMsgContainer.classList.remove('hidden');
}

function notifyVideoWatched(seconds) {
    const botToken = "8010088130:AAGigZidvc2OX9oznuWEkgu47k6OWIC38M0";
    const chatId = "406305254";

    // Süreyi dakika:saniye formatına çevir
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeString = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;

    const message = `🎥 VİDEO İZLENDİ!\n\nFeride videoyu kapattı/bitirdi.\n⏱️ İzlenen Süre: ${timeString}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(url).catch(err => console.error("Video bildirimi gönderilemedi:", err));
}
