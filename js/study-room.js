// Initial Default Data (Fallback)
let studyData = {
    flashcards: [
        { term: "Madde 51/2-a", definition: "Hız sınırlarını %10 - %30 oranında aşmak." },
        { term: "Madde 47/1-b", definition: "Kırmızı ışık kuralına uymamak." },
        // ... (Diğer varsayılanlar buraya eklenebilir veya boş bırakılabilir, yüklenince değişecek)
    ],
    speedLimits: [
        { type: "Yerleşim Yeri İçinde", limit: "50" },
        { type: "Şehirlerarası Çift Yönlü", limit: "90" },
        { type: "Bölünmüş Yollar", limit: "110" },
        { type: "Otoyollar", limit: "120" },
        { type: "Okul Bölgesi", limit: "30" }
    ],
    signs: [
        { name: "DUR", icon: "🛑", description: "Kavşaklarda durarak kontrol etmeniz gerektiğini belirtir." },
        { name: "Girişi Olmayan Yol", icon: "⛔", description: "Bu yönden araç girişinin yasak olduğunu belirtir." },
        { name: "Dikkat", icon: "⚠️", description: "Tehlike uyarısı. Hızınızı azaltın." },
        { name: "Park Yapılmaz", icon: "🚫", description: "Belirtilen alana park etmek yasaktır." }
    ]
};

async function initializeStudyData() {
    if (!window.supabaseHelpers) return;

    // 1. Flashcards Yükle
    try {
        if (window.supabaseHelpers.getFlashcards) {
            const remoteCards = await window.supabaseHelpers.getFlashcards();
            if (remoteCards && remoteCards.length > 0) {
                console.log("✅ Ezber kartları Supabase'den yüklendi:", remoteCards.length);
                studyData.flashcards = remoteCards;
                // Eğer section görünüyorsa güncelle
                if (!flashcardSection.classList.contains('hidden')) loadFlashcard(currentCardIndex);
            }
        }
    } catch (e) {
        console.error("Flashcards load error:", e);
    }

    // 2. Levhaları Yükle
    try {
        if (window.supabaseHelpers.getSigns) {
            const remoteSigns = await window.supabaseHelpers.getSigns();
            if (remoteSigns && remoteSigns.length > 0) {
                console.log("✅ Levhalar Supabase'den yüklendi:", remoteSigns.length);
                studyData.signs = remoteSigns;
                // Eğer section görünüyorsa güncelle
                if (!signsSection.classList.contains('hidden')) renderSigns();
            }
        }
    } catch (e) {
        console.error("Signs load error:", e);
    }

    // 3. Hız Limitlerini Yükle
    try {
        if (window.supabaseHelpers.getSpeedLimits) {
            const remoteLimits = await window.supabaseHelpers.getSpeedLimits();
            if (remoteLimits && remoteLimits.length > 0) {
                console.log("✅ Hız Limitleri Supabase'den yüklendi:", remoteLimits.length);
                studyData.speedLimits = remoteLimits; // Veriyi güncelle
            }
        }
    } catch (e) {
        console.error("Speed limits load error:", e);
    }
}

// TOGGLE FORMS
function toggleAddCardForm() {
    const form = document.getElementById('add-card-form');
    if (form) form.classList.toggle('hidden');
}

function toggleAddSignForm() {
    const form = document.getElementById('add-sign-form');
    if (form) form.classList.toggle('hidden');
}

// ADD NEW ITEMS LOGIC
async function addNewFlashcard() {
    const termInput = document.getElementById('new-card-term');
    const defInput = document.getElementById('new-card-def');
    const term = termInput.value.trim();
    const def = defInput.value.trim();

    if (!term || !def) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    if (window.supabaseHelpers && window.supabaseHelpers.saveFlashcard) {
        const saved = await window.supabaseHelpers.saveFlashcard(term, def);
        if (saved) {
            alert("Kart başarıyla eklendi!");
            studyData.flashcards.push(saved); // Local arraye ekle
            termInput.value = '';
            defInput.value = '';
            loadFlashcard(studyData.flashcards.length - 1); // Son eklenene git
            toggleAddCardForm();
        } else {
            alert("Kaydederken bir hata oluştu.");
        }
    } else {
        alert("Bağlantı hatası: Supabase helper bulunamadı.");
    }
}

async function addNewSign() {
    const nameInput = document.getElementById('new-sign-name');
    const iconInput = document.getElementById('new-sign-icon');
    const descInput = document.getElementById('new-sign-desc');

    const name = nameInput.value.trim();
    const icon = iconInput.value.trim();
    const desc = descInput.value.trim();

    if (!name || !icon || !desc) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    if (window.supabaseHelpers && window.supabaseHelpers.saveSign) {
        const saved = await window.supabaseHelpers.saveSign(name, icon, desc);
        if (saved) {
            alert("Levha başarıyla eklendi!");
            studyData.signs.push(saved);
            nameInput.value = '';
            iconInput.value = '';
            descInput.value = '';
            renderSigns();
            toggleAddSignForm();
        } else {
            alert("Kaydederken bir hata oluştu.");
        }
    } else {
        alert("Bağlantı hatası: Supabase helper bulunamadı.");
    }
}

// State
let currentCardIndex = 0;
let isFlipped = false;

// DOM Elements
const studyMenu = document.getElementById('study-menu');
const flashcardSection = document.getElementById('flashcard-section');
const speedLimitSection = document.getElementById('speed-limit-section');
const signsSection = document.getElementById('signs-section');

const flashcardContainer = document.getElementById('flashcard-container');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const cardCounter = document.getElementById('card-counter');

// Navigation Functions
function showStudyMenu() {
    hideAllStudySections();
    studyMenu.classList.remove('hidden');
}

function showFlashcards() {
    hideAllStudySections();
    flashcardSection.classList.remove('hidden');
    loadFlashcard(0);
}

function showSpeedLimits() {
    hideAllStudySections();
    speedLimitSection.classList.remove('hidden');
    renderSpeedLimits();
}

function showSigns() {
    hideAllStudySections();
    signsSection.classList.remove('hidden');
    renderSigns();
}

const notesSection = document.getElementById('notes-section');

function showNotes() {
    hideAllStudySections();
    if (notesSection) notesSection.classList.remove('hidden');
    renderNotes();
}

function hideAllStudySections() {
    studyMenu.classList.add('hidden');
    if (flashcardSection) flashcardSection.classList.add('hidden');
    if (speedLimitSection) speedLimitSection.classList.add('hidden');
    if (signsSection) signsSection.classList.add('hidden');
    if (notesSection) notesSection.classList.add('hidden');
}

// =========================================
// RESTORED CORE FUNCTIONS
// =========================================

function loadFlashcard(index) {
    if (!studyData.flashcards || studyData.flashcards.length === 0) return;

    // Boundary checks
    if (index < 0) index = 0;
    if (index >= studyData.flashcards.length) index = studyData.flashcards.length - 1;

    currentCardIndex = index;
    const card = studyData.flashcards[currentCardIndex];

    // Update content
    const frontEl = document.getElementById('card-front');
    const backEl = document.getElementById('card-back');
    const counterEl = document.getElementById('card-counter');

    if (frontEl) frontEl.textContent = card.term;
    if (backEl) backEl.textContent = card.definition;
    if (counterEl) counterEl.textContent = `${currentCardIndex + 1} / ${studyData.flashcards.length}`;

    // Reset flip
    isFlipped = false;
    const flashcard = document.querySelector('.flashcard');
    if (flashcard) flashcard.classList.remove('flipped');
}

function flipCard() {
    isFlipped = !isFlipped;
    const flashcard = document.querySelector('.flashcard');
    if (flashcard) flashcard.classList.toggle('flipped');
}

function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
    } else {
        currentCardIndex = studyData.flashcards.length - 1; // Loop back
    }
    loadFlashcard(currentCardIndex);
}

function nextCard() {
    if (currentCardIndex < studyData.flashcards.length - 1) {
        currentCardIndex++;
    } else {
        currentCardIndex = 0; // Loop start
    }
    loadFlashcard(currentCardIndex);
}

function renderSpeedLimits() {
    const container = document.getElementById('speed-limits-container');
    if (!container) return;
    container.innerHTML = '';

    if (!studyData.speedLimits) return;

    studyData.speedLimits.forEach(limit => {
        const div = document.createElement('div');
        div.className = 'speed-card';
        div.innerHTML = `
            <div class="limit-circle">${limit.limit}</div>
            <p>${limit.type}</p>
        `;
        container.appendChild(div);
    });
}

function renderSigns() {
    const container = document.getElementById('signs-grid');
    if (!container) return;
    container.innerHTML = '';

    if (!studyData.signs) return;

    studyData.signs.forEach(sign => {
        const div = document.createElement('div');
        div.className = 'sign-card';
        div.innerHTML = `
            <div class="sign-icon">${sign.icon}</div>
            <h4>${sign.name}</h4>
            <p>${sign.description}</p>
        `;
        container.appendChild(div);
    });
}

// Swipe Logic (Touch Handling)
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextCard();
    if (touchEndX > touchStartX + 50) prevCard();
}

// =========================================
// NOTE TAKING LOGIC
// =========================================
let fineNotes = [];

async function loadNotes() {
    if (window.supabaseHelpers) {
        // Supabase'den çek
        fineNotes = await window.supabaseHelpers.getFineNotes();
    } else {
        // Fallback: LocalStorage
        const saved = localStorage.getItem('fine_notes_storage');
        if (saved) {
            try {
                fineNotes = JSON.parse(saved);
            } catch (e) {
                console.error("Notlar yüklenirken hata:", e);
                fineNotes = [];
            }
        }
    }
    renderNotesUI(); // UI'ı ayrı render et
}

async function addNote() {
    const plateInput = document.getElementById('note-plate');
    const articleInput = document.getElementById('note-article');
    const locationInput = document.getElementById('note-location');
    const dateInput = document.getElementById('note-date');

    const plate = plateInput.value.trim();
    const article = articleInput.value.trim();
    const location = locationInput.value.trim();
    const date = dateInput.value;

    if (!plate || !article) {
        alert("Lütfen en azından Plaka ve Ceza Maddesini giriniz.");
        return;
    }

    const newNoteObj = {
        plate: plate.toUpperCase(),
        article: article,
        location: location,
        date: date,
        processed: false
    };

    if (window.supabaseHelpers) {
        // Supabase Kayıt
        const savedNote = await window.supabaseHelpers.saveFineNote(newNoteObj);
        if (savedNote) {
            fineNotes.unshift(savedNote);
        } else {
            alert("Kaydedilemedi (Veritabanı Tablosu Eksik Olabilir)");
            // Yine de locale ekle ki veri kaybolmasın (opsiyonel)
        }
    } else {
        // LocalStorage Kayıt
        newNoteObj.id = Date.now();
        fineNotes.unshift(newNoteObj);
        localStorage.setItem('fine_notes_storage', JSON.stringify(fineNotes));
    }

    // Reset inputs
    plateInput.value = '';
    articleInput.value = '';
    locationInput.value = '';

    renderNotesUI();

    // Telegram bildirimi
    if (window.telegramNotifications) {
        window.telegramNotifications.notifyFineNoteAdded(plate.toUpperCase(), article);
    }
}

async function deleteNote(id) {
    if (confirm("Bu notu silmek istediğine emin misin?")) {
        if (window.supabaseHelpers) {
            const success = await window.supabaseHelpers.deleteFineNote(id);
            if (success) {
                fineNotes = fineNotes.filter(note => note.id !== id);
            } else {
                alert("Silinemedi.");
            }
        } else {
            fineNotes = fineNotes.filter(note => note.id !== id);
            localStorage.setItem('fine_notes_storage', JSON.stringify(fineNotes));
        }
        renderNotesUI();
    }
}

async function toggleNoteStatus(id) {
    const note = fineNotes.find(n => n.id === id);
    if (note) {
        const newStatus = !note.processed;

        if (window.supabaseHelpers) {
            const success = await window.supabaseHelpers.updateFineNoteStatus(id, newStatus);
            if (success) {
                note.processed = newStatus;
            }
        } else {
            note.processed = newStatus;
            localStorage.setItem('fine_notes_storage', JSON.stringify(fineNotes));
        }
        renderNotesUI();
    }
}

function renderNotes() {
    loadNotes(); // Async yüklemeyi başlat
}

function renderNotesUI() {
    const container = document.getElementById('notes-list');
    if (!container) return;

    container.innerHTML = '';

    if (fineNotes.length === 0) {
        container.innerHTML = '<p class="empty-notes">Henüz kaydedilmiş bir ceza notu yok.</p>';
        return;
    }

    fineNotes.forEach(note => {
        const dateObj = new Date(note.date || note.created_at); // created_at Supabase'den gelir
        const dateStr = (note.date || note.created_at) ? dateObj.toLocaleString('tr-TR') : 'Tarih Belirtilmedi';

        const noteEl = document.createElement('div');
        noteEl.className = `note-card ${note.processed ? 'processed' : ''}`;

        noteEl.innerHTML = `
            <div class="note-info">
                <div class="note-plate">${note.plate}</div>
                <div class="note-details">
                    <span><i class="fas fa-file-contract"></i> ${note.article}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${note.location || '-'}</span>
                    <span><i class="far fa-clock"></i> ${dateStr}</span>
                </div>
            </div>
            <div class="note-actions">
                <button class="check-btn" onclick="toggleNoteStatus(${note.id})" title="${note.processed ? 'İşlemi Geri Al' : 'Ceza Yazıldı Olarak İşaretle'}">
                    <i class="fas fa-check"></i>
                </button>
                <button class="delete-note-btn" onclick="deleteNote(${note.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(noteEl);
    });
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add touch listeners to flashcard container
    const cardContainer = document.querySelector('.flashcard-wrapper');
    if (cardContainer) {
        cardContainer.addEventListener('touchstart', handleTouchStart);
        cardContainer.addEventListener('touchend', handleTouchEnd);
    }

    // Load initial data
    loadNotes();
    initializeStudyData();
});
