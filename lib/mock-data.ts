import type { WordEntry } from "@/lib/types";

export const mockWords: Record<string, WordEntry> = {
  discoverable: {
    slug: "discoverable",
    word: "discoverable",
    source: "ai_generated",
    created_at: new Date().toISOString(),
    senses: [
      {
        part_of_speech: "adjective",
        meaning:
          "Able to be found or noticed, especially when searching for information.",
        synonyms: ["findable", "searchable", "accessible", "traceable"],
        examples: [
          "Make sure your project is discoverable by adding good keywords and tags.",
        ],
      },
    ],
  },
  run: {
    slug: "run",
    word: "run",
    source: "ai_generated",
    created_at: new Date().toISOString(),
    senses: [
      {
        part_of_speech: "verb",
        meaning: "To move quickly using your legs, faster than walking.",
        synonyms: ["sprint", "jog", "dash", "race"],
        examples: ["I run every morning before work to stay healthy."],
      },
      {
        part_of_speech: "noun",
        meaning: "A period of moving quickly on foot, or a short trip.",
        synonyms: ["jog", "sprint", "dash"],
        examples: ["Let's go for a run in the park this afternoon."],
      },
    ],
  },
  serendipity: {
    slug: "serendipity",
    word: "serendipity",
    source: "ai_generated",
    created_at: new Date().toISOString(),
    senses: [
      {
        part_of_speech: "noun",
        meaning:
          "The happy chance of finding something good when you are not looking for it.",
        synonyms: ["luck", "chance", "fortune", "accident"],
        examples: [
          "Finding that bookshop was pure serendipity \u2014 I wasn't even looking for it.",
        ],
      },
    ],
  },
  ubiquitous: {
    slug: "ubiquitous",
    word: "ubiquitous",
    source: "ai_generated",
    created_at: new Date().toISOString(),
    senses: [
      {
        part_of_speech: "adjective",
        meaning:
          "Seen or found everywhere, seeming to be in all places at once.",
        synonyms: ["everywhere", "common", "widespread", "prevalent"],
        examples: ["Smartphones have become ubiquitous in modern life."],
      },
    ],
  },
  eloquent: {
    slug: "eloquent",
    word: "eloquent",
    source: "ai_generated",
    created_at: new Date().toISOString(),
    senses: [
      {
        part_of_speech: "adjective",
        meaning:
          "Able to express thoughts and feelings clearly and effectively when speaking or writing.",
        synonyms: ["articulate", "fluent", "expressive", "persuasive"],
        examples: [
          "She gave an eloquent speech that moved the audience to tears.",
        ],
      },
    ],
  },
};
