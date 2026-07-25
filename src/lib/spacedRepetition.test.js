// src/lib/spacedRepetition.test.js
import { describe, it, expect } from "vitest";
import { calculateNextReview } from "./spacedRepetition";

describe("calculateNextReview", () => {
  it("grows the interval on a Good rating for a fresh verse", () => {
    const freshVerse = { interval: 0, ease_factor: 2.5, repetitions: 0 };
    const result = calculateNextReview(freshVerse, 3); // 3 = Good

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);
  });

  it("fully resets on an Again rating, not a gradual decrease", () => {
    // An experienced verse — already reviewed successfully 3 times.
    const experiencedVerse = { interval: 18, ease_factor: 2.7, repetitions: 3 };
    const result = calculateNextReview(experiencedVerse, 1); // 1 = Again

    // TODO(you): what should interval be after a full reset?
    expect(result.interval).toBe(1);
    // TODO(you): what should repetitions be after a full reset?
    expect(result.repetitions).toBe(0);
  });

  it("repetitions is 2 with rating of 3", () => {
    const learningVerse = { interval: 1, ease_factor: 2.6, repetitions: 2 };

    const result = calculateNextReview(learningVerse, 3);

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(3);
  });
  it("repetitions is 3 with rating of 4", () => {
    const learningVerse = { interval: 1, ease_factor: 2.6, repetitions: 3 };

    const result = calculateNextReview(learningVerse, 4);

    expect(result.interval).toBe(3);
    expect(result.repetitions).toBe(4);
  });

  it("repetition is 3 case with perfect recall and rating > 2", () => {
    const perfectRecall = { interval: 1, ease_factor: 2.6, repetitions: 3 };

    const result = calculateNextReview(perfectRecall, 5);

    expect(result.interval).toBe(
      Math.round(perfectRecall.interval * perfectRecall.ease_factor),
    );
    expect(result.repetitions).toBe(4);
    expect(result.ease_factor).toBe(
      perfectRecall.ease_factor + (0.1 - (5 - 5) * 0.08),
    );
  });
});
