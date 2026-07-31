// src/lib/scoreAttempt.js
//
// Compares what a user typed against the actual verse text, word by word.
// Case is never penalized. A word with matching letters but different
// punctuation gets partial credit instead of zero.

const PUNCTUATION_PARTIAL_CREDIT = 0.95;

// Removes anything that isn't a letter/number/underscore, so
// "wisdom" and "wisdom." compare equal once punctuation is stripped.
function stripPunctuation(word) {
  return word.replace(/[^\w]/g, "");
}

// Compares typed vs. actual text word by word, returning both the real
// word and the typed word alongside a status: "match" (exact,
// case-insensitive), "partial" (letters match, punctuation doesn't), or
// "miss" (wrong or missing). Shared by scoreAttempt (turns statuses into
// a percentage) and the Practice UI (turns statuses into colored text).
export function compareWords(typedText, actualText) {
  const typedWords = typedText.trim().split(/\s+/);
  const actualWords = actualText.trim().split(/\s+/);

  return actualWords.map((actualWord, i) => {
    const typedWord = typedWords[i] || ""; // missing word = empty string, not undefined

    if (typedWord.toLowerCase() === actualWord.toLowerCase()) {
      return { word: actualWord, typedWord, status: "match" };
    }
    if (
      stripPunctuation(typedWord).toLowerCase() ===
      stripPunctuation(actualWord).toLowerCase()
    ) {
      return { word: actualWord, typedWord, status: "partial" };
    }
    return { word: actualWord, typedWord, status: "miss" };
  });
}

export function scoreAttempt(typedText, actualText) {
  const comparison = compareWords(typedText, actualText);

  const totalScore = comparison.reduce((sum, { status }) => {
    if (status === "match") return sum + 1; // exact match, case doesn't matter
    if (status === "partial") return sum + PUNCTUATION_PARTIAL_CREDIT; // letters match, punctuation doesn't
    return sum; // letters don't match — no credit
  }, 0);

  return Number(((totalScore / comparison.length) * 100).toFixed(2));
}
