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
**Status:** understood
**Depends on:** supabase-error-pattern
**Evidence (2026-07-21, upgraded 2026-07-22, reinforced 2026-07-23):** 07-21: understood the "orphan verse" consequence of missing `user_id` unprompted, but missed the cross-user leak angle (taught). 07-22: after `supabase db dump` surfaced the real policy, correctly explained why `getVerses()`'s missing `user_id` filter isn't a bug. 07-23: correctly predicted, before testing, that disabling RLS would leak all verses across accounts — then confirmed hands-on with two real test accounts (isolation holds with RLS on, leaks with it off) and restored it. Third day of evidence, now includes a live empirical test, not just code-reading.

### rls-fail-open-vs-closed
**Status:** seed
**Depends on:** rls-data-isolation
**Evidence (2026-07-23):** Explained (not yet independently reasoned) during Section 3: dropping a policy entirely makes Postgres deny *everyone* (fail-closed, default-deny when RLS is enabled with zero policies), which is different from disabling RLS outright (fail-open, the scenario actually tested). Worth a direct check next time rather than assuming it stuck from being told once.

### schema-not-versioned
**Status:** practicing
**Depends on:** —
**Evidence (2026-07-21, progressed 2026-07-22):** 07-21: missing-practice finding, no SQL/migration files anywhere. 07-22: `supabase/schema.sql` now captures real table definitions + RLS policies in git via `supabase db dump`. Not fully resolved — this is a snapshot, not a CLI-tracked migration (`supabase db pull` failed with an unexplained "No schema changes found", unresolved — see [[db-pull-mystery]]), so ongoing schema changes still won't auto-diff. Real progress, not yet the end state.

### db-pull-mystery
**Status:** seed
**Depends on:** schema-not-versioned
**Evidence (2026-07-22):** `supabase db pull` reported "No schema changes found" against a database that demonstrably has `verses`/`reviews` tables in `public`. Three hypotheses tested and ruled out together (Docker container crash — `docker ps -a` showed nothing running; stale migration history — `supabase migration list` showed empty local *and* remote; wrong schema — dashboard confirmed `public`). Root cause never found; worked around with `db dump` instead. Open loose end for a future session — do not assume a cause if this resurfaces.

### sm2-algorithm
**Status:** understood
**Depends on:** —
**Evidence (2026-07-21, upgraded 2026-07-23):** 07-21: correctly identified direction (harder rating → shorter/reset interval) but described it as a gradual "decrement" rather than the actual full reset. 07-23, different day: wrote a unit test asserting the reset (`interval: 1, repetitions: 0` on "Again"), self-corrected an initial wrong value (`interval: 0`) before it was even flagged, and the corrected assertion matches the real code. Genuine retrieval + self-correction, not just recall.
**Note (2026-07-24):** now mid-modification for a 5th "Perfect" rating and a deliberate threshold change to Good/Easy's progression — see [[test-should-assert-intent]]. `sm2-algorithm`'s `understood` status was earned on the *pre-change* behavior; the modified version isn't yet re-verified.

### test-should-assert-intent
**Status:** practicing
**Depends on:** automated-testing-basics
**Evidence (2026-07-24 introduced, 2026-07-25 applied):** 07-24: flagged that a test's expected value had been edited to match new code output rather than asserting intent — acknowledged, not yet corrected. 07-25, different day: rewrote the tests with clear intent-revealing names ("repetitions is 2 with rating of 3" / "...3 with rating of 4"), each pinned to the specific `repetitions` threshold that triggers each interval — real correction, not just re-agreeing. All 5 tests pass (`npx vitest run`, verified 2026-07-25).

### self-report-practice
**Status:** understood
**Depends on:** —
**Evidence (2026-07-21 named, closed 2026-07-31):** Named as a known product gap in Phase 1 (practice was reveal + self-rate, no real recall checking). Closed for real 2026-07-31: `Practice.jsx` now uses typed recall — `scoreAttempt`/`compareWords` score the actual typed text against the verse, `percentageToRating` auto-determines the SM-2 rating, no self-report buttons remain. Drove the UI iteration directly from feedback across two rounds (added a "Correct version" comparison box, then corrected the first box to show typed words with only true misses flagged, no padding) — real product ownership, not just accepting a first draft.

### percentage-to-rating-mapping
**Status:** practicing
**Depends on:** self-report-practice
**Evidence (2026-07-31):** Wrote `percentageToRating` + 8 boundary tests test-first. Caught two real bugs before any implementation existed: the "Need Practice" bucket was first written as `>50%` (would never match anything — 30 isn't greater than 50), corrected to `<50%` once asked to trace a concrete value through it; then a test asserted `50%` → rating 1, contradicting the just-agreed table (`50-69.99% = Average = 2`), corrected once traced against the table. Also predicted, before running anything, that a missing `export` keyword would break the test file's named import — found and fixed it independently, confirmed with a real passing test run.

### reduce-accumulator-pattern
**Status:** introduced
**Depends on:** —
**Evidence (2026-07-31):** Asked directly where `sum` gets initialized in `scoreAttempt`'s `.reduce()` call — hadn't spotted that the initial value is `.reduce()`'s second argument, easy to miss since it sits below the callback body. Walked through step-by-step (`sum` in → callback return → `sum` for the next call) with a concrete word-by-word trace. Not yet independently demonstrated in a new context.

### env-var-security
**Status:** understood
**Depends on:** —
**Evidence (2026-07-21):** Correctly reasoned that `VITE_` prefix relates to the Vite build tool and that the anon key doesn't need database-password-level secrecy. Confirmed and connected to RLS in conversation.

### navbar-name-bug
**Status:** understood
**Depends on:** supabase-error-pattern
**Evidence (2026-07-21 found, resolved 2026-07-24):** 07-21: found during file-mapping. 07-24: traced it via real git archaeology (`git log -p`) rather than guessing — found the exact commit (`534e775`, misleadingly titled "added space repetition algorithm") that silently deleted the name fields and the `options: { data: metadata }` pattern. Correctly explained the data flow (metadata → `user_metadata` → already-loaded `user` object, not a separate table pull, self-corrected that detail). Restored the fix with two guided fill-in attempts: first attempt passed `firstName`/`lastName` as separate positional arguments — correctly predicted, when asked to trace it, that the extra argument would be silently dropped — then fixed it to a single object. Verified working end-to-end with a real signup.

### positional-vs-object-arguments
**Status:** practicing
**Depends on:** navbar-name-bug
**Evidence (2026-07-24):** After passing `signUp(email, password, formData.firstName, formData.lastName)` — four positional args against a three-parameter function — correctly predicted that `metadata` would just equal `formData.firstName` and the fourth argument would be silently dropped, no error. Real, useful JS gotcha, caught through reasoning rather than being told.

### react-context
**Status:** seed
**Depends on:** —
**Evidence:** Underlying mechanism of `AuthContext` (prop-drilling problem it solves); not directly probed. The file's own comments explain it — worth checking understanding directly rather than assuming from that.

### automated-testing-basics
**Status:** practicing
**Depends on:** —
**Evidence (2026-07-23):** Installed Vitest, wrote a first test after one explained example, self-corrected the reclaim-task assertion. Then, unprompted, wrote a *third* test entirely independently — asked "how do I get better at this," was pointed at "test every branch, test the boundaries," and immediately picked the exact untested `repetitions === 1` branch, wrote a correct test with no fill-ins, ran it, passed first try. Strong same-day evidence — capped at `practicing` per the no-same-day-`understood` rule; a great candidate to confirm as `understood` on a later-day review.
**Evidence (2026-07-25):** Different day, mixed but real: initial draft for `scoreAttempt`'s test tried to fetch from Supabase inside the test — see [[pure-function-boundary]] — corrected once reminded of the `calculateNextReview` precedent. After that, wrote the exact-match test correctly (own choice of a real scripture verse as test data) and later wrote a second, harder test (missing punctuation) independently, which is what surfaced a real rounding bug. Testing habit is sticking, but still needs occasional reminders on fundamentals — not yet `understood`.

### pure-function-boundary
**Status:** introduced
**Depends on:** automated-testing-basics
**Evidence (2026-07-25):** First draft of a `scoreAttempt` test tried to pull real data from Supabase inside the test body. Corrected by pointing back to how `calculateNextReview` was tested (plain made-up literals, no external systems) — same principle, not yet independently recognized in a new context without that reminder.

### averaging-and-rounding-math
**Status:** practicing
**Depends on:** —
**Evidence (2026-07-25):** Wrote a test expecting a 10-point score drop from 2 missing commas (out of ~29 words), got `100` instead of the expected `90`. When asked to compute `(27×1 + 2×0.95) / 29 × 100` by hand, correctly got `99.65` — realized a 0.05-per-word penalty, diluted across many words, can't produce a 10-point swing. Made a real design call in response (round to 2 decimals instead of the nearest whole number, to preserve the small signal instead of losing it to rounding). Same-day introduction and resolution — capped at `practicing` per the no-same-day-`understood` rule.

### return-statement-control-flow
**Status:** introduced
**Depends on:** —
**Evidence (2026-07-25):** Wrote `console.log(...)` immediately after a `return` statement (dead code) plus a `Math.round(...).toFixed(2)` order-of-operations bug that silently discarded the decimal precision it was meant to preserve. Asked to trace both before running; fixed correctly (`Number(value.toFixed(2))`, dead code removed) but without narrating the reasoning back — credit is for the correct fix, not yet for demonstrated explanation.

### git-workflow
**Status:** understood
**Depends on:** —
**Evidence (2026-07-21 and prior):** Pre-existing evidence: 6 real, incremental commits in the repo before this session. New evidence today: independently ran `git status`, read a `git diff` on `.gitignore` themselves, diagnosed that an earlier commit had gitignored `learning/`/`.claude/`/`.agents/`, fixed it, staged, and committed (`e336851`) — entirely unprompted, no commands dictated. Two independent days of evidence.

### gitignore-scope
**Status:** introduced
**Depends on:** git-workflow
**Evidence (2026-07-22):** Initially conflated "keep this off GitHub" with "gitignore it," which would have meant zero version history/backup for `learning/`. After the tradeoff was named (gitignore = no local backup either, vs. a private repo = backup + hidden from others), chose to commit everything instead. First contact with this specific distinction — worth a quick check next session rather than assuming it's locked in.
**Evidence (2026-07-29):** Related but different gap, same underlying file: created a `.gitignore` *inside* `backend/venv/` trying to exclude a sibling `.env`, instead of one line (`venv/`) in the *parent* `backend/.gitignore` — the same "ignore the whole folder from outside it, like `node_modules`" pattern from Section 1, not yet generalized to a new folder (`venv/`) without a fresh reminder.
**Evidence (2026-07-30):** Real forward progress — asked to propose the pattern for three related `celerybeat-schedule*` files unprompted, correctly reasoned to a wildcard glob in the parent `backend/.gitignore` (one small typo, not a conceptual miss). The core "ignore the whole thing from outside it" idea is sticking; still needed the *new* `__pycache__` gap pointed out rather than catching it independently.

### git-untrack-after-gitignore
**Status:** introduced
**Depends on:** gitignore-scope
**Evidence (2026-07-30):** New concept: `backend/__pycache__/` had been committed before `.gitignore` covered it — adding the ignore rule doesn't retroactively untrack already-committed files. Taught `git rm -r --cached` (removes from git's tracking without deleting the real file, since Python regenerates it anyway); applied correctly, verified with `git ls-files`.

---

## Phase 2 — Distributed backend (scripture reminder scheduler)

### python-for-backend-choice
**Status:** introduced
**Depends on:** —
**Evidence (2026-07-28):** Named the real reason for Python (already known, wants to grow deeper specifically in backend work) rather than a generic "it's popular" answer.

### celery-redis-vs-diy-queue
**Status:** introduced
**Depends on:** python-for-backend-choice
**Evidence (2026-07-28):** Initial answer ("to distribute all the tasks") was too shallow to count as understanding the tradeoff; after being walked through what a hand-rolled queue would make the learner personally responsible for (lost tasks on worker crash, duplicate delivery, retry/backoff, timezone-aware scheduling), confirmed the concept landed ("i get it now"). Worth a real re-check next session, not just accepting same-day confirmation.

### shared-database-vs-duplicate-db
**Status:** introduced
**Depends on:** —
**Evidence (2026-07-28):** Correctly named the real cost of a second database unprompted — migration correctness and consistency between the two databases — without needing the answer walked through first.

### email-vs-push-notification-tradeoff
**Status:** introduced
**Depends on:** —
**Evidence (2026-07-28):** Needed a second prompt to name the specific mechanism (a service worker) rather than just agreeing email was easier; got there once asked directly what push notifications would require on the frontend.

### celery-beat-vs-external-cron
**Status:** introduced
**Depends on:** celery-redis-vs-diy-queue
**Evidence (2026-07-28):** Correctly identified the centralization/debuggability angle ("more centralized point so easier to debug and less heavywork for us") without needing the answer walked through.

### docker-compose-vs-kubernetes-first
**Status:** introduced
**Depends on:** —
**Evidence (2026-07-28):** Correctly reasoned that container fundamentals need to be solid before taking on orchestration complexity, unprompted.

### flower-vs-prometheus-first
**Status:** introduced
**Depends on:** —
**Evidence (2026-07-28):** Confirmed with a bare "yes" to a yes/no framing of the question — real but thin evidence, worth a fuller free-recall check next time this comes up.

### locust-vs-k6
**Status:** introduced
**Depends on:** python-for-backend-choice
**Evidence (2026-07-28):** Correctly tied the choice back to the standing goal of going deeper in Python specifically, not just tool preference.

### raw-vm-vs-managed-platform
**Status:** introduced
**Depends on:** —
**Evidence (2026-07-28):** Correctly named that owning the underlying machine matters because the point is to actually understand what's happening under the hood, not just tradeoffs in the abstract.

### celery-task
**Status:** introduced
**Depends on:** celery-redis-vs-diy-queue
**Evidence (2026-07-29):** Taught the `@app.task` decorator (turns a normal function into one that can run via `.delay()` on a worker instead of inline) and successfully triggered `send_test_email.delay(...)` from a second terminal, confirmed by a real email arriving. Mechanism was explained, not independently derived — but correctly applied.

### celery-broker
**Status:** introduced
**Depends on:** celery-task
**Evidence (2026-07-29):** Saw `broker="redis://localhost:6379/0"` in the app config and the worker's own startup log confirming `Connected to redis://localhost:6379/0` — connected the config to the real running Redis instance from the same session.

### celery-worker-process
**Status:** introduced
**Depends on:** celery-broker
**Evidence (2026-07-29):** Wrong prediction, corrected: guessed `celery -A celery_app worker` would finish and return the prompt; actually a long-running process, same shape as `npm run dev`. After the correction, successfully ran it in a separate terminal, watched it register the task and connect to Redis, and watched it pick up and execute the real triggered task.

### redis-basics
**Status:** introduced
**Depends on:** —
**Evidence (2026-07-29):** Correctly predicted Redis installs globally via Homebrew (matching the earlier Supabase CLI pattern). Started it with `brew services start redis`, confirmed it was actually reachable with `redis-cli ping` → `PONG` (didn't know the expected response beforehand, guessed wrong, corrected).

### api-keys-as-env-vars
**Status:** introduced
**Depends on:** env-var-security
**Evidence (2026-07-29):** Added `RESEND_API_KEY` to `backend/.env` without prompting for the pattern itself (already internalized from the frontend's `VITE_SUPABASE_*` vars) — real transfer of the concept to a new language/context. Repeated the earlier `.gitignore`-scope mistake in this new context (tried a nested `.gitignore` inside `venv/` instead of one line in `backend/.gitignore`) — see [[gitignore-scope]] — corrected the same way as before, suggesting the underlying concept hasn't fully generalized yet.

### postgres-connection-from-python
**Status:** introduced
**Depends on:** shared-database-vs-duplicate-db
**Evidence (2026-07-30):** Correctly reasoned (unprompted, before being told) that a raw DB connection needs a role/credential rather than the frontend's user-login model, and correctly named that this new credential needs to be treated with more care than the anon key since it bypasses RLS entirely. Used `psycopg2.connect()` successfully after debugging a real unfilled `[YOUR-PASSWORD]` placeholder in the copied connection string.

### sql-querying-from-python
**Status:** practicing
**Depends on:** postgres-connection-from-python
**Evidence (2026-07-30):** Wrote the WHERE clause independently, through several real debugging rounds: wrong column name and `==` (JS syntax, invalid SQL), then `GETDATE()` (SQL Server syntax, not Postgres — self-corrected to `NOW()`), then `= NULL` (a real SQL trap — comparing to NULL with `=` never matches). Verified the `= NULL` behavior empirically rather than just accepting an explanation, and — once the schema fix made the NULL-check provably dead code — correctly proposed simplifying it away entirely. Strong session; capped at `practicing` per the no-same-day-`understood` rule.

### read-vs-write-db-access
**Status:** introduced
**Depends on:** postgres-connection-from-python
**Evidence (2026-07-30):** Correctly reasoned, unprompted, that `last_reminded_at` should only be written *after* a successful send, not before — the real consequence of read vs. write ordering when a write has side effects (an email) that can't be undone. Implemented and verified: the `UPDATE` only runs past a successful `resend.Emails.send()` call.

### credentials-management
**Status:** introduced
**Depends on:** api-keys-as-env-vars
**Evidence (2026-07-30):** Correctly reasoned that `DATABASE_URL` needs more care than the anon key before being told (transfer from `env-var-security`/`api-keys-as-env-vars`). Found and fixed the unfilled `[YOUR-PASSWORD]` placeholder in the connection string once flagged — a real, common credential-setup mistake.

### sql-null-semantics
**Status:** practicing
**Depends on:** sql-querying-from-python
**Evidence (2026-07-30):** Initially predicted `next_review_at = NULL` would still catch NULL rows (wrong — SQL's three-valued logic means `= NULL` never matches, even genuine NULLs). Rather than just accepting the correction, tested it empirically by adding a real verse through the UI and rerunning the script — which surfaced a *different*, real finding (see [[db-column-defaults]]) that made the question moot in practice, but the instinct to verify empirically rather than take the explanation on faith is the real skill here.

### db-column-defaults
**Status:** practicing
**Depends on:** —
**Evidence (2026-07-30):** Independently noticed, by checking the real Supabase dashboard (not prompted to), that `next_review_at`'s `DEFAULT now()` meant every new verse was immediately "due" — a real product bug with real consequences once Section 9 sends live emails. Proposed the fix (default to `now() + 1 day` instead), correctly identified the DB-level column default as the right place to fix it (works for every insert path, not just the frontend), and got the Postgres interval syntax right after one lookup. This was self-directed problem-finding, not a guided probe.

### celery-beat-periodic-tasks
**Status:** practicing
**Depends on:** celery-beat-vs-external-cron
**Evidence (2026-07-30):** Configured `app.conf.beat_schedule`, ran Beat in a third terminal alongside the worker, watched `check_and_notify` fire automatically every 60 seconds with zero manual trigger — verified via real worker log timestamps, not assumed.

### fan-out-pattern
**Status:** introduced
**Depends on:** celery-beat-periodic-tasks
**Evidence (2026-07-30):** First fill-in called `send_reminder_email(verse_id, email, reference)` directly instead of `.delay(...)` — same mistake-shape as the `positional-vs-object-arguments` gap, a plain function call instead of queuing. Corrected once asked to recall the Section 7 distinction (called plainly vs. `.delay()`), applied correctly after.

### idempotency
**Status:** practicing
**Depends on:** fan-out-pattern
**Evidence (2026-07-30):** Correctly reasoned about the design ("a user should get reminded daily... only if we've sent it successfully") before any code was written. First implementation attempt (`last_reminded_at <= NOW()`) didn't actually implement the "within the last day" guard — matched a wrong prediction pattern (looked plausible, didn't hold up when traced through). Corrected to `<= NOW() - interval '1 day'` once asked to trace what the original condition actually excluded (nothing — true forever once set). **Verified empirically, both directions:** watched a real email fire when due, then watched a second Beat cycle 60 seconds later correctly send nothing — proof the guard works, not just code that compiles.

### celery-retries
**Status:** practicing
**Depends on:** celery-task
**Evidence (2026-07-31):** Correctly identified upfront that a naive design (retry every exception) was wrong once traced against a real example: a `ValidationError` (the actual `test@example.com` failure from Section 11) never changes between retry attempts, so retrying it is pure waste. Implemented via `resend.exceptions` inspection (not guessing) to split retryable (`RateLimitError`, `ApplicationError`) from permanent (`ValidationError`, `MissingRequiredFieldsError`, `MissingApiKeyError`, `InvalidApiKeyError`) failures, using Celery's `autoretry_for`. Not yet live-tested — deferred by choice to move on to hosting.

### exponential-backoff
**Status:** introduced
**Depends on:** celery-retries
**Evidence (2026-07-31):** Proposed exponential backoff unprompted ("growing backoff so redis doesnt get hammered") before it was explained. Configured via Celery's `retry_backoff=5` (doubling: 5s/10s/20s), `retry_backoff_max`, and `retry_jitter` (to avoid many simultaneously-failing tasks retrying in lockstep). Not yet observed firing for real.

### dead-letter-handling
**Status:** introduced
**Depends on:** celery-retries
**Evidence (2026-07-31):** Not implemented as a separate mechanism (no dead-letter queue/table) — decided the existing container logs plus the hourly `check_and_notify` re-check are sufficient visibility for this project's current maturity, rather than building dedicated failure-tracking infrastructure. A reasoned scope decision, not an oversight.

### at-least-once-delivery
**Status:** understood
**Depends on:** idempotency, celery-retries
**Evidence (2026-07-31):** The strongest evidence of this whole section — pushed back on bounded retries with "shouldn't I go til success," then reasoned through it independently: traced what happens to `last_reminded_at` when a send fails (stays unset) and what `check_and_notify` does with that on its next hourly run (re-flags it as due), and concluded unprompted that this is already a system-level retry loop. This is the actual insight behind at-least-once delivery — a message queue's per-attempt retry doesn't have to guarantee eventual success alone when a higher-level, idempotency-guarded re-check already does.

### docker-basics
**Status:** practicing
**Depends on:** docker-compose-vs-kubernetes-first
**Evidence (2026-07-30):** Correctly reasoned, when asked, why Redis needed its own container rather than living inside the app container ("if one goes down, the other can still stay up") — independently arrived at the isolation/blast-radius rationale, not just told it. Ran the full build/up/scale cycle repeatedly and correctly read `docker compose ps`/build output to confirm state.

### dockerfile
**Status:** practicing
**Depends on:** docker-basics
**Evidence (2026-07-30):** Wrote and iterated on a real `Dockerfile` (layer-cached `requirements.txt` install before `COPY . .`, then added non-root execution after seeing Celery's own root `SecurityWarning`). Asked a real pushback question when told to add `useradd`/`chown`/`USER appuser` — "doesnt that defeat our whole root purpose" — correctly resolved once given the least-privilege/scoped-`chown`-vs-full-root distinction, not just accepted.

### docker-compose-file
**Status:** practicing
**Depends on:** dockerfile
**Evidence (2026-07-30):** Wrote `docker-compose.yml` with three services (`redis`, `worker`, `beat`), correctly asked "what does environment do here" rather than copying it blind, and connected the answer to the `CELERY_BROKER_URL` env-var pattern already used with `RESEND_API_KEY`/`DATABASE_URL`.

### container-networking
**Status:** practicing
**Depends on:** docker-compose-file
**Evidence (2026-07-30):** Wrong prediction, corrected: guessed `localhost` would still reach Redis from inside a worker container ("i thijnk it still does") — actually `localhost` inside a container refers only to that container itself; containers reach each other by service name. Corrected via `CELERY_BROKER_URL=redis://redis:6379/0`, confirmed via the worker's own startup log. Real second networking bug found and fixed independently in this same section: an old Homebrew Redis (never stopped since Section 7) was bound to the same host port as Docker's Redis, so triggered tasks got real task IDs but no container worker ever received them — diagnosed via `lsof -i :6379`, two separate brokers silently coexisting on one port.

### horizontal-scaling
**Status:** practicing
**Depends on:** docker-compose-file
**Evidence (2026-07-30):** Correctly predicted 5 total containers before scaling ("i expect 5 containers then") given `--scale worker=3` plus `redis`+`beat`. Verified real distribution, not assumed: triggered 6 `send_test_email` jobs and confirmed via container logs that `worker-1`/`worker-2`/`worker-3` each picked up different task IDs — genuine load-spread across processes.

### observability-basics
**Status:** seed
**Depends on:** flower-vs-prometheus-first
**Evidence:** Named in Section 12's concept list; not yet taught.

### flower-dashboard
**Status:** seed
**Depends on:** observability-basics
**Evidence:** Named in Section 12's concept list; not yet taught.

### healthy-vs-falling-behind
**Status:** seed
**Depends on:** flower-dashboard
**Evidence:** Named in Section 12's concept list; not yet taught.

### fault-tolerance
**Status:** seed
**Depends on:** horizontal-scaling
**Evidence:** Named in Section 13's concept list; not yet taught.

### task-acknowledgment-and-redelivery
**Status:** seed
**Depends on:** celery-worker-process, at-least-once-delivery
**Evidence:** Named in Section 13's concept list; not yet taught.

### chaos-testing
**Status:** seed
**Depends on:** fault-tolerance
**Evidence:** Named in Section 13's concept list; not yet taught.

### load-testing-basics
**Status:** seed
**Depends on:** locust-vs-k6
**Evidence:** Named in Section 14's concept list; not yet taught.

### throughput-vs-latency
**Status:** seed
**Depends on:** load-testing-basics
**Evidence:** Named in Section 14's concept list; not yet taught.

### backpressure
**Status:** seed
**Depends on:** throughput-vs-latency
**Evidence:** Named in Section 14's concept list; not yet taught.

### cloud-vm-setup
**Status:** seed
**Depends on:** raw-vm-vs-managed-platform
**Evidence:** Named in Section 15's concept list; not yet taught.

### remote-docker-deployment
**Status:** seed
**Depends on:** cloud-vm-setup, docker-compose-file
**Evidence:** Named in Section 15's concept list; not yet taught.

### secrets-in-production
**Status:** introduced
**Depends on:** cloud-vm-setup, credentials-management
**Evidence (2026-07-31):** First real production secret handled: Supabase env vars set on Vercel for the live frontend deploy. A hand-retyped copy of the anon key was manually verified with a byte-for-byte shell diff (not eyeballing a 150-character base64 string) and caught as genuinely wrong before it shipped — same instinct as [[credential-leak-response]], verify rather than trust a transcription. Fixed by piping the value directly from the source `.env` file into `vercel env add` instead of retyping.

### least-privilege-containers
**Status:** introduced
**Depends on:** dockerfile
**Evidence (2026-07-30):** After seeing Celery's real root-user `SecurityWarning`, added `useradd --create-home appuser` + `USER appuser` to the Dockerfile. Pushed back with a genuine question ("doesnt that defeat our whole root purpose") rather than just accepting the fix — resolved via the scoped-`chown`-vs-full-root distinction (the running process gets write access to exactly `/app`, not the whole machine). Real second-order consequence surfaced and fixed: Beat couldn't write its own `celerybeat-schedule` file (`Permission denied`) until `chown -R appuser:appuser /app` ran *before* `USER appuser`, not after.

### db-connection-pooling
**Status:** introduced
**Depends on:** postgres-connection-from-python
**Evidence (2026-07-30):** `check_and_notify` failed every cycle inside Docker with "Network is unreachable" — Supabase's direct connection string resolves to an IPv6-only address, and the container had no outbound IPv6 route. Correctly reasoned through the fix's tradeoff before being given the answer: asked to predict Session-vs-Transaction pooling mode for a connect→one-query→close pattern, first guessed Session, self-corrected to Transaction with the right reasoning ("its a one time thing and not an ongoing session") before being told which was right. Switched `DATABASE_URL` to the transaction-mode pooler (port 6543), confirmed via a clean `check_and_notify succeeded` log line.

### credential-leak-response
**Status:** introduced
**Depends on:** credentials-management
**Evidence (2026-07-30):** A real DB password appeared in plaintext in Docker logs (surfaced by a `ppostgresql://` typo causing a DSN-parse error that echoed the full connection string). Rotated the password immediately rather than treating a logged/leaked secret as still safe to use — correct instinct: once a credential has been printed anywhere, it should be treated as burned, not just "probably fine."
