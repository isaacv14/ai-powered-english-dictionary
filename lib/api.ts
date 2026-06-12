import type { WordEntry } from "@/lib/types";

export type WordApiSuccess = WordEntry;

export type WordApiError =
  | { error: "not_found"; suggestion?: string | null }
  | { error: "validation_error"; message: string }
  | { error: "rate_limited"; message: string; retryAfter: number }
  | { error: "blocklisted"; message: string };

export type WordApiResponse = WordApiSuccess | WordApiError;

import { mockWords } from "./mock-data";

function findClosestSuggestion(slug: string): string | null {
  const keys = Object.keys(mockWords);
  if (keys.length === 0) return null;
  const sameLetter = keys.find((k) => k[0] === slug[0] && k !== slug);
  return sameLetter ?? keys[0];
}

export async function fetchWord(slug: string): Promise<WordApiResponse> {
  const res = await fetch(`/api/word/${slug}`, { cache: "no-store" });
  const data: WordApiResponse = await res.json();

  if (!res.ok && !("error" in data)) {
    throw new Error(`API returned ${res.status}`);
  }

  return data;
}

export async function fetchWordWithMockFallback(
  slug: string
): Promise<WordApiResponse> {
  const useMock =
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_MOCK === "true";

  if (useMock) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const word = mockWords[slug];
    if (word) return word;
    return { error: "not_found", suggestion: findClosestSuggestion(slug) };
  }

  return fetchWord(slug);
}
