/**
 * Recently-added words utilities.
 * Used to fetch and display the N most recently added words on the home page.
 */

import { WordEntry } from "../types";

export type RecentlyAddedWord = Pick<
  WordEntry,
  "slug" | "word" | "created_at"
> & {
  primary_meaning: string; // The meaning from the first sense
};

/**
 * This function would normally query the database.
 * For now, it's a placeholder that the backend will implement.
 *
 * @param limit - Maximum number of words to fetch (default: 10)
 * @returns Array of recently-added words
 * @note Backend implementation should query the `words` table ordered by
 *       created_at DESC, limit N, and join with word_senses to get primary_meaning
 */
export async function getRecentlyAddedWords(
  limit: number = 10
): Promise<RecentlyAddedWord[]> {
  // This would be implemented by Agent 1 in the backend API route
  // For now, returning an empty array as placeholder
  try {
    const response = await fetch(`/api/words/recent?limit=${limit}`);
    if (!response.ok) {
      console.error("Failed to fetch recently added words:", response.status);
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching recently added words:", error);
    return [];
  }
}

/**
 * Formats a recently-added word for display.
 * Useful for standardizing how recent words are shown across the app.
 *
 * @param word - The recently-added word to format
 * @returns Formatted display object
 */
export function formatRecentWord(word: RecentlyAddedWord): {
  title: string;
  description: string;
  href: string;
  dateAdded: string;
} {
  return {
    title: word.word,
    description:
      word.primary_meaning.length > 100
        ? word.primary_meaning.substring(0, 100) + "..."
        : word.primary_meaning,
    href: `/word/${word.slug}`,
    dateAdded: new Date(word.created_at).toLocaleDateString("en-US"),
  };
}
