// src/components/VerseCard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isDueForReview } from '../lib/spacedRepetition'
import styles from './VerseCard.module.css'

const STATUS = {
  needToLearn: { label: 'Need to learn',  className: styles.badgeNeedToLearn },
  learning:    { label: 'Still learning', className: styles.badgeLearning },
  mastered:    { label: 'Mastered',       className: styles.badgeMastered },
}

// Formats next_review_at into a human readable string
function formatNextReview(verse) {
  if (!verse.next_review_at) return null
  if (isDueForReview(verse))  return 'Due today'

  const days = Math.round(
    (new Date(verse.next_review_at) - new Date()) / (1000 * 60 * 60 * 24)
  )

  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}

function VerseCard({ verse, onDelete }) {
  const [confirming, setConfirming] = useState(false)

  const badge      = STATUS[verse.status]
  const nextReview = formatNextReview(verse)
  const due        = isDueForReview(verse)

  return (
    <li className={`${styles.card} ${due ? styles.cardDue : ''}`}>

      <div className={styles.topRow}>
        {badge && (
          <span className={`${styles.badge} ${badge.className}`}>
            {badge.label}
          </span>
        )}
        {/* Next review chip */}
        {nextReview && (
          <span className={`${styles.reviewChip} ${due ? styles.reviewChipDue : ''}`}>
            {nextReview}
          </span>
        )}
      </div>

      <p className={styles.verseText}>{verse.text}</p>

      <div className={styles.footer}>
        <p className={styles.verseRef}>
          {verse.reference} · {verse.translation || 'ESV'}
        </p>

        <div className={styles.actions}>
          <Link to={`/practice/${verse.id}`} className={styles.practiceLink}>
            Practice
          </Link>

          {confirming ? (
            <div className={styles.confirmRow}>
              <span className={styles.confirmLabel}>Are you sure?</span>
              <button className={styles.cancelButton} onClick={() => setConfirming(false)}>Cancel</button>
              <button className={styles.confirmButton} onClick={() => onDelete(verse.id)}>Yes, delete</button>
            </div>
          ) : (
            <button className={styles.deleteButton} onClick={() => setConfirming(true)}>Delete</button>
          )}
        </div>
      </div>

    </li>
  )
}

export default VerseCard
