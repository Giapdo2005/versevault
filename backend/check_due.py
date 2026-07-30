# backend/check_due.py
#
# Connects directly to Supabase's Postgres (bypassing RLS — this runs with
# a privileged credential, not the public anon key) and prints which users
# have a verse due for review right now.

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(os.environ["DATABASE_URL"])
cur = conn.cursor()

# next_review_at always has a DB-level default (never NULL in practice),
# so this only needs to check the timestamp — see isDueForReview() in
# src/lib/spacedRepetition.js for the frontend's equivalent logic.
cur.execute("""
    SELECT user_id, reference, next_review_at
    FROM verses
    WHERE next_review_at <= NOW()
""")

for user_id, reference, next_review_at in cur.fetchall():
    print(f"User {user_id} is due for: {reference} (was due {next_review_at})")

cur.close()
conn.close()
