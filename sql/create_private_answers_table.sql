-- ÖZEL ODA (PRIVATE ROOM) TABLOSU
-- Bu tablo "Onunla beraber olsaydın ne yapardın?" sorusuna verilen cevapları saklar

CREATE TABLE IF NOT EXISTS private_answers (
    id BIGSERIAL PRIMARY KEY,
    character TEXT NOT NULL CHECK (character IN ('rabbit', 'fox')),
    answer_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_private_answers_character ON private_answers(character);
CREATE INDEX IF NOT EXISTS idx_private_answers_created_at ON private_answers(created_at DESC);

-- RLS (Row Level Security) Politikaları
ALTER TABLE private_answers ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Herkes private_answers okuyabilir"
    ON private_answers
    FOR SELECT
    USING (true);

-- Herkes ekleyebilir
CREATE POLICY "Herkes private_answers ekleyebilir"
    ON private_answers
    FOR INSERT
    WITH CHECK (true);

-- Tablo oluşturuldu!
-- Artık Tavşan ve Tilki cevaplarını kaydedebilir ve görüntüleyebilirsiniz.
