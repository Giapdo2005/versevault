# VerseVault — Knowledge Graph

Statuses: `seed` (named but not yet demonstrated) → `introduced` (partially demonstrated / just taught) → `practicing` → `understood` (demonstrated cleanly, applied correctly).

---

### protected-routing
**Status:** understood
**Depends on:** react-context
**Evidence (2026-07-21):** Correctly predicted, after one correction, that clicking a CTA while logged out routes through `ProtectedRoute` → `/login`. Initial instinct ("login is the first page") was wrong — corrected in conversation, then re-demonstrated correctly.

### auth-session-flow
**Status:** introduced
**Depends on:** protected-routing
**Evidence (2026-07-21):** Named this as a fear area upfront (Phase 1). Walked through `getSession()` + `onAuthStateChange` together; not yet independently explained by learner.

### supabase-error-pattern
**Status:** understood
**Depends on:** auth-session-flow
**Evidence (2026-07-21):** Didn't know why `signIn`/`signUp` return `{ error }` instead of throwing when first asked ("not sure"). After walkthrough of `Login.jsx`'s `if (error) {...}` check, this is taught/introduced — worth a real check next session (predict the failure mode, not just recall the explanation).

### rls-data-isolation
**Status:** introduced
**Depends on:** supabase-error-pattern
**Evidence (2026-07-21):** Understood the "orphan verse" consequence of missing `user_id` unprompted. Did not independently identify the cross-user data leak angle (that `getVerses()` has no `user_id` filter and relies entirely on RLS) — this was taught. Self-reports RLS is enabled in Supabase dashboard; unverified as code (no migrations in repo).

### schema-not-versioned
**Status:** seed
**Depends on:** —
**Evidence (2026-07-21):** Missing-practice finding, not yet a lesson: no SQL/migration files anywhere in the repo — schema and RLS policies exist only in the Supabase dashboard. Relevant given the stated goal of backend/system-design depth.

### sm2-algorithm
**Status:** introduced
**Depends on:** —
**Evidence (2026-07-21):** Correctly identified direction (harder rating → shorter/reset interval) but described it as a gradual "decrement" rather than the actual full reset (`interval`/`repetitions` → 0) on "Again"/"Hard". Corrected in conversation.

### self-report-practice
**Status:** seed
**Depends on:** —
**Evidence:** Named as a known product gap (Phase 1: practice is reveal + self-rate, no typed-recall checking) but not yet probed as a design decision — candidate for a forward-plan section since it's parking-lot work.

### env-var-security
**Status:** understood
**Depends on:** —
**Evidence (2026-07-21):** Correctly reasoned that `VITE_` prefix relates to the Vite build tool and that the anon key doesn't need database-password-level secrecy. Confirmed and connected to RLS in conversation.

### navbar-name-bug
**Status:** introduced
**Depends on:** supabase-error-pattern
**Evidence (2026-07-21):** Found during file-mapping, not yet handed to the learner as a debugging exercise: `Navbar.jsx` reads `user.user_metadata.firstName/lastName`, but `signUp` never collects or sends a name — display will always be blank. Good candidate reclaim task (ties directly to the stated Supabase/auth fear).

### react-context
**Status:** seed
**Depends on:** —
**Evidence:** Underlying mechanism of `AuthContext` (prop-drilling problem it solves); not directly probed. The file's own comments explain it — worth checking understanding directly rather than assuming from that.

### missing-practice: automated testing
**Status:** seed
**Depends on:** —
**Evidence (2026-07-21):** No `*.test.*`/`*.spec.*` files anywhere in the repo. Absence noted as curriculum, not a failure — worth a section once the core MVP work is underway.
