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
        const musicCont = document.getElementById('music-player-container');
        if (musicCont) musicCont.classList.remove('hidden');

        // Bottom Nav Göster
        const bottomNav = document.getElementById('bottom-nav');
        if (bottomNav) bottomNav.classList.remove('hidden');
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

        // Müzik kontrolcüsünü göster
        const musicCont = document.getElementById('music-player-container');
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
            // Bottom Nav Göster
            const bottomNav = document.getElementById('bottom-nav');
            if (bottomNav) bottomNav.classList.remove('hidden');

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
            if (roomSection.id === 'poetry-room') roomName = 'poetry';
            else if (roomSection.id === 'memory-room') roomName = 'memory';
            else if (roomSection.id === 'meeting-room') roomName = 'meeting';
            else if (roomSection.id === 'game-room') roomName = 'game';
            else if (roomSection.id === 'working-room') roomName = 'working';
            else if (roomSection.id === 'private-room') roomName = 'private';
            else if (roomSection.id === 'calikusu-room') roomName = 'calikusu';
            else if (roomSection.id === 'english-room') roomName = 'english';

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
        const calikusuRoom = document.getElementById('calikusu-room');
        if (calikusuRoom) calikusuRoom.classList.add('hidden');
        const englishRoom = document.getElementById('english-room');
        if (englishRoom) englishRoom.classList.add('hidden');
        const musicRoom = document.getElementById('music-room');
        if (musicRoom) musicRoom.classList.add('hidden');

        movePlayerToBackground(); // Player persistence logic

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

        // Scroll başa al
        window.scrollTo(0, 0);

        // Bottom Nav Update
        updateBottomNavState('hall');

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

    const btnCalikusu = document.getElementById('btn-calikusu');
    const calikusuRoom = document.getElementById('calikusu-room');

    if (btnCalikusu) {
        btnCalikusu.addEventListener('click', () => {
            const currentProfile = localStorage.getItem('userProfile');

            if (currentProfile === 'rabbit') {
                const password = prompt("Çalıkuşu'nun dünyasına girmek için parolayı söyle 🌸:");
                if (password && password.toLowerCase() === 'prenses') {
                    openRoom(calikusuRoom);
                    loadTodos();
                    loadDiary();
                } else {
                    alert("Yanlış parola! Sadece gerçek prensesler girebilir. 🚫");
                }
            } else {
                // Tilki (veya diğerleri) şifresiz girebilir (Admin gibi)
                openRoom(calikusuRoom);
                loadTodos();
                loadDiary();
            }
        });
    }

    const btnEnglish = document.getElementById('btn-english');
    const englishRoom = document.getElementById('english-room');

    if (btnEnglish) {
        btnEnglish.addEventListener('click', () => {
            openRoom(englishRoom);
            checkDailyEnglish();
        });
    }



    // ======================================
    // 3.1 DIRECT NAVIGATION (BOTTOM NAV)
    // ======================================
    window.updateBottomNavState = (target) => {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));

        // HTML Sırası:
        // 0: Hall
        // 1: Meeting (Sohbet)
        // 2: Memory (Anılar)
        // 3: Poetry (Şiir)
        // 4: Game (Oyun)
        // 5: Working (Çalışma)
        // 6: English (İngilizce)
        // 7: Calikusu (Çalıkuşu)
        // 8: Private (Özel)

        let activeIndex = -1;
        if (target === 'hall') activeIndex = 0;
        else if (target === 'meeting-room') activeIndex = 1;
        else if (target === 'memory-room') activeIndex = 2;
        else if (target === 'poetry-room') activeIndex = 3;
        else if (target === 'game-room') activeIndex = 4;
        else if (target === 'working-room') activeIndex = 5;
        else if (target === 'english-room') activeIndex = 6;
        else if (target === 'calikusu-room') activeIndex = 7;
        else if (target === 'private-room') activeIndex = 8;
        else if (target === 'music-room') activeIndex = 9; // YENİ: Müzik Odası

        if (activeIndex !== -1 && navItems[activeIndex]) {
            navItems[activeIndex].classList.add('active');
            // Menü kaydırılabilir olduğu için aktif öğeyi görünür yapalım
            navItems[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    window.openDirectRoom = function (roomId, event) {
        if (event) event.preventDefault();

        // --- GÜVENLİK KONTROLLERİ ---
        // 1. Özel Oda Şifre Kontrolü
        if (roomId === 'private-room') {
            const password = prompt("Bu odaya girmek için şifreyi söyle:");
            if (password !== 'yasak') {
                alert("Yanlış şifre! Giremezsin. 🚫");
                return; // Erişimi engelle
            }
        }

        // 2. Çalıkuşu Odası Şifre Kontrolü
        if (roomId === 'calikusu-room') {
            const currentProfile = localStorage.getItem('userProfile');
            if (currentProfile === 'rabbit') {
                const password = prompt("Çalıkuşu'nun dünyasına girmek için parolayı söyle 🌸:");
                if (!password || password.toLowerCase() !== 'prenses') {
                    alert("Yanlış parola! Sadece gerçek prensesler girebilir. 🚫");
                    return; // Erişimi engelle
                }
            }
            // Tilki (fox) ise şifresiz geçebilir
        }
        // ----------------------------

        // Önce Hol'e dönme işlemini (gizleme) yap, ama room selection'ı açma
        // Tüm odaları kapat
        if (sectionPoetry) sectionPoetry.classList.add('hidden');
        if (sectionMemory) sectionMemory.classList.add('hidden');
        if (sectionMeeting) sectionMeeting.classList.add('hidden');
        if (workingRoom) workingRoom.classList.add('hidden');
        if (privateRoom) privateRoom.classList.add('hidden');
        if (calikusuRoom) calikusuRoom.classList.add('hidden');
        if (englishRoom) englishRoom.classList.add('hidden');

        // Müzik Odası logic
        const musicRoom = document.getElementById('music-room');
        if (musicRoom) musicRoom.classList.add('hidden');

        const gameRoom = document.getElementById('game-room');
        if (gameRoom) gameRoom.classList.add('hidden');

        // Hallway (Oda Seçimi) GİZLE
        if (roomSelection) roomSelection.classList.add('hidden');

        // --- PLAYER PERSISTENCE ---
        if (roomId === 'music-room') {
            movePlayerToForeground();
        } else {
            // Başka odaya gidiyorsak ve player YouTube ise backgrounda al
            movePlayerToBackground();
        }
        // --------------------------

        // Target Odayı Bul
        const targetRoom = document.getElementById(roomId);
        if (targetRoom) {
            targetRoom.classList.remove('hidden');
            window.scrollTo(0, 0);
            localStorage.setItem('activeRoomId', roomId);

            // Telegram bildirimi
            if (window.telegramNotifications) {
                window.telegramNotifications.notifyRoomEntered(roomId);
            }

            // Odaya özel init fonksiyonları
            if (roomId === 'poetry-room') {
                // Şiir yükle
                if (btnPoetry) btnPoetry.click();
                else renderFloatingPoems();
            }
            else if (roomId === 'memory-room') renderMemories();
            else if (roomId === 'calikusu-room') {
                if (typeof loadTodos === 'function') loadTodos();
                if (typeof loadDiary === 'function') loadDiary();
            }
            else if (roomId === 'english-room') {
                if (typeof checkDailyEnglish === 'function') checkDailyEnglish();
            }
            else if (roomId === 'music-room') {
                // Müzik odası açılınca yapılacaklar (Gerekirse)
                if (typeof renderPlaylist === 'function') renderPlaylist();
            }
            else if (roomId === 'working-room') {
                // Özel işlem gerekirse buraya
            }

            updateBottomNavState(roomId);
        } else {
            // Eğer oda bulunamazsa (örn: henüz login değil)
            console.error("Oda bulunamadı:", roomId);
        }
    };

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
    // ======================================
    // 5. MÜZİK OYNATICI MANTIĞI (MP3 + YOUTUBE HIBRIT)
    // ======================================
    let playlist = [
        { type: 'mp3', src: 'assets/music/track1.mp3', title: 'Bir Beyaz Orkide', artist: 'Sezen Aksu' },
        { type: 'mp3', src: 'assets/music/track2.mp3', title: 'Sen Bilmezsin', artist: 'Dedublüman' },
        { type: 'mp3', src: 'assets/music/track3.mp3', title: 'Sen Beni Unutamazsın', artist: 'Emre Fel' },
        { type: 'mp3', src: 'assets/music/track4.mp3', title: 'Senden Geçemiyorum', artist: 'Madrigal' }
    ];

    // LocalStorage'dan kayıtlı listeyi al
    const savedPlaylist = JSON.parse(localStorage.getItem('user_playlist'));
    if (savedPlaylist && savedPlaylist.length > 0) {
        playlist = savedPlaylist;
    } else {
        localStorage.setItem('user_playlist', JSON.stringify(playlist));
    }

    let currentTrackIndex = 0;
    let isPlaying = false;
    let player = null; // YouTube Player Instance

    // UI Elements
    const musicContainer = document.getElementById('music-player-container');
    const fullPanel = document.getElementById('full-music-panel');
    const miniPlayBtn = document.getElementById('mini-play-btn');
    const mainPlayBtn = document.getElementById('main-play-btn');
    const miniTitle = document.getElementById('current-track-title');
    const miniArtist = document.getElementById('current-track-artist');
    const playlistUl = document.getElementById('playlist');

    // 1. YouTube IFrame API Yükleme
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // PLAYER STATE Helpers
    function movePlayerToForeground() {
        const ytPlaceholder = document.getElementById('youtube-player-placeholder');
        const albumContainer = document.getElementById('album-art-container');
        if (ytPlaceholder && albumContainer) {
            albumContainer.appendChild(ytPlaceholder);
            ytPlaceholder.style.position = 'absolute';
            ytPlaceholder.style.top = '0';
            ytPlaceholder.style.left = '0';
            ytPlaceholder.style.width = '100%';
            ytPlaceholder.style.height = '100%';
            ytPlaceholder.style.opacity = '1';
            ytPlaceholder.style.zIndex = '100';
            ytPlaceholder.style.borderRadius = '50%';
        }
    }

    function movePlayerToBackground() {
        const ytPlaceholder = document.getElementById('youtube-player-placeholder');
        if (ytPlaceholder) {
            document.body.appendChild(ytPlaceholder);
            ytPlaceholder.style.position = 'fixed';
            ytPlaceholder.style.top = '0';
            ytPlaceholder.style.left = '0';
            ytPlaceholder.style.width = '1px';
            ytPlaceholder.style.height = '1px';
            ytPlaceholder.style.opacity = '0';
            ytPlaceholder.style.zIndex = '-1';
            ytPlaceholder.style.borderRadius = '0';
        }
    }

    window.onYouTubeIframeAPIReady = () => {
        // YouTube API Başlatma

        const playerOptions = {
            height: '100%',
            width: '100%',
            videoId: '',
            host: 'https://www.youtube.com',
            playerVars: {
                'playsinline': 1,
                'controls': 1,
                'disablekb': 1,
                'fs': 0,
                'rel': 0,
                'enablejsapi': 1,
            },
            events: {
                'onReady': (event) => {
                    console.log("YouTube Player Hazır");
                    onPlayerReady(event);
                },
                'onStateChange': onPlayerStateChange,
                'onError': (e) => {
                    console.error("YouTube Player Hatası:", e);
                }
            }
        };

        // Origin sadece HTTP/HTTPS ise eklenmeli, file:// ise eklenmemeli (çünkü mismatch yapar)
        if (window.location.protocol !== 'file:') {
            playerOptions.playerVars.origin = window.location.origin;
        }

        player = new YT.Player('youtube-player-placeholder', playerOptions);
    };

    function onPlayerReady(event) {
        // Hazır
        console.log("YouTube Player Ready");
    }

    function onPlayerStateChange(event) {
        // 0: Ended, 1: Playing, 2: Paused
        if (event.data === YT.PlayerState.ENDED) {
            playNext();
        } else if (event.data === YT.PlayerState.PLAYING) {
            isPlaying = true;
            updatePlayIcons();
        } else if (event.data === YT.PlayerState.PAUSED) {
            isPlaying = false;
            updatePlayIcons();
        }
    }

    // 2. Playlist Render
    window.renderPlaylist = () => {
        if (!playlistUl) return;
        playlistUl.innerHTML = '';

        playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
            li.innerHTML = `
                <i class="${track.type === 'youtube' ? 'fab fa-youtube' : 'fas fa-music'}"></i>
                <div class="playlist-info">
                    <span class="song-title">${track.title}</span>
                    <span class="song-meta">${track.artist || (track.type === 'youtube' ? 'YouTube' : 'Müzik')}</span>
                </div>
                <button class="delete-track-btn" onclick="removeTrack(${index}, event)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            li.onclick = (e) => {
                if (!e.target.closest('.delete-track-btn')) {
                    playTrack(index);
                }
            };
            playlistUl.appendChild(li);
        });

        // Update Mini Player Info
        if (playlist[currentTrackIndex]) {
            miniTitle.textContent = playlist[currentTrackIndex].title;
            miniArtist.textContent = playlist[currentTrackIndex].artist || 'Müzik Çalar';
        }
    };

    // 3. Play Logic
    window.playTrack = (index) => {
        if (index < 0) index = playlist.length - 1;
        if (index >= playlist.length) index = 0;

        currentTrackIndex = index;
        const track = playlist[index];

        // UI Eleman seç
        const vinylUI = document.getElementById('vinyl-record-ui');
        const ytPlaceholder = document.getElementById('youtube-player-placeholder');
        const albumContainer = document.getElementById('album-art-container');

        // --- UI RESET START ---
        // Varsayılan: Vinyl görünür, YouTube gizli ve yerinde (body veya hidden div)
        if (vinylUI) vinylUI.style.display = 'block';
        if (ytPlaceholder) {
            // Eski yerine veya gizli moda al (reset)
            // Ancak pratik olması için biz her playTrack'te logic kuracağız
            // YouTube ise taşıyacağız, değilse gizleyeceğiz
        }
        // --- UI RESET END ---

        // Önce her şeyi durdur
        audio.pause();
        audio.currentTime = 0;
        if (player && player.stopVideo) player.stopVideo();

        renderPlaylist(); // Active class update

        const titleEl = document.getElementById('current-track-title');
        const artistEl = document.getElementById('current-track-artist');

        if (track.type === 'mp3') {
            // MP3 MODU
            if (vinylUI) {
                vinylUI.style.display = 'block';
                vinylUI.classList.remove('playing');
                void vinylUI.offsetWidth;
                vinylUI.classList.add('playing');
            }
            // YouTube placeholder'ı gizle
            if (ytPlaceholder) {
                ytPlaceholder.style.position = 'absolute';
                ytPlaceholder.style.zIndex = '-1';
                ytPlaceholder.style.opacity = '0';
            }

            audio.src = track.src;
            audio.play().catch(e => console.error(e));
            isPlaying = true;

        } else if (track.type === 'youtube') {
            // YOUTUBE MODU
            // Hangi odadayız kontrol et
            const musicRoom = document.getElementById('music-room');
            const inMusicRoom = musicRoom && !musicRoom.classList.contains('hidden');

            if (inMusicRoom) {
                // Vinyl Gizle
                if (vinylUI) vinylUI.style.display = 'none';
                movePlayerToForeground();
            } else {
                movePlayerToBackground();
            }

            if (player && player.loadVideoById) {
                player.loadVideoById(track.videoId);
                isPlaying = true;
            } else {
                // Player init olmamış olabilir
                console.log("Player not ready yet, waiting...");
                setTimeout(() => {
                    if (player && player.loadVideoById) {
                        player.loadVideoById(track.videoId);
                        isPlaying = true;
                        updatePlayIcons();
                    }
                }, 1500);
            }
        }

        updatePlayIcons();

        // Info Update
        if (titleEl) titleEl.textContent = track.title;
        if (artistEl) artistEl.textContent = track.artist || 'Müzik Çalar';

        // Mini player update (eğer varsa)
        if (typeof miniTitle !== 'undefined') miniTitle.textContent = track.title;
        if (typeof miniArtist !== 'undefined') miniArtist.textContent = track.artist || 'Müzik Çalar';
    };

    window.togglePlay = () => {
        const track = playlist[currentTrackIndex];

        if (track.type === 'mp3') {
            if (audio.paused) {
                audio.play();
                isPlaying = true;
            } else {
                audio.pause();
                isPlaying = false;
            }
        } else if (track.type === 'youtube') {
            if (player && player.getPlayerState) {
                const state = player.getPlayerState();
                if (state === YT.PlayerState.PLAYING) {
                    player.pauseVideo();
                    isPlaying = false;
                } else {
                    player.playVideo();
                    isPlaying = true;
                }
            }
        }
        updatePlayIcons();
    };

    function updatePlayIcons() {
        const iconHtml = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        if (miniPlayBtn) miniPlayBtn.innerHTML = iconHtml;
        if (mainPlayBtn) mainPlayBtn.innerHTML = iconHtml;
    }

    window.playNext = () => {
        playTrack(currentTrackIndex + 1);
    };

    window.playPrev = () => {
        playTrack(currentTrackIndex - 1);
    };

    // 4. Panel Toggle
    window.toggleMusicPanel = () => {
        if (musicContainer.classList.contains('expanded')) {
            musicContainer.classList.remove('expanded');
            // Mini Player geri gelsin (CSS transition sonrası veya hemen)
            document.getElementById('mini-player').style.display = 'flex';
        } else {
            musicContainer.classList.add('expanded');
            // Mini Player gizlensin
            // document.getElementById('mini-player').style.display = 'none'; // CSS ile hallettik ama JS ile de garanti olsun
        }
    };

    // 5. YouTube Ekleme
    // 5. YouTube Ekleme
    window.addYoutubeTrack = async () => {
        const input = document.getElementById('yt-input');
        const url = input.value.trim();

        if (!url) return;

        // Video ID Çıkarma
        let videoId = '';
        try {
            if (url.includes('youtu.be')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('youtube.com/watch')) {
                const urlObj = new URL(url);
                videoId = urlObj.searchParams.get('v');
            } else if (url.includes('embed')) {
                videoId = url.split('embed/')[1].split('?')[0];
            }
        } catch (e) {
            console.error("ID parse hatası:", e);
        }

        if (!videoId || videoId.length < 11) {
            // Regex Fallback
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length == 11) {
                videoId = match[2];
            } else {
                alert("Geçersiz YouTube linki! Lütfen tam link girin.");
                return;
            }
        }

        let trackTitle = 'YouTube Video';
        const apiKey = 'AIzaSyBD20NlGmp5MXJoLkdfI3VR_nV6gruDb30'; // Kullanıcının sağladığı API Key

        try {
            // Önce Resmi YouTube API ile dene
            const apiResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
            const apiData = await apiResponse.json();

            if (apiData.items && apiData.items.length > 0) {
                trackTitle = apiData.items[0].snippet.title;
            } else {
                throw new Error("API'den başlık alınamadı, fallback'e geçiliyor...");
            }
        } catch (apiError) {
            console.warn("YouTube API Hatası (Fallback kullanılıyor):", apiError);
            // Fallback: noembed.com
            try {
                const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
                const data = await response.json();
                if (data.title) trackTitle = data.title;
            } catch (e) {
                console.log("Noembed de başarısız oldu:", e);
            }
        }

        const newTrack = {
            type: 'youtube',
            videoId: videoId,
            src: '',
            title: trackTitle,
            artist: 'YouTube'
        };

        // Prompt kaldırıldı

        playlist.push(newTrack);
        localStorage.setItem('user_playlist', JSON.stringify(playlist));
        renderPlaylist();

        input.value = '';

        // Bildirim ve Otomatik Çalma
        alert("Eklendi: " + trackTitle);
        if (confirm("Hemen çalmak ister misin?")) {
            playTrack(playlist.length - 1);
        }
    };

    window.removeTrack = (index, event) => {
        event.stopPropagation();
        if (confirm("Bu şarkıyı listeden silmek istiyor musun?")) {
            playlist.splice(index, 1);
            localStorage.setItem('user_playlist', JSON.stringify(playlist));
            renderPlaylist();

            // Eğer silinen çalıyorsa durdur veya sonrakine geç
            if (index === currentTrackIndex) {
                playTrack(index); // Index değişmedi ama içerik değişti, sıradaki gelir.
            } else if (index < currentTrackIndex) {
                currentTrackIndex--; // Index kayması düzelt
            }
        }
    };

    // Init Render
    renderPlaylist();

    // Ses Kontrolü (Audio Only - YouTube API ayrı volume yönetir ama ikisini sync edebiliriz)
    const volSlider = document.getElementById('volume-slider');
    if (volSlider) {
        volSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            audio.volume = val / 100;
            if (player && player.setVolume) {
                player.setVolume(val);
            }
        });
    }

    // Audio Ended (MP3 için)
    audio.onended = () => {
        playNext();
    };

    // Initial State: İlk şarkıyı active yap (çalmadan) handled by renderPlaylist

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

// ======================================
// 8. ÇALIKUŞU ODASI FONKSİYONLARI
// ======================================

// Tab Değiştirme
window.openCmTab = (tabName) => {
    const tabs = document.querySelectorAll('.tab-content');
    const btns = document.querySelectorAll('.tab-btn');

    tabs.forEach(t => t.classList.remove('active'));
    btns.forEach(b => b.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.add('active');
    // Find button
    const btn = Array.from(btns).find(b => b.getAttribute('onclick').includes(tabName));
    if (btn) btn.classList.add('active');
};

// --- TODO LIST ---
window.loadTodos = () => {
    const list = document.getElementById('todo-list');
    if (!list) return;

    const todos = JSON.parse(localStorage.getItem('cm_todos') || '[]');
    list.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');
        li.innerHTML = `
                <span onclick="toggleTodo(${index})">${todo.text}</span>
                <button class="delete-task-btn" onclick="deleteTodo(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        list.appendChild(li);
    });
};

window.addTodo = () => {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) return;

    const todos = JSON.parse(localStorage.getItem('cm_todos') || '[]');
    todos.push({ text: text, completed: false });
    localStorage.setItem('cm_todos', JSON.stringify(todos));

    input.value = '';
    loadTodos();

    // Telegram bildirimi
    if (window.telegramNotifications) {
        window.telegramNotifications.notifyTodoAdded(text);
    }
};

window.toggleTodo = (index) => {
    const todos = JSON.parse(localStorage.getItem('cm_todos') || '[]');
    if (todos[index]) {
        todos[index].completed = !todos[index].completed;
        localStorage.setItem('cm_todos', JSON.stringify(todos));
        loadTodos();
    }
};

window.deleteTodo = (index) => {
    const todos = JSON.parse(localStorage.getItem('cm_todos') || '[]');
    todos.splice(index, 1);
    localStorage.setItem('cm_todos', JSON.stringify(todos));
    loadTodos();
};

// --- DIARY ---
window.loadDiary = () => {
    const container = document.getElementById('diary-entries');
    if (!container) return;

    let entries = JSON.parse(localStorage.getItem('cm_diary') || '[]');
    container.innerHTML = '';

    // Tarihe göre sırala (En yeni en üstte)
    entries.sort((a, b) => b.date - a.date);

    entries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'diary-card collapsed'; // Varsayılan kapalı

        // Tarih formatı (Örn: 3 Şubat 2026, Salı 23:30)
        let dateStr;
        try {
            dateStr = new Date(entry.date).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            dateStr = new Date(entry.date).toLocaleString();
        }

        // Accordion yapısı
        div.innerHTML = `
            <div class="diary-header" onclick="this.parentElement.classList.toggle('expanded')">
                <div class="d-flex align-items-center gap-2">
                    <i class="fas fa-book-open" style="color: #ff9aa2;"></i>
                    <span class="diary-date-label">${dateStr}</span>
                </div>
                <i class="fas fa-chevron-down toggle-icon"></i>
            </div>
            <div class="diary-body">
                <div class="diary-content-text">${entry.text.replace(/\n/g, '<br>')}</div>
            </div>
        `;
        container.appendChild(div);
    });
};

window.saveDiaryEntry = () => {
    const input = document.getElementById('diary-text');
    const dateInput = document.getElementById('diary-date-picker');

    const text = input.value.trim();
    if (!text) {
        alert('Lütfen bir şeyler yaz...');
        return;
    }

    // Use selected date or current time if empty
    let entryDate;
    if (dateInput && dateInput.value) {
        entryDate = new Date(dateInput.value).getTime(); // Use selected date
    } else {
        entryDate = Date.now(); // Fallback to now
    }

    const entries = JSON.parse(localStorage.getItem('cm_diary') || '[]');
    entries.push({
        text: text,
        date: entryDate
    });

    // Sort by date (newest first)
    entries.sort((a, b) => b.date - a.date);

    localStorage.setItem('cm_diary', JSON.stringify(entries));

    input.value = '';
    if (dateInput) dateInput.value = ''; // Reset date picker
    loadDiary();
    alert('Günlüğün kaydedildi 📒');

    // Telegram bildirimi
    if (window.telegramNotifications) {
        window.telegramNotifications.notifyDiaryAdded(text);
    }
};

// ======================================
// 9. İNGİLİZCE ODASI FONKSİYONLARI (GEMINI API)
// ======================================
window.checkDailyEnglish = () => {
    const today = new Date().toDateString();
    const storedData = JSON.parse(localStorage.getItem('english_daily') || '{}');

    const welcomeScreen = document.getElementById('english-welcome');
    const contentScreen = document.getElementById('english-content');
    const topicLabel = document.getElementById('daily-topic-date');

    // Eğer bugünün verisi varsa direkt göster
    if (storedData.date === today && storedData.words && storedData.words.length > 0) {
        welcomeScreen.classList.add('hidden');
        contentScreen.classList.remove('hidden');
        topicLabel.textContent = `Bugünün Kelimeleri (${new Date().toLocaleDateString('tr-TR')})`;
        renderEnglishWords(storedData.words);
    } else {
        // Veri yoksa karşılama ekranını göster
        contentScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
    }
};

window.startDailyEnglish = async () => {
    const welcomeScreen = document.getElementById('english-welcome');
    const loadingScreen = document.getElementById('english-loading');
    const btn = document.querySelector('.start-english-btn');

    btn.classList.add('hidden');
    loadingScreen.classList.remove('hidden');

    try {
        const words = await fetchWordsFromGemini();

        // LocalStorage Kaydet
        const dataToStore = {
            date: new Date().toDateString(),
            words: words
        };
        localStorage.setItem('english_daily', JSON.stringify(dataToStore));

        // Ekranı güncelle
        loadingScreen.classList.add('hidden');
        welcomeScreen.classList.add('hidden');
        document.getElementById('english-content').classList.remove('hidden');
        document.getElementById('daily-topic-date').textContent = `Bugünün Kelimeleri (${new Date().toLocaleDateString('tr-TR')})`;

        renderEnglishWords(words);

    } catch (error) {
        console.error("Gemini Error:", error);
        alert("Üzgünüm, şu an kelimeleri getiremiyorum. Lütfen daha sonra tekrar dene. 😔");
        loadingScreen.classList.add('hidden');
        btn.classList.remove('hidden');
    }
};

window.refreshEnglishWords = () => {
    if (confirm("Bugünün kelimelerini yenilemek istiyor musun?")) {
        // LocalStorage temizle ve restart
        localStorage.removeItem('english_daily');
        const contentScreen = document.getElementById('english-content');
        const welcomeScreen = document.getElementById('english-welcome');
        const btn = document.querySelector('.start-english-btn');

        contentScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        btn.classList.remove('hidden');
        startDailyEnglish();
    }
};

async function fetchWordsFromGemini() {
    // Not: Bu key client-side'da görünür durumdadır. Production için backend proxy kullanılmalıdır.
    const API_KEY = 'AIzaSyCzuhjjQdK-QkR2gBoA1mzBbF5kEIUdriI';

    // API Denemesi
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const prompt = `
            Bana B1 seviyesinde 20 adet İngilizce kelime ver. 
            Her kelime için:
            1. İngilizce kelime (word)
            2. Türkçe anlamı (meaning)
            3. İngilizce örnek cümle (exampleEn)
            4. Örnek cümlenin Türkçe çevirisi (exampleTr)
            
            Lütfen SADECE JSON formatında bir dizi (array) döndür. Başka hiçbir metin yazma.
            Format şöyle olsun:
            [
                { "word": "Apple", "meaning": "Elma", "exampleEn": "I ate an apple.", "exampleTr": "Bir elma yedim." }
            ]
        `;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);

    } catch (error) {
        console.warn("Gemini API çalışmadı, yedek liste (Offline Mode) devreye giriyor...", error);

        // --- FALLBACK (YEDEK) LİSTE ---
        // API kotası dolduğunda veya hata verdiğinde kullanıcıyı mağdur etmemek için
        // hazır bir B1 kelime listesi döndürüyoruz.
        const fallbackPool = [
            { "word": "Achieve", "meaning": "Başarmak", "exampleEn": "She worked hard to achieve her goals.", "exampleTr": "Hedeflerine ulaşmak için çok çalıştı." },
            { "word": "Benefit", "meaning": "Fayda / Yarar", "exampleEn": "Regular exercise has many benefits.", "exampleTr": "Düzenli egzersizin birçok faydası vardır." },
            { "word": "Challenge", "meaning": "Zorluk / Meydan Okuma", "exampleEn": "This puzzle is a real challenge.", "exampleTr": "Bu bulmaca gerçek bir zorluk." },
            { "word": "Decide", "meaning": "Karar Vermek", "exampleEn": "I cannot decide what to wear.", "exampleTr": "Ne giyeceğime karar veremiyorum." },
            { "word": "Encourage", "meaning": "Cesaretlendirmek", "exampleEn": "My parents always encourage me.", "exampleTr": "Ailem beni her zaman cesaretlendirir." },
            { "word": "Feature", "meaning": "Özellik", "exampleEn": "This phone has many new features.", "exampleTr": "Bu telefonun birçok yeni özelliği var." },
            { "word": "Goal", "meaning": "Hedef", "exampleEn": "His goal is to become a doctor.", "exampleTr": "Onun hedefi doktor olmak." },
            { "word": "Habit", "meaning": "Alışkanlık", "exampleEn": "Eating late is a bad habit.", "exampleTr": "Geç yemek yemek kötü bir alışkanlıktır." },
            { "word": "Improve", "meaning": "Geliştirmek", "exampleEn": "I want to improve my English.", "exampleTr": "İngilizcemi geliştirmek istiyorum." },
            { "word": "Journey", "meaning": "Yolculuk", "exampleEn": "Life is a long journey.", "exampleTr": "Hayat uzun bir yolculuktur." },
            { "word": "Knowledge", "meaning": "Bilgi", "exampleEn": "Knowledge is power.", "exampleTr": "Bilgi güçtür." },
            { "word": "Limit", "meaning": "Sınır", "exampleEn": "There is a limit to my patience.", "exampleTr": "Sabrımın bir sınırı var." },
            { "word": "Manage", "meaning": "Yönetmek / Başarmak", "exampleEn": "Can you manage the project?", "exampleTr": "Projeyi yönetebilir misin?" },
            { "word": "Notice", "meaning": "Fark Etmek", "exampleEn": "Did you notice his new haircut?", "exampleTr": "Yeni saç kesimini fark ettin mi?" },
            { "word": "Opportunity", "meaning": "Fırsat", "exampleEn": "Don't miss this opportunity.", "exampleTr": "Bu fırsatı kaçırma." },
            { "word": "Protect", "meaning": "Korumak", "exampleEn": "We must protect the environment.", "exampleTr": "Çevreyi korumalıyız." },
            { "word": "Quality", "meaning": "Kalite", "exampleEn": "The quality of this fabric is high.", "exampleTr": "Bu kumaşın kalitesi yüksek." },
            { "word": "Realize", "meaning": "Farkına Varmak / Gerçekleştirmek", "exampleEn": "I didn't realize it was so late.", "exampleTr": "Saatin bu kadar geç olduğunun farkına varmadım." },
            { "word": "Solution", "meaning": "Çözüm", "exampleEn": "We need to find a solution quickly.", "exampleTr": "Hızlıca bir çözüm bulmalıyız." },
            { "word": "Talent", "meaning": "Yetenek", "exampleEn": "She has a talent for music.", "exampleTr": "Onun müziğe yeteneği var." },
            { "word": "Advice", "meaning": "Tavsiye", "exampleEn": "Can I give you a piece of advice?", "exampleTr": "Sana bir tavsiye verebilir miyim?" },
            { "word": "Complaint", "meaning": "Şikayet", "exampleEn": "I have a complaint about the service.", "exampleTr": "Hizmetle ilgili bir şikayetim var." },
            { "word": "Disappoint", "meaning": "Hayal Kırıklığına Uğratmak", "exampleEn": "I don't want to disappoint you.", "exampleTr": "Seni hayal kırıklığına uğratmak istemiyorum." },
            { "word": "Efficient", "meaning": "Verimli", "exampleEn": "This new machine is very efficient.", "exampleTr": "Bu yeni makine çok verimli." },
            { "word": "Forecast", "meaning": "Tahmin (Hava vb.)", "exampleEn": "The weather forecast predicts rain.", "exampleTr": "Hava durumu tahmini yağmur öngörüyor." },
            { "word": "Generous", "meaning": "Cömert", "exampleEn": "He is very generous with his time.", "exampleTr": "O, zamanı konusunda çok cömerttir." },
            { "word": "Hesitate", "meaning": "Tereddüt Etmek", "exampleEn": "Don't hesitate to call me.", "exampleTr": "Beni aramaktan çekinme." },
            { "word": "Ignore", "meaning": "Görmezden Gelmek", "exampleEn": "You shouldn't ignore the warning signs.", "exampleTr": "Uyarı işaretlerini görmezden gelmemelisin." },
            { "word": "Justify", "meaning": "Haklı Çıkarmak", "exampleEn": "How can you justify your actions?", "exampleTr": "Davranışlarını nasıl haklı çıkarabilirsin?" },
            { "word": "Keen", "meaning": "Hevesli / Keskin", "exampleEn": "She is keen to learn new things.", "exampleTr": "Yeni şeyler öğrenmeye hevesli." },
            { "word": "Loyal", "meaning": "Sadık", "exampleEn": "Dogs are very loyal animals.", "exampleTr": "Köpekler çok sadık hayvanlardır." },
            { "word": "Maintain", "meaning": "Sürdürmek / Bakım Yapmak", "exampleEn": "It's important to maintain a healthy lifestyle.", "exampleTr": "Sağlıklı bir yaşam tarzını sürdürmek önemlidir." },
            { "word": "Nervous", "meaning": "Gergin", "exampleEn": "I felt nervous before the interview.", "exampleTr": "Mülakattan önce gergin hissettim." },
            { "word": "Object", "meaning": "İtiraz Etmek / Nesne", "exampleEn": "I object to this decision.", "exampleTr": "Bu karara itiraz ediyorum." },
            { "word": "Participate", "meaning": "Katılmak", "exampleEn": "Everyone should participate in the discussion.", "exampleTr": "Herkes tartışmaya katılmalı." },
            { "word": "Qualifications", "meaning": "Nitelikler", "exampleEn": "She has excellent qualifications for the job.", "exampleTr": "İş için mükemmel niteliklere sahip." },
            { "word": "Recommend", "meaning": "Tavsiye Etmek", "exampleEn": "Can you recommend a good restaurant?", "exampleTr": "İyi bir restoran tavsiye edebilir misin?" },
            { "word": "Satisfy", "meaning": "Tatmin Etmek", "exampleEn": "Nothing seems to satisfy him.", "exampleTr": "Hiçbir şey onu tatmin etmiyor gibi görünüyor." },
            { "word": "Threaten", "meaning": "Tehdit Etmek", "exampleEn": "The clouds threaten rain.", "exampleTr": "Bulutlar yağmur tehdidi oluşturuyor (yağmur yağacak gibi)." },
            { "word": "Urgent", "meaning": "Acil", "exampleEn": "This is an urgent matter.", "exampleTr": "Bu acil bir mesele." },
            { "word": "Valuable", "meaning": "Değerli", "exampleEn": "Time is our most valuable resource.", "exampleTr": "Zaman en değerli kaynağımızdır." },
            { "word": "Warn", "meaning": "Uyarmak", "exampleEn": "I warned him about the danger.", "exampleTr": "Onu tehlike konusunda uyardım." },
            { "word": "Yield", "meaning": "Ürün Vermek / Yol Vermek", "exampleEn": "The investment yielded high returns.", "exampleTr": "Yatırım yüksek getiri sağladı." },
            { "word": "Zone", "meaning": "Bölge", "exampleEn": "We entered a no-parking zone.", "exampleTr": "Park yapılmaz bölgesine girdik." },
            { "word": "Ambition", "meaning": "Hırs", "exampleEn": "Her ambition is to travel the world.", "exampleTr": "Hırsı dünyayı gezmek." },
            { "word": "Brave", "meaning": "Cesur", "exampleEn": "He was brave enough to speak up.", "exampleTr": "Konuşacak kadar cesurdu." },
            { "word": "Candidate", "meaning": "Aday", "exampleEn": "He is the best candidate for the job.", "exampleTr": "O iş için en iyi aday." },
            { "word": "Detect", "meaning": "Tespit Etmek", "exampleEn": "The sensor detected movement.", "exampleTr": "Sensör hareket tespit etti." },
            { "word": "Evaluate", "meaning": "Değerlendirmek", "exampleEn": "Teachers evaluate student performance.", "exampleTr": "Öğretmenler öğrenci performansını değerlendirir." },
            { "word": "Flexible", "meaning": "Esnek", "exampleEn": "I have a flexible schedule.", "exampleTr": "Esnek bir programım var." }
        ];

        // Listeyi karıştır (Shuffle)
        for (let i = fallbackPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fallbackPool[i], fallbackPool[j]] = [fallbackPool[j], fallbackPool[i]];
        }

        // İlk 20 taneyi döndür
        return fallbackPool.slice(0, 20);
    }
}

// Global variables for English Room navigation
let currentEnglishWords = [];
let currentWordIndex = 0;

function renderEnglishWords(words) {
    currentEnglishWords = words;
    currentWordIndex = 0;

    // Reset Views
    document.getElementById('english-completion').classList.add('hidden');
    document.getElementById('card-controls').classList.remove('hidden');
    document.getElementById('single-card-container').classList.remove('hidden');

    showEnglishWord(currentWordIndex);
}

function showEnglishWord(index) {
    const container = document.getElementById('single-card-container');
    const progressText = document.getElementById('word-progress-text');

    if (index >= currentEnglishWords.length) {
        // End of list
        container.classList.add('hidden');
        document.getElementById('card-controls').classList.add('hidden');
        document.getElementById('english-completion').classList.remove('hidden');
        progressText.textContent = `${currentEnglishWords.length} / ${currentEnglishWords.length}`;
        return;
    }

    const item = currentEnglishWords[index];
    progressText.textContent = `${index + 1} / ${currentEnglishWords.length}`;

    // Clear previous content
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'single-word-card';
    card.innerHTML = `
        <div class="word-main">
            <span class="en-word-large">${item.word}</span>
            <span class="tr-word-large">${item.meaning}</span>
        </div>
        <div class="word-sentences">
            <p class="example-en-large">"${item.exampleEn}"</p>
            <p class="example-tr-large">(${item.exampleTr})</p>
        </div>
    `;
    container.appendChild(card);
}

window.nextEnglishWord = () => {
    currentWordIndex++;
    showEnglishWord(currentWordIndex);
};

window.restartDailyEnglish = () => {
    currentWordIndex = 0;

    document.getElementById('english-completion').classList.add('hidden');
    document.getElementById('card-controls').classList.remove('hidden');
    document.getElementById('single-card-container').classList.remove('hidden');

    showEnglishWord(currentWordIndex);
};




