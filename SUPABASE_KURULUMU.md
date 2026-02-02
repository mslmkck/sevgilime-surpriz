# 🚀 Supabase Kurulum Rehberi (Sıfırdan)

Eski Supabase projesini sildiğiniz için, sitenizin veri tabanı özelliklerini (şiirler, anılar, mesajlar) tekrar çalıştırmak adına yeni bir proje kurmamız gerekiyor.

Aşağıdaki adımları sırasıyla takip edin.

## 1. Yeni Proje Oluşturma

1.  [database.new](https://database.new) adresine gidin.
2.  Giriş yapın ve **New Project** butonuna tıklayın.
3.  **Name:** `SevgilimWeb` (veya istediğiniz bir isim)
4.  **Database Password:** Güçlü bir şifre belirleyin ve kenara not edin.
5.  **Region:** Size en yakın konumu seçin (örneğin: *Frankfurt*).
6.  **Create new project** butonuna tıklayın ve kurulmasını bekleyin (birkaç dakika sürebilir).

## 2. Tabloları Oluşturma (SQL)

Proje oluştuktan sonra sol menüden **SQL Editor** ikonuna tıklayın ve **New Query** diyerek boş bir sayfa açın.
Aşağıdaki kodların **TAMAMINI** kopyalayıp oraya yapıştırın ve sağ alttaki **Run** butonuna basın.

```sql
-- KULLANICI PROFİLLERİ
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    profile_type TEXT DEFAULT 'rabbit',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ŞİİRLER
CREATE TABLE IF NOT EXISTS poems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ANILAR (Shared Board için slot_number kullanıyoruz)
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    slot_number INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, slot_number)
);

-- SOHBET MESAJLARI
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT, -- Kimin gönderdiği (cihaz id)
    sender TEXT NOT NULL, -- 'rabbit' veya 'fox'
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OYUN SKORLARI
CREATE TABLE IF NOT EXISTS game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_type TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    result_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CEZA NOTLARI (ÇALIŞMA ODASI - KİŞİYE ÖZEL)
CREATE TABLE IF NOT EXISTS fine_notes (
    id SERIAL PRIMARY KEY,
    user_profile TEXT NOT NULL,
    plate TEXT NOT NULL,
    article TEXT NOT NULL,
    location TEXT,
    date TIMESTAMP WITH TIME ZONE,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- EZBER KARTLARI (HERKESE AÇIK)
CREATE TABLE IF NOT EXISTS flashcards (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- GÜVENLİK AYARLARI (RLS) - Şimdilik herkese açık (Public)
-- Gerçek bir uygulamada burayı daha sıkı tutabiliriz ama kişisel bir site için kolaylık sağlar.
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE fine_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Herkesin okuyup yazabilmesine izin veren politikalar
CREATE POLICY "Public Profiles" ON user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Poems" ON poems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Memories" ON memories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Chat" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Games" ON game_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Fine Notes" ON fine_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Flashcards" ON flashcards FOR ALL USING (true) WITH CHECK (true);

-- Realtime özelliğini aç (Chat için gerekli)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table chat_messages;
commit;

-- VARSAYILAN KARTLARI EKLE (SQL İle Toplu Yükleme)
INSERT INTO flashcards (term, definition) VALUES
-- CEZA MADDELERİ
('Madde 51/2-a', 'Hız sınırlarını %10 - %30 oranında aşmak.'),
('Madde 51/2-b', 'Hız sınırlarını %30 - %50 oranında aşmak.'),
('Madde 51/2-c', 'Hız sınırlarını %50''den fazla aşmak.'),
('Madde 47/1-b', 'Kırmızı ışık kuralına uymamak.'),
('Madde 48/5', 'Alkollü araç kullanmak.'),
('Madde 78/1-a', 'Emniyet kemeri takmamak.'),
('Madde 73/c', 'Seyir halinde cep telefonu kullanmak.'),
('Madde 36/3-a', 'Ehliyetsiz araç kullanmak.'),
-- TRAFİK KUSURLARI
('Asli Kusur 1', 'Kırmızı ışıkta veya dur işaretinde geçmek.'),
('Asli Kusur 2', 'Taşıt giremez levhasının bulunduğu yola girmek (Ters Yön).'),
('Asli Kusur 3', 'İkiden fazla şeritli yollarda karşı şeride girmek.'),
('Asli Kusur 4', 'Arkadan çarpmak.'),
('Asli Kusur 5', 'Geçme yasağı olan yerlerde araç geçmek.'),
('Asli Kusur 6', 'Dönüş manevralarını yanlış yapmak.'),
('Asli Kusur 7', 'Şeride tecavüz etmek.'),
('Asli Kusur 8', 'Kavşaklarda geçiş önceliğine uymamak.'),
('Asli Kusur 9', 'Kaplamanın dar olduğu yerlerde geçiş önceliğine uymamak.'),
('Asli Kusur 10', 'Manevraları düzenleyen genel şartlara uymamak.'),
('Asli Kusur 11', 'Yerleşim yerleri dışındaki yollarda duraklama veya park etme.'),
('Asli Kusur 12', 'Park etmiş araca çarpmak.'),
-- 2918 SAYILI KANUN MADDELERİ
('Madde 23', 'Araç tescil belgesini araçta bulundurmamak.'),
('Madde 25', 'Tescilsiz araçla trafiğe çıkmak.'),
('Madde 26', 'Araçta yapılan teknik değişikliği 30 gün içinde bildirmemek.'),
('Madde 30/1-a', 'Bozuk ışık donanımı ile araç kullanmak.'),
('Madde 30/1-b', 'Mevzuata uygun olmayan lastik (kel lastik) kullanmak.'),
('Madde 34', 'Muayenesi yapılmamış araçla trafiğe çıkmak.'),
('Madde 36', 'Sürücü belgesiz araç kullanmak veya yetersiz ehliyetle sürmek.'),
('Madde 44/1-b', 'Araç kullanırken sürücü belgesini yanında bulundurmamak.'),
('Madde 46/2-c', 'Şerit izleme ve değiştirme kurallarına uymamak (Makas atmak).'),
('Madde 46/2-d', 'Zorunlu bir neden olmadıkça sol şeridi sürekli işgal etmek.'),
('Madde 47/1-a', 'Trafik polisinin dur ikazına uymamak.'),
('Madde 47/1-c', 'Trafik işaret levhalarına uymamak.'),
('Madde 47/1-d', 'Yer işaretlemelerine (yol çizgilerine) uymamak.'),
('Madde 48/5', 'Hususi araçlarda 0.50 promil üzeri alkollü araç kullanmak.'),
('Madde 52/1-a', 'Kavşaklara yaklaşırken hızını azaltmamak.'),
('Madde 53/1-b', 'Sağa dönüş kurallarına uymamak.'),
('Madde 54/1-b', 'Hatalı sollama yapmak.'),
('Madde 56/1-c', 'Öndeki aracı güvenli mesafeden takip etmemek (Takip mesafesi).'),
('Madde 64/1-b-1', 'Geceleyin karşılaşmalarda uzun hüzmeli farları kullanmak (Kısa yakılmalı).'),
('Madde 67', 'Yönetmelikte belirtilen park etme esaslarına uymamak.'),
('Madde 49', 'Taşıt kullanma sürelerine uymamak (Ticari).'),
('Madde 65/1-a', 'Taşıma sınırı üzerinde yük almak.'),
('Madde 81/1-a', 'Trafik kazasına karışıp kaza mahallinde durmamak.'),
('Madde 91', 'Zorunlu Mali Sorumluluk Sigortasını yaptırmamak.');
```

"Success" mesajını görünce tablolar tamam demektir! ✅

## 3. Depolama (Storage) Ayarı

Anı defterine fotoğraf yükleyebilmek için bir "Bucket" açmalıyız.

1.  Sol menüden **Storage** ikonuna tıklayın.
2.  **New Bucket** butonuna basın.
3.  **Name project:** `memory-photos` (Bu ismi aynen yazın!)
4.  **Public bucket** seçeneğini **AÇIK (ON)** yapın. (Bu çok önemli!)
5.  **Save** diyerek kaydedin.
6.  Bucket oluştuktan sonra, **Configuration** sekmesine gidin ve **Policies** kısmından "New Policy" diyerek *Give users access to all files* gibi hazır bir template seçip "Insert", "Update", "Select" izinlerinin hepsini verip kaydedin. (Veya SQL ile halledebiliriz ama arayüzden "Public" seçmek yeterli olabilir).

## 4. Bağlantı Bilgilerini Alma

1.  Sol menüden **Project Settings** (Dişli çark) > **API** kısmına gidin.
2.  **Project URL** değerini kopyalayın.
3.  **Project API Keys** altındaki `anon` `public` key'i kopyalayın.

## 5. Siteye Entegre Etme

Bu bilgileri bana (AI Asistanına) iletebilirsin veya kendin ekleyebilirsin:

1.  Masaüstündeki `website/js/supabase-client.js` dosyasını açın.
2.  En üstteki satırlara yapııştırın:

```javascript
const SUPABASE_URL = 'https://sizin-proje-urlniz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJxbG...sizin-uzun-anon-keyiniz...';
```

Kaydettikten sonra siteniz çalışmaya hazır! 🎉
