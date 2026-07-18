// src/data/verses.js
import { supabase } from "../lib/supabase";

export async function getVerses() {
  const { data, error } = await supabase
    .from("verses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveVerse(verse) {
  // Get the current logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("verses")
    .insert([
      {
        ...verse,
        status: "needToLearn",
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVerse(id) {
  const { error } = await supabase.from("verses").delete().eq("id", id);

  if (error) throw error;
}

export async function updateVerse(id, fields) {
  const { error } = await supabase.from("verses").update(fields).eq("id", id);

  if (error) throw error;
}

// --- logReview ---
// Saves a record of this practice session to the reviews table.
// This gives us history — not just current state.
// Called alongside updateVerse every time the user rates a verse.
export async function logReview(verseId, rating, intervalDays, easeFactor) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("reviews").insert([
    {
      verse_id: verseId,
      user_id: user.id,
      rating,
      interval_days: intervalDays,
      ease_factor: easeFactor,
    },
  ]);

  if (error) throw error;
}
