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

-- GÜVENLİK AYARLARI (RLS) - Şimdilik herkese açık (Public)
-- Gerçek bir uygulamada burayı daha sıkı tutabiliriz ama kişisel bir site için kolaylık sağlar.
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Herkesin okuyup yazabilmesine izin veren politikalar
CREATE POLICY "Public Profiles" ON user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Poems" ON poems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Memories" ON memories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Chat" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Games" ON game_scores FOR ALL USING (true) WITH CHECK (true);

-- Realtime özelliğini aç (Chat için gerekli)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table chat_messages;
commit;
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
