# VerseVault — Forward Plan

## Decisions your code already made (inherited)

- **React** — fuzzy, real but partial: correctly explained the re-render performance angle; the fuller "UI as a function of state" picture is still ahead. Revisit naturally as sections touch component code.
- **Vite** — build tool only, low-stakes, not a priority to go deep on given your backend focus.
- **Supabase** — understood: correctly named it as backend-as-a-service providing SQL database + auth/authorization in one sentence.
- **Hosting** — genuinely undecided, no config exists yet (no Vercel/Netlify/etc). Real decision still ahead, not yet fuzzy-but-explained — just open. Lands in a later section.

## Section 1 — Make the ground solid *(fixed)*

Git already has real, incremental history (6 commits) and the app runs cleanly — most of "solid ground" is already true. The one gap: `learning/` (this session's artifacts) plus `.claude/`, `.agents/`, `skills-lock.json` are currently untracked.

**Deliverable:** everything from this session is committed — nothing from today can be lost.

**Tasks:**
- [x] Tour the untracked files (`.claude/`, `.agents/`, `skills-lock.json`, `learning/`) and confirm none of them are secrets/environment-specific — decide together they belong in git.
- [x] Stage the right files with `git add` (learner runs it).
- [x] Write and run a commit, message in the learner's own words.
- [x] Verify with `git log`/`git status` that the working tree is clean.

**Done 2026-07-22** — commit `e336851`, working tree clean. Bonus: caught and fixed a self-made `.gitignore` mistake along the way (see [[gitignore-scope]] in the knowledge graph) — unplanned, but real evidence.

## Section 2 — Version your schema as code

Right now `verses`/`reviews` tables and RLS policies exist only by clicking around the Supabase dashboard — no record of them in git. Write SQL migration file(s) that capture the current schema and policies as-is, and commit them to the repo.

**Reclaim task:** go find and read the actual RLS policy on `verses` in the dashboard, then write down in your own words exactly what it allows and blocks — this is the [[rls-data-isolation]] concept from the file map, currently only `introduced`.

**Deliverable:** "your database can be rebuilt from git, not from memory."

**Receipt:** direct follow-up to the fear you named in Phase 1 (Supabase debugging) and the gap found in Phase 2 (no migrations anywhere in the repo).

**Progress 2026-07-22:** Installed and linked the Supabase CLI. `supabase db pull` (the intended tool — generates a real tracked migration) hit an unresolved mystery: reported "No schema changes found" despite `verses`/`reviews` genuinely existing in `public`. Ruled out three causes (a Docker container crash, stale migration history, wrong schema) without finding the real one. Worked around it with `supabase db dump --schema public -f supabase/schema.sql`, which got the actual goal done: `schema.sql` now captures the real table definitions and RLS policies (`auth.uid() = user_id` on both tables) in git. Reclaim task done — correctly explained that this policy is *why* `getVerses()`'s missing `user_id` filter in the JS isn't a bug.

**Open loose end:** `db dump` is a one-time snapshot, not a tracked migration — future schema changes won't auto-diff against it, and `db pull` may hit the same unexplained failure again. Worth another look in a future session, ideally with more time to dig into CLI internals.

## Section 3 — Verify data isolation for real

Create a second test account and confirm, hands-on, that one user's verses never appear for another. If the policy is missing or wrong, write/fix it here rather than assuming it works.

**Reclaim task:** before testing, predict what you'd see if the policy were broken or missing — then break it on purpose (temporarily) and confirm your prediction, before restoring it.

**Deliverable:** proof, not assumption, that user data is isolated — the load-bearing guarantee for every feature after this.

**Tasks:**
- [x] Predict what you'd see in the app if the RLS policy were broken or missing, before testing anything.
- [x] Create a second test account and add a verse under each of the two accounts.
- [x] Confirm hands-on that each account only ever sees its own verse.
- [x] Break the policy on purpose (temporarily) and confirm your prediction from step 1 actually happens.
- [x] Restore the policy, re-verify isolation holds, commit anything that changed.

**Done 2026-07-23** — correctly predicted the leak, disabled RLS on `verses` and watched it happen for real (both test accounts saw all verses), re-enabled it, confirmed isolation restored. No repo changes this section (all done via dashboard SQL), so nothing to commit. Section 4 is next.

## Section 4 — A safety net for the trickiest logic

No automated tests exist anywhere in the repo. Rather than bolting testing on later as homework, introduce it here, where it's actually load-bearing: tests for `calculateNextReview` (the SM-2 logic) — pure JS, no dependencies, an ideal first unit-test target.

**Scope note (2026-07-23):** originally this section also covered testing the RLS isolation behavior from Section 3, but that needs real test-user infrastructure against Supabase — descoped to keep this section achievable. Candidate for its own future section if wanted.

**Reclaim task:** you described the "Again" rating as a gradual decrement during Phase 2, when it's actually a full reset (`interval`/`repetitions` → 0). Write a test that pins down the real behavior, so this can't quietly drift or be misunderstood again.

**Deliverable:** a test suite that catches regressions in the riskiest piece of logic in the app.

**Tasks:**
- [x] Decide and install a test framework (Vitest — pairs natively with Vite).
- [x] Write a first passing test: a "Good" rating grows the interval.
- [x] Write the reclaim-task test: "Again"/"Hard" fully resets `interval`/`repetitions`, not a gradual decrement.
- [x] Run the suite, read the output together.
- [x] Commit the test file and updated `package.json`.

**Done 2026-07-23** — commit `deb71ec`. Both tests pass; self-corrected the reclaim-task assertion before it was even flagged. Deliverable reached: a real regression test for the algorithm's trickiest behavior. Section 5 (the Navbar name bug) is next.

## Section 5 — Fix the Navbar name bug

A real bug found while mapping the code: `Navbar.jsx` reads `user.user_metadata.firstName/lastName`, but `signUp` in `AuthContext.jsx` never collects or sends a name — it will always render blank.

**Reclaim task:** trace this yourself first (where would the name need to be captured? how does Supabase's `signUp` options carry custom metadata?) before fixing it.

**Tasks:**
- [x] Trace and predict: where does a name need to be captured, and how might `signUp` carry it to Supabase?
- [x] Add first/last name fields to the signup form in `Login.jsx`.
- [x] Update `AuthContext`'s `signUp` to pass them through to Supabase.
- [x] Test end-to-end with a new account, confirm the Navbar shows the name.
- [x] Commit.

**Deliverable:** visible, working fix — and a second rep on debugging an auth-related Supabase issue, the exact skill you said you want to grow.

**Done 2026-07-24** — commit `5cbbf0e`. This wasn't a mystery bug — real git archaeology found the exact commit (`534e775`) that silently deleted it. Caught a real JS gotcha along the way (positional args silently dropping) via a wrong-then-corrected fill-in. All five hardening sections (1-5) are now complete.

## Section 6 — Typed-recall practice

Promoted from the parking lot (chosen 2026-07-24, ahead of Friends). Replaces the reveal-and-self-rate flow in `Practice.jsx` with real typed input: the user types the verse from memory, the app compares it word-by-word against the actual text, computes a percentage match, and **auto-determines the SM-2 rating** from that percentage (decided 2026-07-24 — no manual buttons; the score decides).

**Reclaim task:** tie back to the "React — fuzzy" inherited decision from Section 3 of this plan (Phase 3 originally) — explain why typing into the new input field automatically updates what's on screen, in terms of "UI as a function of state," not just the re-render-performance angle you gave then.

**Deliverable:** a working typed-practice mode that scores real recall, not self-report.

**Tasks:**
- [x] Decide percentage-to-rating thresholds — 6 labels (Perfect/Good/Decent/Average/Need practice/Poor) mapping onto a **5-value** rating scale (adds a new "Perfect" = 5, extending `calculateNextReview` beyond its original 1-4).
- [x] Trace/predict what `calculateNextReview` actually needs to change to support rating 5, before touching the code. Correctly predicted it would fall into the existing "grow interval" branch with a bigger ease-factor bump — technically already worked via fallthrough before any edit.
- [x] Update `calculateNextReview` for the 5th rating + write tests locking in the new behavior. **Done 2026-07-25:** 5th (Perfect) branch in place; Good/Easy deliberately now takes 3 successful reviews before the 3-day jump (confirmed intent). Tests rewritten with intent-revealing names, no longer just echoing code output. Doc comments updated for the 1-5 scale. All 5 tests pass.
- [x] Write `scoreAttempt` as a pure, tested function (word-by-word comparison + percentage) — test-first, same pattern. **Done 2026-07-25:** case-insensitive full match, 0.95 partial credit for punctuation-only mismatches, rounded to 2 decimals (not the nearest whole number — a real bug surfaced along the way, see [[averaging-and-rounding-math]] in the graph). Committed and pushed (`3cf8e8b`).
- [x] Write the percentage-to-rating mapping (6 buckets → 5 values, decided 2026-07-24) as its own tested function. **Done 2026-07-31:** `src/lib/percentageToRating.js` + 8 boundary tests. Caught two real bugs before writing any implementation: the "Need Practice" bucket was first written as `>50%` (would never match anything, since 30% doesn't satisfy `30 > 50`), corrected to `<50%`; then a test asserted exactly `50%` → rating 1, contradicting the just-agreed table (`50-69.99% = Average = 2`), corrected once traced against the table. Predicted-then-confirmed a missing `export` keyword would break the named import before running anything — found and fixed it independently, verified with a real test run (8/8 passing).
- [x] Rebuild `Practice.jsx`'s UI: typed input instead of reveal, wire up scoring + auto-rating.
- [x] Test end-to-end in the browser.
- [x] Commit.

**Paused 2026-07-28** — deliberately parked here (3 of 6 tasks done) to pivot to Phase 2 below. Nothing lost; resumed exactly where this left off.

**Resumed and finished 2026-07-31** — decided to prioritize finishing the app itself (this + Section 10) over continuing the Section 15 deployment blocker (stuck on Oracle Cloud account setup). `Practice.jsx` rebuilt: textarea replaces reveal-and-buttons, `handleSubmitAttempt` scores the attempt and shows results (score %, rating label, word-by-word comparison), `handleRate` is now only called by a "Continue" button so the learner can actually see their score before the save+navigate happens. Along the way: refactored `scoreAttempt.js` to extract a shared `compareWords` helper (word-level match/partial/miss + both words) reused by both the score calculation and the UI, instead of duplicating the matching logic — verified the refactor didn't change `scoreAttempt`'s existing test results before building on top of it. Iterated twice on the results UI from direct feedback: added a second "Correct version" box for side-by-side comparison, then reworked the first box to show the user's own typed words (not the correct ones) with only true misses in red — initially over-styled (bold + underline) and padded missing words with `___` placeholders "to match length," both trimmed down to plain red text and no padding once flagged as unwanted.

---

## Phase 2 — Distributed backend: the scripture reminder scheduler

**Why this phase exists:** the goal driving it is backend/distributed-systems depth for big-tech infra interviews — not another frontend feature. The real problem it solves: reminding each user their verse review is due is, underneath, millions of independently-scheduled per-user jobs with retry/delivery requirements and predictable traffic spikes (Sunday mornings, Easter, Christmas). That's a genuine distributed-scheduling problem, not a toy one.

### Fast path to deployment (decided 2026-07-29)

**Goal:** a real, live deployment within a week, for the resume — while still understanding every piece, not copy-pasting.

**Deploy-critical path, in this order:** Section 7 → 8 → 9 → 11 → 15 → **README**. This is the minimum for "it's actually live and doing its job unattended": one working task, reading real data, running on a schedule, containerized, on a real VM.

**Deferred until after deployment, not dropped:** Section 10 (retries/failure handling), Section 12 (Flower dashboard), Section 13 (kill-a-worker chaos test), Section 14 (Locust load test). None of these block having something live — they're real interview-story depth to add once the core is already running in production. Section 6's remaining typed-practice work (paused 2026-07-28) also resumes after this fast path.

**Reprioritized 2026-07-31:** got stuck on Oracle Cloud account setup (Section 15 blocker) and decided to make the app itself more complete first rather than wait on that. New order: finish **Section 6** (typed-recall practice, resume at task 4/6) and **Section 10** (retry/failure handling) now, then return to Section 15 deployment once both are done. Sections 12-14 stay deferred until after deployment either way.

**New: README section**, right after Section 15 — a clean top-level `README.md` documenting what's actually deployed and how to run it, written once there's a real system to describe accurately (not aspirational docs for something not yet built).

### Locked decisions (2026-07-28)

- **Language:** Python — already the learner's strongest language; the explicit goal is going deeper in it for backend work specifically.
- **Task queue:** Celery + Redis — the standard Python distributed task queue; avoids reinventing retries, dedup, and worker-crash handling that Celery already solves.
- **Data source:** connect directly to the existing Supabase Postgres (it's plain Postgres under a connection string) — a second database would only invent a consistency/sync problem that doesn't need to exist.
- **Delivery channel:** email via a transactional provider (Resend/SendGrid) — every user already has one (Supabase Auth), and it avoids pulling frontend work (service workers, browser permissions) back into a backend-focused project.
- **Scheduling trigger:** Celery Beat — keeps the periodic "who's due" check inside the same system as everything else, for one centralized, debuggable point instead of a second system (cron) running blind.
- **Orchestration:** Docker Compose, multiple worker containers — containers and horizontal scaling first, before taking on Kubernetes' extra learning curve.
- **Monitoring:** Flower — Celery's own dashboard, minimal setup, docs assume this exact stack. Prometheus/Grafana is a real candidate to add later once Flower feels too basic.
- **Load testing:** Locust — load-test scenarios stay in Python instead of context-switching to k6's JavaScript.
- **Hosting:** a cloud VM (DigitalOcean Droplet) — raw machine control on purpose, so killing a process or a node is something the learner directly causes and observes, not something a managed platform quietly papers over.

### Section 7 — One task, one worker, running locally  [x] done 2026-07-29
**Deliverable:** trigger a Celery task from Python and watch a worker execute it, ending with a real test email landing in an inbox.
**Concepts:** celery-task, celery-broker, celery-worker-process, redis-basics, api-keys-as-env-vars

**Tasks:**
- [x] Set up `backend/` folder with its own Python virtual environment.
- [x] Install and start Redis locally (Homebrew), confirm it's running (`redis-cli ping` → `PONG`).
- [x] Install Celery + redis client in the venv.
- [x] Sign up for a transactional email provider (Resend), get an API key, store it in `backend/.env`.
- [x] Write a minimal Celery app + one task that sends a test email.
- [x] Start a worker, trigger the task, confirm a real email arrives.

**Done 2026-07-29** — real email received. Along the way: correctly predicted Redis installs globally (same as the Supabase CLI), wrongly predicted the worker command would return control (corrected via the `npm run dev` analogy — a long-running process), and repeated the "nested `.gitignore` instead of one line in the parent" mistake from earlier with `venv/`, corrected the same way as before.

### Section 8 — Talking to the real data  [x] done 2026-07-30
**Deliverable:** a Python script connects to the existing Supabase Postgres and prints who's actually due for a review today.
**Concepts:** postgres-connection-from-python, sql-querying-from-python, read-vs-write-db-access, credentials-management

**Done 2026-07-30** — `backend/check_due.py`, real query, real results. Debugged through several genuine SQL mistakes independently (wrong column name, `GETDATE()` vs `NOW()`, the `= NULL` trap — verified empirically rather than just accepting the explanation). **Bonus, self-directed:** caught a real product bug by checking the live dashboard unprompted — new verses were immediately "due" because of `next_review_at`'s `DEFAULT now()`. Fixed at the schema level (`DEFAULT now() + interval '1 day'`) so every insert path benefits, not just the frontend; `supabase/schema.sql` refreshed to match. `read-vs-write-db-access` still `seed` — this section was read-only.

### Section 9 — The automatic heartbeat  [x] done 2026-07-30
**Deliverable:** Celery Beat runs on a timer, checks who's due, and fans that out into individual email jobs with no manual trigger.
**Concepts:** celery-beat-periodic-tasks, fan-out-pattern, idempotency

**Tasks:**
- [x] Decide the local test interval (short, e.g. every minute — will change to daily before Section 15) and the real production cadence (daily, re-remind until reviewed).
- [x] Turn `check_due.py`'s query into a proper Celery task; join with `auth.users` to get real email addresses.
- [x] Fan out: for each due user, queue a real reminder email task.
- [x] Configure Celery Beat's schedule, start it in a third terminal, watch it fire with no manual trigger.
- [x] Observe what happens on repeated fires before a verse is reviewed — decide and implement the idempotency guard.

**Done 2026-07-30** — full loop verified empirically, both directions: manually set a test verse's `next_review_at` to the past, watched Beat's next cycle fan out a real `send_reminder_email` job, confirmed a real email arrived, confirmed `last_reminded_at` was written only after the successful send, then waited a second cycle and confirmed **no duplicate email** — the idempotency guard actually works, not just compiles. Two real bugs caught and fixed along the way: `.delay()` missing from the fan-out call (defaulted to synchronous execution), and the idempotency guard initially not subtracting the day interval (`<= NOW()` is always true once set, not just within a day). Also cleaned up two gitignore gaps: `celerybeat-schedule*` (proposed independently, small typo only) and `backend/__pycache__/` (was accidentally committed before being gitignored — introduced `git rm --cached` to untrack without deleting).

### Section 10 — Failure isn't the exception, it's the design  [ ] not started
**Deliverable:** deliberately break email sending, watch Celery retry with backoff, then land in a clearly logged failure state once retries are exhausted.
**Concepts:** celery-retries, exponential-backoff, dead-letter-handling, at-least-once-delivery

### Section 11 — Going multi-worker with containers  [x] done 2026-07-30
**Deliverable:** the whole stack (Redis, Beat, several worker containers) runs with one `docker compose up`, with proof that jobs are actually split across workers.
**Concepts:** docker-basics, dockerfile, docker-compose-file, container-networking, horizontal-scaling

**Tasks:**
- [x] Write a `Dockerfile` for the backend (Python base image, install `requirements.txt`, copy code).
- [x] Write `docker-compose.yml`: services for `redis`, `worker`, `beat`.
- [x] Get it running as a single instance of each service — debug container networking (`localhost` means something different inside a container).
- [x] Scale to multiple worker containers and prove tasks actually get distributed across them, not just one.

**Done 2026-07-30** — full stack (`redis`, `worker`, `beat`) runs with one `docker compose up --build`. Correctly predicted `localhost` wouldn't work across containers before being told; fixed via `CELERY_BROKER_URL` env var (`redis://redis:6379/0` from Compose, defaults to `localhost` for bare-venv runs). Added non-root execution (`useradd appuser` + `chown` + `USER appuser`) after seeing Celery's own root warning — real second-order bug from that fix: Beat couldn't write its own `celerybeat-schedule` file until `chown -R` covered the whole `/app` dir first. Scaled to 3 worker containers (`--scale worker=3`), correctly predicted 5 total containers. Real distribution proof: triggered 6 `send_test_email` jobs, confirmed via container logs that all three `worker-1`/`worker-2`/`worker-3` each picked up different task IDs — genuine load-spread, not just configured-and-assumed. Diagnosed and fixed a real infra bug along the way: an old Homebrew Redis (`brew services start redis`, Section 7, never stopped) was silently bound to the same port as Docker's Redis, so triggered tasks got real task IDs but no worker ever received them — caught via `lsof -i :6379`, fixed by stopping the Homebrew service. Also fixed `check_and_notify`'s Supabase connection: Docker had no outbound IPv6 route and Supabase's direct connection string resolves to IPv6-only, so every cycle failed with "Network is unreachable" — switched `DATABASE_URL` to Supabase's IPv4-compatible **connection pooler** (transaction mode, port 6543), correctly reasoning through Session-vs-Transaction mode first (transaction mode fits because each task opens one short-lived connection for one query, no session state held across calls). Along the way, a DB password was accidentally exposed in plaintext logs — rotated it immediately rather than treating the leak as low-stakes.

### Section 12 — Watching it live  [ ] not started
**Deliverable:** a real-time Flower dashboard showing tasks, workers, and failures as they happen.
**Concepts:** observability-basics, flower-dashboard, healthy-vs-falling-behind

### Section 13 — Kill a worker on purpose  [ ] not started
**Deliverable:** kill a worker container mid-job and prove the job still completes with nothing lost — the fault-tolerance demo.
**Concepts:** fault-tolerance, task-acknowledgment-and-redelivery, chaos-testing

### Section 14 — Prove it under load  [ ] not started
**Deliverable:** Locust scenarios simulating an "Easter morning" traffic spike, with throughput/latency measured as worker count scales.
**Concepts:** load-testing-basics, throughput-vs-latency, backpressure

### Section 15 — Actually live  [ ] not started
**Deliverable:** the full stack deployed to a real cloud VM via SSH, confirmed by real emails going out from a server that isn't the learner's laptop.
**Concepts:** cloud-vm-setup, remote-docker-deployment, secrets-in-production

### Section README — a clean top-level README  [ ] not started
**Deliverable:** a real `README.md`, written once Section 15 is live, accurately describing what VerseVault is, the stack (React/Supabase frontend + the new Python/Celery/Redis/Docker backend), how to run it locally, and what's actually deployed. Resume-facing, so it needs to read as a real, working project — not aspirational.
**Concepts:** technical-writing-for-a-real-audience

## Sections 16+ — remaining candidates (not yet detailed)

- **Friends/social feature** — the original vision, best system-design practice (new tables, relationships, permissions). Still parked, now behind the backend phase.
- **Prometheus + Grafana** — natural upgrade from Flower once its dashboard feels too basic.
- **Kubernetes** — natural upgrade from Docker Compose once containers/orchestration fundamentals from Section 11 are solid.

---

Next step: run `/next-lesson` — it takes the next open section (Section 7) and breaks it into one task at a time. Nothing here gets built without you being able to explain it first.
