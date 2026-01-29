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


    // Olumsuzluk içeren kelimeler (Genişletilmiş Liste)
    const negativeWords = [
        "hiç", "hic", "yok", "hayır", "hayir", "değil", "degil", "maalesef",
        "istemem", "istemiyorum", "sevmiyorum", "bitti", "git", "ayrıl",
        "nefret", "küs", "yalan", "sahte", "kötü", "berbat", "uzak", "soğuk",
        "sevmem", "yabancı", "el", "kimse", "boş", "eski", "olmaz", "yapamam"
    ];

    // Girilen metinde bu kelimelerden biri var mı?
    const isNegative = negativeWords.some(word => input.includes(word));

    if (input.length > 0 && !isNegative) {
        // BAŞARILI GİRİŞ

        // 1. Ekrana Tebrik Mesajı Yaz
        errorMsg.innerText = "Harikasın, kalbinin güzelliğiyle giriş yapılıyor... ❤️";
        errorMsg.style.color = "#4caf50"; // Yeşil renk
        errorMsg.classList.remove('hidden');

        // 2. Telegram'a Bildir (Başarılı)
        notifyVisit(input, true);

        // 3. Biraz bekleyip (mesaj okunsun) siteyi aç
        setTimeout(() => {
            loginOverlay.style.opacity = '0';
            loginOverlay.style.transition = 'opacity 1s ease';

            setTimeout(() => {
                loginOverlay.style.display = 'none';
                mainContent.classList.remove('hidden');
                AOS.refresh();
                animateText();
                startCountdown();
            }, 1000);
        }, 1500); // 1.5 saniye mesajı görsün

    } else {
        // BAŞARISIZ / ENGEL

        // Hata mesajını ayarla
        if (isNegative) {
            errorMsg.innerText = "Yanlış şifre, doğru olanı sen biliyorsun...";
            // Telegram'a Bildir (Engellendi)
            notifyVisit(input, false);
        } else {
            errorMsg.innerText = "Hayır, bu değil... Bir daha düşün 🥺";
        }

        errorMsg.style.color = "#ff6b6b"; // Kırmızı renk (hata)
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


// --- HANGMAN GAME LOGIC ---
const hangmanWords = [
    { word: "DOSTLUK", hint: "İyi günde kötü günde yanında olandır." },
    { word: "GÜLÜMSE", hint: "En güzel makyajdır, yüzüne yakışır." },
    { word: "BAŞARI", hint: "Emek vermeden kazanılmaz, zirveye giden yol." },
    { word: "GELECEK", hint: "Henüz yaşanmamış ama umut dolu zaman dilimi." },
    { word: "SÜRPRİZ", hint: "Beklenmedik anda gelen mutluluk." },
    { word: "YILDIZ", hint: "Gece gökyüzünü aydınlatan parlak cisim." },
    { word: "SONSUZLUK", hint: "Ucu bucağı olmayan, bitmeyen zaman." },
    { word: "HAYAL", hint: "Gerçekleşmesini istediğin düşler." },
    { word: "UMUT", hint: "Karanlıkta bile bir ışık olduğuna inanmak." },
    { word: "MACERA", hint: "Heyecan dolu, riskli ama eğlenceli olaylar zinciri." },
    { word: "SADAKAT", hint: "Bağlılık ve güvenin temelidir." },
    { word: "GÜVEN", hint: "Birine duyulan inanç, dayanak." },
    { word: "ZAMAN", hint: "Geri alınamayan en değerli hazine." },
    { word: "KAHKAHAN", hint: "Mutluluğun en sesli hali." }
];

let selectedWordObj = {};
let selectedWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
const maxWrong = 6;

function openHangmanModal() {
    const modal = document.getElementById('hangman-modal');
    modal.classList.remove('hidden');
    initHangman();
}

function closeHangmanModal() {
    const modal = document.getElementById('hangman-modal');
    modal.classList.add('hidden');
}

function initHangman() {
    // Reset state
    wrongGuesses = 0;
    guessedLetters = [];
    selectedWordObj = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    selectedWord = selectedWordObj.word;

    // UI Reset
    document.getElementById('man-container').innerHTML = `
        <svg height="150" width="120" id="hangman-svg" style="stroke: #e0e0e0; stroke-width: 3; fill: none;">
            <line x1="10" y1="140" x2="110" y2="140" />
            <line x1="30" y1="140" x2="30" y2="20" />
            <line x1="30" y1="20" x2="80" y2="20" />
            <line x1="80" y1="20" x2="80" y2="40" />
            
            <circle cx="80" cy="50" r="10" class="man-part" id="part-0" />
            <line x1="80" y1="60" x2="80" y2="100" class="man-part" id="part-1" />
            <line x1="80" y1="70" x2="60" y2="90" class="man-part" id="part-2" />
            <line x1="80" y1="70" x2="100" y2="90" class="man-part" id="part-3" />
            <line x1="80" y1="100" x2="60" y2="130" class="man-part" id="part-4" />
            <line x1="80" y1="100" x2="100" y2="130" class="man-part" id="part-5" />
        </svg>
    `;

    document.getElementById('game-status-msg').innerText = "";
    document.getElementById('restart-game-btn').classList.add('hidden');

    // Hint Reset
    const hintText = document.getElementById('hint-text');
    const hintBtn = document.getElementById('hint-btn');
    if (hintText) { hintText.classList.add('hidden'); hintText.innerText = ""; }
    if (hintBtn) { hintBtn.style.display = "inline-block"; }

    renderWord();

    renderKeyboard();
}

function renderWord() {
    const display = selectedWord.split('').map(letter =>
        guessedLetters.includes(letter) ? letter : "_"
    ).join(" ");
    document.getElementById('word-display').innerText = display;

    checkWinLoss();
}

function renderKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = "";
    const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";

    alphabet.split('').forEach(letter => {
        const btn = document.createElement('button');
        btn.innerText = letter;
        btn.classList.add('key-btn');
        btn.onclick = () => handleGuess(letter);
        if (guessedLetters.includes(letter)) {
            btn.disabled = true;
            if (selectedWord.includes(letter)) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('wrong');
            }
        }
        keyboard.appendChild(btn);
    });
}

function handleGuess(letter) {
    if (guessedLetters.includes(letter) || wrongGuesses >= maxWrong) return;

    guessedLetters.push(letter);

    if (!selectedWord.includes(letter)) {
        wrongGuesses++;
        updateMan();
    }

    renderWord();
    renderKeyboard();
}

function updateMan() {
    // Show parts based on wrongGuesses index (0 to 5)
    // wrongGuesses is 1-based count, IDs are part-0 to part-5
    const partId = `part-${wrongGuesses - 1}`;
    const part = document.getElementById(partId);
    if (part) {
        part.style.display = "block";
    }
}

function checkWinLoss() {
    const isWon = selectedWord.split('').every(l => guessedLetters.includes(l));
    const isLost = wrongGuesses >= maxWrong;

    if (isWon) {
        document.getElementById('game-status-msg').style.color = "#4caf50";
        document.getElementById('game-status-msg').innerText = "Tebrikler! Kazandın 🎉";

        // Confetti Effect
        var duration = 3 * 1000;
        var end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#4caf50', '#81c784', '#a5d6a7']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#4caf50', '#81c784', '#a5d6a7']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        endGame();
    } else if (isLost) {
        document.getElementById('game-status-msg').style.color = "#ff6b6b";
        document.getElementById('game-status-msg').innerText = `Kaybettin... Kelime: ${selectedWord}`;
        endGame();
    }
}

function endGame() {
    // Disable all keys
    const keys = document.querySelectorAll('.key-btn');
    keys.forEach(k => k.disabled = true);

    // Show restart button
    document.getElementById('restart-game-btn').classList.remove('hidden');
}

function showHint() {
    const hintText = document.getElementById('hint-text');
    const hintBtn = document.getElementById('hint-btn');

    hintText.innerText = selectedWordObj.hint;
    hintText.classList.remove('hidden');
    hintText.style.display = 'block'; // Ensure visibility

    // Hide button after showing hint
    hintBtn.style.display = 'none';
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
