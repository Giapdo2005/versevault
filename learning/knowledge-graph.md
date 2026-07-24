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
**Status:** introduced
**Depends on:** automated-testing-basics
**Evidence (2026-07-24):** While extending `calculateNextReview` for a 5th rating, also changed existing Good/Easy thresholds — a deliberate, confirmed design choice. But the existing test's expected value was edited to match the new code's output rather than being written to assert the new *intended* behavior — the reverse of how a regression test should work (a test that always agrees with the code can't catch anything). Named and acknowledged ("yes, this makes sense") but not yet corrected — bookmarked for next session, so credit is for recognizing it, not yet for applying it.

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

### git-workflow
**Status:** understood
**Depends on:** —
**Evidence (2026-07-21 and prior):** Pre-existing evidence: 6 real, incremental commits in the repo before this session. New evidence today: independently ran `git status`, read a `git diff` on `.gitignore` themselves, diagnosed that an earlier commit had gitignored `learning/`/`.claude/`/`.agents/`, fixed it, staged, and committed (`e336851`) — entirely unprompted, no commands dictated. Two independent days of evidence.

### gitignore-scope
**Status:** introduced
**Depends on:** git-workflow
**Evidence (2026-07-22):** Initially conflated "keep this off GitHub" with "gitignore it," which would have meant zero version history/backup for `learning/`. After the tradeoff was named (gitignore = no local backup either, vs. a private repo = backup + hidden from others), chose to commit everything instead. First contact with this specific distinction — worth a quick check next session rather than assuming it's locked in.
