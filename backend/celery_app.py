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
from celery import Celery
from dotenv import load_dotenv
import resend

load_dotenv()  # reads backend/.env into os.environ, same idea as Vite's import.meta.env

resend.api_key = os.environ["RESEND_API_KEY"]

# "scheduler" is just this app's name. broker=... tells Celery where to find
# the message queue — the local Redis you started earlier.
app = Celery("scheduler", broker="redis://localhost:6379/0")


@app.task
def send_test_email(to_address):
    resend.Emails.send({
        "from": "onboarding@resend.dev",  # Resend's default sender for unverified accounts
        "to": to_address,
        "subject": "VerseVault test email",
        "html": "<p>This email was sent by a Celery worker.</p>",
    })
