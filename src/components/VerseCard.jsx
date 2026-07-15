// src/components/VerseCard.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './VerseCard.module.css'

// Maps status value to display label and CSS class
const STATUS = {
  needToLearn: { label: 'Need to learn',  className: styles.badgeNeedToLearn },
  learning:    { label: 'Still learning', className: styles.badgeLearning },
  mastered:    { label: 'Mastered',       className: styles.badgeMastered },
}

function VerseCard({ verse, onDelete }) {
  const [confirming, setConfirming] = useState(false)

  function handleDeleteClick() { setConfirming(true) }
  function handleCancel()      { setConfirming(false) }
  function handleConfirm()     { onDelete(verse.id) }

  const badge = STATUS[verse.status]

  return (
    <li className={styles.card}>

      {/* Status badge — only renders if verse has a recognised status */}
      {badge && (
        <span className={`${styles.badge} ${badge.className}`}>
          {badge.label}
        </span>
      )}

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
              <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
              <button className={styles.confirmButton} onClick={handleConfirm}>Yes, delete</button>
            </div>
          ) : (
            <button className={styles.deleteButton} onClick={handleDeleteClick}>Delete</button>
          )}
        </div>
      </div>

    </li>
  )
}

export default VerseCard
