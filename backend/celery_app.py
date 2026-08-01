# backend/celery_app.py
#
# Defines the Celery app and its one task: sending a test email via Resend.
#
# Run a worker (in this terminal, venv active):
#   celery -A celery_app worker --loglevel=info
#
# Trigger the task from a SEPARATE terminal (new venv, new shell):
#   python3 -c "from celery_app import send_test_email; send_test_email.delay('you@example.com')"

import os
import psycopg2
from celery import Celery
from dotenv import load_dotenv
import resend
from resend.exceptions import RateLimitError, ApplicationError
from celery.schedules import crontab


load_dotenv()  # reads backend/.env into os.environ, same idea as Vite's import.meta.env

resend.api_key = os.environ["RESEND_API_KEY"]
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")

# "scheduler" is just this app's name. broker=... tells Celery where to find
# the message queue — the local Redis you started earlier.
app = Celery("scheduler", broker=CELERY_BROKER_URL)

# Beat schedule: what runs automatically and hourly
app.conf.beat_schedule = {
    "check-and-notify": {
        "task": "celery_app.check_and_notify",
        "schedule": crontab(minute=0, hour='*'),  
    },
}


@app.task
def send_test_email(to_address):
    resend.Emails.send({
        "from": "onboarding@resend.dev", 
        "to": to_address,
        "subject": "VerseVault test email",
        "html": "<p>This email was sent by a Celery worker.</p>",
    })


@app.task(
    autoretry_for=(RateLimitError, ApplicationError),  # transient — worth retrying
    retry_backoff=5,       # first retry after ~5s, doubling each attempt (5s, 10s, 20s)
    retry_backoff_max=60,  # cap, in case max_retries ever grows
    retry_jitter=True,     # randomize slightly so simultaneous failures don't retry in lockstep
    max_retries=3,
)
def send_reminder_email(verse_id, to_address, reference):
    # Each task gets its own fresh connection — tasks run in separate
    # worker processes, so a connection can't be shared across them.
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": to_address,
        "subject": f"Time to review {reference}",
        "html": f'<p>Your verse "{reference}" is due for review in VerseVault.</p>',
    })

    # if Emails.send() had raised an exception, we'd never reach this line.
    cur.execute(
        'UPDATE verses SET last_reminded_at = NOW() WHERE id = %s',
        (verse_id,),
    )
    conn.commit()
    cur.close()
    conn.close()


@app.task
def check_and_notify():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # Due verses (same as check_due.py) that haven't been reminded about
    # in the last day, joined with auth.users for a real email address.
    cur.execute("""
        SELECT v.id, v.reference, u.email
        FROM verses v JOIN auth.users u ON u.id = v.user_id
        WHERE v.next_review_at <= NOW() AND 
        (v.last_reminded_at IS NULL OR v.last_reminded_at <= NOW() - interval '1 day')
    """)

    due = cur.fetchall()
    cur.close()
    conn.close()

    # Fan out — one queued job per due verse, not sent inline here.
    for verse_id, reference, email in due:
        send_reminder_email.delay(verse_id, email, reference)
