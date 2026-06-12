export type {
  WordSense,
  WordEntry,
  WordEntryInput,
  AIGenerationError,
  ValidationError,
  ApiError,
  ApiResponse,
} from "./types";

export {
  normalizeSearchTerm,
  slugify,
  validateSearchTerm,
  looksLikeWord,
} from "./utils/normalization";

export type { SynonymLink } from "./utils/synonyms";
export {
  generateSynonymLinks,
  getSynonymHref,
  getSynonymSlug,
} from "./utils/synonyms";

export {
  BLOCKLIST,
  isBlocklisted,
  blockTerm,
  unblockTerm,
  getBlocklistSize,
} from "./constants/blocklist";

export type { RecentlyAddedWord } from "./utils/recent-words";
export {
  getRecentlyAddedWords,
  formatRecentWord,
} from "./utils/recent-words";

export { getSupabaseClient } from "./supabase";
export { getGeminiClient } from "./gemini";
export { SYSTEM_PROMPT, buildUserPrompt } from "./ai-prompt";
export { checkRateLimit, resetRateLimit } from "./rate-limit";
export {
  getWordBySlug,
  insertWord,
  getAllSlugs,
  getRecentWords,
} from "./supabase-queries";
