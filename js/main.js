// 1. AOS Init (Scroll Animations)
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
});

// 2. Şifreli Giriş
const correctPassword = "feride"; // Şifreyi buradan değiştirebilirsin
function checkPassword() {
    const input = document.getElementById('password').value.trim().toLowerCase();
    const errorMsg = document.getElementById('error-msg');
    const loginOverlay = document.getElementById('login-overlay');
    const mainContent = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-btn');

    if (input === correctPassword) {
        // Ziyaret Bildirimi
        notifyVisit();

        // Efektle kapat
        loginOverlay.style.opacity = '0';
        loginOverlay.style.transition = 'opacity 1s ease';

        // Müzik otomatik başlamasın, kullanıcı seçsin
        musicBtn.innerHTML = '🎵 Müziği Başlat';
        isPlaying = false;

        setTimeout(() => {
            loginOverlay.style.display = 'none';
            mainContent.classList.remove('hidden');
            musicBtn.style.display = 'block'; // Müzik butonunu göster
            AOS.refresh();

            // Metin animasyonunu başlat
            animateText();

            // Geri sayımı başlat
            startCountdown();

            // Oyunu hazırlama (Otomatik başlamaz, butona basılınca başlar)
            // loadQuestion(); 
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
    const phoneNumber = "905555555555"; // Kendi numaranla değiştir
    const message = "Merhaba, bir konuda görüş/öneri iletmek istiyorum...";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// WhatsApp (Quiz Sonuçları)
function openWhatsApp() {
    const phoneNumber = "905555555555"; // Kendi numaranla değiştir

    let message = "🎮 *Feride'nin Oyun Sonuçları:* 🎮\n\n";

    userAnswers.forEach((item, index) => {
        message += `*${index + 1}. ${item.question}*\n👉 ${item.answer}\n\n`;
    });

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}


// 8. Ziyaret Bildirimi
function notifyVisit() {
    const botToken = "8010088130:AAGigZidvc2OX9oznuWEkgu47k6OWIC38M0";
    const chatId = "406305254";

    if (botToken === "BURAYA_BOT_TOKEN_YAZ") return;

    const message = "🚨 Feride siteye giriş yaptı! (Tarih: " + new Date().toLocaleString() + ")";
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(url).catch(err => console.error("Bağlantı hatası:", err));
}

// 9. Mesaj Gönderme
function sendTelegramMessage() {
    const msgInput = document.getElementById('secret-message');
    const statusText = document.getElementById('msg-status');
    const message = msgInput.value.trim();

    if (!message) {
        statusText.innerText = "Lütfen boş mesaj gönderme...";
        statusText.style.color = "red";
        return;
    }

    const botToken = "8010088130:AAGigZidvc2OX9oznuWEkgu47k6OWIC38M0";
    const chatId = "406305254";

    if (botToken.includes("BURAYA")) {
        alert("Bot ayarları yapılmamış!");
        return;
    }

    const fullMessage = "💌 Feride'den Yeni Mesaj:\n\n" + message;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(fullMessage)}`;

    statusText.innerText = "Gönderiliyor...";
    statusText.style.color = "#d4a5a5";

    fetch(url)
        .then(response => {
            if (response.ok) {
                msgInput.value = "";
                statusText.innerText = "Mesajınız başarıyla iletildi.";
                statusText.style.color = "lightgreen";
            } else {
                statusText.innerText = "Bir hata oluştu.";
                statusText.style.color = "red";
            }
        })
        .catch(err => {
            statusText.innerText = "Bağlantı hatası.";
            console.error(err);
        });
}
