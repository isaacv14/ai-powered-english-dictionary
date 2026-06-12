-- Create words table
CREATE TABLE IF NOT EXISTS words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    word TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'ai_generated' CHECK (source IN ('ai_generated', 'verified')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_words_slug ON words (slug);

-- Create word_senses table
CREATE TABLE IF NOT EXISTS word_senses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    part_of_speech TEXT NOT NULL,
    meaning TEXT NOT NULL,
    synonyms JSONB NOT NULL DEFAULT '[]',
    examples JSONB NOT NULL DEFAULT '[]',
    order_index INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_word_senses_word_id ON word_senses (word_id);
