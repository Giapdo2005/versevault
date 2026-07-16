// src/lib/supabase.js
//
// Creates a single Supabase client for the entire app.
// Every file that needs to talk to Supabase imports from here.
//
// Why a singleton? One shared client means one shared auth session.
// If each file created its own client, they wouldn't share login state.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

// createClient returns a client object with methods for
// auth (.auth.signIn, .auth.signOut) and
// database queries (.from('verses').select(), .insert(), etc.)
export const supabase = createClient(supabaseUrl, supabaseKey)
