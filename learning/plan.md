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
- [ ] Write the percentage-to-rating mapping (6 buckets → 5 values, decided 2026-07-24) as its own tested function.
- [ ] Rebuild `Practice.jsx`'s UI: typed input instead of reveal, wire up scoring + auto-rating.
- [ ] Test end-to-end in the browser.
- [ ] Commit.

**Paused 2026-07-28** — deliberately parked here (3 of 6 tasks done) to pivot to Phase 2 below. Nothing lost; resume exactly where this left off whenever the frontend work comes back around.

---

## Phase 2 — Distributed backend: the scripture reminder scheduler

**Why this phase exists:** the goal driving it is backend/distributed-systems depth for big-tech infra interviews — not another frontend feature. The real problem it solves: reminding each user their verse review is due is, underneath, millions of independently-scheduled per-user jobs with retry/delivery requirements and predictable traffic spikes (Sunday mornings, Easter, Christmas). That's a genuine distributed-scheduling problem, not a toy one.

### Fast path to deployment (decided 2026-07-29)

**Goal:** a real, live deployment within a week, for the resume — while still understanding every piece, not copy-pasting.

**Deploy-critical path, in this order:** Section 7 → 8 → 9 → 11 → 15 → **README**. This is the minimum for "it's actually live and doing its job unattended": one working task, reading real data, running on a schedule, containerized, on a real VM.

**Deferred until after deployment, not dropped:** Section 10 (retries/failure handling), Section 12 (Flower dashboard), Section 13 (kill-a-worker chaos test), Section 14 (Locust load test). None of these block having something live — they're real interview-story depth to add once the core is already running in production. Section 6's remaining typed-practice work (paused 2026-07-28) also resumes after this fast path.

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

### Section 8 — Talking to the real data  [ ] not started
**Deliverable:** a Python script connects to the existing Supabase Postgres and prints who's actually due for a review today.
**Concepts:** postgres-connection-from-python, sql-querying-from-python, read-vs-write-db-access, credentials-management

### Section 9 — The automatic heartbeat  [ ] not started
**Deliverable:** Celery Beat runs on a timer, checks who's due, and fans that out into individual email jobs with no manual trigger.
**Concepts:** celery-beat-periodic-tasks, fan-out-pattern, idempotency

### Section 10 — Failure isn't the exception, it's the design  [ ] not started
**Deliverable:** deliberately break email sending, watch Celery retry with backoff, then land in a clearly logged failure state once retries are exhausted.
**Concepts:** celery-retries, exponential-backoff, dead-letter-handling, at-least-once-delivery

### Section 11 — Going multi-worker with containers  [ ] not started
**Deliverable:** the whole stack (Redis, Beat, several worker containers) runs with one `docker compose up`, with proof that jobs are actually split across workers.
**Concepts:** docker-basics, dockerfile, docker-compose-file, container-networking, horizontal-scaling

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
