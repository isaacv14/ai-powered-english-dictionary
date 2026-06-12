"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { WordEntry } from "@/lib/types";
import { generateSynonymLinks } from "@/lib/utils/synonyms";
import { fetchWordWithMockFallback } from "@/lib/api";
import SearchBar from "@/components/search-bar";

type PageState =
  | { status: "loading" }
  | { status: "found"; data: WordEntry }
  | { status: "not_found"; suggestion?: string | null }
  | { status: "error"; message: string };

export default function WordPageClient({ slug }: { slug: string }) {
  const [state, setState] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState({ status: "loading" });
      try {
        const res = await fetchWordWithMockFallback(slug);
        if (cancelled) return;

        if ("error" in res) {
          if (res.error === "not_found") {
            setState({ status: "not_found", suggestion: res.suggestion });
          } else {
            setState({
              status: "error",
              message: res.message ?? "Something went wrong.",
            });
          }
        } else {
          setState({ status: "found", data: res });
        }
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            message: "Something went wrong. Please try again.",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="flex flex-col flex-1">
      <header className="w-full py-6 px-4 border-b border-zinc-200 dark:border-zinc-700">
        <SearchBar />
      </header>
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-10">
        {state.status === "loading" && <LoadingState slug={slug} />}
        {state.status === "found" && <WordDisplay data={state.data} />}
        {state.status === "not_found" && (
          <NotFoundState slug={slug} suggestion={state.suggestion} />
        )}
        {state.status === "error" && <ErrorState message={state.message} />}
      </main>
    </div>
  );
}

function LoadingState({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Generating definition for &ldquo;{slug}&rdquo;...
      </p>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
        This should only take a moment.
      </p>
    </div>
  );
}

function WordDisplay({ data }: { data: WordEntry }) {
  return (
    <article>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {data.word}
        </h1>
      </header>

      {data.senses.map((sense, i) => (
        <section
          key={i}
          className="mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4 dark:bg-blue-900 dark:text-blue-200">
            {sense.part_of_speech}
          </span>

          <div className="mb-4">
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 mb-1">
              Meaning
            </h2>
            <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              {sense.meaning}
            </p>
          </div>

          {sense.synonyms.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Synonyms
              </h2>
              <div className="flex flex-wrap gap-2">
                {generateSynonymLinks(sense.synonyms).map((link) => (
                  <Link
                    key={link.slug}
                    href={link.href}
                    className="px-3 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-sm hover:bg-blue-100 hover:text-blue-700 transition dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-blue-900 dark:hover:text-blue-200"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {sense.examples.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                Example
              </h2>
              {sense.examples.map((ex, j) => (
                <blockquote
                  key={j}
                  className="pl-4 border-l-4 border-blue-400 italic text-zinc-600 dark:text-zinc-400 mb-2 last:mb-0"
                >
                  &ldquo;{ex}&rdquo;
                </blockquote>
              ))}
            </div>
          )}
        </section>
      ))}
    </article>
  );
}

function NotFoundState({
  slug,
  suggestion,
}: {
  slug: string;
  suggestion?: string | null;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl mb-4">🔍</p>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        Word not found
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6">
        We couldn&apos;t find a definition for &ldquo;{slug}&rdquo;.
      </p>
      {suggestion && (
        <Link
          href={`/word/${suggestion.toLowerCase().replace(/\s+/g, "-")}`}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          Did you mean {suggestion}?
        </Link>
      )}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-zinc-500 dark:text-zinc-400 mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-lg bg-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-300 transition dark:bg-zinc-700 dark:text-zinc-200"
      >
        Try again
      </button>
    </div>
  );
}
