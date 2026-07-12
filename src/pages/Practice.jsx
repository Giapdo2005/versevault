// src/pages/Practice.jsx
//
// The memorization practice page.
// Reached via /practice/:id — the :id in the URL tells us which verse to load.
//
// New concepts here:
//   useParams  — reads dynamic segments from the URL
//   revealed   — local state toggling between hidden and shown text
//   word map   — splitting verse text into words and rendering underscores

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getVerses, updateVerse } from '../data/verses'
import styles from './Practice.module.css'

function Practice() {
  // useParams reads the dynamic part of the URL.
  // If the URL is /practice/1719432000000, then id = "1719432000000"
  // Note: URL params are always strings, so we convert to a number
  // when comparing against verse.id (which is a number from Date.now()).
  const { id } = useParams()
  const navigate = useNavigate()

  // Find the verse that matches the id from the URL.
  // We call getVerses() directly here since we just need a one-time read.
  const verse = getVerses().find((v) => v.id === Number(id))

  // `revealed` tracks whether the user has flipped the card yet.
  const [revealed, setRevealed] = useState(false)

  // --- renderHiddenText ---
  // Splits the verse into words and replaces each one with underscores.
  // The number of underscores matches the word length so the rhythm
  // of the verse is preserved as a visual hint.
  //
  // "For God so loved" → "___ ___ __ _____"
  function renderHiddenText(text) {
    return text
      .split(' ')
      .map((word, index) => (
        // We use index as the key here because the words don't have
        // unique ids — and the list never reorders, so index is safe.
        <span key={index} className={styles.blank}>
          {'_'.repeat(word.length)}
        </span>
      ))
  }

  // --- handleGotIt / handleStillLearning ---
  // Both update the verse's status then go back to the list.
  function handleGotIt() {
    updateVerse(Number(id), { status: 'mastered' })
    navigate('/verses')
  }

  function handleStillLearning() {
    updateVerse(Number(id), { status: 'learning' })
    navigate('/verses')
  }

  // Guard: if no verse found for this id, show a fallback.
  // This handles the case where someone navigates to a bad URL.
  if (!verse) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Verse not found.</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* Reference is always visible — it's the "prompt" */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>Practice</p>
        <h1 className={styles.reference}>{verse.reference}</h1>
        <p className={styles.hint}>
          {revealed ? 'How did you do?' : 'Recite the verse, then reveal.'}
        </p>
      </div>

      {/* The card — shows blanks or full text based on revealed state */}
      <div className={styles.card}>
        <div className={styles.verseText}>
          {revealed
            ? verse.text
            : renderHiddenText(verse.text)
          }
        </div>
      </div>

      {/* Actions — change based on revealed state */}
      {!revealed ? (
        <button
          className={styles.revealButton}
          onClick={() => setRevealed(true)}
        >
          Reveal verse
        </button>
      ) : (
        <div className={styles.ratingRow}>
          <button
            className={styles.stillLearningButton}
            onClick={handleStillLearning}
          >
            Still learning
          </button>
          <button
            className={styles.gotItButton}
            onClick={handleGotIt}
          >
            Got it ✓
          </button>
        </div>
      )}

    </div>
  )
}

export default Practice
