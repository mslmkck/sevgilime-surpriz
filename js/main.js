// Main JavaScript - Cleaned for Step-by-Step Build

document.addEventListener('DOMContentLoaded', () => {
    // 1. AOS Init (Scroll Animations) - Gelecek adımlar için hazır dursun
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    const loginScreen = document.getElementById('login-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainContent = document.getElementById('main-content');

    // MÜZİK AYARLARI (Native Audio)
    // Şarkımızı tanımlayalım (Otomatik çalma politikaları gereği tıklama ile başlatacağız)
    const audio = new Audio('assets/music/track1.mp3');
    audio.loop = true;
    audio.volume = 0.5;

    // Global erişim
    window.siteAudio = audio;

    // Giriş Butonuna Tıklanınca
    if (enterBtn) {
        const startSite = () => {
            // Müzik Başlat
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Müzik başladı.");
                }).catch(error => {
                    console.error("Müzik başlatılamadı:", error);
                });
            }

            // Ekran Geçişi: Login -> Profil Seçimi
            loginScreen.style.opacity = '0';
            enterBtn.disabled = true;

            setTimeout(() => {
                loginScreen.style.display = 'none';

                // Profil Seçim Ekranını Göster
                const profileScreen = document.getElementById('profile-selection-screen');
                if (profileScreen) {
                    profileScreen.classList.remove('hidden');
                }

                // Müzik kontrolcüsünü de göster (Müzik başladı çünkü)
                const musicCont = document.getElementById('music-container');
                if (musicCont) musicCont.classList.remove('hidden');

            }, 1000);
        };

        enterBtn.addEventListener('click', startSite);
        enterBtn.addEventListener('touchstart', (e) => {
            if (audio.paused) startSite();
        }, { passive: true });
    }

    // PROFİL SEÇİM MANTIĞI
    const profileScreen = document.getElementById('profile-selection-screen');
    const btnRabbit = document.getElementById('select-rabbit');
    const btnFox = document.getElementById('select-fox');

    function selectProfile(profileType) {
        // Profili kaydet (İleride kullanılabilir)
        localStorage.setItem('userProfile', profileType);

        // Telegram bildirimi gönder
        if (window.telegramNotifications) {
            window.telegramNotifications.notifyProfileSelection(profileType);
        }

        // Profil ekranını gizle
        if (profileScreen) profileScreen.style.display = 'none';

        // Ana içeriği göster
        if (mainContent) {
            mainContent.classList.remove('hidden');
            AOS.refresh();
        }
    }

    if (btnRabbit) btnRabbit.addEventListener('click', () => selectProfile('rabbit'));
    if (btnFox) btnFox.addEventListener('click', () => selectProfile('fox'));

    // ODA GEÇİŞLERİ
    const roomSelection = document.getElementById('room-selection');
    const btnPoetry = document.getElementById('btn-poetry');
    const btnMemory = document.getElementById('btn-memory');
    const sectionPoetry = document.getElementById('poetry-room');
    const sectionMemory = document.getElementById('memory-room');
    const btnMeeting = document.getElementById('btn-meeting');
    const sectionMeeting = document.getElementById('meeting-room');

    window.openRoom = function (roomSection) {
        if (!roomSelection || !roomSection) return;

        // Hallway'i gizle
        roomSelection.classList.add('hidden');

        // İlgili odayı göster
        roomSection.classList.remove('hidden');

        // Scroll başa al
        window.scrollTo(0, 0);

        // Telegram bildirimi
        if (window.telegramNotifications) {
            let roomName = 'unknown';
            if (roomSection === sectionPoetry) roomName = 'poetry';
            else if (roomSection === sectionMemory) roomName = 'memory';
            else if (roomSection === sectionMeeting) roomName = 'meeting';
            else if (roomSection.id === 'game-room') roomName = 'game';

            window.telegramNotifications.notifyRoomEntered(roomName);
        }
    };

    // Global fonksiyon (HTML'den çağrılabilmesi için window'a atıyoruz)
    window.goBackToHall = () => {
        // Tüm oda içeriklerini gizle
        sectionPoetry.classList.add('hidden');
        sectionMemory.classList.add('hidden');
        if (sectionMeeting) sectionMeeting.classList.add('hidden');

        // Oyun Odası varsa onu da gizle
        const gameRoom = document.getElementById('game-room');
        if (gameRoom) {
            gameRoom.classList.add('hidden');
            // Oyun menüsünü göster, oyunları gizle
            const gamesMenu = document.querySelector('.games-menu');
            if (gamesMenu) gamesMenu.classList.remove('hidden');
            const wheelGame = document.getElementById('wheel-game-container');
            const wordsGame = document.getElementById('words-game-container');
            if (wheelGame) wheelGame.classList.add('hidden');
            if (wordsGame) wordsGame.classList.add('hidden');
        }

        // Seçim ekranını geri getir
        roomSelection.classList.remove('hidden');
    };

    if (btnPoetry) btnPoetry.addEventListener('click', () => openRoom(sectionPoetry));
    if (btnMemory) btnMemory.addEventListener('click', () => openRoom(sectionMemory));
    if (btnMeeting) btnMeeting.addEventListener('click', () => openRoom(sectionMeeting));

    // RESİM YÜKLEME MANTIĞI
    const imageInput = document.getElementById('image-upload');
    let currentSlotId = null;

    // HTML'den çağrılacak fonksiyon (window'a ata)
    window.triggerUpload = (slotId) => {
        currentSlotId = slotId;
        if (imageInput) imageInput.click();
    };

    if (imageInput) {
        imageInput.addEventListener('change', function (e) {
            if (this.files && this.files[0] && currentSlotId) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    const imgElement = document.getElementById(`img-${currentSlotId}`);
                    const slot = imgElement.parentElement;
                    const placeholder = slot.querySelector('.empty-placeholder');

                    if (imgElement) {
                        imgElement.src = e.target.result;
                        imgElement.classList.remove('hidden');
                    }

                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                }

                reader.readAsDataURL(this.files[0]);
            }
            // Aynı dosyayı tekrar seçebilmek için input'u sıfırla
            this.value = '';
        });
    }

    // ======================================
    // 5. MÜZİK OYNATICI MANTIĞI
    // ======================================
    const musicContainer = document.getElementById('music-container');
    const musicPanel = document.getElementById('music-panel');
    const musicBtn = document.getElementById('music-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const playlistItems = document.querySelectorAll('#playlist li');

    let isPlaying = false;
    let currentTrackIndex = 0;

    // Panel Aç/Kapa
    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            if (musicPanel.classList.contains('hidden')) {
                musicPanel.classList.remove('hidden');
            } else {
                musicPanel.classList.add('hidden');
            }
        });
    }

    // Şarkı Çal
    function playTrack(index) {
        // Liste sınırları kontrolü
        if (index < 0) index = playlistItems.length - 1;
        if (index >= playlistItems.length) index = 0;

        currentTrackIndex = index;
        const newSrc = playlistItems[currentTrackIndex].getAttribute('data-src');

        // UI Güncelle (Active class)
        playlistItems.forEach(item => item.classList.remove('active'));
        playlistItems[currentTrackIndex].classList.add('active');

        // Audio kaynağını zorla güncelle ve yükle (Sorunsuz geçiş için)
        audio.src = newSrc;
        audio.load();

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updatePlayIcon();
                console.log("Şarkı çalıyor:", newSrc);
            }).catch(err => {
                console.error("Çalma hatası:", err);
                // Otomatik geçiş hatası olursa (örneğin kullanıcı etkileşimi yoksa)
            });
        }
    }

    // Toggle Play/Pause
    function togglePlay() {
        if (audio.paused) {
            audio.play();
            isPlaying = true;
        } else {
            audio.pause();
            isPlaying = false;
        }
        updatePlayIcon();
    }

    function updatePlayIcon() {
        if (playPauseBtn) {
            playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        }
    }

    // Event Listeners
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);

    if (prevBtn) prevBtn.addEventListener('click', () => {
        playTrack(currentTrackIndex - 1);
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        playTrack(currentTrackIndex + 1);
    });

    // Liste elemanlarına tıklama
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            playTrack(index);
        });
    });

    // Ses Kontrolü
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value;
        });
    }

    // Müzik bittiğinde sıradakine geç
    audio.addEventListener('ended', () => {
        playTrack(currentTrackIndex + 1);
    });

    // Initial State: İlk şarkıyı active yap (çalmadan)
    if (playlistItems.length > 0) {
        playlistItems[0].classList.add('active');
    }

    // Uygulama başladığında müzik kutusunu göster
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            setTimeout(() => {
                if (musicContainer) musicContainer.classList.remove('hidden');
            }, 1000);
        });
    }

    // ======================================
    // 6. ŞİİR ODASI MANTIĞI (FLOATING POEMS)
    // ======================================
    const floatingArea = document.getElementById('floating-area');
    const poemModal = document.getElementById('poem-modal');
    const modalPoemTitle = document.getElementById('modal-poem-title');
    const modalPoemBody = document.getElementById('modal-poem-body');
    const newPoemForm = document.getElementById('new-poem-form');

    // Varsayılan Şiirler ve LocalStorage
    let poems = JSON.parse(localStorage.getItem('myPoems')) || [
        {
            id: 1,
            title: "Çalıkuşu...",
            body: `Feride,
Kendini engellere, duvarlara hapsettin. Sanıyorsun ki bu yangın sönecek...
Yanılıyorsun Feride.
Bana 'Tenlerimiz buluşmazsa ne işe yarar sevmek?' diye sorduğun o geceyi hatırla.
Şu an çaldığın o kapılar, kaçtığın o yollar... Hepsi yine bana çıkacak.
Seni Seviyorum.`
        }
    ];

    // Şiirleri Uçuşur Hale Getir
    function renderFloatingPoems() {
        if (!floatingArea) return;
        floatingArea.innerHTML = '';

        poems.forEach(poem => {
            const el = document.createElement('div');
            el.classList.add('floating-poem');
            el.innerText = poem.title;

            // Rastgele Konum (Sayfa sınırları içinde kalsın)
            // %10 ile %80 arası güvenli bölge
            const randomTop = Math.floor(Math.random() * 70) + 10;
            const randomLeft = Math.floor(Math.random() * 70) + 10;
            const randomDelay = Math.random() * 5;

            el.style.top = `${randomTop}%`;
            el.style.left = `${randomLeft}%`;
            el.style.animationDelay = `${randomDelay}s`;
            el.style.animationDuration = `${15 + Math.random() * 10}s`; // 15-25sn arası sürsün

            // Tıklayınca Aç
            el.addEventListener('click', (e) => {
                e.stopPropagation(); // Arka plana tıklamayı engelle
                openPoemModal(poem);
            });

            floatingArea.appendChild(el);
        });
    }

    // Modal Açma/Kapama
    function openPoemModal(poem) {
        modalPoemTitle.innerText = poem.title;
        modalPoemBody.innerText = poem.body;
        poemModal.classList.remove('hidden');
    }

    window.closePoemModal = () => {
        poemModal.classList.add('hidden');
    }

    // Yeni Şiir Formunu Göster
    window.toggleAddPoemForm = () => {
        if (newPoemForm) newPoemForm.classList.toggle('hidden');
    }

    // Yeni Şiir Kaydet
    window.saveNewPoem = () => {
        const titleInput = document.getElementById('new-poem-title');
        const bodyInput = document.getElementById('new-poem-body');

        if (!titleInput || !bodyInput) return;

        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();

        if (!title || !body) {
            alert("Lütfen başlık ve şiir içeriğini doldurun.");
            return;
        }

        const newPoem = {
            id: Date.now(),
            title: title,
            body: body
        };

        poems.push(newPoem);
        localStorage.setItem('myPoems', JSON.stringify(poems)); // Kalıcı yap

        // Telegram bildirimi
        if (window.telegramNotifications) {
            window.telegramNotifications.notifyPoemCreated(title, body);
        }

        renderFloatingPoems(); // Listeyi güncelle
        toggleAddPoemForm(); // Formu kapat

        // Inputları temizle
        titleInput.value = '';
        bodyInput.value = '';
    }

    // Odaya girince şiirleri oluştur (Eğer daha önce oluşturulmadıysa)
    if (btnPoetry) {
        btnPoetry.addEventListener('click', () => {
            renderFloatingPoems();
        });
    }
    // ======================================
    // 7. BULUŞMA ODASI MANTIĞI (CHAT ve ÇİFT KULLANICI)
    // ======================================
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const toggleUserBtn = document.getElementById('toggle-user-btn');

    // Mesajları Yükle
    let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];

    // Varsayılan Kullanıcı: 'user' (Sen)
    // Artık sabit, çünkü gerçek bir uygulama gibi sadece sen olabilirsin.
    const currentUser = 'user';

    // Profiller (Varsayılan)
    let myProfile = localStorage.getItem('userProfile') || 'rabbit';
    let partnerProfile = myProfile === 'rabbit' ? 'fox' : 'rabbit';

    // Emojiler
    const emojis = {
        'rabbit': '🐰',
        'fox': '🦊',
        'user': '👤' // Fallback
    };

    // Mesajları Ekrana Bas
    function renderMessages() {
        if (!chatMessages) return;

        // Emojileri tekrar kontrol et (Profil değişmiş olabilir)
        const currentMyProfile = localStorage.getItem('userProfile') || 'rabbit';
        const currentPartnerProfile = currentMyProfile === 'rabbit' ? 'fox' : 'rabbit';
        const myEmoji = emojis[currentMyProfile];
        const partnerEmoji = emojis[currentPartnerProfile];

        chatMessages.innerHTML = `
            <div class="message system-message">
                Buluşma odasına hoş geldin... Şömine çok güzel yanıyor. 🔥
            </div>
        `;

        messages.forEach(msg => {
            const div = document.createElement('div');
            div.classList.add('message');
            const isUser = msg.sender === 'user';

            div.classList.add(isUser ? 'sent' : 'received');

            // Emoji Ekle
            const emoji = isUser ? myEmoji : partnerEmoji;

            // Saat Biçimi (HH:MM)
            const date = new Date(msg.time);
            const timeStr = isNaN(date.getTime()) ? '' : date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');

            // Mesaj İçeriği + Saat
            if (isUser) {
                div.innerHTML = `
                    <div class="msg-content">${msg.text} <span class="emoji-icon" style="font-size:1.2rem; margin-left:5px;">${emoji}</span></div>
                    <div class="msg-time" style="text-align: right; font-size: 0.7rem; opacity: 0.7; margin-top: 2px;">${timeStr} ${timeStr ? '<i class="fas fa-check-double"></i>' : ''}</div>
                `;
            } else {
                div.innerHTML = `
                    <div class="msg-content"><span class="emoji-icon" style="font-size:1.2rem; margin-right:5px;">${emoji}</span> ${msg.text}</div>
                    <div class="msg-time" style="text-align: left; font-size: 0.7rem; opacity: 0.7; margin-top: 2px;">${timeStr}</div>
                `;
            }

            chatMessages.appendChild(div);
        });

        // En alta kaydır
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Mesaj Gönder
    function sendMessage() {
        if (!chatInput) return;

        const text = chatInput.value.trim();
        if (!text) return;

        // O anki currentUser kimse onun adıyla kaydet
        const newMsg = { sender: currentUser, text: text, time: Date.now() };
        messages.push(newMsg);

        // LocalStorage Kayıt
        localStorage.setItem('chatMessages', JSON.stringify(messages));

        // Telegram bildirimi
        if (window.telegramNotifications) {
            window.telegramNotifications.notifyChatMessage(currentUser, text);
        }

        // UI Güncelle
        renderMessages();
        chatInput.value = '';
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Odaya girince mesajları yükle
    if (btnMeeting) {
        btnMeeting.addEventListener('click', () => {
            // Hafif gecikme ile yükle ki display:none kalkınca scroll hesaplanabilsin
            setTimeout(renderMessages, 100);
        });
    }

});

// =============================================
// GÖRÜŞ VE ÖNERİ SİSTEMİ - GLOBAL FONKSİYON
// =============================================

window.sendFeedback = function () {
    const textarea = document.getElementById('feedback-message');
    const statusDiv = document.getElementById('feedback-status');
    const sendBtn = document.getElementById('send-feedback-btn');

    if (!textarea || !statusDiv) return;

    const message = textarea.value.trim();

    // Validasyon
    if (!message) {
        statusDiv.className = 'feedback-status error';
        statusDiv.textContent = '❌ Lütfen bir mesaj yazın!';
        statusDiv.classList.remove('hidden');

        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 3000);
        return;
    }

    if (message.length < 5) {
        statusDiv.className = 'feedback-status error';
        statusDiv.textContent = '❌ Mesaj en az 5 karakter olmalı!';
        statusDiv.classList.remove('hidden');

        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 3000);
        return;
    }

    // Gönderiliyor durumu
    statusDiv.className = 'feedback-status sending';
    statusDiv.textContent = '📤 Gönderiliyor...';
    statusDiv.classList.remove('hidden');
    sendBtn.disabled = true;

    // Telegram bildirimi gönder
    const timestamp = new Date().toLocaleString('tr-TR');
    const telegramMessage = `
<b>💌 Yeni Görüş/Öneri</b>

<i>"${message}"</i>

🕐 ${timestamp}
    `.trim();

    // Telegram config'i localStorage'dan al
    const botToken = localStorage.getItem('telegram_bot_token') || 'YOUR_BOT_TOKEN';
    const chatId = localStorage.getItem('telegram_chat_id') || 'YOUR_CHAT_ID';

    // Config kontrolü
    if (botToken === 'YOUR_BOT_TOKEN' || chatId === 'YOUR_CHAT_ID') {
        statusDiv.className = 'feedback-status error';
        statusDiv.textContent = '⚠️ Telegram yapılandırması eksik! telegram-panel.html\'i kullan.';
        statusDiv.classList.remove('hidden');
        sendBtn.disabled = false;
        setTimeout(() => statusDiv.classList.add('hidden'), 5000);
        return;
    }

    // Telegram'a gönder
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'HTML'
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                statusDiv.className = 'feedback-status success';
                statusDiv.textContent = '✅ Mesajın gönderildi! Teşekkürler 💕';
                textarea.value = '';

                // LocalStorage'a da kaydet
                const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
                feedbacks.push({
                    message: message,
                    timestamp: Date.now()
                });
                localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

                setTimeout(() => {
                    statusDiv.classList.add('hidden');
                }, 5000);
            } else {
                throw new Error('Telegram API error');
            }
        })
        .catch(error => {
            console.error('Feedback error:', error);
            statusDiv.className = 'feedback-status error';
            statusDiv.textContent = '❌ Gönderilirken hata oluştu. Lütfen tekrar dene.';

            setTimeout(() => {
                statusDiv.classList.add('hidden');
            }, 5000);
        })
        .finally(() => {
            sendBtn.disabled = false;
        });
};
