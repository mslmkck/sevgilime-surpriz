// ============================================
// AŞK TESTİ OYUNU
// ============================================

const quizData = [
    {
        question: "İlk buluşmamızda ben ne giymiştim? 👗👕",
        options: ["Mavi Gömlek", "Siyah Kazak", "Beyaz Tişört", "Hatırlamıyorum (Yandı!)"],
        correct: 1 // 0-indexli (Siyah Kazak diyelim, sen değiştirebilirsin)
    },
    {
        question: "Benim en sevdiğim yemek hangisi? 🍕",
        options: ["Mantı", "Pizza", "Hamburger", "Sarma"],
        correct: 0
    },
    {
        question: "Hangi şarkı bizim şarkımız? 🎵",
        options: ["Bir Beyaz Orkide", "Sen Bilmezsin", "Yalan", "Gülpembe"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;

function initQuizGame() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    // Oyun bitti mi?
    if (currentQuestion >= quizData.length) {
        showQuizResult();
        return;
    }

    const q = quizData[currentQuestion];

    let html = `
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-options">
    `;

    q.options.forEach((opt, index) => {
        html += `<button class="quiz-btn" onclick="checkAnswer(${index})">${opt}</button>`;
    });

    html += `</div>
             <div class="quiz-score">Puan: ${score}</div>`;

    container.innerHTML = html;

    gsap.from(".quiz-btn", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5
    });
}

window.checkAnswer = (selected) => {
    const q = quizData[currentQuestion];
    const buttons = document.querySelectorAll('.quiz-btn');

    if (selected === q.correct) {
        // Doğru
        buttons[selected].classList.add('correct');
        score += 10;

        // Konfeti
        if (window.confetti) {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
            });
        }
    } else {
        // Yanlış
        buttons[selected].classList.add('wrong');
        buttons[q.correct].classList.add('correct'); // Doğruyu göster
    }

    // Butonları kilitle
    buttons.forEach(btn => btn.disabled = true);

    // Sonraki soruya geç
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
}

function showQuizResult() {
    const container = document.getElementById('quiz-container');

    let message = "";
    if (score === quizData.length * 10) {
        message = "MÜKEMMEL AŞIK! ❤️ Beni çok iyi tanıyorsun!";
    } else if (score > 0) {
        message = "Fena değil, ama biraz daha dikkat! 😉";
    } else {
        message = "Ah be... Unutkanlık mı başladı? 😂";
    }

    container.innerHTML = `
        <div class="quiz-question">TEST BİTTİ!</div>
        <div style="font-size: 3rem; margin-bottom: 20px;">🎉</div>
        <div style="font-size: 1.5rem; margin-bottom: 20px;">Skorun: ${score}</div>
        <div style="font-size: 1.2rem; opacity: 0.9;">${message}</div>
        <button class="game-back-btn" style="position: relative; top: 20px; left: 0;" onclick="initQuizGame()">Tekrar Oyna</button>
    `;

    // Supabase Kayıt
    if (window.supabaseHelpers) {
        window.supabaseHelpers.saveGameScore('quiz', score, { result: message });
    }

    // Telegram Kayıt
    if (window.telegramNotifications) {
        window.telegramNotifications.notifyGamePlayed('quiz', `Skor: ${score} - ${message}`);
    }
}
