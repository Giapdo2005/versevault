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

export function scoreAttempt(typedText, actualText) {
  const typedWords = typedText.trim().split(/\s+/);
  const actualWords = actualText.trim().split(/\s+/);

  const totalScore = actualWords.reduce((sum, actualWord, i) => {
    const typedWord = typedWords[i] || ""; // missing word = empty string, not undefined

    if (typedWord.toLowerCase() === actualWord.toLowerCase()) {
      return sum + 1; // exact match, case doesn't matter
    }
    if (
      stripPunctuation(typedWord).toLowerCase() ===
      stripPunctuation(actualWord).toLowerCase()
    ) {
      return sum + PUNCTUATION_PARTIAL_CREDIT; // letters match, punctuation doesn't
    }
    return sum; // letters don't match — no credit
  }, 0);

  return Number(((totalScore / actualWords.length) * 100).toFixed(2));
}
