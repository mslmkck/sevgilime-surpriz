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

        // Mood Tracker Başlat
        if (window.MoodTracker) {
            window.MoodTracker.init();
        }

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

        // Mood Tracker Başlat
        if (window.MoodTracker) {
            window.MoodTracker.init();
        }

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
            else if (roomSection.id === 'music-room') roomName = 'music';
            else if (roomSection.id === 'music-room') roomName = 'music';

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
        if (musicRoom) musicRoom.classList.add('hidden');

        // destructionRoom kaldırıldı

        // movePlayerToBackground kaldırıldı

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
        // Varsayılan olarak şiirleri aç
        switchPoetryTab('poems');
    });

    // ======================================
    // POETRY & LETTERS ROOM LOGIC
    // ======================================

    window.switchPoetryTab = async (tabName) => {
        const poemsArea = document.getElementById('poems-content-area');
        const lettersArea = document.getElementById('letters-content-area');
        const btnPoems = document.getElementById('tab-btn-poems');
        const btnLetters = document.getElementById('tab-btn-letters');

        if (tabName === 'poems') {
            poemsArea.classList.remove('hidden');
            lettersArea.classList.add('hidden');
            btnPoems.classList.add('active');
            btnLetters.classList.remove('active');

            if (window.supabaseHelpers) {
                const dbPoems = await window.supabaseHelpers.getPoems();
                if (dbPoems && dbPoems.length > 0) {
                    poems = dbPoems;
                }
                renderFloatingPoems();
            }
        } else {
            poemsArea.classList.add('hidden');
            lettersArea.classList.remove('hidden');
            btnPoems.classList.remove('active');
            btnLetters.classList.add('active');

            renderLetters();
        }
    };

    // --- MEKTUP MANTIĞI ---
    window.toggleAddLetterForm = () => {
        const form = document.getElementById('new-letter-form');
        form.classList.toggle('hidden');
    };

    window.saveNewLetter = async () => {
        const title = document.getElementById('new-letter-title').value;
        const body = document.getElementById('new-letter-body').value;
        const dateStr = document.getElementById('new-letter-date').value;

        if (!title || !body || !dateStr) {
            alert("Lütfen tüm alanları doldurun!");
            return;
        }

        const unlockDate = new Date(dateStr).toISOString();

        if (window.supabaseHelpers) {
            await window.supabaseHelpers.saveFutureLetter(title, body, unlockDate);
            alert("Mektup zaman kapsülüne kondu! ⏳");
            toggleAddLetterForm();
            renderLetters(); // Listeyi yenile
        }
    };

    window.renderLetters = async () => {
        const grid = document.getElementById('letters-grid');
        grid.innerHTML = '<p style="color:white; width:100%;">Mektuplar yükleniyor...</p>';

        if (!window.supabaseHelpers) return;

        const letters = await window.supabaseHelpers.getFutureLetters();
        grid.innerHTML = '';

        if (letters.length === 0) {
            grid.innerHTML = '<p style="color:white; opacity:0.7;">Henüz geleceğe yazılmış bir mektup yok.</p>';
            return;
        }

        const now = new Date();

        letters.forEach(letter => {
            const unlockDate = new Date(letter.unlock_date);
            const isLocked = now < unlockDate;
            const card = document.createElement('div');

            // Kart Stili
            card.style.cssText = `
                background: ${isLocked ? 'rgba(44, 62, 80, 0.9)' : 'rgba(236, 240, 241, 0.95)'};
                color: ${isLocked ? '#bdc3c7' : '#2c3e50'};
                width: 140px;
                height: 180px;
                border-radius: 10px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                transition: transform 0.3s;
                position: relative;
                overflow: hidden;
            `;

            // Kilit İkonu / Zarf İkonu
            const icon = isLocked ? '<i class="fas fa-lock" style="font-size: 2.5rem; margin-top:20px;"></i>' : '<i class="fas fa-envelope-open-text" style="font-size: 2.5rem; margin-top:20px; color: #e67e22;"></i>';

            // Tarih Formatı
            const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            const dateDisplay = unlockDate.toLocaleDateString('tr-TR', dateOptions);

            card.innerHTML = `
                ${icon}
                <div style="text-align:center; z-index:2;">
                    <h4 style="font-size: 0.9rem; margin-bottom: 5px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${letter.title}</h4>
                    <span style="font-size: 0.7rem; opacity: 0.8;">${isLocked ? 'Açılış:' : ''} ${dateDisplay}</span>
                </div>
            `;

            if (isLocked) {
                // Kilitliyken tıklandığında
                card.onclick = () => {
                    const diffTime = Math.abs(unlockDate - now);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    alert(`Bu mektubu açmak için daha ${diffDays} gün beklemen lazım! 🚫`);
                };
            } else {
                // Açıkken tıklandığında
                card.onclick = () => openLetterReadModal(letter);
            }

            // Hover efekti
            card.onmouseenter = () => card.style.transform = 'translateY(-5px)';
            card.onmouseleave = () => card.style.transform = 'translateY(0)';

            grid.appendChild(card);
        });
    };

    // Mektup Okuma Modalı
    window.openLetterReadModal = (letter) => {
        const modal = document.getElementById('letter-read-modal');
        const title = document.getElementById('letter-read-title');
        const meta = document.getElementById('letter-read-meta');
        const body = document.getElementById('letter-read-body');

        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const sentDate = new Date(letter.created_at).toLocaleDateString('tr-TR', dateOptions);

        title.textContent = letter.title;
        meta.textContent = `Kimden: ${letter.sender === 'rabbit' ? '🐰 Tavşan' : (letter.sender === 'fox' ? '🦊 Tilki' : 'Bilinmiyor')} | Yazılma Tarihi: ${sentDate}`;
        body.textContent = letter.content;

        modal.classList.remove('hidden');
    };

    window.closeLetterReadModal = () => {
        document.getElementById('letter-read-modal').classList.add('hidden');
    };

    if (btnMemory) btnMemory.addEventListener('click', async () => {
        openRoom(sectionMemory);
        renderMemories();
    });

    // MÜZİK ODASI NAVIGATION
    const btnMusic = document.getElementById('btn-music');
    const musicRoom = document.getElementById('music-room');
    if (btnMusic && musicRoom) {
        btnMusic.addEventListener('click', () => {
            openRoom(musicRoom);
            if (window.musicDB) {
                // Eğer playlist boşsa, otomatik yüklemesini isteyebiliriz ama
                // loadPlaylist zaten sayfa açılışında çalışıyor.
                // Belki UI resetlemesi yapılabilir.
                renderPlaylist();
            }
        });
    }

    const btnGame = document.getElementById('btn-game');
    const sectionGame = document.getElementById('game-room');

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
        // Nav kaldırıldı
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
    // 5. MÜZİK OYNATICI MANTIĞI (PRO PLAYER V2)
    // ======================================

    // Varsayılan Playlist
    const defaultPlaylist = [
        { id: 'def1', type: 'asset', src: 'assets/music/track1.mp3', title: 'Bir Beyaz Orkide', artist: 'Sezen Aksu' },
        { id: 'def2', type: 'asset', src: 'assets/music/track2.mp3', title: 'Sen Bilmezsin', artist: 'Dedublüman' },
        { id: 'def3', type: 'asset', src: 'assets/music/track3.mp3', title: 'Track 3', artist: 'Müzik Odası' },
        { id: 'def4', type: 'asset', src: 'assets/music/track4.mp3', title: 'Track 4', artist: 'Müzik Odası' }
    ];

    let playlist = []; // Aktif playlist
    let currentTrackIndex = 0;
    // ... (diğer değişkenler aynı kalsın)

    // ... initMusicPlayer aynı ...

    // ... setupAudioEvents aynı ...

    // ... loadPlaylist, renderPlaylist, loadTrackInfo, playTrack, togglePlay, playNext, playPrev aynı ...

    // Buraya kadar olan kodu atlayarak sadece addMp3Track kısmını değiştireceğim.
    // Ancak replace_file_content contiguous (bitişik) blok istediği için aradaki fonksyonları tekrar yazmamak adına
    // sadece addMp3Track ve defaultPlaylist'i değiştiremem. İki ayrı çağrı yapmalıyım veya bloğu daraltmalıyım.

    // Strateji: Önce defaultPlaylist'i değiştireyim. Sonra addMp3Track'i.
    // Bu daha güvenli ve az kod tekrarı olur.
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;

    // UI Elementleri (Global erişim için load sonrasında tekrar kontrol ediyoruz)
    let uiElements = {};

    function getUI() {
        return {
            title: document.getElementById('current-track-title'),
            artist: document.getElementById('current-track-artist'),
            playIcon: document.querySelector('#main-play-btn i'),
            progressBar: document.getElementById('progress-bar'),
            currentTime: document.getElementById('current-time'),
            totalDuration: document.getElementById('total-duration'),
            playlistDrawer: document.getElementById('playlist-drawer'),
            drawerOverlay: document.getElementById('drawer-overlay'),
            vinylDisc: document.getElementById('vinyl-record-ui'),
            playlistUl: document.getElementById('playlist')
        };
    }

    // 1. Oynatıcıyı Başlat (DB + Playlist)
    async function initMusicPlayer() {
        if (window.musicDB) {
            try {
                await window.musicDB.init();
                console.log("🎵 Müzik DB Başlatıldı");
                await loadPlaylist();
            } catch (err) {
                console.error("Müzik DB hatası:", err);
                playlist = [...defaultPlaylist];
                renderPlaylist();
            }
        } else {
            playlist = [...defaultPlaylist];
            renderPlaylist();
        }

        setupAudioEvents();
    }

    // Audio Eventleri
    function setupAudioEvents() {
        const ui = getUI();

        // Time Update (Progress Bar)
        audio.addEventListener('timeupdate', () => {
            const { currentTime, duration } = audio;
            if (isNaN(duration)) return;

            // Bar genişliği
            const progressPercent = (currentTime / duration) * 100;
            if (ui.progressBar) ui.progressBar.style.width = `${progressPercent}%`;

            // Süre metinleri
            if (ui.currentTime) ui.currentTime.textContent = formatTime(currentTime);
            if (ui.totalDuration) ui.totalDuration.textContent = formatTime(duration);
        });

        // Click on Progress Container (Seek)
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const width = progressContainer.clientWidth;
                const clickX = e.offsetX;
                const duration = audio.duration;
                if (!isNaN(duration)) {
                    audio.currentTime = (clickX / width) * duration;
                }
            });
        }

        // Song Ended
        audio.addEventListener('ended', () => {
            if (isRepeat) {
                audio.play(); // Tekrar çal
            } else {
                playNext(); // Sıradakine geç
            }
        });

        // Shuffle Button
        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => {
                isShuffle = !isShuffle;
                shuffleBtn.style.color = isShuffle ? '#e74c3c' : 'white';
            });
        }

        // Repeat Button
        const repeatBtn = document.getElementById('repeat-btn');
        if (repeatBtn) {
            repeatBtn.addEventListener('click', () => {
                isRepeat = !isRepeat;
                repeatBtn.style.color = isRepeat ? '#e74c3c' : 'white';
            });
        }
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // 2. Playlist Yükle
    async function loadPlaylist() {
        try {
            const userTracks = await window.musicDB.getAllTracks();
            const formattedUserTracks = userTracks.map(t => ({
                id: t.id,
                type: 'blob', // Kullanıcı ekledi
                src: URL.createObjectURL(t.file),
                title: t.title,
                artist: t.artist
            }));

            // Birleştir
            playlist = [...defaultPlaylist, ...formattedUserTracks];

            // Eğer shuffle açıksa karıştırılabilir ama şimdilik düz liste
            renderPlaylist();

            // İlk şarkıyı hazırla (UI)
            if (playlist.length > 0 && !audio.src) {
                loadTrackInfo(0);
            }

        } catch (err) {
            console.error("Playlist yükleme hatası:", err);
            // Hata olsa bile varsayılanları göster
            playlist = [...defaultPlaylist];
            renderPlaylist();
        }
    }

    // 3. Playlist Render
    window.renderPlaylist = () => {
        const ui = getUI();
        if (!ui.playlistUl) return;
        ui.playlistUl.innerHTML = '';

        if (playlist.length === 0) {
            ui.playlistUl.innerHTML = '<li style="padding:20px; text-align:center; color:#777;">Henüz müzik yok. Ekleyin!</li>';
            return;
        }

        playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;

            // Silme butonu (HERKES İÇİN AÇIK)
            // Varsayılan şarkılar için id string, kullanıcı şarkıları için number
            // Bunu deleteTrack fonksiyonunda kontrol edeceğiz.
            const deleteBtn = `<button class="delete-track-btn" title="Sil" onclick="deleteTrack('${track.id}', event)"><i class="fas fa-trash-alt"></i></button>`;

            li.innerHTML = `
                <i class="fas fa-music"></i>
                <div class="playlist-info">
                    <span class="song-title">${track.title}</span>
                    <span class="song-meta">${track.artist || ''}</span>
                </div>
                ${deleteBtn}
            `;

            li.onclick = (e) => {
                // Silme butonuna basıldıysa oynatma
                if (!e.target.closest('.delete-track-btn')) {
                    playTrack(index);
                    togglePlaylistDrawer(); // Seçince listeyi kapat
                }
            };
            ui.playlistUl.appendChild(li);
        });
    };

    // 4. Şarkı Bilgisi Yükle
    function loadTrackInfo(index) {
        if (index < 0 || index >= playlist.length) return;
        const track = playlist[index];
        const ui = getUI();

        if (ui.title) ui.title.textContent = track.title;
        if (ui.artist) ui.artist.textContent = track.artist || '';

        // Metadata (Duration) yüklenince süreyi göster
        audio.onloadedmetadata = () => {
            if (ui.totalDuration) ui.totalDuration.textContent = formatTime(audio.duration);
        };
    }

    // 5. Oynatma
    window.playTrack = (index) => {
        // Döngüsel geçiş
        if (index < 0) index = playlist.length - 1;
        if (index >= playlist.length) index = 0;

        currentTrackIndex = index;
        const track = playlist[index];

        loadTrackInfo(index);
        renderPlaylist(); // Highlight update

        audio.src = track.src;
        audio.play().then(() => {
            isPlaying = true;
            updatePlayIcons();
            startVinyl();
        }).catch(e => console.error("Play error:", e));
    };

    window.togglePlay = () => {
        if (playlist.length === 0) return;
        if (audio.paused) {
            if (!audio.src) playTrack(currentTrackIndex); // Başlamamışsa başlat
            else {
                audio.play();
                isPlaying = true;
                updatePlayIcons();
                startVinyl();
            }
        } else {
            audio.pause();
            isPlaying = false;
            updatePlayIcons();
            stopVinyl();
        }
    };

    window.playNext = () => {
        if (isShuffle) {
            // Rastgele index
            let rand = Math.floor(Math.random() * playlist.length);
            playTrack(rand);
        } else {
            playTrack(currentTrackIndex + 1);
        }
    };

    window.playPrev = () => {
        playTrack(currentTrackIndex - 1);
    };

    function updatePlayIcons() {
        const ui = getUI();
        if (ui.playIcon) {
            ui.playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    function startVinyl() {
        const ui = getUI();
        if (ui.vinylDisc) ui.vinylDisc.classList.add('playing');
    }

    function stopVinyl() {
        const ui = getUI();
        if (ui.vinylDisc) ui.vinylDisc.classList.remove('playing');
    }

    // 6. MP3 Ekleme
    window.addMp3Track = async (input) => {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            let fileName = file.name.replace(/\.[^/.]+$/, "");
            let title = fileName;
            let artist = ""; // "Bilinmeyen Sanatçı" yerine boş

            if (fileName.includes("-")) {
                const parts = fileName.split("-");
                if (parts.length >= 2) {
                    artist = parts[0].trim();
                    title = parts.slice(1).join("-").trim();
                }
            }

            try {
                await window.musicDB.addTrack(file, title, artist);
                alert(`"${title}" listeye eklendi!`);
                await loadPlaylist();
                input.value = '';
            } catch (err) {
                console.error("Ekleme hatası:", err);
                alert("Hata oluştu.");
            }
        }
    };

    // 7. Şarkı Silme
    window.deleteTrack = async (id, event) => {
        if (event) event.stopPropagation();
        if (confirm("Listeden kaldırılsın mı?")) {
            try {
                // Eğer ID string ise ve 'def' ile başlıyorsa (Varsayılan şarkı)
                if (typeof id === 'string' && id.startsWith('def')) {
                    // Sadece listeden çıkar (DB işlemi yok)
                    playlist = playlist.filter(track => track.id !== id);
                    if (playlist.length === 0) {
                        audio.pause();
                        audio.src = "";
                        isPlaying = false;
                        updatePlayIcons();
                        stopVinyl();
                    }
                    renderPlaylist();
                    return; // DB işlemine gerek yok
                }

                // Kullanıcı şarkısı (IndexedDB)
                await window.musicDB.deleteTrack(Number(id)); // ID'yi sayıya çevir

                // Eğer çalan şarkıysa durdur
                const currentTrack = playlist[currentTrackIndex];
                if (currentTrack && currentTrack.id == id) { // Loose equality for string/number match check if needed
                    audio.pause();
                    isPlaying = false;
                    audio.src = "";
                    updatePlayIcons();
                    stopVinyl();
                }

                await loadPlaylist();
            } catch (err) {
                console.error("Silme hatası:", err);
                // alert("Silinirken hata oluştu.");
            }
        }
    };

    // 8. Drawer Toggle
    window.togglePlaylistDrawer = () => {
        const ui = getUI();
        if (ui.playlistDrawer) {
            ui.playlistDrawer.classList.toggle('open');
            /* Overlay toggle */
            if (ui.drawerOverlay) {
                // Overlay class toggle is handled by CSS sibling selector if adjacent, 
                // but let's be safe and toggle it explicitly or rely on 'open' class on drawer
            }
        }
    };

    // Müzik Oynatıcıyı Başlat
    initMusicPlayer();
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


// ======================================
// ÖZEL ODA (PRIVATE ROOM) FUNCTIONS
// ======================================

// Özel Oda açıldığında kaydedilmiş cevapları yükle
window.loadPrivateAnswers = async function () {
    if (!window.supabaseHelpers) return;

    try {
        const answers = await window.supabaseHelpers.getPrivateAnswers();

        if (answers && answers.length > 0) {
            const savedContainer = document.getElementById('saved-answers-container');
            const savedList = document.getElementById('saved-answers-list');

            if (savedContainer && savedList) {
                savedContainer.classList.remove('hidden');
                savedList.innerHTML = '';

                answers.forEach(answer => {
                    const answerItem = document.createElement('div');
                    answerItem.className = 'saved-answer-item';

                    const characterEmoji = answer.character === 'rabbit' ? '🐰' : '🦊';
                    const characterName = answer.character === 'rabbit' ? 'Tavşan' : 'Tilki';
                    const date = new Date(answer.created_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    answerItem.innerHTML = `
                        <div class="saved-answer-header">
                            <span class="character-emoji">${characterEmoji}</span>
                            <span class="character-name">${characterName}</span>
                        </div>
                        <div class="saved-answer-text">${answer.answer_text}</div>
                        <div class="saved-answer-date">${date}</div>
                    `;

                    savedList.appendChild(answerItem);
                });
            }
        }
    } catch (error) {
        console.error('Cevaplar yüklenirken hata:', error);
    }
};

// Cevapları kaydet
window.savePrivateAnswers = async function () {
    const rabbitAnswer = document.getElementById('rabbit-answer').value.trim();
    const foxAnswer = document.getElementById('fox-answer').value.trim();

    if (!rabbitAnswer && !foxAnswer) {
        alert('Lütfen en az bir cevap yazın! 💭');
        return;
    }

    if (!window.supabaseHelpers) {
        alert('Bağlantı hatası! Lütfen tekrar deneyin.');
        return;
    }

    try {
        // Tavşan cevabını kaydet
        if (rabbitAnswer) {
            await window.supabaseHelpers.savePrivateAnswer('rabbit', rabbitAnswer);
        }

        // Tilki cevabını kaydet
        if (foxAnswer) {
            await window.supabaseHelpers.savePrivateAnswer('fox', foxAnswer);
        }

        // Başarı mesajı
        alert('Cevaplarınız kaydedildi! 💝');

        // Telegram bildirimi
        if (window.telegramNotifications && typeof window.telegramNotifications.sendCustomNotification === 'function') {
            const message = `🔒 Özel Oda'da yeni cevaplar:\n${rabbitAnswer ? '🐰 Tavşan: ' + rabbitAnswer.substring(0, 50) + '...\n' : ''}${foxAnswer ? '🦊 Tilki: ' + foxAnswer.substring(0, 50) + '...' : ''}`;
            window.telegramNotifications.sendCustomNotification(message);
        }

        // Formu temizle
        document.getElementById('rabbit-answer').value = '';
        document.getElementById('fox-answer').value = '';

        // Kaydedilmiş cevapları yeniden yükle
        await loadPrivateAnswers();

    } catch (error) {
        console.error('Cevaplar kaydedilirken hata:', error);
        alert('Bir hata oluştu! Lütfen tekrar deneyin.');
    }
};

// Özel Oda açıldığında cevapları yükle
const privateRoomObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        const privateRoom = document.getElementById('private-room');
        if (privateRoom && !privateRoom.classList.contains('hidden')) {
            loadPrivateAnswers();
        }
    });
});

// Observer'ı başlat
const privateRoom = document.getElementById('private-room');
if (privateRoom) {
    privateRoomObserver.observe(privateRoom, {
        attributes: true,
        attributeFilter: ['class']
    });
}



