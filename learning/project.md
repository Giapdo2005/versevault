# VerseVault — Project

## About me

Building this for myself and Christian friends at church — an aspiring software engineer who wants **backend depth and system-design thinking** more than frontend polish. Comfortable doing some frontend but not chasing depth there.

**How it was built:** Planned the project first, then used Claude (free tier) to write the code, with quizzing along the way. Some manual tweaks since, but minimal — most of the syntax is AI-written, the decisions are more mine. This means: git blame can't tell us what you *understand* vs. what you *typed* — Phase 2 will test understanding directly, not authorship.

**Self-identified weak spot:** debugging, especially anything that touches Supabase (auth errors, future backend flows). This will route the probes in Phase 2.

## The idea

A structured, spaced-repetition-style app for memorizing scripture, individually and (eventually) with friends/community. First users: the builder and friends at their church.

## MVP — In / Frozen / Parking lot

**In (built and working today):**
- Account creation + login (Supabase Auth)
- Add a verse with preferred translation
- View verse list
- Practice a verse: blank card shows word count, user self-reveals and self-rates (mastered / still learning / needs practice)
- Spaced repetition scheduling based on that self-rating

**Frozen:** none — nothing half-built exists to freeze. This is a lean, working core loop, not a pile of started features.

**Parking lot (real product ideas, not started, not part of near-term MVP work yet):**
- Friends / social / shared progress — the app is purely single-user right now
- Checked recall in Practice (typing the verse and seeing which words are right/wrong, vs. today's self-report-only flow)

## Triage decision: **Adopt**

Reasoning:
- The app runs cleanly (`npm run dev` works, confirmed 2026-07-21).
- Git history is real and incremental (6 commits, first-commit-to-now tells a coherent story).
- No feature bloat — everything that exists is working; there's nothing to trim.
- Stack (React + Supabase) is a legitimate place to build the backend/system-design skills wanted here — no need to rebuild to get there.

Decision: adopt as-is, map it for real understanding, then plan forward — including reclaiming the Supabase/backend pieces that currently feel like a black box.
