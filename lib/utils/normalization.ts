/**
 * Input normalization and validation utilities.
 * Used by both frontend and backend to ensure consistent handling of search input.
 */

import { ValidationError } from "../types";

// Constants for validation
const MIN_LENGTH = 1;
const MAX_LENGTH = 100;
const VALID_CHAR_PATTERN = /^[a-z0-9\s\-']+$/i;

/**
 * Normalizes a search term into a URL-friendly slug.
 * - Trims whitespace
 * - Converts to lowercase
 * - Removes punctuation except hyphens and spaces
 * - Replaces multiple spaces/hyphens with single separator
 *
 * @param input - Raw search input from user
 * @returns Normalized slug (e.g., "my-search-term")
 * @throws ValidationError if input fails validation
 */
export function normalizeSearchTerm(input: string): string {
  if (!input) {
    throw {
      code: "empty_input",
      message: "Search term cannot be empty",
    } as ValidationError;
  }

  // Trim and convert to lowercase
  let normalized = input.trim().toLowerCase();

  // Check length before processing
  if (normalized.length < MIN_LENGTH) {
    throw {
      code: "too_short",
      message: `Search term must be at least ${MIN_LENGTH} character long`,
    } as ValidationError;
  }

  if (normalized.length > MAX_LENGTH) {
    throw {
      code: "too_long",
      message: `Search term must be shorter than ${MAX_LENGTH} characters`,
    } as ValidationError;
  }

  // Check for valid characters (letters, numbers, spaces, hyphens, apostrophes)
  if (!VALID_CHAR_PATTERN.test(normalized)) {
    throw {
      code: "invalid_characters",
      message:
        "Search term can only contain letters, numbers, spaces, hyphens, and apostrophes",
    } as ValidationError;
  }

  // Remove extra whitespace and normalize separators
  normalized = normalized.replace(/\s+/g, "-").replace(/-+/g, "-");

  // Remove leading/trailing hyphens
  normalized = normalized.replace(/^-+|-+$/g, "");

  // Final length check after normalization
  if (normalized.length === 0) {
    throw {
      code: "empty_input",
      message: "Search term results in an empty slug after normalization",
    } as ValidationError;
  }

  return normalized;
}

/**
 * Alias for normalizeSearchTerm - both functions serve the same purpose.
 * Converts raw input into a normalized, URL-friendly slug.
 *
 * @param input - Raw search input from user
 * @returns Normalized slug
 */
export function slugify(input: string): string {
  return normalizeSearchTerm(input);
}

/**
 * Validates a search term without throwing errors.
 * Returns validation errors in an object instead.
 *
 * @param input - Raw search input to validate
 * @returns { valid: true } or { valid: false, error: ValidationError }
 */
export function validateSearchTerm(
  input: string
): { valid: true } | { valid: false; error: ValidationError } {
  try {
    normalizeSearchTerm(input);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error as ValidationError };
  }
}

/**
 * Checks if a search term is a candidate for a word search.
 * Performs basic heuristics - at least 2 characters, looks like a word.
 *
 * @param term - Normalized term to check
 * @returns true if term looks like a valid word
 */
export function looksLikeWord(term: string): boolean {
  // At minimum, 2 chars and contains at least one letter
  if (term.length < 2) return false;
  if (!/[a-z]/i.test(term)) return false;

  // Reject if it's all hyphens or all numbers
  if (!/[a-z]/i.test(term)) return false;

  return true;
}
