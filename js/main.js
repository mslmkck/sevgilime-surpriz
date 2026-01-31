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

    // ZORLA DURDUR (Oto-başlatmayı engelle)
    audio.pause();
    audio.currentTime = 0;

    // Global erişim
    window.siteAudio = audio;

    // Giriş Butonuna Tıklanınca
    if (enterBtn) {
        const startSite = () => {
            // Müzik Başlatma İPTAL (Kullanıcı seçince başlayacak)
            /* 
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Müzik başladı.");
                }).catch(error => {
                    console.error("Müzik başlatılamadı:", error);
                });
            }
            */

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

                // Müzik kontrolcüsünü henüz gösterme
                // const musicCont = document.getElementById('music-container');
                // if (musicCont) musicCont.classList.remove('hidden');

            }, 1000);
        };

        enterBtn.addEventListener('click', startSite);
        enterBtn.addEventListener('touchstart', (e) => {
            startSite();
        }, { passive: true });
    }

    // PROFİL SEÇİM MANTIĞI
    const profileScreen = document.getElementById('profile-selection-screen');
    const btnRabbit = document.getElementById('select-rabbit');
    const btnFox = document.getElementById('select-fox');

    async function selectProfile(profileType) {
        // Profili kaydet
        localStorage.setItem('userProfile', profileType);

        // Müzik Başlat + Bildirim
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => { console.log('Oto-oynatma engellendi, kullanıcı etkileşimi bekleniyor.'); });
        }

        // Müzik kontrolcüsünü göster
        const musicCont = document.getElementById('music-container');
        if (musicCont) musicCont.classList.remove('hidden');

        // Ufak Bilgi Mesajı (Toast)
        const toast = document.createElement('div');
        toast.innerText = "🎵 Müzik Başladı";
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = "rgba(0,0,0,0.7)";
        toast.style.color = "#fff";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "20px";
        toast.style.zIndex = "1000";
        toast.style.transition = "opacity 0.5s";
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 500);
        }, 3000);


        // Supabase'e kaydet
        if (window.supabaseHelpers) {
            await window.supabaseHelpers.saveUserProfile(profileType);
        }

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

    if (btnPoetry) btnPoetry.addEventListener('click', async () => {
        openRoom(sectionPoetry);
        if (window.supabaseHelpers) {
            // Şiirleri yükle
            const dbPoems = await window.supabaseHelpers.getPoems();
            if (dbPoems && dbPoems.length > 0) {
                poems = dbPoems;
            }
            renderFloatingPoems();
        }
    });

    if (btnMemory) btnMemory.addEventListener('click', async () => {
        openRoom(sectionMemory);
        // Anıları yükle
        if (window.supabaseHelpers) {
            const memories = await window.supabaseHelpers.getMemories();
            // Mevcut resimleri temizle veya güncelle
            // Her slotu tek tek kontrol et
            for (let i = 1; i <= 9; i++) {
                const imgElement = document.getElementById(`img-${i}`);
                if (!imgElement) continue;

                const foundMem = memories.find(m => m.slot_number === i);
                const slot = imgElement.parentElement;
                const placeholder = slot.querySelector('.empty-placeholder');

                if (foundMem) {
                    // Resim var
                    imgElement.src = foundMem.image_url;
                    // Cache sorunu olursa: foundMem.image_url + '?' + new Date().getTime();
                    imgElement.classList.remove('hidden');
                    if (placeholder) placeholder.style.display = 'none';
                } else {
                    // Resim yok - Varsayılanları koru (ilk 2 slot unsplash linkiydi, onları db yoksa bozmayalım)
                    // Ancak DB boşsa ve bu slotlar dinamikse gizlenmeli.
                    // Kodun orjinalinde slot 1 ve 2 statik src'ye sahipti HTML'de.
                    // Eğer veritabanında kayıt yoksa HTML'deki src kalır.

                    // Slot 3 ve sonrası için:
                    if (i > 2) {
                        imgElement.classList.add('hidden');
                        imgElement.src = "";
                        if (placeholder) placeholder.style.display = 'block';
                    }
                }
            }
        }
    });

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
        imageInput.addEventListener('change', async function (e) {
            if (this.files && this.files[0] && currentSlotId) {
                const file = this.files[0];
                const reader = new FileReader();

                // Önizleme göster
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
                reader.readAsDataURL(file);

                // Supabase'e yükle
                if (window.supabaseHelpers) {
                    // Upload start notification or spinner could go here
                    const publicUrl = await window.supabaseHelpers.uploadMemoryPhoto(currentSlotId, file);
                    if (publicUrl) {
                        console.log("Memory uploaded successfully:", publicUrl);
                    }
                }
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
    // Varsayılan Şiirler ve Supabase
    let poems = [];
    // İlk yüklemede varsayılan şiir (eğer veritabanı boşsa gösterilebilir veya direkt boş bırakılabilir)
    // Şimdilik boş başlatıyoruz, odaya girince dolacak.

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
        // Supabase 'content' döndürür, LocalStorage 'body'. İkisini de destekle.
        modalPoemBody.innerText = poem.content || poem.body || '';
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
    // Yeni Şiir Kaydet
    window.saveNewPoem = async () => {
        const titleInput = document.getElementById('new-poem-title');
        const bodyInput = document.getElementById('new-poem-body');

        if (!titleInput || !bodyInput) return;

        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();

        if (!title || !body) {
            alert("Lütfen başlık ve şiir içeriğini doldurun.");
            return;
        }

        // Supabase Kayıt
        if (window.supabaseHelpers) {
            try {
                const savedPoem = await window.supabaseHelpers.savePoem(title, body);
                if (savedPoem) {
                    poems.push(savedPoem); // savedPoem içinde 'content' var
                }
            } catch (err) {
                console.error("Şiir kaydedilemedi:", err);
                alert("Şiir kaydedilemedi.");
                return;
            }
        } else {
            // Fallback local
            const newPoem = {
                id: Date.now(),
                title: title,
                body: body,
                content: body // Tutarlılık için
            };
            poems.push(newPoem);
        }

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

    // Odaya girince şiirleri oluştur -> Artık 'btnPoetry' click listener'ında yukarıda yapıyoruz.
    // Burayı silebiliriz veya boş bırakabiliriz.
    // ======================================
    // 7. BULUŞMA ODASI MANTIĞI (CHAT ve ÇİFT KULLANICI)
    // ======================================
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const toggleUserBtn = document.getElementById('toggle-user-btn');

    // Mesajları Yükle
    let messages = [];

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

        // Emojileri tekrar kontrol et
        const currentMyProfile = localStorage.getItem('userProfile') || 'rabbit';
        const partnerProfile = currentMyProfile === 'rabbit' ? 'fox' : 'rabbit';
        const myEmoji = emojis[currentMyProfile];
        const partnerEmoji = emojis[partnerProfile];

        // Mesajları temizle
        chatMessages.innerHTML = `
            <div class="message system-message">
                Buluşma odasına hoş geldin... Şömine çok güzel yanıyor. 🔥
            </div>
        `;

        // Supabase'den gelen mesaj objesi yapısı: { sender: 'rabbit', message: '...', created_at: '...' }
        // Local yapı: { sender: 'user', text: '...', time: ... }
        // Adapter logic:

        messages.forEach(msg => {
            // Mesajın kimden geldiğini belirle
            // sender: 'rabbit' veya 'fox' olmalı.
            const senderProfile = msg.sender;

            // Benim profilim ne?
            const isSentByMe = (senderProfile === currentMyProfile);

            const div = document.createElement('div');
            div.classList.add('message');
            div.classList.add(isSentByMe ? 'sent' : 'received');

            // Emoji seçimi: Gönderen profiline göre
            // Eğer gönderen 'rabbit' ise rabbit emojisi, 'fox' ise fox emojisi. 
            // Kendim gönderdiysem myEmoji, karşı tarafsa partnerEmoji mantığı yerine direkt gonderen-bazlı emoji.
            const msgEmoji = emojis[senderProfile] || '👤';

            // Saat
            const date = new Date(msg.created_at || msg.time);
            const timeStr = isNaN(date.getTime()) ? '' : date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
            const textContent = msg.message || msg.text;

            if (isSentByMe) {
                div.innerHTML = `
                    <div class="msg-content">${textContent} <span class="emoji-icon" style="font-size:1.2rem; margin-left:5px;">${msgEmoji}</span></div>
                    <div class="msg-time" style="text-align: right; font-size: 0.7rem; opacity: 0.7; margin-top: 2px;">${timeStr}</div>
                `;
            } else {
                div.innerHTML = `
                    <div class="msg-content"><span class="emoji-icon" style="font-size:1.2rem; margin-right:5px;">${msgEmoji}</span> ${textContent}</div>
                    <div class="msg-time" style="text-align: left; font-size: 0.7rem; opacity: 0.7; margin-top: 2px;">${timeStr}</div>
                `;
            }
            chatMessages.appendChild(div);
        });

        // En alta kaydır
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Mesaj Gönder
    // Mesaj Gönder
    async function sendMessage() {
        if (!chatInput) return;

        const text = chatInput.value.trim();
        if (!text) return;

        const currentProfile = localStorage.getItem('userProfile') || 'rabbit';

        // 1. Önce EKRAANDA GÖSTER (Optimistic Update) - Beklemeden!
        const optimisticMsg = {
            sender: currentProfile,
            message: text,
            created_at: new Date().toISOString(),
            is_optimistic: true // Henüz gitmedi
        };
        messages.push(optimisticMsg);
        renderMessages();

        // Input'u hemen temizle
        chatInput.value = '';

        // 2. Sonra Supabase'e gönder
        if (window.supabaseHelpers) {
            try {
                await window.supabaseHelpers.saveChatMessage(text);
                // Başarılı olduğunda bir şey yapmaya gerek yok, realtime veya refresh ile düzelir.
                // Optimistic mesajı gerçek mesajla değiştirebiliriz ama şimdilik kalsın.
            } catch (err) {
                console.error("Mesaj gönderilemedi:", err);
                alert("Mesaj gönderilemedi, internet bağlantını kontrol et.");
            }
        } else {
            console.warn("Supabase yüklü değil, mesaj sadece yerel olarak eklendi.");
        }

        // 3. Telegram bildirimi
        if (window.telegramNotifications) {
            window.telegramNotifications.notifyChatMessage(currentProfile, text);
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Odaya girince mesajları yükle ve abone ol
    let isSubscribed = false;

    if (btnMeeting) {
        btnMeeting.addEventListener('click', async () => {
            // Mesajları çek
            if (window.supabaseHelpers) {
                const msgs = await window.supabaseHelpers.getChatMessages();
                if (msgs) messages = msgs;

                // Abonelik başlat
                if (!isSubscribed) {
                    window.supabaseHelpers.subscribeToChatMessages((newMsg) => {
                        messages.push(newMsg);
                        renderMessages();
                    });
                    isSubscribed = true;
                }
            }

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
