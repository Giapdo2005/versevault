// src/lib/spacedRepetition.js
//
// Pure implementation of the SM-2 spaced repetition algorithm.
// No React, no Supabase — just math.

// Ratings:
//   1 = Again  — complete blank, couldn't recall
//   2 = Hard   — recalled but with significant difficulty
//   3 = Good   — recalled with some effort
//   4 = Easy   — perfect recall, felt effortless

// --- calculateNextReview ---
// Takes the current verse state and a rating (1-4).
// Returns the updated fields to save back to the database.
//
// We return an object of fields rather than a full verse so we
// can pass it directly to updateVerse(id, fields).
export function calculateNextReview(verse, rating) {
  let { interval, ease_factor, repetitions } = verse;

  // --- Step 1: Update ease factor ---
  // Ease factor controls how fast intervals grow.
  // Good reviews push it up, hard/again reviews pull it down.
  // Formula from SM-2 spec:
  ease_factor = ease_factor + (0.1 - (5 - rating) * 0.08);

  // Ease factor never drops below 1.3 — prevents intervals
  // from shrinking to almost nothing on hard cards.
  if (ease_factor < 1.3) ease_factor = 1.3;

  // --- Step 2: Update interval and repetitions ---
  if (rating < 3) {
    // Again or Hard — reset back to the beginning.
    // The user needs to see this verse again very soon.
    interval = 1;
    repetitions = 0;
  } else if (rating >= 3 && rating < 5) {
    // Good or Easy — grow the interval.
    if (repetitions < 3) {
      interval = 1; // need 2 successful days to move on
    } else if (repetitions === 3) {
      interval = 3; // now we can increment after 3 good days
    } else {
      // After that, multiply by ease factor each time.
      // ease_factor starts at 2.5, so intervals roughly
      // double each successful review: 3 → 7 → 18 → 45...
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  } else {
    // new case of perfect recall
    if (repetitions < 2) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 3;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  }

  // --- Step 3: Calculate next review date ---
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  // --- Step 4: Determine status label ---
  // We map the rating to our existing status system
  // so the badge on VerseCard still makes sense.
  const status =
    rating === 1
      ? "needToLearn"
      : rating === 2
        ? "learning"
        : rating === 3
          ? "learning"
          : "mastered";

  return {
    interval,
    ease_factor,
    repetitions,
    status,
    next_review_at: nextReview.toISOString(),
    last_reviewed_at: now.toISOString(),
  };
}

// --- isDueForReview ---
// Returns true if a verse is due to be reviewed today or earlier.
// Used to filter the verse list to show only what needs practice.
export function isDueForReview(verse) {
  if (!verse.next_review_at) return true; // never reviewed — always due
  return new Date(verse.next_review_at) <= new Date();
}

// --- getDueVerses ---
// Filters an array of verses to only those due for review.
// Sorted by most overdue first — if you're late on something,
// see it first.
export function getDueVerses(verses) {
  return verses
    .filter(isDueForReview)
    .sort((a, b) => new Date(a.next_review_at) - new Date(b.next_review_at));
}
