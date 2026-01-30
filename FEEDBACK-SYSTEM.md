# 💌 Görüş ve Öneri Sistemi

## ✨ Özellik

Odalar holünün en altına modern bir görüş ve öneri kutusu eklendi!

### 📍 Konum
Ana sayfa → Oda seçim ekranı → En alt

### 🎨 Tasarım
- Modern glassmorphism efekti
- Responsive mobil uyumlu
- Hover animasyonları
- Durum mesajları (başarılı/hatalı/gönderiliyor)

## 🚀 Nasıl Çalışıyor?

1. Kullanıcı odalar ekranında aşağı kaydırır
2. Görüş/öneri kutusunu görür
3. Mesajını yazar (min 5 karakter)
4. "Gönder" butonuna tıklar
5. Mesaj **Telegram'a direkt gönderilir** 📱
6. LocalStorage'a da yedeklenir

## 📦 Eklenen Dosyalar

### HTML (`index.html`)
```html
<div class="feedback-section">
    <div class="feedback-card">
        <h3>💌 Görüş ve Önerileriniz</h3>
        <textarea id="feedback-message"></textarea>
        <button onclick="sendFeedback()">Gönder</button>
    </div>
</div>
```

### CSS (`css/style.css`)
- `.feedback-section` - Ana container
- `.feedback-card` - Glassmorphism kart
- `.feedback-form` - Form stilleri
- `.feedback-status` - Durum mesajları
- Responsive media queries

### JavaScript (`js/main.js`)
- `window.sendFeedback()` - Global fonksiyon
- Validasyon (boş kontrol, min 5 karakter)
- Telegram API entegrasyonu
- LocalStorage kayıt

## 🔔 Telegram Bildirimi

Mesaj şu formatta gelir:

```
💌 Yeni Görüş/Öneri

"Kullanıcının mesajı buraya gelir..."

🕐 31.01.2026 00:45:30
```

## ✅ Validasyon Kuralları

1. **Boş mesaj** → ❌ "Lütfen bir mesaj yazın!"
2. **5 karakterden az** → ❌ "Mesaj en az 5 karakter olmalı!"
3. **Geçerli mesaj** → ✅ "Mesajın gönderildi! Teşekkürler 💕"

## 📱 Durum Mesajları

### Gönderiliyor
```
📤 Gönderiliyor...
```

### Başarılı
```
✅ Mesajın gönderildi! Teşekkürler 💕
```

### Hatalı
```
❌ Gönderilirken hata oluştu. Lütfen tekrar dene.
```

## 💾 LocalStorage Kayıt

Tüm gönderilen mesajlar ayrıca LocalStorage'a kaydedilir:

```javascript
{
    message: "Mesaj içeriği",
    timestamp: 1738271130000
}
```

Kayıtlı mesajları görmek için:
```javascript
console.log(JSON.parse(localStorage.getItem('feedbacks')));
```

## 📐 Responsive Tasarım

### Desktop (> 768px)
- Max-width: 800px
- Padding: 30px
- Buton sağda

### Mobile (≤ 768px)
- Padding: 20px
- Buton tam genişlik
- Küçük font boyutları

## 🎯 Test Et

1. `index.html` sayfasını aç
2. Profil seç (Tavşan/Tilki)
3. Odalar ekranında aşağı kaydır
4. Görüş kutusunu gör
5. Bir mesaj yaz ve gönder
6. Telegram'ı kontrol et!

## 🔧 Teknik Detaylar

### API İstek
```javascript
POST https://api.telegram.org/bot{TOKEN}/sendMessage
Content-Type: application/json

{
    chat_id: "406305254",
    text: "💌 Yeni Görüş/Öneri...",
    parse_mode: "HTML"
}
```

### HTML Formatı
Telegram mesajında HTML formatı desteklenir:
- `<b>Kalın</b>`
- `<i>İtalik</i>`
- `<code>Kod</code>

## 💡 Gelecek Geliştirmeler

- [ ] Karakter sayacı ekle
- [ ] Emoji picker
- [ ] Gönderim geçmişi göster
- [ ] Dosya ekleme desteği
- [ ] Yanıt bildirimi

---

**Oluşturulma Tarihi**: 31 Ocak 2026
**Durum**: ✅ Aktif ve Çalışıyor
