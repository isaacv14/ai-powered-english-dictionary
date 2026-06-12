/**
 * Synonym linking utility.
 * Converts raw synonym strings into properly formatted links.
 * Used by the frontend component to render clickable synonym tags.
 */

import { slugify } from "./normalization";

export type SynonymLink = {
  text: string; // Display text (e.g., "findable")
  slug: string; // URL slug (e.g., "findable")
  href: string; // Full href path (e.g., "/word/findable")
};

/**
 * Converts a list of synonym strings into SynonymLink objects.
 * Each link can be used as a clickable tag pointing to the word's page.
 *
 * @param synonyms - Array of synonym strings
 * @returns Array of SynonymLink objects with slugs and hrefs
 * @example
 *   generateSynonymLinks(["findable", "searchable", "accessible"])
 *   // Returns:
 *   // [
 *   //   { text: "findable", slug: "findable", href: "/word/findable" },
 *   //   { text: "searchable", slug: "searchable", href: "/word/searchable" },
 *   //   { text: "accessible", slug: "accessible", href: "/word/accessible" }
 *   // ]
 */
export function generateSynonymLinks(synonyms: string[]): SynonymLink[] {
  return synonyms
    .map((synonym) => {
      const trimmed = synonym.trim();
      if (!trimmed) return null;

      try {
        const slug = slugify(trimmed);
        return {
          text: trimmed,
          slug: slug,
          href: `/word/${slug}`,
        };
      } catch {
        // If slugification fails, skip this synonym
        return null;
      }
    })
    .filter((link): link is SynonymLink => link !== null);
}

/**
 * Generates an href path for a given synonym.
 * Useful when you already have a synonym string and just need the path.
 *
 * @param synonym - The synonym string
 * @returns The href path (e.g., "/word/findable") or null if invalid
 */
export function getSynonymHref(synonym: string): string | null {
  try {
    const slug = slugify(synonym);
    return `/word/${slug}`;
  } catch {
    return null;
  }
}

/**
 * Generates a slug for a synonym without the full href.
 * Useful when constructing data structures.
 *
 * @param synonym - The synonym string
 * @returns The slug or null if invalid
 */
export function getSynonymSlug(synonym: string): string | null {
  try {
    return slugify(synonym);
  } catch {
    return null;
  }
}
