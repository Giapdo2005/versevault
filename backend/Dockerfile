# backend/Dockerfile
#
# Defines the image both the worker and Beat containers run from —
# docker-compose.yml will override the default command below per service.

FROM python:3.11-slim

WORKDIR /app

# Copy just requirements.txt first, install, THEN copy the rest of the code.
# This is deliberate layer caching: if your code changes but requirements.txt
# doesn't, Docker reuses the cached "pip install" step instead of redoing it
# on every single rebuild — same idea as your test suite only rerunning what
# actually changed, applied to build steps instead of tests.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# By default, everything above runs as root — fine for the build steps
# themselves. But the actual running process (the thing an attacker would
# be interacting with if this container were ever compromised) shouldn't
# have more privilege than it needs. `useradd` creates a normal Linux user
# (same command you'd use on any Debian/Ubuntu machine, nothing Docker-
# specific about it); `USER` tells Docker to run everything from this line
# down — including the final CMD — as that user instead of root.
RUN useradd --create-home appuser
RUN chown -R appuser:appuser /app
USER appuser

# Default command — docker-compose.yml overrides this for the beat service.
CMD ["celery", "-A", "celery_app", "worker", "--loglevel=info"]
