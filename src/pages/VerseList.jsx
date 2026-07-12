// src/pages/VerseList.jsx
//
// Now a full-featured list page. Changes from the stub:
//   - Uses useState so the list re-renders when a verse is deleted
//   - Sorts verses newest-first
//   - Delegates card rendering to <VerseCard>
//   - Handles deletion by updating state + localStorage together

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getVerses, deleteVerse } from '../data/verses'
import VerseCard from '../components/VerseCard'
import styles from './VerseList.module.css'

function VerseList() {
  // Why useState here instead of a plain variable?
  // When we delete a verse, we need React to re-render the list.
  // Plain variables don't trigger re-renders — useState does.
  // We initialize with getVerses() so the list is populated on load.
  const [verses, setVerses] = useState(getVerses)
  //                                    ^ note: we pass the function itself,
  //                                      not getVerses(). This is "lazy
  //                                      initialization" — React only calls
  //                                      it once on mount, not every render.

  // --- handleDelete ---
  // Called by VerseCard when the user confirms deletion.
  // We receive the id of the verse to remove.
  function handleDelete(id) {
    // 1. Remove from localStorage via our data helper
    deleteVerse(id)

    // 2. Update React state to match — filter out the deleted verse.
    //    setVerses triggers a re-render with the new array.
    setVerses((current) => current.filter((v) => v.id !== id))
  }

  // Sort newest first — spreads into a new array first because
  // .sort() mutates in place, which can cause subtle React bugs.
  const sorted = [...verses].sort((a, b) => b.id - a.id)

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>My Verses</h1>
        <Link to="/add" className={styles.addLink}>+ Add verse</Link>
      </div>

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
              // We pass onDelete down as a prop — VerseCard calls it
              // when the user confirms. This is called "lifting state up":
              // the list owns the state, the card just triggers changes.
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
