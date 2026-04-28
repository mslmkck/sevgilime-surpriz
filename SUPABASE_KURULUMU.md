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
-- 1. KULLANICI PROFİLLERİ
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    profile_type TEXT DEFAULT 'rabbit',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ŞİİRLER
CREATE TABLE IF NOT EXISTS poems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ANILAR
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    slot_number INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, slot_number)
);

-- 4. SOHBET MESAJLARI
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    sender TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. OYUN SKORLARI
CREATE TABLE IF NOT EXISTS game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_type TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    result_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. DUYGU DURUMU (MOOD TRACKER)
CREATE TABLE IF NOT EXISTS mood_tracker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_role TEXT NOT NULL,
    mood_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ÖZEL ODA CEVAPLARI (PRIVATE ANSWERS)
CREATE TABLE IF NOT EXISTS private_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. GELECEĞE MEKTUPLAR (FUTURE LETTERS)
CREATE TABLE IF NOT EXISTS future_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    content TEXT NOT NULL,
    sender TEXT NOT NULL,
    unlock_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CEZA NOTLARI
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

-- 10. EZBER KARTLARI
CREATE TABLE IF NOT EXISTS flashcards (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. LEVHALAR
CREATE TABLE IF NOT EXISTS signs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. HIZ LİMİTLERİ
CREATE TABLE IF NOT EXISTS speed_limits (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    "limit" TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- GÜVENLİK AYARLARI (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE future_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE fine_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE speed_limits ENABLE ROW LEVEL SECURITY;

-- Politikalar
CREATE POLICY "Public Profiles" ON user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Poems" ON poems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Memories" ON memories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Chat" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Games" ON game_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Mood" ON mood_tracker FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Private Answers" ON private_answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Future Letters" ON future_letters FOR ALL USING (true) WITH CHECK (true);
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
('Yerleşim Yeri İçinde', '50'), ('Şehirlerarası Çift Yönlü', '90'), ('Bölünmüş Yollar', '110'), ('Otoyollar', '120'), ('Okul Bölgesi', '30');

INSERT INTO signs (name, icon, description) VALUES
('DUR', '🛑', 'Dur kontrol et.'), ('Girişi Olmayan Yol', '⛔', 'Ters yön.'), ('Dikkat', '⚠️', 'Tehlike uyarısı.'), ('Park Yapılmaz', '🚫', 'Yasak.'), ('Yaya Geçidi', '🚸', 'Yavaşla.'), ('Kaygan Yol', '🛣️', 'Kaygan.');

INSERT INTO flashcards (term, definition) VALUES
('Madde 51/2-a', 'Hız %10-%30 aşımı.'), ('Madde 47/1-b', 'Kırmızı ışık.'), ('Madde 48/5', 'Alkol.'), ('Madde 78/1-a', 'Kemer.');
```

"Success" mesajını görünce tablolar tamam demektir! ✅

## 3. Depolama (Storage) Ayarı

1.  Sol menüden **Storage** ikonuna tıklayın.
2.  **New Bucket** butonuna basın.
3.  **Name:** `memory-photos` (Public bucket ON olsun).
4.  Policies kısmından her şeye izin verin.

## 4. Bağlantı Bilgilerini Alma

1.  **Project Settings** > **API** kısmına gidin.
2.  `Project URL` ve `anon` key'i kopyalayıp `supabase-client.js` içine yapıştırın.

Siteniz çalışmaya hazır! 🎉
