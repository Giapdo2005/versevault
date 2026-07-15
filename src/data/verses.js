// src/data/verses.js
// Data layer — all localStorage logic lives here.
// Swap these functions for API calls in Feature 6 and nothing else changes.

const STORAGE_KEY = 'versevault_verses'

export function getVerses() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveVerse(verse) {
  const existing = getVerses()
  const newVerse = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    status: 'needToLearn', // default status — before ...verse so it can't be overridden
    ...verse,
  }
  const updated = [...existing, newVerse]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return newVerse
}

export function deleteVerse(id) {
  const existing = getVerses()
  const updated = existing.filter((v) => v.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function updateVerse(id, fields) {
  const existing = getVerses()
  const updated = existing.map((v) =>
    v.id === id ? { ...v, ...fields } : v
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
