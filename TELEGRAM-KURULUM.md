# 📱 Telegram Bildirimleri Kurulum Rehberi

## 🎯 Özellikler

Artık web sitenizdeki her önemli eylem Telegram'a bildirim olarak gelecek:

- ✅ **Profil Seçimi** (Tavşan/Tilki)
- ✅ **Oda Girişleri** (Şiir, Anılar, Sohbet, Oyun)
- ✅ **Şiir Yazımı**
- ✅ **Mesaj Gönderme**
- ✅ **Oyun Sonuçları** (Kader Çarkı, Yasak Kelimeler)
- ✅ **Site Açılışı**

---

## 🤖 ADIM 1: Telegram Bot Oluşturma

### 1. BotFather'ı Aç
Telegram'da `@BotFather` kullanıcısını bul ve konuşmayı başlat.

### 2. Yeni Bot Oluştur
```
/newbot
```

### 3. Bot İsmi Ver
```
Sevgilime Sürpriz Bot
```

### 4. Bot Kullanıcı Adı Ver (unique olmalı)
```
sevgilime_surpriz_bot
```

### 5. Bot Token'ı Kaydet
BotFather sana bir token verecek. Örnek:
```
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz0123456789
```

**❗ Bu token'ı kaydet!** Bir daha gösterilmeyecek.

---

## 💬 ADIM 2: Chat ID Bulma

### Option 1: @userinfobot Kullan (KOLAY)
1. Telegram'da `@userinfobot` kullanıcısını bul
2. `/start` yaz
3. Bot sana **ID** gösterecek (Örnek: `123456789`)
4. Bu Chat ID'ni kaydet!

### Option 2: Manuel Yöntem
1. Botunla konuşmayı başlat (`/start` yaz)
2. Tarayıcıda şu URL'yi aç:
```
https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
```
3. `"chat":{"id": 123456789}` kısmında ID'ni bul

---

## ⚙️ ADIM 3: Web Sitesinde Yapılandırma

### Tarayıcı Konsolunu Aç
1. Websiteni aç (`index.html`)
2. F12 bas (Geliştirici Araçları)
3. **Console** sekmesine geç

### Telegram Config'i Ayarla
Konsola yapıştır ve çalıştır:

```javascript
window.telegramNotifications.setConfig(
    'YOUR_BOT_TOKEN_HERE',  // Buraya bot token'ını yapıştır
    'YOUR_CHAT_ID_HERE'     // Buraya chat ID'ni yapıştır
);
```

**Örnek:**
```javascript
window.telegramNotifications.setConfig(
    '1234567890:ABCdefGHI',
    '987654321'
);
```

---

## 🧪 ADIM 4: Test Et

### Test Bildirimi Gönder
Konsola yapıştır:
```javascript
window.telegramNotifications.test();
```

✅ Telegram'dan "🧪 Test Bildirimi" mesajı gelecek!

---

## 📋 Bildirim Türleri

### 1. **Profil Seçimi**
```
👤 Profil Seçildi
🐰 Tavşan karakteri seçildi!
🕐 31.01.2026 00:15:30
```

### 2. **Oda Girişi**
```
📖 Oda Girişi
Şiir Odası açıldı
🕐 31.01.2026 00:16:45
```

### 3. **Yeni Şiir**
```
📝 Yeni Şiir Yazıldı
Başlık: Gözlerinde Kayboldum
"Gözlerinde kayboldum, dünyam sensin artık..."
🕐 31.01.2026 00:17:12
```

### 4. **Mesaj Gönderme**
```
💬 Yeni Mesaj
Gönderen: Kullanıcı
"Seni çok özledim..."
🕐 31.01.2026 00:18:30
```

### 5. **Oyun Sonucu**
```
🎮 Oyun Oynandı
Oyun: 🎡 Kader Çarkı
Sonuç: Kazanan: BİZİZ! 💕
🕐 31.01.2026 00:20:15
```

### 6. **Site Açılışı**
```
🌟 Web Sitesi Açıldı
Birisi siteye girdi! 💕
🕐 31.01.2026 00:10:00
```

---

## 🔧 Manuel Yapılandırma (Alternatif)

Eğer konsol yerine code'u direkt düzenlemek istersen:

1. `js/telegram-notifications.js` dosyasını aç
2. Şu satırları bul (satır 6-9):
```javascript
const TELEGRAM_CONFIG = {
    botToken: 'YOUR_BOT_TOKEN_HERE',
    chatId: 'YOUR_CHAT_ID_HERE'
};
```
3. Token ve Chat ID'yi yapıştır:
```javascript
const TELEGRAM_CONFIG = {
    botToken: '1234567890:ABCdefGHI',
    chatId: '987654321'
};
```
4. Dosyayı kaydet

---

## 🎛️ Bildirim Ayarları

### Sessiz Bildirimleri Devre Dışı Bırak
Oda girişleri varsayılan olarak sessiz (silent: true). Bunu değiştirmek için:

`js/telegram-notifications.js` içinde `notifyRoomEntered` fonksiyonundaki `silent: true`'yu `silent: false` yap.

### Site Açılış Bildirimini Kapat
`js/telegram-notifications.js` dosyasının sonundaki (satır 205-215) şu kısmı yoruma al:

```javascript
// window.addEventListener('load', () => {
//     ...
// });
```

---

## 🐛 Sorun Giderme

### ❌ Bildirim Gelmediği Durumlar

1. **"⚠️ Telegram yapılandırılmamış" Hatası**
   - Çözüm: Config'i doğru ayarladığından emin ol
   - Test: `window.telegramNotifications.test()` çalıştır

2. **"Unauthorized" Hatası**
   - Nedeni: Bot token yanlış
   - Çözüm: BotFather'dan yeni token al

3. **"Chat not found" Hatası**
   - Nedeni: Chat ID yanlış veya bota `/start` yazmadın
   - Çözüm: Önce botla konuşmayı başlat

4. **Hiçbir Hata Yok Ama Bildirim Yok**
   - F12 → Console → Hataları kontrol et
   - Botun engellenmediğinden emin ol
   - İnternet bağlantını kontrol et

---

## 📱 Mobil Kullanım

Telegram bildirimleri her cihazda çalışır:
- ✅ Desktop
- ✅ Mobile (iOS/Android)
- ✅ Tablet
- ✅ Web

Telegram'ı telefonda açık tutarsan anında bildirim alırsın! 📲

---

## 🎉 Tamamlandı!

Artık tüm bildirimler Telegram'dan gelecek. Sevgilin ne yaptığını anında öğreneceksin! 💕

Sorular için: Konsola `window.telegramNotifications` yaz ve mevcut fonksiyonları gör.
