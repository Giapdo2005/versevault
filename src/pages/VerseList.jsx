// src/pages/VerseList.jsx
//
// Now fetches from Supabase instead of localStorage.
// Key change: getVerses() is now async so we use useEffect to
// fetch on mount, and a loading state while we wait.

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getVerses, deleteVerse } from '../data/verses'
import VerseCard from '../components/VerseCard'
import ProgressBar from '../components/ProgressBar'
import styles from './VerseList.module.css'

function VerseList() {
  const [verses, setVerses]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  // useEffect runs after the component mounts.
  // We use it here because we need to fetch data from the network —
  // you can't do async work directly in the component body.
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
  }, []) // empty [] means run once on mount

  async function handleDelete(id) {
    await deleteVerse(id)
    setVerses((current) => current.filter((v) => v.id !== id))
  }

  if (loading) return <div className={styles.page}><p className={styles.state}>Loading...</p></div>
  if (error)   return <div className={styles.page}><p className={styles.state}>{error}</p></div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Verses</h1>
        <Link to="/add" className={styles.addLink}>+ Add verse</Link>
      </div>

      <ProgressBar verses={verses} />

      {verses.length === 0 ? (
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
            {verses.map((verse) => (
              <VerseCard key={verse.id} verse={verse} onDelete={handleDelete} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default VerseList
