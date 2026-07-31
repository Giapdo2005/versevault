# VerseVault

VerseVault is a full-stack scripture memorization platform that uses the SM-2 spaced repetition algorithm and an asynchronous Python backend to help users retain Bible verses over time. The system combines a React frontend with a distributed email reminder service powered by Celery, Redis, and Docker.

## Status

- **Frontend + Supabase backend** — done, running.
- **Email reminder backend** (Python/Celery/Redis) — built, tested, and fully containerized locally (`docker compose up`).
- **Cloud deployment** — in progress. This section will be updated with a live URL once the backend is running on a real server instead of just locally.

## Features

- 📖 Store and organize Bible verses
- ⌨️ Typed-recall practice — type the verse from memory, get scored word-by-word, and see exactly what you got right vs. wrong
- 🧠 Spaced repetition scheduling (SM-2 algorithm) driven automatically by your recall score
- 📧 Automatic email reminders powered by Celery
- 🔐 Secure authentication and Row-Level Security via Supabase
- ⚡ Horizontally scalable background workers with Redis
- 🐳 Fully containerized backend with Docker Compose

## System Overview

VerseVault is two systems wforking together:

1. **The app** (React + Supabase) — where you add verses, organize them, and practice. Practice is typed-recall: you type the verse from memory, and it's scored word-by-word against the real text (case-insensitive, with partial credit for punctuation-only mismatches). The resulting percentage is mapped onto the [SM-2 spaced repetition algorithm](https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm)'s 1-5 rating scale automatically — no self-reporting — which determines how soon the verse comes back for review — struggle with it and it resurfaces sooner, recall it well and the interval grows.
2. **The reminder scheduler** (Python + Celery + Redis) — a separate backend service that runs on its own clock. Every hour, it checks which verses are due for review and haven't been reminded about in the last day, and sends a real email for each one via [Resend](https://resend.com). It talks directly to the same Supabase Postgres database as the frontend, so there's one source of truth, not two databases to keep in sync.

## Architecture

```
┌─────────────────┐        ┌──────────────────────┐
│  React frontend  │──────▶│   Supabase (Postgres   │
│  (Vite + RLS)     │        │   + Auth, RLS-scoped)  │
└─────────────────┘        └──────────┬─────────────┘
                                        │
                             ┌──────────┴─────────────┐
                             │   Celery Beat (hourly)   │
                             │   "who's due for review?" │
                             └──────────┬─────────────┘
                                        │ fans out one job per due verse
                             ┌──────────▼─────────────┐
                             │   Redis (task queue)      │
                             └──────────┬─────────────┘
                                        │
                     ┌──────────────────┼──────────────────┐
                     ▼                  ▼                  ▼
              ┌───────────┐      ┌───────────┐      ┌───────────┐
              │ worker-1   │      │ worker-2   │      │ worker-3   │
              │ (sends via │      │ (sends via │      │ (sends via │
              │  Resend)   │      │  Resend)   │      │  Resend)   │
              └───────────┘      └───────────┘      └───────────┘
```

The whole backend (Redis + Beat + however many worker containers) runs from one `docker compose up`, and workers scale horizontally with `docker compose up --scale worker=N`.

## Engineering Decisions

**Celery + Redis instead of a hand-rolled scheduler.** A "check every hour, send an email" job sounds simple until you account for what happens when a worker crashes mid-send, two checks somehow overlap, or a task needs to retry. Celery already solves worker-crash recovery, task retries, and queue durability.

**One shared Postgres database, not two.** The backend connects directly to the same Supabase Postgres the frontend uses, instead of maintaining a separate database for the scheduler. A second database would only introduce a consistency problem (keeping two copies of verse state in sync) that doesn't need to exist — one source of truth is simpler and strictly safer.

**Fan-out, not a loop of inline sends.** `check_and_notify` doesn't send emails itself — it queues one independent job per due verse (`send_reminder_email.delay(...)`). If one email is slow or fails, it never blocks or delays the others, and this is also _why_ horizontal scaling works at all: more worker containers just means more of these independent jobs running in parallel rather than sending one email at a time which increases performance especially at scale.

**Idempotency guard on every reminder.** A task queue like Celery guarantees a task runs _at least once_, not _exactly once_ — retries and redeliveries are expected, not edge cases. Rather than trust "this only fires once," `last_reminded_at` is checked and set explicitly, so a duplicate delivery is a non-event instead of a duplicate email in someone's inbox.

**Connection pooling over a direct database connection.** Docker containers don't get a default outbound IPv6 route, and Supabase's direct connection string resolves to an IPv6-only address — a real failure mode discovered during containerization, not a hypothetical one. Switching to Supabase's transaction-mode connection pooler fixed the routing problem and was also the _better-fitting_ choice regardless: each task opens a connection, runs one query, and closes it, which is exactly the short-lived-connection pattern transaction pooling is designed for.

**Docker Compose before Kubernetes.** Horizontal scaling and container fundamentals needed to be solid on their own before adding an orchestrator's complexity on top. Compose gets the real deliverable — multiple worker containers, proven task distribution — without a second, harder tool in the way of learning the first one properly.

**Non-root containers.** Worker and Beat containers run as a dedicated unprivileged user, not root, following the principle of least privilege — if a container were ever compromised, the blast radius is scoped to what that user can touch, not the whole machine.

**Row-Level Security instead of relying on application-code filtering.** Data isolation between users is enforced at the database layer via Postgres RLS policies (`auth.uid() = user_id`), not by remembering to add a `WHERE user_id = ...` clause in every query. This was tested directly — disabling the policy causes a real cross-user data leak, confirming the isolation actually depends on RLS and not on the application code getting it right every time.

**A cloud VM over a managed platform, for now.** Deploying to a raw VM (SSH access, manual Docker setup) instead of a managed container platform is a deliberate choice to own the full deployment path directly, rather than have a platform abstract away the parts worth understanding.

## Tech stack

**Frontend:** React 18, Vite, React Router, Supabase JS client, Vitest
**Backend:** Python, Celery, Redis, Docker / Docker Compose, psycopg2, Resend
**Database:** Postgres (via Supabase), with Row-Level Security so each user only ever sees their own data

## Local development

### Frontend

```bash
npm install
```

Create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

```bash
npm run dev
```

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `backend/.env` file with:

```
RESEND_API_KEY=your-resend-api-key
DATABASE_URL=your-supabase-postgres-connection-string
```

Run it directly:

```bash
celery -A celery_app worker --loglevel=info   # terminal 1
celery -A celery_app beat --loglevel=info     # terminal 2
```

Or run the whole stack containerized:

```bash
docker compose up --build
docker compose up --build --scale worker=N   # run N worker containers instead of 1
```

## Testing

```bash
npm test
```

Covers the spaced repetition algorithm, the typed-recall scoring function, and the percentage-to-rating mapping.

## Roadmap

- Retry/backoff handling for failed email sends.
- Flower dashboard for live task/worker monitoring.
- Friends/social feature.
