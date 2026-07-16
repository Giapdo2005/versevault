// src/data/verses.js
//
// This is the only file that changed when we swapped localStorage
// for Supabase. Every page still calls the same functions —
// getVerses, saveVerse, deleteVerse, updateVerse — they just now
// hit a real database instead of the browser.
//
// Notice all functions are now `async` — database calls take time
// (network request), so we have to wait for them. localStorage was
// instant because it was just reading from memory.

import { supabase } from '../lib/supabase'

// --- getVerses ---
// Fetches all verses belonging to the logged in user.
// Supabase's Row Level Security automatically filters by user_id —
// we don't have to pass the user id manually, Supabase reads it
// from the active session.
export async function getVerses() {
  const { data, error } = await supabase
    .from('verses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// --- saveVerse ---
// Inserts a new verse row into the verses table.
// Again, user_id is handled by Supabase via the active session
// and our Row Level Security policy.
export async function saveVerse(verse) {
  const { data, error } = await supabase
    .from('verses')
    .insert([{ ...verse, status: 'needToLearn' }])
    .select()
    .single() // returns the inserted row as an object, not an array

  if (error) throw error
  return data
}

// --- deleteVerse ---
// Deletes a verse by id.
// RLS ensures you can only delete your own verses.
export async function deleteVerse(id) {
  const { error } = await supabase
    .from('verses')
    .delete()
    .eq('id', id) // .eq means "where id equals"

  if (error) throw error
}

// --- updateVerse ---
// Updates specific fields on a verse by id.
export async function updateVerse(id, fields) {
  const { error } = await supabase
    .from('verses')
    .update(fields)
    .eq('id', id)

  if (error) throw error
}
