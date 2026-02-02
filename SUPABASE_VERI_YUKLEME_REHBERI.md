# ✅ Hata Düzeltme ve Veri Yükleme Rehberi

Alınan `syntax error at or near "limit"` hatasının sebebi, `limit` kelimesinin SQL dilinde özel bir komut (örneğin `LIMIT 10`) olmasıdır. Bu yüzden sütun adı olarak kullanıldığında tırnak içine alınması gerekir (`"limit"`).

Aşağıdaki SQL kodlarını sırasıyla Supabase **SQL Editor** kısmına yapıştırıp çalıştırın.

## ADIM 1: Önceki Hatalı Tabloları Temizle (Opsiyonel ama Önerilir)

Eğer tabloları yarım yamalak oluşturduysanız, temiz bir başlangıç için önce bunları silip tekrar oluşturmak en iyisidir.

```sql
DROP TABLE IF EXISTS speed_limits;
DROP TABLE IF EXISTS signs;
DROP TABLE IF EXISTS flashcards;
DROP TABLE IF EXISTS fine_notes;
```

## ADIM 2: Tabloları Doğru Şekilde Oluştur

Aşağıdaki kodu çalıştırarak tabloları yeniden ve hatasız oluşturun. `limit` sütununu artık çift tırnak (`"limit"`) ile koruyoruz veya farklı bir isim (`speed_value`) de verebilirdik ama kodlarınızda `limit` olduğu için tırnakla çözeceğiz.

```sql
-- 1. LEVHALAR TABLOSU
CREATE TABLE IF NOT EXISTS signs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. HIZ LİMİTLERİ TABLOSU (HATA DÜZELDİ: "limit" özel kelimedir)
CREATE TABLE IF NOT EXISTS speed_limits (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    "limit" TEXT NOT NULL, -- Tırnak içine aldık!
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. EZBER KARTLARI TABLOSU
CREATE TABLE IF NOT EXISTS flashcards (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. CEZA NOTLARI TABLOSU
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
```

## ADIM 3: Verileri Yükle

Şimdi verileri içeri aktaralım.

```sql
-- HIZ LİMİTLERİ VERİLERİ (Tırnaklı "limit" sütununa dikkat)
INSERT INTO speed_limits (type, "limit") VALUES
('Yerleşim Yeri İçinde', '50'),
('Şehirlerarası Çift Yönlü', '90'),
('Bölünmüş Yollar', '110'),
('Otoyollar', '120'),
('Okul Bölgesi', '30');

-- LEVHA VERİLERİ
INSERT INTO signs (name, icon, description) VALUES
('DUR', '🛑', 'Kavşaklarda durarak kontrol etmeniz gerektiğini belirtir.'),
('Girişi Olmayan Yol', '⛔', 'Bu yönden araç girişinin yasak olduğunu belirtir.'),
('Dikkat', '⚠️', 'Tehlike uyarısı. Hızınızı azaltın.'),
('Park Yapılmaz', '🚫', 'Belirtilen alana park etmek yasaktır.'),
('Yaya Geçidi', '🚸', 'Yaya geçidine yaklaşıldığını bildirir.'),
('Kaygan Yol', '🛣️', 'Yol yüzeyinin kaygan olabileceğini belirtir.');

-- EZBER KARTLARI (Tam Liste)
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
-- KANUN MADDELERİ
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

## ADIM 4: Güvenlik Ayarlarını Yap (RLS)

Son olarak bu tablolara erişimi açalım.

```sql
-- RLS Aktifleştir
ALTER TABLE signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE speed_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE fine_notes ENABLE ROW LEVEL SECURITY;

-- Politikaları Oluştur (Zaten varsa hata verebilir, sorun değil)
CREATE POLICY "Public Signs" ON signs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Speed Limits" ON speed_limits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Flashcards" ON flashcards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Fine Notes" ON fine_notes FOR ALL USING (true) WITH CHECK (true);
```
