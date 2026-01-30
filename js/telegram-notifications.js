// =============================================
// TELEGRAM BİLDİRİM SİSTEMİ
// =============================================

// Telegram Bot Configuration
// Bot oluşturmak için: https://t.me/BotFather
const TELEGRAM_CONFIG = {
    botToken: '8010088130:AAGigZidvc2OX9oznuWEkgu47k6OWIC38M0',  // BotFather'dan alınan token
    chatId: '406305254'  // Telegram chat ID
};

// LocalStorage'a otomatik kaydet (ilk çalıştırmada)
if (!localStorage.getItem('telegram_bot_token')) {
    localStorage.setItem('telegram_bot_token', TELEGRAM_CONFIG.botToken);
    localStorage.setItem('telegram_chat_id', TELEGRAM_CONFIG.chatId);
    console.log('✅ Telegram config otomatik kaydedildi');
}

// Telegram'a mesaj gönder
async function sendTelegramNotification(message, options = {}) {
    // Eğer token veya chatId yoksa sessizce çık
    if (TELEGRAM_CONFIG.botToken === 'YOUR_BOT_TOKEN_HERE' ||
        TELEGRAM_CONFIG.chatId === 'YOUR_CHAT_ID_HERE') {
        console.log('⚠️ Telegram yapılandırılmamış. Bildirim gönderilemedi.');
        return false;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;

    // Mesajı formatla
    const formattedMessage = options.emoji
        ? `${options.emoji} ${message}`
        : message;

    const payload = {
        chat_id: TELEGRAM_CONFIG.chatId,
        text: formattedMessage,
        parse_mode: 'HTML',
        disable_notification: options.silent || false
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Telegram bildirimi gönderildi:', message);
        return true;
    } catch (error) {
        console.error('❌ Telegram bildirim hatası:', error);
        return false;
    }
}

// =============================================
// BİLDİRİM FONKSİYONLARI
// =============================================

// Profil seçimi bildirimi
function notifyProfileSelection(profileType) {
    const icon = profileType === 'rabbit' ? '🐰' : '🦊';
    const name = profileType === 'rabbit' ? 'Tavşan' : 'Tilki';
    const timestamp = new Date().toLocaleString('tr-TR');

    const message = `
<b>👤 Profil Seçildi</b>

${icon} <b>${name}</b> karakteri seçildi!

🕐 ${timestamp}
    `.trim();

    sendTelegramNotification(message, { emoji: icon });
}

// Şiir yazma bildirimi
function notifyPoemCreated(title, content) {
    const timestamp = new Date().toLocaleString('tr-TR');
    const preview = content.length > 100 ? content.substring(0, 100) + '...' : content;

    const message = `
<b>📝 Yeni Şiir Yazıldı</b>

<b>Başlık:</b> ${title || 'Başlıksız'}

<i>${preview}</i>

🕐 ${timestamp}
    `.trim();

    sendTelegramNotification(message, { emoji: '📝' });
}

// Mesaj gönderme bildirimi
function notifyChatMessage(sender, messageText) {
    const timestamp = new Date().toLocaleString('tr-TR');
    const senderName = sender === 'user' ? 'Kullanıcı' : 'Partner';
    const icon = sender === 'user' ? '💬' : '💕';
    const preview = messageText.length > 150 ? messageText.substring(0, 150) + '...' : messageText;

    const message = `
<b>${icon} Yeni Mesaj</b>

<b>Gönderen:</b> ${senderName}

<i>"${preview}"</i>

🕐 ${timestamp}
    `.trim();

    sendTelegramNotification(message, { emoji: icon, silent: false });
}

// Oda girişi bildirimi
function notifyRoomEntered(roomName) {
    const timestamp = new Date().toLocaleString('tr-TR');

    const roomEmojis = {
        'poetry': '📖',
        'memory': '💝',
        'meeting': '💬',
        'game': '🎮'
    };

    const roomNames = {
        'poetry': 'Şiir Odası',
        'memory': 'Anılar Odası',
        'meeting': 'Sohbet Odası',
        'game': 'Oyun Odası'
    };

    const emoji = roomEmojis[roomName] || '🚪';
    const room = roomNames[roomName] || roomName;

    const message = `
<b>${emoji} Oda Girişi</b>

<b>${room}</b> açıldı

🕐 ${timestamp}
    `.trim();

    sendTelegramNotification(message, { emoji: emoji, silent: true });
}

// Oyun oynama bildirimi
function notifyGamePlayed(gameType, result) {
    const timestamp = new Date().toLocaleString('tr-TR');

    const gameNames = {
        'wheel': '🎡 Kader Çarkı',
        'words': '🚫 Yasak Kelimeler'
    };

    const gameName = gameNames[gameType] || gameType;

    const message = `
<b>🎮 Oyun Oynandı</b>

<b>Oyun:</b> ${gameName}
<b>Sonuç:</b> ${result}

🕐 ${timestamp}
    `.trim();

    sendTelegramNotification(message, { emoji: '🎮' });
}

// Anı ekleme bildirimi
function notifyMemoryAdded(slotNumber) {
    const timestamp = new Date().toLocaleString('tr-TR');

    const message = `
<b>📸 Yeni Anı Eklendi</b>

Slot ${slotNumber}'a fotoğraf yüklendi 💝

🕐 ${timestamp}
    `.trim();

    sendTelegramNotification(message, { emoji: '📸' });
}

// Müzik çalma bildirimi
function notifyMusicPlayed(trackName) {
    const timestamp = new Date().toLocaleString('tr-TR');

    const message = `
<b>🎵 Müzik Çalıyor</b>

<i>${trackName}</i>

🕐 ${timestamp}
    `.trim();

    sendTelegramNotification(message, { emoji: '🎵', silent: true });
}

// Site açılışı bildirimi
function notifyWebsiteOpened() {
    const timestamp = new Date().toLocaleString('tr-TR');

    const message = `
<b>🌟 Web Sitesi Açıldı</b>

Birisi siteye girdi! 💕

🕐 ${timestamp}
    `.trim();

    sendTelegramNotification(message, { emoji: '🌟' });
}

// =============================================
// GLOBAL EXPORT
// =============================================

window.telegramNotifications = {
    // Config
    setConfig: (botToken, chatId) => {
        TELEGRAM_CONFIG.botToken = botToken;
        TELEGRAM_CONFIG.chatId = chatId;
        localStorage.setItem('telegram_bot_token', botToken);
        localStorage.setItem('telegram_chat_id', chatId);
        console.log('✅ Telegram yapılandırması kaydedildi');
    },

    loadConfig: () => {
        const savedToken = localStorage.getItem('telegram_bot_token');
        const savedChatId = localStorage.getItem('telegram_chat_id');

        if (savedToken && savedChatId) {
            TELEGRAM_CONFIG.botToken = savedToken;
            TELEGRAM_CONFIG.chatId = savedChatId;
            console.log('✅ Telegram yapılandırması yüklendi');
            return true;
        }
        return false;
    },

    // Notification functions
    notifyProfileSelection,
    notifyPoemCreated,
    notifyChatMessage,
    notifyRoomEntered,
    notifyGamePlayed,
    notifyMemoryAdded,
    notifyMusicPlayed,
    notifyWebsiteOpened,

    // Test fonksiyonu
    test: () => {
        sendTelegramNotification('<b>🧪 Test Bildirimi</b>\n\nTelegram entegrasyonu çalışıyor! ✅', { emoji: '🧪' });
    }
};

// Sayfa açılışında config'i yükle ve bildirim gönder
window.addEventListener('load', () => {
    window.telegramNotifications.loadConfig();

    // İlk açılışta bildirim gönder (sadece ilk 5 saniye içinde)
    const lastNotification = localStorage.getItem('last_open_notification');
    const now = Date.now();

    if (!lastNotification || (now - parseInt(lastNotification)) > 300000) { // 5 dakika
        setTimeout(() => {
            notifyWebsiteOpened();
            localStorage.setItem('last_open_notification', now.toString());
        }, 2000);
    }
});
