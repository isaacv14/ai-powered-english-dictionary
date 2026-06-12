import { getSupabaseClient } from "./supabase";
import type { WordEntry, WordSense } from "./types";

type DbWord = {
  id: string;
  slug: string;
  word: string;
  source: "ai_generated" | "verified";
  created_at: string;
};

type DbSense = {
  id: string;
  word_id: string;
  part_of_speech: string;
  meaning: string;
  synonyms: string[];
  examples: string[];
  order_index: number;
};

export async function getWordBySlug(slug: string): Promise<WordEntry | null> {
  const supabase = getSupabaseClient();
  const { data: word, error } = await supabase
    .from("words")
    .select("id, slug, word, source, created_at")
    .eq("slug", slug)
    .single<DbWord>();

  if (error || !word) {
    return null;
  }

  const { data: senses, error: sensesError } = await supabase
    .from("word_senses")
    .select("part_of_speech, meaning, synonyms, examples, order_index")
    .eq("word_id", word.id)
    .order("order_index", { ascending: true })
    .returns<DbSense[]>();

  if (sensesError || !senses) {
    return null;
  }

  return {
    slug: word.slug,
    word: word.word,
    source: word.source,
    created_at: word.created_at,
    senses: senses.map((s) => ({
      part_of_speech: s.part_of_speech,
      meaning: s.meaning,
      synonyms: s.synonyms,
      examples: s.examples,
    })),
  };
}

export async function insertWord(
  slug: string,
  word: string,
  source: "ai_generated" | "verified",
  senses: WordSense[]
): Promise<WordEntry | null> {
  const supabase = getSupabaseClient();
  const { data: wordRow, error: wordError } = await supabase
    .from("words")
    .insert({ slug, word, source } as never)
    .select("id, slug, word, source, created_at")
    .single<DbWord>();

  if (wordError || !wordRow) {
    return null;
  }

  const sensesRows = senses.map((sense, index) => ({
    word_id: wordRow.id,
    part_of_speech: sense.part_of_speech,
    meaning: sense.meaning,
    synonyms: sense.synonyms,
    examples: sense.examples,
    order_index: index,
  }));

  const { error: sensesError } = await supabase
    .from("word_senses")
    .insert(sensesRows as never);

  if (sensesError) {
    return null;
  }

  return {
    slug: wordRow.slug,
    word: wordRow.word,
    source: wordRow.source,
    created_at: wordRow.created_at,
    senses,
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("words")
    .select("slug");

  if (error || !data) {
    return [];
  }

  return data.map((row: { slug: string }) => row.slug);
}

export async function getRecentWords(limit: number = 10): Promise<WordEntry[]> {
  const supabase = getSupabaseClient();
  const { data: words, error } = await supabase
    .from("words")
    .select("id, slug, word, source, created_at")
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<DbWord[]>();

  if (error || !words) {
    return [];
  }

  const entries: WordEntry[] = [];

  for (const w of words) {
    const { data: senses } = await supabase
      .from("word_senses")
      .select("part_of_speech, meaning, synonyms, examples, order_index")
      .eq("word_id", w.id)
      .order("order_index", { ascending: true })
      .returns<DbSense[]>();

    entries.push({
      slug: w.slug,
      word: w.word,
      source: w.source,
      created_at: w.created_at,
      senses: (senses ?? []).map((s) => ({
        part_of_speech: s.part_of_speech,
        meaning: s.meaning,
        synonyms: s.synonyms,
        examples: s.examples,
      })),
    });
  }

  return entries;
}
