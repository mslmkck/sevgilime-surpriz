// =============================================
// IMHA ODASI (DESTRUCTION ROOM) LOGIC
// =============================================

const DestructionRoom = {
    // Soru listesi
    questions: [
        "Sitenin kapanmasını istiyor musun?",
        "Beni özledin mi?",
        "Seni özlediğime inanıyor musun?",
        "Benimle ilk ve son kez buluşmak ister miydin?"
    ],

    // State
    currentQuestionIndex: 0,
    timerInterval: null,

    // Config
    COUNTDOWN_DURATION_HOURS: 72,

    // Init function
    init: function () {
        console.log("Destruction Room Initialized");

        // 1. KULLANICI KONTROLÜ (Sadece Tavşan)
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile !== 'rabbit') {
            this.showAccessDenied();
            // Test sırasında yanlışlıkla başlatılan sayacı temizle (Kullanıcı isteği)
            if (localStorage.getItem('destruction_started_at')) {
                localStorage.removeItem('destruction_started_at');
                console.log("Unauthorized countdown reset.");
            }
            return;
        }

        this.checkState();

        // Eğer daha önce başlatıldıysa UI'ı güncelle
        if (localStorage.getItem('destruction_started_at')) {
            this.showCountdown();
        } else if (localStorage.getItem('destruction_failed')) {
            this.showFailure();
        } else {
            this.showQuestion(0);
        }
    },

    // Yetkisiz Giriş Ekranı
    showAccessDenied: function () {
        const wrapper = document.querySelector('.destruction-wrapper');
        if (wrapper) {
            wrapper.innerHTML = `
                <div class="destruction-container">
                    <div class="destruction-icon"><i class="fas fa-lock"></i></div>
                    <h2 class="destruction-title">ERİŞİM ENGELLENDİ</h2>
                    <p class="destruction-desc">Bu alana sadece Tavşan karakteri erişebilir.</p>
                    <button class="back-btn-internal" onclick="goBackToHall()">Geri Dön</button>
                </div>
            `;
        }
    },

    // Check existing state and routing
    checkState: function () {
        // Reset Wrapper Content if it was overwritten by Access Denied
        const wrapper = document.querySelector('.destruction-wrapper');
        // Eğer wrapper içeriği bozulmuşsa (back button vs) reload gerekebilir ama
        // şimdilik HTML yapısını koruduğumuzu varsayıyoruz. 
        // AccessDenied innerHTML değiştirdiği için, normal akışta sayfa yenilenmeli veya HTML restore edilmeli.
        // Basitlik adına: innerHTML restore kodu eklemeyeceğiz, kullanıcı sayfayı yenilerse düzelir.
        // Ancak Rabbit olarak girince düzgün çalışması için HTML'in index.html'deki hali duruyor olmalı.
    },

    // Show specific question
    showQuestion: function (index) {
        const questionContainer = document.getElementById('destruction-question-container');
        const countdownContainer = document.getElementById('destruction-countdown-container');
        const failContainer = document.getElementById('destruction-fail-container');

        // Hide others
        if (countdownContainer) countdownContainer.classList.add('hidden');
        if (failContainer) failContainer.classList.add('hidden');

        if (questionContainer) {
            questionContainer.classList.remove('hidden');

            const questionText = document.getElementById('destruction-question-text');
            if (questionText) {
                questionText.textContent = this.questions[index];
                questionText.classList.remove('fade-in');
                void questionText.offsetWidth; // Trigger reflow
                questionText.classList.add('fade-in');
            }
        }
    },

    // Handle Yes answer
    handleYes: function () {
        const currentQ = this.questions[this.currentQuestionIndex];

        // Notify Telegram
        if (window.telegramNotifications) {
            window.telegramNotifications.sendCustomNotification(
                `<b>🧨 İmha Odası - Cevap</b>\n\nSoru: <i>${currentQ}</i>\nCevap: <b>EVET</b>`,
                { emoji: '✅' }
            );
        }

        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questions.length) {
            this.showQuestion(this.currentQuestionIndex);
        } else {
            this.startCountdownSequence();
        }
    },

    // Handle No answer
    handleNo: function () {
        const currentQ = this.questions[this.currentQuestionIndex];

        // Notify Telegram
        if (window.telegramNotifications) {
            window.telegramNotifications.sendCustomNotification(
                `<b>🧨 İmha Odası - Cevap</b>\n\nSoru: <i>${currentQ}</i>\nCevap: <b>HAYIR</b>\n\n⚠️ İmha iptal edildi.`,
                { emoji: '❌' }
            );
        }

        this.failSequence();
    },

    // Start Countdown
    startCountdownSequence: function () {
        const now = Date.now();
        localStorage.setItem('destruction_started_at', now);

        if (window.telegramNotifications) {
            window.telegramNotifications.sendCustomNotification(
                `<b>🚨 DİKKAT: İMHA GERİ SAYIMI BAŞLADI!</b>\n\nSüre: 72 Saat\n\nKullanıcı tüm sorulara EVET dedi.`,
                { emoji: '☢️' }
            );
        }

        this.showCountdown();
    },

    // Show Countdown UI
    showCountdown: function () {
        const questionContainer = document.getElementById('destruction-question-container');
        const countdownContainer = document.getElementById('destruction-countdown-container');

        if (questionContainer) questionContainer.classList.add('hidden');
        if (countdownContainer) countdownContainer.classList.remove('hidden');

        // Final Confirm Question Display (Sayacın Altında)
        const finalConfirmDiv = document.getElementById('destruction-final-confirm');
        if (finalConfirmDiv) finalConfirmDiv.classList.remove('hidden');

        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    },

    // Update Timer Display
    updateTimer: function () {
        const startTime = parseInt(localStorage.getItem('destruction_started_at'));
        if (!startTime) {
            clearInterval(this.timerInterval);
            return; // Durdurulmuş
        }

        const durationMs = this.COUNTDOWN_DURATION_HOURS * 60 * 60 * 1000;
        const elapsed = Date.now() - startTime;
        const remaining = durationMs - elapsed;

        if (remaining <= 0) {
            clearInterval(this.timerInterval);
            document.getElementById('destruction-timer-display').textContent = "00:00:00";
            document.getElementById('destruction-status-text').textContent = "SİSTEM İMHA EDİLDİ";
            return;
        }

        const seconds = Math.floor((remaining / 1000) % 60);
        const minutes = Math.floor((remaining / (1000 * 60)) % 60);
        const hours = Math.floor((remaining / (1000 * 60 * 60)));

        const format = (num) => num.toString().padStart(2, '0');

        const display = `${format(hours)}:${format(minutes)}:${format(seconds)}`;
        document.getElementById('destruction-timer-display').textContent = display;
    },

    // Final Confirmation Handler (Sayacın altındaki soru)
    handleFinalConfirmation: function (choice) {
        if (choice === 'yes') {
            // "Eminim" -> Devam et, belki bir bildirim at
            if (window.telegramNotifications) {
                window.telegramNotifications.sendCustomNotification(
                    `<b>☢️ İmha Teyidi</b>\n\nKullanıcı her şeyi bitirmek istediğine <b>EMİN</b> olduğunu belirtti. Geri sayım devam ediyor.`,
                    { emoji: '💀' }
                );
            }
            alert("Geri sayım devam ediyor... Kararın kesinleşti.");
            // Butonları gizle veya disable et
            const btnGroup = document.querySelector('#destruction-final-confirm .destruction-btn-group');
            if (btnGroup) btnGroup.style.display = 'none';
            document.querySelector('#destruction-final-confirm h3').textContent = "KARAR KESİNLEŞTİ";

        } else {
            // "Hayır/Emin Değilim" -> İPTAL ET
            localStorage.removeItem('destruction_started_at');
            clearInterval(this.timerInterval);

            if (window.telegramNotifications) {
                window.telegramNotifications.sendCustomNotification(
                    `<b>🛑 İMHA İPTAL EDİLDİ</b>\n\nKullanıcı son anda vazgeçti.`,
                    { emoji: '🛑' }
                );
            }

            this.failSequence(); // İptal ekranına yönlendir
        }
    },

    // Fail Sequence
    failSequence: function () {
        const questionContainer = document.getElementById('destruction-question-container');
        const countdownContainer = document.getElementById('destruction-countdown-container'); // Sayacı da gizle
        const failContainer = document.getElementById('destruction-fail-container');

        if (questionContainer) questionContainer.classList.add('hidden');
        if (countdownContainer) countdownContainer.classList.add('hidden');
        if (failContainer) failContainer.classList.remove('hidden');
    }
};

// Global handlers for HTML buttons
window.destructionRoom = DestructionRoom;
