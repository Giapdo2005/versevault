// src/pages/VerseList.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getVerses, deleteVerse } from '../data/verses'
import { getDueVerses } from '../lib/spacedRepetition'
import VerseCard from '../components/VerseCard'
import ProgressBar from '../components/ProgressBar'
import styles from './VerseList.module.css'

function VerseList() {
  const [verses, setVerses]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  // `showDueOnly` toggles between all verses and due-today verses
  const [showDueOnly, setShowDueOnly] = useState(false)

  useEffect(() => {
    async function fetchVerses() {
      try {
        const data = await getVerses()
        setVerses(data)
      } catch (err) {
        setError('Failed to load verses.')
      } finally {
        setLoading(false)
      }
    }
    fetchVerses()
  }, [])

  async function handleDelete(id) {
    await deleteVerse(id)
    setVerses((current) => current.filter((v) => v.id !== id))
  }

  const dueVerses = getDueVerses(verses)
  const displayed = showDueOnly ? dueVerses : verses

  if (loading) return <div className={styles.page}><p className={styles.state}>Loading...</p></div>
  if (error)   return <div className={styles.page}><p className={styles.state}>{error}</p></div>

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>My Verses</h1>
        <Link to="/add" className={styles.addLink}>+ Add verse</Link>
      </div>

      <ProgressBar verses={verses} />

      {/* Due today banner — only shows if verses are due */}
      {dueVerses.length > 0 && (
        <div className={styles.dueBanner}>
          <p className={styles.dueText}>
            📖 <strong>{dueVerses.length}</strong> {dueVerses.length === 1 ? 'verse' : 'verses'} due for review today
          </p>
          <button
            className={styles.dueToggle}
            onClick={() => setShowDueOnly(!showDueOnly)}
          >
            {showDueOnly ? 'Show all' : 'Review now'}
          </button>
        </div>
      )}

      {displayed.length === 0 ? (
        <div className={styles.empty}>
          <p>No verses saved yet.</p>
          <Link to="/add" className={styles.emptyLink}>Add your first verse →</Link>
        </div>
      ) : (
        <>
          <p className={styles.count}>
            {displayed.length} {displayed.length === 1 ? 'verse' : 'verses'}
            {showDueOnly ? ' due today' : ' total'}
          </p>
          <ul className={styles.list}>
            {displayed.map((verse) => (
              <VerseCard key={verse.id} verse={verse} onDelete={handleDelete} />
            ))}
          </ul>
        </>
      )}

    </div>
  )
}

export default VerseList
