// =============================================
// MOOD TRACKER (DUYGU DURUM TAKİBİ)
// =============================================

const MoodTracker = {
    // Mod Tanımları
    moods: [
        { type: 'happy', icon: '😊', label: 'Mutlu', color: '#f1c40f' },
        { type: 'sad', icon: '😢', label: 'Üzgün', color: '#3498db' },
        { type: 'tired', icon: '😫', label: 'Yorgun', color: '#95a5a6' },
        { type: 'love', icon: '🥰', label: 'Aşık', color: '#e91e63' },
        { type: 'angry', icon: '😡', label: 'Kızgın', color: '#e74c3c' },
        { type: 'excited', icon: '🤩', label: 'Heyecanlı', color: '#9b59b6' }
    ],

    // Başlatıcı
    init: function () {
        console.log("Mood Tracker Init...");
        // 1. Seçim UI'ını oluştur
        this.renderMoodSelector();

        // 2. Partnerin son modunu yükle
        this.loadPartnerMood();
    },

    // UI Render: Mod Seçici
    renderMoodSelector: function () {
        const container = document.getElementById('mood-selection-area');
        if (!container) return; // Henüz HTML'de yoksa veya gizliyse

        container.innerHTML = '';

        // Başlık
        const title = document.createElement('h3');
        title.className = 'mood-title';
        title.textContent = "Bugün nasıl hissediyorsun?";
        container.appendChild(title);

        // Buton Wrapper
        const btnGroup = document.createElement('div');
        btnGroup.className = 'mood-buttons';

        this.moods.forEach(mood => {
            const btn = document.createElement('div');
            btn.className = `mood-btn mood-btn-${mood.type}`;
            btn.onclick = () => this.handleMoodSelection(mood, btn);
            btn.innerHTML = `
                <span class="mood-icon">${mood.icon}</span>
                <span class="mood-label">${mood.label}</span>
            `;
            btnGroup.appendChild(btn);
        });

        container.appendChild(btnGroup);
    },

    // Mod Seçimi
    handleMoodSelection: async function (mood, btnElement) {
        // Efekt (Aktif sınıfı ekle)
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');

        const userProfile = localStorage.getItem('userProfile');
        if (!userProfile) {
            console.warn("Kullanıcı profili bulunamadı, mod kaydedilemiyor.");
            return;
        }

        // Supabase Kayıt
        try {
            // @ts-ignore
            const { error } = await window.supabaseClient
                .from('mood_tracker')
                .insert([{
                    user_role: userProfile,
                    mood_type: mood.type
                }]);

            if (error) throw error;

            console.log("Mood başarıyla kaydedildi:", mood.label);

            // Telegram Bildirimi
            if (window.telegramNotifications) {
                const userName = userProfile === 'rabbit' ? 'Tavşan 🐰' : 'Tilki 🦊';
                const message = `<b>${userName}</b> şu an <b>${mood.label}</b> hissediyor. ${mood.icon}`;
                window.telegramNotifications.sendCustomNotification(message);
            } else {
                console.warn("Telegram notifications modülü yüklü değil.");
            }

            // Geri bildirim (Toast veya basit alert yerine UI değişimi yeterli)
            // Belki bir "Kaydedildi" tiki çıkabilir.

        } catch (err) {
            console.error("Mood kayıt hatası:", err);
            alert("Mood kaydedilemedi. Bağlantını kontrol et.");
        }
    },

    // Partnerin Modunu Yükle
    loadPartnerMood: async function () {
        const currentUser = localStorage.getItem('userProfile');
        if (!currentUser) return;

        // Partner kim?
        const partnerRole = currentUser === 'rabbit' ? 'fox' : 'rabbit';

        try {
            // @ts-ignore
            const { data, error } = await window.supabaseClient
                .from('mood_tracker')
                .select('*')
                .eq('user_role', partnerRole)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            if (data && data.length > 0) {
                const lastEntry = data[0];
                const moodObj = this.moods.find(m => m.type === lastEntry.mood_type);

                if (moodObj) {
                    this.renderPartnerCard(partnerRole, moodObj, lastEntry.created_at);
                }
            } else {
                console.log("Partner için mood kaydı bulunamadı.");
            }

        } catch (err) {
            console.error("Partner modu yüklenemedi:", err);
        }
    },

    // Partner UI Render
    renderPartnerCard: function (role, mood, timestamp) {
        const container = document.getElementById('partner-mood-display');
        if (!container) return;

        const partnerName = role === 'rabbit' ? 'Tavşan' : 'Tilki';
        const partnerIcon = role === 'rabbit' ? '🐰' : '🦊';

        // Zaman formatı (Örn: 14:30)
        let timeStr = "";
        try {
            const date = new Date(timestamp);
            timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

            // Tarih kontrolü (Bugün mü?)
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            if (!isToday) {
                timeStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric' }) + " " + timeStr;
            }
        } catch (e) { timeStr = ""; }

        container.innerHTML = `
            <div class="partner-mood-card mood-glow-${mood.type}">
                <div class="partner-icon-circle">
                    ${partnerIcon}
                </div>
                <div class="partner-mood-info">
                    <span class="partner-name">${partnerName} şu an böyle hissediyor:</span>
                    <span class="partner-status">
                        ${mood.label} ${mood.icon}
                    </span>
                </div>
                <!-- Opsiyonel: Zaman -->
                <div style="font-size: 0.7rem; color: rgba(255,255,255,0.4); align-self: flex-end;">${timeStr}</div>
            </div>
        `;

        container.classList.remove('hidden');
    }
};

// Global'e ata
window.MoodTracker = MoodTracker;
