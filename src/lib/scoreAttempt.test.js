// src/lib/scoreAttempt.test.js
import { describe, it, expect } from "vitest";
import { scoreAttempt } from "./scoreAttempt";

describe("scoreAttempt", () => {
  // TODO(you): write a test where the typed text matches exactly
  // (case-insensitive) — should score 100.
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
