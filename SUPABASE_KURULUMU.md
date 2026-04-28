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

-- LEVHALAR (HERKESE AÇIK)
CREATE TABLE IF NOT EXISTS signs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL, -- Emoji veya ikon kodu
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- HIZ LİMİTLERİ (HERKESE AÇIK)
CREATE TABLE IF NOT EXISTS speed_limits (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    "limit" TEXT NOT NULL, -- HATA DÜZELTİLDİ: "limit" özel kelimedir, tırnak içine alındı.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- GÜVENLİK AYARLARI (RLS) - Şimdilik herkese açık (Public)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE fine_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE speed_limits ENABLE ROW LEVEL SECURITY;

-- Herkesin okuyup yazabilmesine izin veren politikalar
CREATE POLICY "Public Profiles" ON user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Poems" ON poems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Memories" ON memories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Chat" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Games" ON game_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Fine Notes" ON fine_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Flashcards" ON flashcards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Signs" ON signs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Speed Limits" ON speed_limits FOR ALL USING (true) WITH CHECK (true);

-- Realtime özelliğini aç (Chat için gerekli)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table chat_messages;
commit;

-- VARSAYILAN VERİLERİ EKLE
INSERT INTO speed_limits (type, "limit") VALUES
('Yerleşim Yeri İçinde', '50'),
('Şehirlerarası Çift Yönlü', '90'),
('Bölünmüş Yollar', '110'),
('Otoyollar', '120'),
('Okul Bölgesi', '30');

INSERT INTO signs (name, icon, description) VALUES
('DUR', '🛑', 'Kavşaklarda durarak kontrol etmeniz gerektiğini belirtir.'),
('Girişi Olmayan Yol', '⛔', 'Bu yönden araç girişinin yasak olduğunu belirtir.'),
('Dikkat', '⚠️', 'Tehlike uyarısı. Hızınızı azaltın.'),
('Park Yapılmaz', '🚫', 'Belirtilen alana park etmek yasaktır.'),
('Yaya Geçidi', '🚸', 'Yaya geçidine yaklaşıldığını bildirir.'),
('Kaygan Yol', '🛣️', 'Yol yüzeyinin kaygan olabileceğini belirtir.');

INSERT INTO flashcards (term, definition) VALUES
('Madde 51/2-a', 'Hız sınırlarını %10 - %30 oranında aşmak.'),
('Madde 51/2-b', 'Hız sınırlarını %30 - %50 oranında aşmak.'),
('Madde 51/2-c', 'Hız sınırlarını %50''den fazla aşmak.'),
('Madde 47/1-b', 'Kırmızı ışık kuralına uymamak.'),
('Madde 48/5', 'Alkollü araç kullanmak.'),
('Madde 78/1-a', 'Emniyet kemeri takmamak.'),
('Madde 73/c', 'Seyir halinde cep telefonu kullanmak.'),
('Madde 36/3-a', 'Ehliyetsiz araç kullanmak.');
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

Bilgileri masaüstündeki `website/js/supabase-client.js` dosyasına eklediğinizden emin olun.

Kaydettikten sonra siteniz çalışmaya hazır! 🎉
