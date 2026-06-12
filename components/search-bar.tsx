"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/normalization";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      const slug = slugify(trimmed);
      router.push(`/word/${slug}`);
    } catch {
      setError("Please enter a valid word (letters, numbers, and hyphens only).");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError(null);
            }}
            placeholder='Search for a word... e.g. "discoverable"'
            className="w-full px-4 py-3 pr-28 rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
