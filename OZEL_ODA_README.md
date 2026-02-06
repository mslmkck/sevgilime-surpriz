# Özel Oda - Kurulum Talimatları

## 🎯 Özellik Özeti

"Özel Oda" içerisine **"Onunla beraber olsaydın ne yapardın?"** sorusu eklendi. Tavşan ve Tilki karakterleri bu soruya cevap yazabilirler ve cevaplar Supabase'de saklanır.

## 📋 Yapılan Değişiklikler

### 1. HTML Güncellemeleri (`index.html`)
- Özel Oda içeriği yenilendi
- Soru başlığı eklendi: "Onunla beraber olsaydın ne yapardın?"
- Tavşan ve Tilki için ayrı metin kutuları (textarea) eklendi
- Kaydet butonu eklendi
- Kaydedilmiş cevapları gösterme alanı eklendi

### 2. CSS Stilleri (`css/extra.css`)
- Modern ve estetik tasarım
- Glassmorphism efektleri
- Smooth animasyonlar (fadeInUp, fadeIn)
- Responsive tasarım
- Focus efektleri ve hover animasyonları

### 3. JavaScript Fonksiyonları (`js/main.js`)
- `savePrivateAnswers()`: Cevapları Supabase'e kaydeder
- `loadPrivateAnswers()`: Kaydedilmiş cevapları yükler
- MutationObserver ile otomatik yükleme
- Telegram bildirimi entegrasyonu

### 4. Supabase Helper (`js/supabase-client.js`)
- `savePrivateAnswer(character, answerText)`: Veritabanına kayıt
- `getPrivateAnswers()`: Tüm cevapları getir

## 🗄️ Veritabanı Kurulumu

### Adım 1: Supabase'e Giriş Yapın
1. [https://supabase.com](https://supabase.com) adresine gidin
2. Projenize giriş yapın

### Adım 2: SQL Tablosunu Oluşturun
1. Sol menüden **SQL Editor**'ü açın
2. **New Query** butonuna tıklayın
3. `sql/create_private_answers_table.sql` dosyasının içeriğini kopyalayın
4. SQL Editor'e yapıştırın
5. **Run** butonuna tıklayın

### Adım 3: Tabloyu Kontrol Edin
1. Sol menüden **Table Editor**'ü açın
2. `private_answers` tablosunu göreceksiniz
3. Tablo şu kolonlara sahip olmalı:
   - `id` (BIGSERIAL, PRIMARY KEY)
   - `character` (TEXT, 'rabbit' veya 'fox')
   - `answer_text` (TEXT)
   - `created_at` (TIMESTAMPTZ)

## 🚀 Kullanım

### Özel Oda'ya Giriş
1. Ana sayfada **"🔒 Özel Oda"** kartına tıklayın
2. Şifre: **`yasak`**
3. Doğru şifreyi girince oda açılır

### Cevap Yazma
1. **Tavşan** veya **Tilki** metin kutusuna cevabınızı yazın
2. Her iki karakter de ayrı ayrı cevap yazabilir
3. **"Cevapları Kaydet"** butonuna tıklayın
4. Cevaplar Supabase'e kaydedilir
5. Telegram'a bildirim gönderilir (eğer aktifse)

### Kaydedilmiş Cevapları Görme
- Cevaplar kaydedildikten sonra otomatik olarak aşağıda görünür
- Her cevap şunları gösterir:
  - Karakter emoji (🐰 veya 🦊)
  - Karakter adı (Tavşan veya Tilki)
  - Cevap metni
  - Tarih ve saat

## 🎨 Tasarım Özellikleri

- **Glassmorphism**: Şeffaf, bulanık arka plan efekti
- **Smooth Animations**: Yumuşak geçişler ve animasyonlar
- **Gradient Buttons**: Renkli gradient butonlar
- **Focus Effects**: Metin kutularına odaklanınca parlama efekti
- **Responsive**: Mobil ve masaüstü uyumlu

## 🔔 Telegram Bildirimleri

Cevap kaydedildiğinde Telegram'a şu formatta bildirim gider:

```
🔒 Özel Oda'da yeni cevaplar:
🐰 Tavşan: [Cevabın ilk 50 karakteri]...
🦊 Tilki: [Cevabın ilk 50 karakteri]...
```

## 🛠️ Teknik Detaylar

### Veri Akışı
1. Kullanıcı cevabı yazar
2. `savePrivateAnswers()` fonksiyonu çağrılır
3. `supabaseHelpers.savePrivateAnswer()` ile Supabase'e kaydedilir
4. Telegram bildirimi gönderilir
5. `loadPrivateAnswers()` ile cevaplar yeniden yüklenir
6. DOM'a dinamik olarak eklenir

### Güvenlik
- RLS (Row Level Security) aktif
- Herkes okuyabilir ve yazabilir (özel oda şifresi ile korunuyor)
- XSS koruması için metin sanitizasyonu yapılabilir (gelecek geliştirme)

## 📝 Notlar

- Cevaplar kalıcı olarak saklanır
- Silme özelliği şu an yok (istenirse eklenebilir)
- Her karakter birden fazla cevap yazabilir
- Tüm cevaplar kronolojik sırada gösterilir

## 🎉 Tamamlandı!

Artık Özel Oda'da Tavşan ve Tilki "Onunla beraber olsaydın ne yapardın?" sorusuna cevap yazabilirler! 💝
