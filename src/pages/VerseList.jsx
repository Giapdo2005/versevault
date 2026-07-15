// src/pages/VerseList.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getVerses, deleteVerse } from '../data/verses'
import VerseCard from '../components/VerseCard'
import ProgressBar from '../components/ProgressBar'
import styles from './VerseList.module.css'

function VerseList() {
  // useState(getVerses) — lazy initialization.
  // Passes the function itself so React only calls it once on mount,
  // not on every re-render.
  const [verses, setVerses] = useState(getVerses)

  function handleDelete(id) {
    deleteVerse(id)
    setVerses((current) => current.filter((v) => v.id !== id))
  }

  // Sort newest first — spread first to avoid mutating state directly
  const sorted = [...verses].sort((a, b) => b.id - a.id)

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>My Verses</h1>
        <Link to="/add" className={styles.addLink}>+ Add verse</Link>
      </div>

      {/*
        ProgressBar receives the full verses array.
        It calculates its own counts internally —
        VerseList doesn't need to know the math.
      */}
      <ProgressBar verses={verses} />

      {sorted.length === 0 ? (
        <div className={styles.empty}>
          <p>No verses saved yet.</p>
          <Link to="/add" className={styles.emptyLink}>Add your first verse →</Link>
        </div>
      ) : (
        <>
          <p className={styles.count}>
            {verses.length} {verses.length === 1 ? 'verse' : 'verses'}
          </p>
          <ul className={styles.list}>
            {sorted.map((verse) => (
              <VerseCard
                key={verse.id}
                verse={verse}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </>
      )}

    </div>
  )
}

export default VerseList
