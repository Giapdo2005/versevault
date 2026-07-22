# VerseVault — File Map

Status legend: `known` (demonstrated in conversation) · `introduced` (partially demonstrated / just taught) · `generated` (machine-made, never hand-edit) · `parked` (not yet probed — honest ledger, not a judgment).

## Entry point

- **`index.html`** — Vite's HTML shell; loads `src/main.jsx` as a module. `parked` (not probed, low-risk file, boring boilerplate).
- **`src/main.jsx`** — Mounts the React tree: wraps `App` in `BrowserRouter` (gives every component client-side routing) and `React.StrictMode` (dev-only double-invoke to catch side-effect bugs). `parked`.
- **`src/App.jsx`** — Top-level route table. Defines which paths are public (`/`, `/login`) vs. wrapped in `ProtectedRoute` (`/verses`, `/add`, `/practice/:id`). `known` → [[protected-routing]].

## Auth

- **`src/context/AuthContext.jsx`** — Owns auth state (`user`, `loading`) via React Context so any component can read it without prop-drilling. On mount, checks `supabase.auth.getSession()` (restores session from localStorage on refresh) and subscribes to `onAuthStateChange`. Exposes `signUp`/`signIn`/`signOut`, all returning `{ error }` instead of throwing. `introduced` → [[auth-session-flow]], [[supabase-error-pattern]].
- **`src/components/ProtectedRoute.jsx`** — Gate component: renders children if `user` exists, else `<Navigate to="/login" />`. `known` → [[protected-routing]].
- **`src/pages/Login.jsx`** — Single page for both login and signup (toggled by `mode` state). Calls `signIn`/`signUp` from `useAuth()`, checks the returned `error` and displays `error.message`, or navigates to `/verses` on success. **Known gap:** signup only sends `email`/`password` — no name is ever collected, which is why [[navbar-name-bug]] exists. `known` → [[supabase-error-pattern]].

## Verse data (backend boundary)

- **`src/lib/supabase.js`** — Creates the single shared Supabase client from `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`. Singleton so every file shares one auth session. `known` → [[env-var-security]].
- **`src/data/verses.js`** — All Supabase reads/writes for verses live here: `getVerses` (no explicit `user_id` filter — isolation depends entirely on RLS), `saveVerse` (fetches current user, attaches `user_id`), `deleteVerse`, `updateVerse`, `logReview` (writes practice history to a separate `reviews` table). `introduced` → [[rls-data-isolation]], [[schema-not-versioned]].
- **Supabase tables `verses` / `reviews`** — live only in the Supabase dashboard; no migration files in this repo. Self-reported RLS is enabled but unverified as code. `parked` → [[schema-not-versioned]].

## Spaced repetition

- **`src/lib/spacedRepetition.js`** — Pure logic, no React/Supabase: `calculateNextReview` (SM-2 algorithm — grows or resets `interval`/`ease_factor`/`repetitions` based on a 1-4 rating), `isDueForReview`, `getDueVerses`. `introduced` → [[sm2-algorithm]].

## Pages

- **`src/pages/Home.jsx`** — Public marketing/landing page, static hero + CTA button to `/add`. Not auth-gated itself. `known` → [[protected-routing]].
- **`src/pages/AddVerse.jsx`** — Form for reference/text/translation; validates non-empty, calls `saveVerse`, navigates to `/verses`. `known`.
- **`src/pages/VerseList.jsx`** — Fetches all verses, renders `ProgressBar` + a `VerseCard` per verse, toggle to filter to due-only via `getDueVerses`. `parked`.
- **`src/pages/Practice.jsx`** — Finds one verse by `:id`, hides the text as underscores sized to word length, reveals on request, then user self-rates 1-4. On rate: runs `calculateNextReview`, saves via `Promise.all([updateVerse, logReview])`. **Known product gap:** no typed-recall checking — purely self-report. `known` → [[sm2-algorithm]], [[self-report-practice]].

## Components

- **`src/components/Navbar.jsx`** — Shows brand + conditional links based on `user` from `useAuth()`. Reads `user.user_metadata.firstName/lastName` for display — **currently always blank**, see [[navbar-name-bug]]. `introduced`.
- **`src/components/VerseCard.jsx`** — Renders one verse: status badge, next-review chip (via `isDueForReview`), delete with inline confirm step. `parked`.
- **`src/components/ProgressBar.jsx`** — Takes the full verses array, computes its own status counts/percentages, renders a 3-segment bar. `parked`.

## Styling

- **`src/styles/global.css`**, **`*.module.css`** (one per component/page) — CSS Modules scope class names per-file automatically; not a priority for backend-focused learning. `parked`, low priority by design.

## Config / generated

- **`vite.config.js`** — Vite + React plugin config. `parked`, boring boilerplate.
- **`package.json`, `package-lock.json`** — dependency manifest/lockfile. `generated` — never hand-edit `package-lock.json`.
- **`node_modules/`** — installed dependencies. `generated` — machine-made, never edit, always rebuildable via `npm install`.
- **`.env`** — holds `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Not committed (in `.gitignore`, only `node_modules`/`.env` remain there now). `known` → [[env-var-security]].
- **`.gitignore`** — controls what git *tracks locally*; briefly (and correctly, on reflection) held `.agents`/`.claude`/`learning`/`skills-lock.json` before being reverted. `known` → [[gitignore-scope]].

## Learning-method tooling

- **`learning/project.md`, `file-map.md`, `knowledge-graph.md`, `plan.md`** — this session's own artifacts: triage, file map, knowledge graph, forward plan. `known` — authored this session, now committed (`e336851`).
- **`.claude/skills/`, `.agents/skills/`** — the `adopt-project`/`next-lesson`/`plan-journey` skill definitions that drive this learning workflow, mirrored for two different tools. `known` — toured 2026-07-22, now committed.
- **`skills-lock.json`** — lockfile recording where those skills came from (`jasonku09/altitude-skills` on GitHub) and a hash, so future changes to the source are detectable. `known` — toured 2026-07-22, now committed.

## Database (schema as code)

- **`supabase/config.toml`** — Supabase CLI settings for *local* development (ports, which API schemas to expose). Not your actual schema — just how the CLI runs things on your machine. `known` → toured 2026-07-22.
- **`supabase/.gitignore`** — nested gitignore excluding CLI-generated temp/cache files (`.temp`, local env overrides). `known`.
- **`supabase/schema.sql`** — a snapshot of the real `verses`/`reviews` table definitions and RLS policies, captured via `supabase db dump` (not a tracked migration — see [[db-pull-mystery]] for why `db pull` was the intended-but-unresolved path). `known` → [[rls-data-isolation]], [[schema-not-versioned]].
- **`supabase/.temp/`** — CLI link-session cache (project ref, connection info). `generated`, gitignored, machine-made.
