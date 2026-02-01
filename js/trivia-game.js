// ============================================
// BİLGİ YARIŞMASI OYUNU (TRIVIA)
// ============================================

const triviaPool = [
    {
        question: "Dünyanın en uzun nehri hangisidir?",
        options: ["Nil Nehri", "Amazon Nehri", "Yangtze Nehri", "Mississipi Nehri"],
        correct: 0
    },
    {
        question: "Mona Lisa tablosu hangi müzede sergilenmektedir?",
        options: ["British Museum", "Metropolitan Museum", "Louvre Müzesi", "Vatikan Müzeleri"],
        correct: 2
    },
    {
        question: "Güneş sistemindeki en büyük gezegen hangisidir?",
        options: ["Mars", "Satürn", "Jüpiter", "Venüs"],
        correct: 2
    },
    {
        question: "Hangisi doğal bir ışık kaynağı değildir?",
        options: ["Güneş", "Ay", "Yıldızlar", "Ateş Böceği"],
        correct: 1
    },
    {
        question: "Türkiye'nin en yüksek dağı hangisidir?",
        options: ["Erciyes Dağı", "Kaçkar Dağı", "Süphan Dağı", "Ağrı Dağı"],
        correct: 3
    },
    {
        question: "Periyodik cetvelde 'O' simgesi hangi elementi temsil eder?",
        options: ["Osmiyum", "Oksijen", "Altın", "Oganesson"],
        correct: 1
    },
    {
        question: "Yüzüklerin Efendisi serisinin yazarı kimdir?",
        options: ["J.K. Rowling", "George R.R. Martin", "J.R.R. Tolkien", "C.S. Lewis"],
        correct: 2
    },
    {
        question: "Aspirinin hammaddesi olan ağaç hangisidir?",
        options: ["Söğüt", "Kavak", "Meşe", "Çam"],
        correct: 0
    },
    {
        question: "Hangi hayvanın kalbi kafasındadır?",
        options: ["Ahtapot", "Karides", "Deniz Anası", "Yengeç"],
        correct: 1
    },
    {
        question: "İnternet dünyasında 'WWW' ne anlama gelir?",
        options: ["World Wide Web", "World Web Wares", "Wide Width Wares", "Web World Wide"],
        correct: 0
    },
    {
        question: "Futbol maçlarında bir takım sahada en az kaç oyuncu ile kalabilir?",
        options: ["8", "7", "6", "9"],
        correct: 1
    },
    {
        question: "Hangi gezegen 'Kızıl Gezegen' olarak bilinir?",
        options: ["Venüs", "Mars", "Jüpiter", "Satürn"],
        correct: 1
    },
    {
        question: "İnsan vücudundaki en büyük organ hangisidir?",
        options: ["Karaciğer", "Beyin", "Deri", "Kalp"],
        correct: 2
    },
    {
        question: "Hangi ülkenin başkenti Paris'tir?",
        options: ["İtalya", "İspanya", "Fransa", "Belçika"],
        correct: 2
    },
    {
        question: "Su kaç derecede kaynar (deniz seviyesinde)?",
        options: ["90°C", "100°C", "110°C", "120°C"],
        correct: 1
    },
    {
        question: "Telefonun mucidi kimdir?",
        options: ["Tesla", "Edison", "Graham Bell", "Marconi"],
        correct: 2
    },
    {
        question: "Hangi satranç taşı 'L' şeklinde hareket eder?",
        options: ["Kale", "Fil", "At", "Vezir"],
        correct: 2
    },
    {
        question: "Van Gogh hangi kulağını kesmiştir?",
        options: ["Sağ", "Sol", "İkisini de", "Hiçbirini"],
        correct: 1
    },
    {
        question: "Titanic gemisi hangi yılda batmıştır?",
        options: ["1910", "1912", "1915", "1920"],
        correct: 1
    },
    {
        question: "Avustralya'nın başkenti neresidir?",
        options: ["Sidney", "Melbourne", "Canberra", "Perth"],
        correct: 2
    },
    {
        question: "Hangi elementin kimyasal sembolü 'Ag'dir?",
        options: ["Altın", "Gümüş", "Argon", "Alüminyum"],
        correct: 1
    },
    {
        question: "İlk Dünya Savaşı hangi yıl başlamıştır?",
        options: ["1912", "1914", "1918", "1923"],
        correct: 1
    },
    {
        question: "Picasso hangi sanat akımının öncüsüdür?",
        options: ["Sürrealizm", "Kübizm", "Empresyonizm", "Dadaizm"],
        correct: 1
    },
    {
        question: "Dünyanın en derin noktası neresidir?",
        options: ["Mariana Çukuru", "Porto Riko Çukuru", "Tonga Çukuru", "Kermadec Çukuru"],
        correct: 0
    },
    {
        question: "Hangi ülke hem Asya hem de Avrupa kıtasında yer alır?",
        options: ["Yunanistan", "Bulgaristan", "Rusya", "İran"],
        correct: 2
    },
    {
        question: "Nobel ödülleri hangi ülkede verilir (Barış ödülü hariç)?",
        options: ["İsviçre", "İsveç", "Norveç", "Almanya"],
        correct: 1
    },
    {
        question: "DNA'nın açılımı nedir?",
        options: ["Deoksiribo Nükleik Asit", "Dinitro Asit", "Doğal Nükleik Asit", "Dinamik Nötron Atomu"],
        correct: 0
    },
    {
        question: "Fatih Sultan Mehmet İstanbul'u kaç yılında fethetmiştir?",
        options: ["1071", "1299", "1453", "1923"],
        correct: 2
    },
    {
        question: "Hangi gezegenin halkaları en belirgindir?",
        options: ["Jüpiter", "Uranüs", "Satürn", "Neptün"],
        correct: 2
    },
    {
        question: "İstiklal Marşı'mızın şairi kimdir?",
        options: ["Namık Kemal", "Orhan Veli", "Mehmet Akif Ersoy", "Ziya Gökalp"],
        correct: 2
    },
    {
        question: "Bir yıl kaç haftadır?",
        options: ["50", "52", "54", "48"],
        correct: 1
    },
    {
        question: "Hangi renk ana renk değildir?",
        options: ["Kırmızı", "Mavi", "Yeşil", "Sarı"],
        correct: 2
    },
    {
        question: "Roma rakamlarında 'X' neyi ifade eder?",
        options: ["5", "10", "50", "100"],
        correct: 1
    },
    {
        question: "Dünyanın en büyük okyanusu hangisidir?",
        options: ["Atlas Okyanusu", "Hint Okyanusu", "Büyük Okyanus", "Arktik Okyanusu"],
        correct: 2
    },
    {
        question: "Hangi meyve C vitamini açısından en zengindir?",
        options: ["Elma", "Muz", "Kuşburnu", "Armut"],
        correct: 2
    },
    {
        question: "Türkiye'nin plaka kodu 06 olan ili hangisidir?",
        options: ["İstanbul", "İzmir", "Adana", "Ankara"],
        correct: 3
    },
    {
        question: "Hangi icat Thomas Edison'a ait değildir?",
        options: ["Ampul", "Fonograf", "Radyo", "Hareketli Film Kamerası"],
        correct: 2
    },
    {
        question: "Spider-Man'in gerçek adı nedir?",
        options: ["Bruce Wayne", "Clark Kent", "Peter Parker", "Tony Stark"],
        correct: 2
    },
    {
        question: "Hangisi bir programlama dili değildir?",
        options: ["Python", "Java", "HTML", "C++"],
        correct: 2
    },
    {
        question: "Basketbolda her takım sahada kaç kişiyle oynar?",
        options: ["5", "6", "7", "11"],
        correct: 0
    },
    {
        question: "Eyfel Kulesi hangi şehirdedir?",
        options: ["Londra", "Berlin", "Roma", "Paris"],
        correct: 3
    },
    {
        question: "İnsan vücudunda kaç tane kromozom vardır?",
        options: ["23", "46", "48", "42"],
        correct: 1
    },
    {
        question: "Hangi ülkenin bayrağında 'Ay ve Yıldız' yoktur?",
        options: ["Türkiye", "Pakistan", "Japonya", "Azerbaycan"],
        correct: 2
    },
    {
        question: "Suyun kimyasal formülü nedir?",
        options: ["CO2", "H2O", "O2", "NaCl"],
        correct: 1
    },
    {
        question: "Hangi hayvan memeli değildir?",
        options: ["Yunus", "Yarasa", "Penguen", "Balina"],
        correct: 2
    },
    {
        question: "Satranç tahtasında kaç kare vardır?",
        options: ["32", "64", "100", "50"],
        correct: 1
    },
    {
        question: "Harry Potter serisindeki büyücülük okulunun adı nedir?",
        options: ["Durmstrang", "Beauxbatons", "Hogwarts", "Ilvermorny"],
        correct: 2
    },
    {
        question: "Türkiye'de kaç coğrafi bölge vardır?",
        options: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "Hangisi dünyanın yedi harikasından biri kabul edilir (Antik)?",
        options: ["Kolezyum", "Keops Piramidi", "Tac Mahal", "Çin Seddi"],
        correct: 1
    },
    {
        question: "Piyanoda kaç tuş vardır (standart)?",
        options: ["66", "72", "88", "96"],
        correct: 2
    }
];

// Değişkenler
let triviaCurrentIndex = 0;
let triviaScore = 0;
window.triviaTimerInterval = null; // Global erişim için
let triviaTimeLeft = 60;
let currentTriviaQuestions = [];

window.initTriviaGame = function () {
    triviaScore = 0;
    triviaCurrentIndex = 0;
    console.log("Trivia Game Başlatılıyor..."); // Debug

    // Soruları karıştır ve ilk 10 tanesini al
    currentTriviaQuestions = [...triviaPool].sort(() => 0.5 - Math.random()).slice(0, 10);

    showTriviaQuestion();
}

function showTriviaQuestion() {
    const container = document.getElementById('trivia-container');
    if (!container) {
        console.error("Trivia container bulunamadı!");
        return;
    }

    // Timer Temizle
    if (window.triviaTimerInterval) clearInterval(window.triviaTimerInterval);

    // Oyun bitti mi?
    if (triviaCurrentIndex >= currentTriviaQuestions.length) {
        showTriviaResult();
        return;
    }

    const q = currentTriviaQuestions[triviaCurrentIndex];
    triviaTimeLeft = 60;

    let html = `
        <div class="quiz-timer" id="trivia-timer">Süre: 60</div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-options">
    `;

    q.options.forEach((opt, index) => {
        html += `<button class="quiz-btn trivia-btn" onclick="window.checkTriviaAnswer(${index})">${opt}</button>`;
    });

    html += `</div>
             <div class="quiz-score">Puan: ${triviaScore} / ${currentTriviaQuestions.length * 10}</div>`;

    container.innerHTML = html;

    // Animasyon
    gsap.from(".trivia-btn", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5
    });

    // Timer Başlat
    startTriviaTimer();
}

function startTriviaTimer() {
    const timerDisplay = document.getElementById('trivia-timer');

    window.triviaTimerInterval = setInterval(() => {
        triviaTimeLeft--;
        if (timerDisplay) timerDisplay.innerText = `Süre: ${triviaTimeLeft}`;

        if (triviaTimeLeft <= 10 && timerDisplay) {
            timerDisplay.style.color = '#ff4d4d';
        }

        if (triviaTimeLeft <= 0) {
            clearInterval(window.triviaTimerInterval);
            handleTriviaTimeout();
        }
    }, 1000);
}

function handleTriviaTimeout() {
    const buttons = document.querySelectorAll('.trivia-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('wrong');
    });

    const q = currentTriviaQuestions[triviaCurrentIndex];
    if (buttons[q.correct]) {
        buttons[q.correct].classList.remove('wrong');
        buttons[q.correct].classList.add('correct');
    }

    setTimeout(() => {
        triviaCurrentIndex++;
        showTriviaQuestion();
    }, 2000);
}

window.checkTriviaAnswer = (selected) => {
    if (window.triviaTimerInterval) clearInterval(window.triviaTimerInterval);

    const q = currentTriviaQuestions[triviaCurrentIndex];
    const buttons = document.querySelectorAll('.trivia-btn');

    if (selected === q.correct) {
        buttons[selected].classList.add('correct');
        triviaScore += 10;
        if (window.confetti) {
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 },
                colors: ['#00ff00', '#ffffff']
            });
        }
    } else {
        buttons[selected].classList.add('wrong');
        if (buttons[q.correct]) buttons[q.correct].classList.add('correct');
    }

    buttons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        triviaCurrentIndex++;
        showTriviaQuestion();
    }, 1500);
}

function showTriviaResult() {
    const container = document.getElementById('trivia-container');

    let message = "";
    const totalScore = currentTriviaQuestions.length * 10;
    const ratio = totalScore > 0 ? triviaScore / totalScore : 0;

    if (ratio >= 0.9) {
        message = "🧠 BİR DAHİSİN! Muazzam bilgi birikimi!";
    } else if (ratio >= 0.7) {
        message = "Harika iş çıkardın! Çok bilgilisin. 📚";
    } else if (ratio >= 0.5) {
        message = "Ortalama üzeri, fena değil! 👏";
    } else {
        message = "Biraz daha genel kültür çalışmalısın. 📖";
    }

    container.innerHTML = `
        <div class="quiz-question">YARIŞMA BİTTİ!</div>
        <div style="font-size: 3rem; margin-bottom: 20px;">🏆</div>
        <div style="font-size: 1.5rem; margin-bottom: 20px;">Toplam Skor: ${triviaScore}</div>
        <div style="font-size: 1.2rem; opacity: 0.9;">${message}</div>
        <button class="game-back-btn" style="position: relative; top: 20px; left: 0;" onclick="window.initTriviaGame()">Tekrar Oyna</button>
    `;

    if (window.supabaseHelpers) {
        window.supabaseHelpers.saveGameScore('trivia', triviaScore, { result: message });
    }

    if (window.telegramNotifications && window.telegramNotifications.notifyGamePlayed) {
        window.telegramNotifications.notifyGamePlayed('trivia', `Skor: ${triviaScore} - ${message}`);
    }
}
