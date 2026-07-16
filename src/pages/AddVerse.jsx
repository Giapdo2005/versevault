// src/pages/AddVerse.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveVerse } from '../data/verses'
import styles from './AddVerse.module.css'

function AddVerse() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ reference: '', text: '', translation: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.reference.trim() || !formData.text.trim() || !formData.translation.trim()) {
      setError('Please fill in the reference, verse text, and translation.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await saveVerse({
        reference:   formData.reference.trim(),
        text:        formData.text.trim(),
        translation: formData.translation.trim(),
      })
      navigate('/verses')
    } catch (err) {
      setError('Failed to save verse. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add a Verse</h1>
        <p className={styles.subtitle}>Type the reference and the verse text.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reference">Reference</label>
          <input id="reference" name="reference" type="text" className={styles.input}
            placeholder="e.g. John 3:16" value={formData.reference} onChange={handleChange} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="text">Verse Text</label>
          <textarea id="text" name="text" className={styles.textarea}
            placeholder="Type the verse here..." value={formData.text}
            onChange={handleChange} rows={5} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="translation">Translation</label>
          <input id="translation" name="translation" type="text" className={styles.input}
            placeholder="e.g. ESV, NIV, KJV" value={formData.translation} onChange={handleChange} />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Saving...' : 'Save Verse'}
        </button>
      </form>
    </div>
  )
}

export default AddVerse
