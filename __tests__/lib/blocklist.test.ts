/**
 * Tests for blocklist and synonym utilities.
 * Run with: npm test __tests__/lib/blocklist.test.ts
 */

import {
  BLOCKLIST,
  isBlocklisted,
  blockTerm,
  unblockTerm,
  getBlocklistSize,
} from "../../lib/constants/blocklist";

describe("Blocklist", () => {
  describe("isBlocklisted", () => {
    test("should return true for blocked terms", () => {
      expect(isBlocklisted("fuck")).toBe(true);
      expect(isBlocklisted("porn")).toBe(true);
      expect(isBlocklisted("xxx")).toBe(true);
    });

    test("should return false for non-blocked terms", () => {
      expect(isBlocklisted("apple")).toBe(false);
      expect(isBlocklisted("learning")).toBe(false);
    });

    test("should check against the BLOCKLIST set", () => {
      const initialSize = getBlocklistSize();
      expect(BLOCKLIST.size).toBe(initialSize);
    });
  });

  describe("blockTerm", () => {
    test("should add a term to the blocklist", () => {
      const initialSize = getBlocklistSize();
      blockTerm("newbadword");
      expect(isBlocklisted("newbadword")).toBe(true);
      expect(getBlocklistSize()).toBe(initialSize + 1);

      // Cleanup
      unblockTerm("newbadword");
    });

    test("should handle adding duplicate terms (Set behavior)", () => {
      const initialSize = getBlocklistSize();
      blockTerm("testterm");
      blockTerm("testterm"); // Add again
      // Set should not increase on duplicate
      expect(getBlocklistSize()).toBe(initialSize + 1);

      // Cleanup
      unblockTerm("testterm");
    });
  });

  describe("unblockTerm", () => {
    test("should remove a term from the blocklist", () => {
      blockTerm("removeme");
      expect(isBlocklisted("removeme")).toBe(true);

      unblockTerm("removeme");
      expect(isBlocklisted("removeme")).toBe(false);
    });

    test("should not throw when removing non-existent term", () => {
      expect(() => unblockTerm("nonexistent")).not.toThrow();
    });
  });

  describe("getBlocklistSize", () => {
    test("should return a number", () => {
      expect(typeof getBlocklistSize()).toBe("number");
    });

    test("should return size > 0", () => {
      expect(getBlocklistSize()).toBeGreaterThan(0);
    });

    test("should update correctly when terms are added/removed", () => {
      const initial = getBlocklistSize();
      blockTerm("temp1");
      expect(getBlocklistSize()).toBe(initial + 1);
      unblockTerm("temp1");
      expect(getBlocklistSize()).toBe(initial);
    });
  });
});

// Synonym tests
import {
  generateSynonymLinks,
  getSynonymHref,
  getSynonymSlug,
} from "../../lib/utils/synonyms";

describe("Synonym utilities", () => {
  describe("generateSynonymLinks", () => {
    test("should convert synonyms to link objects", () => {
      const links = generateSynonymLinks(["findable", "searchable"]);
      expect(links).toHaveLength(2);
      expect(links[0]).toEqual({
        text: "findable",
        slug: "findable",
        href: "/word/findable",
      });
      expect(links[1]).toEqual({
        text: "searchable",
        slug: "searchable",
        href: "/word/searchable",
      });
    });

    test("should handle multi-word synonyms", () => {
      const links = generateSynonymLinks(["well known", "easily found"]);
      expect(links).toHaveLength(2);
      expect(links[0].slug).toBe("well-known");
      expect(links[0].href).toBe("/word/well-known");
    });

    test("should skip empty strings and null values", () => {
      const links = generateSynonymLinks(["apple", "", "  ", "banana"]);
      expect(links).toHaveLength(2);
      expect(links.map((l) => l.text)).toEqual(["apple", "banana"]);
    });

    test("should trim whitespace from synonyms", () => {
      const links = generateSynonymLinks(["  apple  ", "banana"]);
      expect(links[0].text).toBe("apple");
    });

    test("should handle special characters in multi-word synonyms", () => {
      const links = generateSynonymLinks(["don't know", "well-known"]);
      expect(links).toHaveLength(2);
      // Check that slugs are valid
      expect(links[0].slug).toBeDefined();
      expect(links[1].slug).toBe("well-known");
    });

    test("should return empty array for empty input", () => {
      const links = generateSynonymLinks([]);
      expect(links).toHaveLength(0);
    });

    test("should filter out invalid synonyms", () => {
      // Input with some invalid characters that would fail slugification
      const links = generateSynonymLinks(["apple", "test@bad"]);
      // "test@bad" should be filtered out
      expect(links.length).toBeLessThanOrEqual(1);
    });
  });

  describe("getSynonymHref", () => {
    test("should return correct href for single word", () => {
      expect(getSynonymHref("apple")).toBe("/word/apple");
    });

    test("should return correct href for multi-word synonym", () => {
      expect(getSynonymHref("well known")).toBe("/word/well-known");
    });

    test("should return null for invalid input", () => {
      expect(getSynonymHref("test@invalid")).toBeNull();
    });

    test("should return null for empty string", () => {
      expect(getSynonymHref("")).toBeNull();
    });
  });

  describe("getSynonymSlug", () => {
    test("should return slug for single word", () => {
      expect(getSynonymSlug("apple")).toBe("apple");
    });

    test("should return slug for multi-word synonym", () => {
      expect(getSynonymSlug("well known")).toBe("well-known");
    });

    test("should return null for invalid input", () => {
      expect(getSynonymSlug("test$invalid")).toBeNull();
    });

    test("should handle case normalization", () => {
      expect(getSynonymSlug("Apple")).toBe("apple");
    });
  });
});
