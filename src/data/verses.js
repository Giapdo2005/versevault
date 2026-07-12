// src/data/verses.js
//
// This file is our "data layer" — all the logic for reading and
// writing verses lives here. The rest of the app never touches
// localStorage directly; it always goes through these functions.
//
// Why isolate it here? If we ever swap localStorage for a real
// database, we only change this one file.

// The key we use to store data in localStorage.
// Think of localStorage like a dictionary: you set and get values by key.
const STORAGE_KEY = "versevault_verses";

// --- getVerses ---
// Reads all saved verses from localStorage and returns them as an array.
// If nothing is saved yet, returns an empty array.
export function getVerses() {
  const raw = localStorage.getItem(STORAGE_KEY);

  // localStorage can only store strings, so we use JSON.stringify to
  // convert objects TO strings when saving, and JSON.parse to convert
  // strings BACK to objects when reading.
  // If raw is null (nothing saved yet), we return an empty array.
  return raw ? JSON.parse(raw) : [];
}

// --- saveVerse ---
// Accepts a verse object, adds it to the existing list, and saves it all back.
export function saveVerse(verse) {
  const existing = getVerses();

  // Create the new verse with a unique ID and a timestamp.
  // Date.now() returns the current time in milliseconds — good enough
  // as a unique ID for local data.
  const newVerse = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    status: "needToLearn",
    ...verse, // spread the incoming fields (reference, text) in
  };

  const updated = [...existing, newVerse];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return newVerse;
}

// --- deleteVerse ---
// Removes a verse by its ID. We'll use this in a later feature.
export function deleteVerse(id) {
  const existing = getVerses();
  const updated = existing.filter((v) => v.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// --- updateVerse ---
// Merges new fields into an existing verse by id.
// The spread operator lets us pass in only what changed —
// everything else stays the same.
// e.g. updateVerse(id, { status: 'mastered' })
export function updateVerse(id, fields) {
  const existing = getVerses();
  const updated = existing.map((v) => (v.id === id ? { ...v, ...fields } : v));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
