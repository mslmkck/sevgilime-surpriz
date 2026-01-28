# ❤️ Sevgilim İçin Sürpriz Web Sitesi

Bu proje, sevgilinize unutulmaz bir sürpriz yapmanız için hazırlanmış, romantik ve interaktif bir web sitesidir.

## 📁 Kurulum ve Düzenleme

Bu projeyi bilgisayarınızda açmak için `index.html` dosyasına çift tıklamanız yeterlidir. Ancak en sağlıklı görüntüleme için "Live Server" gibi bir yerel sunucu kullanmanız veya bir hostinge yüklemeniz önerilir.

### 1. Şifreyi Değiştirme
Site açılışında sorulan sorunun cevabını değiştirmek için:
- `js/main.js` dosyasını açın.
- En üstteki `const correctPassword = "ironi";` satırını bulun.
- `"ironi"` yerine kendi cevabınızı yazın (küçük harflerle yazmanız önerilir).
- HTML dosyasındaki soru metnini de güncellemeyi unutmayın!

### 2. Başlangıç Tarihini Ayarlama
Zaman sayacının doğru çalışması için:
- `js/main.js` dosyasını açın.
- `const startDate = new Date(2023, 0, 1);` satırını bulun.
- Tarihi şu formatta girin: `YIL, AY (Ocak=0, Şubat=1, ...), GÜN`.

### 3. Müzik Ekleme
Siteye arka plan müziği eklemek için:
- Sevdiğiniz bir şarkıyı `.mp3` formatında indirin.
- Dosya adını `song.mp3` yapın.
- `assets/music/` klasörünün içine atın.
- Eğer farklı bir isim kullanırsanız `index.html` içindeaudio satırını güncelleyin.

### 4. Fotoğraf Ekleme
Galeri bölümüne kendi fotoğraflarınızı eklemek için:
- Fotoğraflarınızı `assets/images/` klasörüne atın.
- `index.html` > Galeri Bölümü kısmına gelin.
- `<div class="img-placeholder">...</div>` olan kısımları silip yerine `<img>` etiketi ekleyebilirsiniz.
  - Örnek: `<img src="assets/images/foto1.jpg" alt="Biz" style="width:100%; border-radius:10px;">`

## 🚀 Yayına Alma (Deploy)

Sitenizi internette yayınlamak (örneğin Netlify üzerinde) çok basittir:
1. Bu klasörü bir zip dosyası yapın veya GitHub'a yükleyin.
2. [Netlify Drop](https://app.netlify.com/drop) sayfasına gidin.
3. Klasörü sürükleyip bırakın.
4. Siteniz saniyeler içinde yayında! Linki sevgilinize atabilirsiniz.

## ❤️ Mutluluklar!
Umarım bu sürpriz onu çok mutlu eder.
