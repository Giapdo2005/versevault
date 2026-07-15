// src/pages/Practice.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getVerses, updateVerse } from '../data/verses'
import styles from './Practice.module.css'

function Practice() {
  const { id } = useParams()
  const navigate = useNavigate()

  const verse = getVerses().find((v) => v.id === Number(id))
  const [revealed, setRevealed] = useState(false)

  // Replace each word with underscores matching its length
  function renderHiddenText(text) {
    return text.split(' ').map((word, index) => (
      <span key={index} className={styles.blank}>
        {'_'.repeat(word.length)}
      </span>
    ))
  }

  function handleGotIt() {
    updateVerse(Number(id), { status: 'mastered' })
    navigate('/verses')
  }

  function handleStillLearning() {
    updateVerse(Number(id), { status: 'learning' })
    navigate('/verses')
  }

  // Guard clause — handles bad URLs gracefully
  if (!verse) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Verse not found.</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <p className={styles.eyebrow}>Practice</p>
        <h1 className={styles.reference}>{verse.reference}</h1>
        <p className={styles.hint}>
          {revealed ? 'How did you do?' : 'Recite the verse, then reveal.'}
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.verseText}>
          {revealed ? verse.text : renderHiddenText(verse.text)}
        </div>
      </div>

      {!revealed ? (
        <button className={styles.revealButton} onClick={() => setRevealed(true)}>
          Reveal verse
        </button>
      ) : (
        <div className={styles.ratingRow}>
          <button className={styles.stillLearningButton} onClick={handleStillLearning}>
            Still learning
          </button>
          <button className={styles.gotItButton} onClick={handleGotIt}>
            Got it ✓
          </button>
        </div>
      )}

    </div>
  )
}

export default Practice
