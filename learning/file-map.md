# VerseVault — File Map

Status legend: `known` (demonstrated in conversation) · `introduced` (partially demonstrated / just taught) · `generated` (machine-made, never hand-edit) · `parked` (not yet probed — honest ledger, not a judgment).

## Entry point

- **`index.html`** — Vite's HTML shell; loads `src/main.jsx` as a module. `parked` (not probed, low-risk file, boring boilerplate).
- **`src/main.jsx`** — Mounts the React tree: wraps `App` in `BrowserRouter` (gives every component client-side routing) and `React.StrictMode` (dev-only double-invoke to catch side-effect bugs). `parked`.
- **`src/App.jsx`** — Top-level route table. Defines which paths are public (`/`, `/login`) vs. wrapped in `ProtectedRoute` (`/verses`, `/add`, `/practice/:id`). `known` → [[protected-routing]].

## Auth

- **`src/context/AuthContext.jsx`** — Owns auth state (`user`, `loading`) via React Context so any component can read it without prop-drilling. On mount, checks `supabase.auth.getSession()` (restores session from localStorage on refresh) and subscribes to `onAuthStateChange`. Exposes `signUp`/`signIn`/`signOut`. `signUp` takes a `metadata` object passed to Supabase's `options: { data: metadata }`, restored 2026-07-24 after being found deleted. `introduced` → [[auth-session-flow]], [[supabase-error-pattern]].
- **`src/components/ProtectedRoute.jsx`** — Gate component: renders children if `user` exists, else `<Navigate to="/login" />`. `known` → [[protected-routing]].
- **`src/pages/Login.jsx`** — Single page for both login and signup (toggled by `mode` state). Signup now collects `firstName`/`lastName` and passes them as `signUp`'s metadata object — restored 2026-07-24 (see [[navbar-name-bug]]). `known` → [[supabase-error-pattern]], [[navbar-name-bug]].

## Verse data (backend boundary)

- **`src/lib/supabase.js`** — Creates the single shared Supabase client from `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`. Singleton so every file shares one auth session. `known` → [[env-var-security]].
- **`src/data/verses.js`** — All Supabase reads/writes for verses live here: `getVerses` (no explicit `user_id` filter — isolation depends entirely on RLS), `saveVerse` (fetches current user, attaches `user_id`), `deleteVerse`, `updateVerse`, `logReview` (writes practice history to a separate `reviews` table). `introduced` → [[rls-data-isolation]], [[schema-not-versioned]].
- **Supabase tables `verses` / `reviews`** — RLS confirmed as code (`supabase/schema.sql`) and empirically tested (disabled/re-enabled with two real test accounts, 2026-07-23). `known` → [[rls-data-isolation]].

## Spaced repetition

- **`src/lib/spacedRepetition.js`** — Pure logic, no React/Supabase: `calculateNextReview` (SM-2 algorithm, now a 1-5 rating scale after adding "Perfect" for typed-recall practice), `isDueForReview`, `getDueVerses`. `known` → [[sm2-algorithm]].
- **`src/lib/spacedRepetition.test.js`** — Unit tests for `calculateNextReview`, rewritten 2026-07-25 with intent-revealing names covering all 5 rating branches. `known` → [[sm2-algorithm]], [[automated-testing-basics]], [[test-should-assert-intent]].
- **`src/lib/scoreAttempt.js`** — Pure functions comparing typed text against actual verse text, word-by-word: full credit for a case-insensitive match, 0.95 partial credit for punctuation-only mismatches, 0 otherwise. `compareWords` (added 2026-07-31) does the actual word-by-word matching and returns `{ word, typedWord, status }` per word; `scoreAttempt` reduces those statuses into a percentage. Shared by the scorer and the Practice UI so the matching logic isn't duplicated. `known` — authored 2026-07-25, refactored 2026-07-31 → [[averaging-and-rounding-math]], [[reduce-accumulator-pattern]].
- **`src/lib/scoreAttempt.test.js`** — Tests for `scoreAttempt` (exact match, a punctuation-mismatch case that surfaced the rounding bug) and `compareWords` (per-word match/partial/miss tagging, including a typo case). `known` — authored 2026-07-25, extended 2026-07-31 → [[pure-function-boundary]], [[averaging-and-rounding-math]].
- **`src/lib/percentageToRating.js`** — Pure function mapping a `scoreAttempt` percentage onto the 1-5 SM-2 rating scale (5 buckets: Need Practice/Average/Decent/Good/Perfect). `known` — authored 2026-07-31, test-first → [[percentage-to-rating-mapping]].
- **`src/lib/percentageToRating.test.js`** — 8 boundary tests, one pair per bucket transition (e.g. `84.99` vs `85`). `known` — authored 2026-07-31 → [[percentage-to-rating-mapping]].

## Pages

- **`src/pages/Home.jsx`** — Public marketing/landing page, static hero + CTA button to `/add`. Not auth-gated itself. `known` → [[protected-routing]].
- **`src/pages/AddVerse.jsx`** — Form for reference/text/translation; validates non-empty, calls `saveVerse`, navigates to `/verses`. `known`.
- **`src/pages/VerseList.jsx`** — Fetches all verses, renders `ProgressBar` + a `VerseCard` per verse, toggle to filter to due-only via `getDueVerses`. `parked`.
- **`src/pages/Practice.jsx`** — Finds one verse by `:id`, hides the text while the user types their attempt into a textarea. On Submit (`handleSubmitAttempt`): scores the attempt (`scoreAttempt`/`compareWords`), auto-determines the rating (`percentageToRating`), and shows a results view — the user's typed words (misses in red), a plain "Correct version" box, and the score/rating — without saving or navigating yet. On Continue (`handleRate`, unchanged): runs `calculateNextReview`, saves via `Promise.all([updateVerse, logReview])`, navigates to `/verses`. Rebuilt 2026-07-31, closing the self-report gap. `known` → [[sm2-algorithm]], [[self-report-practice]], [[percentage-to-rating-mapping]].

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

## Backend (Python/Celery scheduler — Phase 2)

- **`backend/venv/`** — Python virtual environment, scoped to this project only (same idea as `node_modules/`, different language). `generated`, gitignored (both by its own auto-created inner `.gitignore` and by `backend/.gitignore`), never edit, rebuildable via `python3 -m venv venv` + `pip install -r requirements.txt`.
- **`backend/.gitignore`** — ignores `venv/` and `.env` from the `backend/` root. `known` → [[gitignore-scope]].
- **`backend/requirements.txt`** — Python's equivalent of `package.json`: exact installed package versions (`celery`, `redis`, `resend`, `python-dotenv`), regenerated via `pip freeze`. `known`.
- **`backend/.env`** — holds `RESEND_API_KEY` and `DATABASE_URL` (now Supabase's **transaction-mode connection pooler** URI, port 6543 — switched from the direct IPv6-only connection string so the Docker containers, which have no outbound IPv6 route, can actually reach Postgres). A real password briefly leaked into container logs via a DSN-parse-error typo this section and was rotated immediately. Gitignored, never committed. `known` → [[api-keys-as-env-vars]], [[credentials-management]], [[db-connection-pooling]], [[credential-leak-response]].
- **`backend/celery_app.py`** — defines the Celery app, its Beat schedule (`check_and_notify` hourly, `crontab(minute=0, hour='*')` — real production cadence, decided 2026-07-31 to sidestep timezone/afternoon-verse edge cases without per-user timezone data), and three tasks: `send_test_email`, `send_reminder_email` (sends one real reminder, updates `last_reminded_at` only after a successful send; retries automatically on `RateLimitError`/`ApplicationError` with exponential backoff, 3 attempts, but fails immediately on `ValidationError`/`MissingRequiredFieldsError`/`MissingApiKeyError`/`InvalidApiKeyError` since those are permanent, not transient), and `check_and_notify` (queries who's due and not recently reminded, fans out one `send_reminder_email.delay(...)` per user). `CELERY_BROKER_URL` reads from an env var (`redis://localhost:6379/0` default, overridden to `redis://redis:6379/0` inside Docker). `known` — authored 2026-07-29, extended 2026-07-30/2026-07-31 → [[celery-task]], [[celery-broker]], [[celery-worker-process]], [[celery-beat-periodic-tasks]], [[fan-out-pattern]], [[idempotency]], [[read-vs-write-db-access]], [[container-networking]], [[celery-retries]], [[exponential-backoff]], [[at-least-once-delivery]].
- **`backend/check_due.py`** — connects directly to Supabase's Postgres with a privileged credential (bypasses RLS on purpose — needs to see every user's rows), queries for verses where `next_review_at <= NOW()`, prints who's due. `known` — authored 2026-07-30 → [[postgres-connection-from-python]], [[sql-querying-from-python]], [[sql-null-semantics]].
- **`backend/celerybeat-schedule*`** — Celery Beat's local persistence files (SQLite-style journal) tracking schedule state. `generated`, gitignored, machine-made.
- **`backend/__pycache__/`** — Python's compiled bytecode cache. `generated`, gitignored (was briefly tracked by accident, untracked with `git rm --cached`) — never edit, always regenerated.
- **`backend/Dockerfile`** — image both the `worker` and `beat` services build from (`docker-compose.yml` overrides the default command per service). Layer-cached (`COPY requirements.txt .` → `pip install` → `COPY . .`), runs as a non-root `appuser` (`useradd` + `chown -R /app` + `USER appuser`) rather than root, per Celery's own startup security warning. `known` — authored 2026-07-30 → [[dockerfile]], [[least-privilege-containers]].
- **`backend/docker-compose.yml`** — three services (`redis`, `worker`, `beat`) on one shared network, addressed by service name (not `localhost`). `DATABASE_URL`/`RESEND_API_KEY`/`CELERY_BROKER_URL` passed through from `backend/.env` via Compose's automatic `.env` pickup. Scales via `docker compose up --scale worker=N`. `known` — authored 2026-07-30 → [[docker-compose-file]], [[container-networking]], [[horizontal-scaling]].
- **`backend/.dockerignore`** — excludes `venv/`, `.env`, `celerybeat-schedule*`, `__pycache__/` from the Docker build context, same pattern as `.gitignore`. `known` — authored 2026-07-30 (independently, correctly) → [[docker-basics]].
