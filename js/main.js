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
    const savedProfile = localStorage.getItem('userProfile');

    // Hızlı Başlangıç (Eğer daha önce girildiyse)
    if (savedProfile) {
        // Login'i atla
        loginScreen.style.display = 'none';

        // Profil seçimini atla
        const profileScreen = document.getElementById('profile-selection-screen');
        if (profileScreen) profileScreen.style.display = 'none';

        // Ana içeriği (Hol) aç
        if (mainContent) {
            mainContent.classList.remove('hidden');
            // AOS'u güncellemek gerekebilir
            setTimeout(() => AOS.refresh(), 500);
        }

        // Müzik kontrolcüsünü göster
        const musicCont = document.getElementById('music-container');
        if (musicCont) musicCont.classList.remove('hidden');
    }

    if (enterBtn) {
        const startSite = () => {
            // Müzik Başlatma İPTAL (Kullanıcı seçince başlayacak)

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

        // Müzik kontrolcüsünü göster (Kullanıcı isterse buradan başlatır)
        const musicCont = document.getElementById('music-container');
        if (musicCont) musicCont.classList.remove('hidden');

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

            // Kayıtlı oda var mı kontrol et
            const savedRoomId = localStorage.getItem('activeRoomId');
            if (savedRoomId) {
                const savedRoom = document.getElementById(savedRoomId);
                if (savedRoom) {
                    // Odayı aç ama buton click simüle etmek daha iyi çünkü fetch logicleri orada
                    if (savedRoomId === 'poetry-room' && btnPoetry) btnPoetry.click();
                    else if (savedRoomId === 'memory-room' && btnMemory) btnMemory.click();
                    else if (savedRoomId === 'meeting-room' && btnMeeting) btnMeeting.click();
                    else if (savedRoomId === 'working-room' && btnWorking) btnWorking.click();
                    else if (savedRoomId === 'private-room' && btnPrivate) btnPrivate.click();
                    else if (savedRoomId === 'game-room') {
                        // Oyun odası butonu main.js içinde tanımlı olmayabilir ama ona ulaşalım
                        const btnGame = document.getElementById('btn-game');
                        if (btnGame) btnGame.click();
                    }
                }
            }
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
    const btnWorking = document.getElementById('btn-working'); // YENİ
    const workingRoom = document.getElementById('working-room'); // YENİ
    const btnPrivate = document.getElementById('btn-private'); // ÖZEL ODA
    const privateRoom = document.getElementById('private-room'); // ÖZEL ODA

    window.openRoom = function (roomSection) {
        if (!roomSelection || !roomSection) return;

        // Hallway'i gizle
        roomSelection.classList.add('hidden');

        // İlgili odayı göster
        roomSection.classList.remove('hidden');

        // Scroll başa al
        window.scrollTo(0, 0);

        // Odayı kaydet (Persistence)
        localStorage.setItem('activeRoomId', roomSection.id);

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
        sectionMemory.classList.add('hidden');
        if (sectionMeeting) sectionMeeting.classList.add('hidden');
        if (workingRoom) workingRoom.classList.add('hidden'); // YENİ
        if (privateRoom) privateRoom.classList.add('hidden'); // ÖZEL ODA

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

        // Aktif odayı temizle
        localStorage.removeItem('activeRoomId');
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
        renderMemories();
    });

    if (btnMeeting) btnMeeting.addEventListener('click', () => openRoom(sectionMeeting));

    if (btnWorking) { // YENİ
        btnWorking.addEventListener('click', () => {
            openRoom(workingRoom);
        });
    }

    if (btnPrivate) { // ÖZEL ODA
        btnPrivate.addEventListener('click', () => {
            const password = prompt("Bu odaya girmek için şifreyi söyle:");
            if (password === 'yasak') {
                openRoom(privateRoom);
            } else {
                alert("Yanlış şifre! Giremezsin. 🚫");
            }
        });
    }

    // ======================================
    // 4.1 ANI ODASI: RENDER & LIGHTBOX
    // ======================================

    let currentMemories = [];
    let lightboxIndex = 0; // Şu an lightbox'ta hangi slot açık (1-9)

    async function renderMemories() {
        if (!window.supabaseHelpers) return;

        // 1. Temizle
        for (let i = 1; i <= 9; i++) {
            const slot = document.getElementById(`slot-${i}`);
            const img = document.getElementById(`img-${i}`);
            // Reset state
            if (img) img.classList.add('hidden');
            if (slot) {
                const ph = slot.querySelector('.empty-placeholder');
                if (ph) ph.style.display = 'flex';
                // Tıklama eventlerini temizle (cloneNode ile hack) veya direkt ata
                slot.onclick = null;
            }
        }

        // 2. Yükle
        currentMemories = await window.supabaseHelpers.getMemories();
        console.log(`Anılar yüklendi: ${currentMemories.length} adet.`);

        // 3. Yerleştir
        currentMemories.forEach(mem => {
            const i = mem.slot_number;
            if (i < 1 || i > 9) return;

            const slot = document.getElementById(`slot-${i}`);
            const img = document.getElementById(`img-${i}`);

            if (img && slot) {
                img.src = mem.image_url + '?t=' + new Date().getTime(); // Cache-bust
                img.classList.remove('hidden');

                const ph = slot.querySelector('.empty-placeholder');
                if (ph) ph.style.display = 'none';

                // Tıklayınca Lightbox Aç
                slot.onclick = () => openLightbox(i);
            }
        });

        // Boş slotlara tıklanınca bir şey yapmasın (veya kullanıcı isterse oraya da ekleme açılabilir)
        // Kullanıcı "Büyütüp bakmak istediğimde yeni resim ekleme açılıyor" dediği için
        // SADECE dolu olanlara lightbox atadık. Boş olanlar tepkisiz kalsın veya "Ekle" butonuna yönlendirsin.
    }

    // ======================================
    // 4.2 LIGHTBOX MANTIĞI
    // ======================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');

    window.openLightbox = (slotNumber) => {
        const mem = currentMemories.find(m => m.slot_number === slotNumber);
        if (!mem) return; // Resim yoksa açma

        lightboxIndex = slotNumber;
        lightboxImg.src = mem.image_url; // Cache-bust olmadan net resim
        lightboxModal.classList.remove('hidden');
    };

    window.closeLightbox = (e) => {
        // Sadece backgrounda veya çarpıya tıklayınca kapat
        if (e.target.id === 'lightbox-modal' || e.target.closest('.lightbox-close')) {
            lightboxModal.classList.add('hidden');
            lightboxImg.src = '';
        }
    };

    window.changeLightboxImage = (dir, e) => {
        if (e) e.stopPropagation();

        // 1 ile 9 arasında gezin, ama BOŞ slotları atla.
        // Basit yöntem: sıradaki dolu slotu bulana kadar dön.

        let nextIndex = lightboxIndex;
        let found = false;
        let attempts = 0;

        while (!found && attempts < 9) {
            nextIndex += dir;
            if (nextIndex > 9) nextIndex = 1;
            if (nextIndex < 1) nextIndex = 9;

            const mem = currentMemories.find(m => m.slot_number === nextIndex);
            if (mem) {
                found = true;
                lightboxIndex = nextIndex;
                lightboxImg.style.display = 'none';
                setTimeout(() => {
                    lightboxImg.src = mem.image_url;
                    lightboxImg.style.display = 'block';
                }, 50); // Ufak bir blink efekti
            }
            attempts++;
        }
    };


    // ======================================
    // 4.3 YENİ ANI EKLEME (FAB)
    // ======================================
    const imageInput = document.getElementById('image-upload');
    let targetUploadSlot = null;

    window.openAddMemoryMenu = () => {
        // Basit bir prompt ile hangi kutuya ekleneceğini soralım
        // Veya daha şık: İlk boş kutuyu bulsun?
        // Kullanıcı "Hangi kutu" seçmek isteyebilir.

        // Basit Yöntem: Prompt
        const choice = prompt("Hangi çerçeveye fotoğraf koymak istersin? (1-9 arası bir sayı gir)");
        if (!choice) return;

        const slotNum = parseInt(choice);
        if (isNaN(slotNum) || slotNum < 1 || slotNum > 9) {
            alert("Lütfen 1 ile 9 arasında bir sayı gir.");
            return;
        }

        // Slot dolu mu kontrol et
        const existing = currentMemories.find(m => m.slot_number === slotNum);
        if (existing) {
            if (!confirm(`Slot ${slotNum} zaten dolu. Üzerine kaydetmek ister misin?`)) {
                return;
            }
        }

        // Upload Tetikle
        targetUploadSlot = slotNum;
        if (imageInput) imageInput.click();
    };

    if (imageInput) {
        imageInput.addEventListener('change', async function (e) {
            if (this.files && this.files[0] && targetUploadSlot) {
                const file = this.files[0];

                // Supabase Yükle
                if (window.supabaseHelpers) {
                    await window.supabaseHelpers.uploadMemoryPhoto(targetUploadSlot, file);
                    // Upload fonksiyonu kendi içinde reload yapıyor (biz eklemiştik previous stepte)
                    // Ama yapmıyorsa renderMemories() çağırmak lazım.
                    // Bizim kodda location.reload() var, o yüzden burası durur.
                }
            }
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
    // Şiirleri Uçuşur Hale Getir
    function renderFloatingPoems() {
        if (!floatingArea) return;
        floatingArea.innerHTML = '';

        if (poems.length === 0) {
            floatingArea.innerHTML = '<p style="color: white; font-style: italic; opacity: 0.7;">Henüz hiç şiir eklenmemiş...</p>';
            return;
        }

        poems.forEach((poem, index) => {
            const el = document.createElement('div');
            el.classList.add('floating-poem');
            el.innerText = poem.title;

            // Animasyon: Giriş animasyonu (Fade In & Slide Up)
            // Sadece ilk yüklemede sırayla gelsinler
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100); // Her kart arasında 100ms gecikme

            // Tıklayınca Aç
            el.addEventListener('click', (e) => {
                e.preventDefault(); // Varsayılan davranışı engelle
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

    let lastRenderedMessageId = null; // En son ekrana basılan mesajın ID'si
    let isInitialLoad = true; // İlk yükleme kontrolü

    // Tek bir mesajı ekrana basan yardımcı fonksiyon
    function appendSingleMessage(msg, container, isMyProfile, currentMyProfile, animate = false) {
        const div = document.createElement('div');
        div.classList.add('message');
        div.classList.add(isMyProfile ? 'sent' : 'received');
        if (animate) div.classList.add('animate-message'); // Sadece yeni mesajlarda animasyon

        div.dataset.id = msg.id || 'temp'; // Tekrarları önlemek için ID kullanımı

        const msgEmoji = emojis[msg.sender] || '👤';

        const date = new Date(msg.created_at || msg.time);
        const timeStr = isNaN(date.getTime()) ? '' : date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
        const textContent = msg.message || msg.text;

        if (isMyProfile) {
            div.innerHTML = `
                <div class="msg-content">${textContent} <span class="emoji-icon" style="font-size:1.2rem; margin-left:5px;">${msgEmoji}</span></div>
                <div class="msg-time">${timeStr}</div>
            `;
        } else {
            div.innerHTML = `
                <div class="msg-content"><span class="emoji-icon" style="font-size:1.2rem; margin-right:5px;">${msgEmoji}</span> ${textContent}</div>
                <div class="msg-time">${timeStr}</div>
            `;
        }

        container.appendChild(div);
    }

    // Mesajları Ekrana Bas (Akıllı Rendering)
    function renderMessages(isFullRebuild = false) {
        if (!chatMessages) return;

        const currentMyProfile = localStorage.getItem('userProfile') || 'rabbit';

        // Eğer tam yeniden oluşturma isteniyorsa veya hiç mesaj yoksa sıfırla
        if (isFullRebuild || chatMessages.children.length <= 1) { // 1 because system message might be there
            chatMessages.innerHTML = `
                <div class="message system-message">
                    Buluşma odasına hoş geldin... Şömine çok güzel yanıyor. 🔥
                </div>
            `;
            // Sıfırladığımız için tüm listeyi baştan sona ekle
            // Sıfırladığımız için tüm listeyi baştan sona ekle
            messages.forEach(msg => {
                appendSingleMessage(msg, chatMessages, msg.sender === currentMyProfile, currentMyProfile, false); // initial -> no animation
            });

            // İlk kez yükleniyorsa
            if (isInitialLoad) {
                // Kaydedilmiş pozisyon var mı?
                const savedScroll = localStorage.getItem('chat_scroll_pos');

                // Animasyonsuz kaydırma için style ayarı
                chatMessages.style.scrollBehavior = 'auto';

                if (savedScroll && parseInt(savedScroll) > 0) {
                    chatMessages.scrollTop = parseInt(savedScroll);
                } else {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }

                // Hemen ardından smooth'a geri dön (Yeni mesajlar için)
                setTimeout(() => {
                    chatMessages.style.scrollBehavior = 'smooth';
                }, 100);

                isInitialLoad = false;
            } else {
                // Rebuild ama ilk load değilse
                if (shouldScrollToBottom) {
                    chatMessages.style.scrollBehavior = 'auto';
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    setTimeout(() => { chatMessages.style.scrollBehavior = 'smooth'; }, 100);
                }
            }

        } else {
            // Sadece YENİ mesajları ekle (Incremental Update)
            // Mevcut DOM'daki son mesajın ID'sini veya indexini kontrol etmeye gerek yok, 
            // messages array'inin sonundakileri ekleyeceğiz.
            // Basitlik için: messages array'indeki son elemanı alıp ekleyelim.
            // Ancak birden fazla yeni gelmiş olabilir.

            // Burada basit bir diff yapalım:
            // DOM'da zaten var olan ID'leri atla.

            // Mevcut DOM ID'lerini topla
            const existingIds = new Set();
            document.querySelectorAll('.message[data-id]').forEach(el => existingIds.add(el.dataset.id));

            messages.forEach(msg => {
                if (!existingIds.has(msg.id) && !existingIds.has(msg.id?.toString())) {
                    appendSingleMessage(msg, chatMessages, msg.sender === currentMyProfile, currentMyProfile, true); // update -> animate
                }
            });

            // Kaydırma mantığı
            if (shouldScrollToBottom) {
                // Smooth scroll ile en alta
                chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
            }
        }
    }

    // Scroll pozisyonunu hatırla
    let shouldScrollToBottom = true; // Varsayılan: En altta başla

    if (chatMessages) {
        chatMessages.addEventListener('scroll', () => {
            const threshold = 50; // Alttan 50px tolerans
            const position = chatMessages.scrollTop + chatMessages.offsetHeight;
            const height = chatMessages.scrollHeight;

            // Eğer kullanıcı yukarı çıktıysa, otomatik kaydırmayı kapat
            if (height - position > threshold) {
                shouldScrollToBottom = false;
            } else {
                shouldScrollToBottom = true;
            }
            // Pozisyonu kaydet
            localStorage.setItem('chat_scroll_pos', chatMessages.scrollTop);
        });
    }

    // Mesaj Gönder
    // Mesaj Gönder
    // Mesaj Gönder
    async function sendMessage() {
        if (!chatInput) return;

        const text = chatInput.value.trim();
        if (!text) return;

        const currentProfile = localStorage.getItem('userProfile') || 'rabbit';

        // 1. Önce EKRAANDA GÖSTER (Optimistic Update)
        // Geçici bir ID veriyoruz ki bunu subscription'da tanıyabilelim
        const tempId = 'opt_' + Date.now();

        const optimisticMsg = {
            id: tempId,
            sender: currentProfile,
            message: text,
            created_at: new Date().toISOString(),
            is_optimistic: true
        };

        messages.push(optimisticMsg);
        shouldScrollToBottom = true; // Biz yazdığımızda kesinlikle aşağı in
        renderMessages();

        // Input'u hemen temizle
        chatInput.value = '';

        // 2. Sonra Supabase'e gönder
        if (window.supabaseHelpers) {
            try {
                // Return data'yı alalım ama listeyi tamamen yenilemeyelim,
                // Subscription gelince oradan düzelir.
                await window.supabaseHelpers.saveChatMessage(text);

                // Başarılı :)
            } catch (err) {
                console.error("Mesaj gönderilemedi:", err);

                // Hata durumunda mesajı görsel olarak uyarılı hale getirebiliriz
                // Şimdilik basitçe alert
                alert("Mesaj gönderilemedi, internet bağlantını kontrol et.");

                // Optimistic mesajı kaldır
                messages = messages.filter(m => m.id !== tempId);
                renderMessages();
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
                // İlk yükleme olduğunu belirtelim
                isInitialLoad = true;

                const msgs = await window.supabaseHelpers.getChatMessages();
                if (msgs) messages = msgs;

                // Tam yeniden oluştur
                renderMessages(true);

                // Abonelik başlat
                if (!isSubscribed) {
                    window.supabaseHelpers.subscribeToChatMessages((newMsg) => {
                        // Gelen mesaj zaten listede var mı? (ID kontrolü)
                        const exists = messages.some(m => m.id === newMsg.id);
                        if (exists) return; // Zaten var, ekleme.

                        // Optimistic mesaj kontrolü
                        const myOptimisticIndex = messages.findIndex(m =>
                            m.is_optimistic &&
                            m.sender === newMsg.sender &&
                            m.message === newMsg.message
                        );

                        if (myOptimisticIndex !== -1) {
                            // Varolan optimistic mesajı güncelle
                            messages[myOptimisticIndex] = newMsg;

                            // DOM'dan eski optimistic mesajı kaldır (ID değiştiği için)
                            // "is_optimistic" olan ve içeriği uyanı bulabilsek iyi ama
                            // Basitçe: temp id ile eklenen elementi bulup silelim
                            // messages array'de update ettik ama DOM'daki ID hala 'opt_...' olabilir.
                            // renderMessages(false) çağırınca yeni ID ile ekler.
                            // Eskisini silmeliyiz.

                            // Optimistic mesajları bulup temizleyelim (Basit yaklaşım)
                            // En doğrusu: tempId'yi biliyor olsaydık onu silerdik.
                            // Ama render system'i full rebuild yapmıyor.
                            // Çözüm: data-id'si 'opt_' ile başlayıp içeriği eşleşeni sil.
                            const optElements = document.querySelectorAll('.message[data-id^="opt_"]');
                            optElements.forEach(el => {
                                if (el.textContent.includes(newMsg.message)) {
                                    el.remove();
                                }
                            });

                        } else {
                            // Yepyeni mesaj, ekle
                            messages.push(newMsg);
                        }

                        renderMessages(false); // Incremental update
                    });
                    isSubscribed = true;
                }
            }
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
