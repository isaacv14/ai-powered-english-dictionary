/**
 * Tests for normalization utilities.
 * Run with: npm test __tests__/lib/normalization.test.ts
 *
 * Uses Jest syntax (compatible with Jest, Vitest, and other test runners).
 * To run: First install Jest: npm install --save-dev jest @types/jest ts-jest
 * Then add to package.json: "test": "jest"
 */

import {
  normalizeSearchTerm,
  slugify,
  validateSearchTerm,
  looksLikeWord,
} from "../../lib/utils/normalization";
import { ValidationError } from "../../lib/types";

describe("normalizeSearchTerm", () => {
  describe("valid inputs", () => {
    test("should normalize a simple word", () => {
      expect(normalizeSearchTerm("Apple")).toBe("apple");
    });

    test("should handle multi-word phrases with spaces", () => {
      expect(normalizeSearchTerm("Hello World")).toBe("hello-world");
    });

    test("should preserve hyphens in hyphenated words", () => {
      expect(normalizeSearchTerm("well-known")).toBe("well-known");
    });

    test("should handle apostrophes in contractions", () => {
      expect(normalizeSearchTerm("don't")).toBe("don't");
    });

    test("should normalize multiple spaces to single hyphen", () => {
      expect(normalizeSearchTerm("hello   world")).toBe("hello-world");
    });

    test("should trim leading and trailing whitespace", () => {
      expect(normalizeSearchTerm("  apple  ")).toBe("apple");
    });

    test("should remove leading and trailing hyphens", () => {
      expect(normalizeSearchTerm("--apple--")).toBe("apple");
    });

    test("should collapse multiple hyphens", () => {
      expect(normalizeSearchTerm("hello---world")).toBe("hello-world");
    });

    test("should handle numbers", () => {
      expect(normalizeSearchTerm("test123")).toBe("test123");
    });

    test("should handle mixed case and spaces and hyphens", () => {
      expect(normalizeSearchTerm("  Hello - World  ")).toBe("hello-world");
    });
  });

  describe("invalid inputs", () => {
    test("should throw on empty string", () => {
      expect(() => normalizeSearchTerm("")).toThrow();
      try {
        normalizeSearchTerm("");
      } catch (error) {
        expect((error as ValidationError).code).toBe("empty_input");
      }
    });

    test("should throw on whitespace-only string", () => {
      expect(() => normalizeSearchTerm("   ")).toThrow();
      try {
        normalizeSearchTerm("   ");
      } catch (error) {
        expect((error as ValidationError).code).toBe("empty_input");
      }
    });

    test("should throw on special characters", () => {
      expect(() => normalizeSearchTerm("hello@world")).toThrow();
      try {
        normalizeSearchTerm("hello@world");
      } catch (error) {
        expect((error as ValidationError).code).toBe("invalid_characters");
      }
    });

    test("should throw on exclamation marks", () => {
      expect(() => normalizeSearchTerm("hello!")).toThrow();
    });

    test("should throw on symbols", () => {
      expect(() => normalizeSearchTerm("hello$world")).toThrow();
    });

    test("should throw on very long input", () => {
      const longString = "a".repeat(150);
      expect(() => normalizeSearchTerm(longString)).toThrow();
      try {
        normalizeSearchTerm(longString);
      } catch (error) {
        expect((error as ValidationError).code).toBe("too_long");
      }
    });

    test("should throw on only hyphens", () => {
      expect(() => normalizeSearchTerm("---")).toThrow();
      try {
        normalizeSearchTerm("---");
      } catch (error) {
        expect((error as ValidationError).code).toBe("empty_input");
      }
    });

    test("should throw on punctuation marks", () => {
      expect(() => normalizeSearchTerm("hello.world")).toThrow();
      expect(() => normalizeSearchTerm("hello,world")).toThrow();
      expect(() => normalizeSearchTerm("hello?world")).toThrow();
    });
  });

  describe("edge cases", () => {
    test("should handle single character", () => {
      expect(normalizeSearchTerm("a")).toBe("a");
    });

    test("should handle unicode letters (might not be valid based on regex)", () => {
      // This depends on if your regex accepts unicode
      // Current implementation uses [a-z] so unicode letters would fail
      expect(() => normalizeSearchTerm("café")).toThrow();
    });

    test("should normalize uppercase to lowercase", () => {
      expect(normalizeSearchTerm("HELLO")).toBe("hello");
    });

    test("should handle mixed case with multiple words", () => {
      expect(normalizeSearchTerm("HeLLo WoRLd")).toBe("hello-world");
    });
  });
});

describe("slugify", () => {
  test("should be an alias for normalizeSearchTerm", () => {
    expect(slugify("Hello World")).toBe(normalizeSearchTerm("Hello World"));
    expect(slugify("test-word")).toBe(normalizeSearchTerm("test-word"));
  });

  test("should handle the same cases as normalizeSearchTerm", () => {
    expect(slugify("Well-Known")).toBe("well-known");
    expect(() => slugify("hello@world")).toThrow();
  });
});

describe("validateSearchTerm", () => {
  test("should return {valid: true} for valid input", () => {
    expect(validateSearchTerm("apple")).toEqual({ valid: true });
    expect(validateSearchTerm("Hello World")).toEqual({ valid: true });
  });

  test("should return {valid: false, error} for invalid input", () => {
    const result = validateSearchTerm("hello@world");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error.code).toBe("invalid_characters");
    }
  });

  test("should not throw - errors are caught and returned", () => {
    expect(() => validateSearchTerm("")).not.toThrow();
    expect(() => validateSearchTerm("hello@")).not.toThrow();
  });

  test("should validate empty input gracefully", () => {
    const result = validateSearchTerm("");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error.code).toBe("empty_input");
    }
  });
});

describe("looksLikeWord", () => {
  test("should return true for valid words", () => {
    expect(looksLikeWord("hello")).toBe(true);
    expect(looksLikeWord("well-known")).toBe(true);
    expect(looksLikeWord("test123")).toBe(true);
  });

  test("should return false for single character", () => {
    expect(looksLikeWord("a")).toBe(false);
  });

  test("should return false for all numbers", () => {
    expect(looksLikeWord("12345")).toBe(false);
  });

  test("should return false for all hyphens", () => {
    expect(looksLikeWord("---")).toBe(false);
  });

  test("should return true for words with at least one letter", () => {
    expect(looksLikeWord("test1")).toBe(true);
    expect(looksLikeWord("hello-123")).toBe(true);
  });
});
