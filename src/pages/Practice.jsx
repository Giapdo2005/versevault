// src/pages/Practice.jsx
//
// Typed-recall practice:
//   - user types the verse from memory instead of self-rating
//   - scoreAttempt compares typed vs. actual text -> a percentage
//   - percentageToRating maps that percentage onto the 1-5 SM-2 scale
//   - calculateNextReview computes the next interval from that rating
//   - logReview saves the session history, updateVerse saves the new state
//   - Submit only scores the attempt and shows the result; the actual save
//     + navigate both happen together, only once Continue is clicked

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVerses, updateVerse, logReview } from "../data/verses";
import { calculateNextReview } from "../lib/spacedRepetition";
import { scoreAttempt, compareWords } from "../lib/scoreAttempt";
import { percentageToRating } from "../lib/percentageToRating";
import styles from "./Practice.module.css";

// Rating config — label, description, and value for each auto-computed
// bucket (from percentageToRating). Kept as a constant outside the
// component so it's created once, not re-created on every render.
const RATINGS = [
  {
    value: 1,
    label: "Need Practice",
    description: "Below 50% match",
    className: "ratingAgain",
  },
  {
    value: 2,
    label: "Average",
    description: "50–69% match",
    className: "ratingHard",
  },
  {
    value: 3,
    label: "Decent",
    description: "70–84% match",
    className: "ratingGood",
  },
  {
    value: 4,
    label: "Good",
    description: "85–99% match",
    className: "ratingGood",
  },
  {
    value: 5,
    label: "Perfect",
    description: "100% match",
    className: "ratingEasy",
  },
];

function Practice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [result, setResult] = useState(null); // { score, rating, comparison } once submitted, else null
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchVerse() {
      try {
        const data = await getVerses();
        const found = data.find((v) => v.id === id);
        setVerse(found || null);
      } finally {
        setLoading(false);
      }
    }
    fetchVerse();
  }, [id]);

  function renderHiddenText(text) {
    return text.split(" ").map((word, index) => (
      <span key={index} className={styles.blank}>
        {"_".repeat(word.length)}
      </span>
    ));
  }

  // Shows what the user actually typed, word for word — only a true
  // miss gets flagged red; match/partial stay plain, unstyled text.
  function renderTypedComparison(comparison) {
    return comparison.map(({ typedWord, status }, index) => (
      <span
        key={index}
        className={status === "miss" ? styles.wordMiss : undefined}
      >
        {typedWord}{" "}
      </span>
    ));
  }

  // --- handleSubmitAttempt ---
  // Called when the user submits their typed attempt. Scores it against
  // the real verse text, maps that to a 1-5 rating, and stores both so
  // the results view can show them — does NOT save or navigate yet.
  function handleSubmitAttempt() {
    const score = scoreAttempt(typedText, verse.text);
    const rating = percentageToRating(score);
    const comparison = compareWords(typedText, verse.text);
    setResult({ score, rating, comparison });
  }

  // --- handleRate ---
  // Called when the user clicks "Continue" on the results view, passing
  // the rating computed in handleSubmitAttempt.
  // 1. Calculate the new interval using SM-2
  // 2. Save updated verse state to Supabase
  // 3. Log this review to the reviews table
  // 4. Navigate back to verse list
  async function handleRate(rating) {
    setSubmitting(true);

    try {
      // Run the algorithm — returns updated fields
      const updates = calculateNextReview(verse, rating);

      // Save new state and log history in parallel.
      // Promise.all runs both at the same time instead of one after
      // the other — faster, and both must succeed or we catch the error.
      await Promise.all([
        updateVerse(id, updates),
        logReview(id, rating, updates.interval, updates.ease_factor),
      ]);

      navigate("/verses");
    } catch (err) {
      console.error("Failed to save review:", err);
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className={styles.page}>
        <p>Loading...</p>
      </div>
    );
  if (!verse)
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Verse not found.</p>
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Practice</p>
        <h1 className={styles.reference}>
          {verse.reference} ({verse.translation})
        </h1>
        <p className={styles.hint}>
          {result
            ? "Here's how you did:"
            : "Type the verse from memory, then submit."}
        </p>
      </div>

      <div className={styles.card}>
        {result && <p className={styles.ratingLabel}>What you typed</p>}
        <div className={styles.verseText}>
          {result
            ? renderTypedComparison(result.comparison)
            : renderHiddenText(verse.text)}
        </div>
      </div>

      {result && (
        <div className={styles.card}>
          <p className={styles.ratingLabel}>Correct version</p>
          <div className={styles.verseText}>{verse.text}</div>
        </div>
      )}

      {!result ? (
        <>
          <textarea
            className={styles.typedInput}
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type the verse from memory..."
            disabled={submitting}
          />
          <button
            className={styles.revealButton}
            onClick={handleSubmitAttempt}
            disabled={!typedText.trim()}
          >
            Submit
          </button>
        </>
      ) : (
        <div className={styles.ratingSection}>
          <p className={styles.ratingLabel}>
            {result.score}% match —{" "}
            {RATINGS.find((r) => r.value === result.rating)?.label}
          </p>
          <button
            className={styles.revealButton}
            onClick={() => handleRate(result.rating)}
            disabled={submitting}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

export default Practice;
