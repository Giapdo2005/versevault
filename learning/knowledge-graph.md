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
**Status:** seed
**Depends on:** —
**Evidence:** Named as a known product gap (Phase 1: practice is reveal + self-rate, no typed-recall checking) but not yet probed as a design decision — candidate for a forward-plan section since it's parking-lot work.

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
**Status:** seed
**Depends on:** celery-redis-vs-diy-queue
**Evidence:** Named in Section 7's concept list; not yet taught.

### celery-broker
**Status:** seed
**Depends on:** celery-task
**Evidence:** Named in Section 7's concept list; not yet taught.

### celery-worker-process
**Status:** seed
**Depends on:** celery-broker
**Evidence:** Named in Section 7's concept list; not yet taught.

### redis-basics
**Status:** seed
**Depends on:** —
**Evidence:** Named in Section 7's concept list; not yet taught.

### api-keys-as-env-vars
**Status:** seed
**Depends on:** env-var-security
**Evidence:** Named in Section 7's concept list; extends the existing `.env` pattern to a new service.

### postgres-connection-from-python
**Status:** seed
**Depends on:** shared-database-vs-duplicate-db
**Evidence:** Named in Section 8's concept list; not yet taught.

### sql-querying-from-python
**Status:** seed
**Depends on:** postgres-connection-from-python
**Evidence:** Named in Section 8's concept list; not yet taught.

### read-vs-write-db-access
**Status:** seed
**Depends on:** postgres-connection-from-python
**Evidence:** Named in Section 8's concept list; not yet taught.

### credentials-management
**Status:** seed
**Depends on:** api-keys-as-env-vars
**Evidence:** Named in Section 8's concept list; not yet taught.

### celery-beat-periodic-tasks
**Status:** seed
**Depends on:** celery-beat-vs-external-cron
**Evidence:** Named in Section 9's concept list; not yet taught.

### fan-out-pattern
**Status:** seed
**Depends on:** celery-beat-periodic-tasks
**Evidence:** Named in Section 9's concept list; not yet taught.

### idempotency
**Status:** seed
**Depends on:** fan-out-pattern
**Evidence:** Named in Section 9's concept list; not yet taught.

### celery-retries
**Status:** seed
**Depends on:** celery-task
**Evidence:** Named in Section 10's concept list; not yet taught.

### exponential-backoff
**Status:** seed
**Depends on:** celery-retries
**Evidence:** Named in Section 10's concept list; not yet taught.

### dead-letter-handling
**Status:** seed
**Depends on:** celery-retries
**Evidence:** Named in Section 10's concept list; not yet taught.

### at-least-once-delivery
**Status:** seed
**Depends on:** idempotency, celery-retries
**Evidence:** Named in Section 10's concept list; not yet taught.

### docker-basics
**Status:** seed
**Depends on:** docker-compose-vs-kubernetes-first
**Evidence:** Named in Section 11's concept list; not yet taught.

### dockerfile
**Status:** seed
**Depends on:** docker-basics
**Evidence:** Named in Section 11's concept list; not yet taught.

### docker-compose-file
**Status:** seed
**Depends on:** dockerfile
**Evidence:** Named in Section 11's concept list; not yet taught.

### container-networking
**Status:** seed
**Depends on:** docker-compose-file
**Evidence:** Named in Section 11's concept list; not yet taught.

### horizontal-scaling
**Status:** seed
**Depends on:** docker-compose-file
**Evidence:** Named in Section 11's concept list; not yet taught.

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
**Status:** seed
**Depends on:** cloud-vm-setup, credentials-management
**Evidence:** Named in Section 15's concept list; not yet taught.
