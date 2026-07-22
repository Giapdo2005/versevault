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

## Section 4 — A safety net for the trickiest logic

No automated tests exist anywhere in the repo. Rather than bolting testing on later as homework, introduce it here, where it's actually load-bearing: a couple of tests for `calculateNextReview` (the SM-2 logic) and the isolation behavior from Section 3.

**Reclaim task:** you described the "Again" rating as a gradual decrement during Phase 2, when it's actually a full reset (`interval`/`repetitions` → 0). Write a test that pins down the real behavior, so this can't quietly drift or be misunderstood again.

**Deliverable:** a test suite that catches regressions in the two riskiest pieces of logic in the app.

## Section 5 — Fix the Navbar name bug

A real bug found while mapping the code: `Navbar.jsx` reads `user.user_metadata.firstName/lastName`, but `signUp` in `AuthContext.jsx` never collects or sends a name — it will always render blank.

**Reclaim task:** trace this yourself first (where would the name need to be captured? how does Supabase's `signUp` options carry custom metadata?) before fixing it.

**Deliverable:** visible, working fix — and a second rep on debugging an auth-related Supabase issue, the exact skill you said you want to grow.

## Sections 6+ — after hardening (sequenced, not yet detailed)

These are the parking-lot items from Phase 1, offered as candidates once the foundation is solid — not committed to yet:

- **Friends/social feature** — the original vision, deliberately sequenced *after* hardening since it's the feature most exposed to schema/RLS bugs, and the best system-design practice (new tables, relationships, permissions).
- **Hosting/deployment** — pick and configure real hosting; currently fully undecided.
- **Checked-recall practice** — typed input instead of self-report in Practice; lower priority given your stated frontend disinterest, but still real product value.

---

Next step: run `/next-lesson` — it takes Section 1 and breaks it into one task at a time. Nothing here gets built without you being able to explain it first.
