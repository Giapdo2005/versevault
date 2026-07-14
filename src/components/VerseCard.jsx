// src/components/VerseCard.jsx
//
// Updated for Feature 4:
//   - Practice button navigates to /practice/:id
//   - Status badge shows mastered / learning / nothing

import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./VerseCard.module.css";

// Status badge config — maps status string to label + style
const STATUS = {
  mastered: { label: "Mastered", className: styles.badgeMastered },
  learning: { label: "Still learning", className: styles.badgeLearning },
  needToLearn: { label: "Need to Learn", className: styles.badgeStart },
};

function VerseCard({ verse, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  function handleDeleteClick() {
    setConfirming(true);
  }
  function handleCancel() {
    setConfirming(false);
  }
  function handleConfirm() {
    onDelete(verse.id);
  }

  // Look up badge info — undefined if no status set yet
  const badge = STATUS[verse.status];

  return (
    <li className={styles.card}>
      {/* Status badge — only renders if the verse has a status */}
      {badge && (
        <span className={`${styles.badge} ${badge.className}`}>
          {badge.label}
        </span>
      )}

      <p className={styles.verseText}>{verse.text}</p>

      <div className={styles.footer}>
        <p className={styles.verseRef}>
          {verse.reference} · {verse.translation}
        </p>

        <div className={styles.actions}>
          {/*
            Link to the practice page for this specific verse.
            We embed the verse's id in the URL so Practice.jsx
            knows which verse to load via useParams.
          */}
          <Link to={`/practice/${verse.id}`} className={styles.practiceLink}>
            Practice
          </Link>

          {confirming ? (
            <div className={styles.confirmRow}>
              <span className={styles.confirmLabel}>Are you sure?</span>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
              <button className={styles.confirmButton} onClick={handleConfirm}>
                Yes, delete
              </button>
            </div>
          ) : (
            <button className={styles.deleteButton} onClick={handleDeleteClick}>
              Delete
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export default VerseCard;
