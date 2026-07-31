import { describe, it, expect } from "vitest";
import { scoreAttempt, compareWords } from "./scoreAttempt";

describe("compareWords", () => {
  it("tags each word as match, partial, or miss", () => {
    const typed = "For God so loves the wrold";
    const actual = "For God so loved the world";

    const result = compareWords(typed, actual);

    expect(result).toEqual([
      { word: "For", typedWord: "For", status: "match" },
      { word: "God", typedWord: "God", status: "match" },
      { word: "so", typedWord: "so", status: "match" },
      { word: "loved", typedWord: "loves", status: "miss" },
      { word: "the", typedWord: "the", status: "match" },
      { word: "world", typedWord: "wrold", status: "miss" },
    ]);
  });

  it("treats a punctuation-only difference as partial", () => {
    const typed = "brothers";
    const actual = "brothers,";

    const result = compareWords(typed, actual);

    expect(result).toEqual([
      { word: "brothers,", typedWord: "brothers", status: "partial" },
    ]);
  });
});

describe("scoreAttempt", () => {
  it("this is a perfect recall practice", () => {
    const typed_verse =
      "so teach us to number our days that we might present to you a heart of wisdom";
    const actual_verse =
      "So teach us to number our days that we might present to You a heart of wisdom";
    const result = scoreAttempt(typed_verse, actual_verse);

    expect(result).toBe(100.0);
  });
  it("Missing two commas", () => {
    const typed_verse =
      "I appeal to you therefore, brothers by the mercies of God, to present your bodies bas a living sacrifice holy and acceptable to God, which is your spiritual worship.";
    const actual_verse =
      "I appeal to you therefore, brothers, by the mercies of God, to present your bodies bas a living sacrifice, holy and acceptable to God, which is your spiritual worship.";
    const result = scoreAttempt(typed_verse, actual_verse);

    expect(result).toBe(99.66);
  });
});
