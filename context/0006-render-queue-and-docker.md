# 0006 — Render queue, renderers/ folder, narration caching, Dockerfile

**Date:** 2026-11-08

## What was asked

Prepare for deployment to a paid Render plan: add a real render queue (Python-based) so renders don't block requests and never run concurrently, fix the earlier observation that HyperFrames videos always re-rendered (and re-billed ElevenLabs) even when unchanged, clean up root-level clutter, and add a Dockerfile.

## What changed

- **Queue**: `app.py` — `POST /api/render` now enqueues `(job_id, script_path, scene_name)` onto an in-process `queue.Queue` and returns immediately (HTTP 202); a single background daemon thread (`_render_worker`, started once at module import) pulls jobs one at a time and runs the actual render. New `GET /api/jobs/<job_id>` reports `queued`/`running`/`done`/`failed`. `index.html` now polls that endpoint every 1.5s instead of awaiting one blocking response.
- **Root cleanup**: `render_yaml.py` and `render_hyperframes.py` moved into `renderers/`; fixed their `ROOT` path resolution (now climbs one extra directory level) since they're no longer at the project root.
- **Narration caching for HyperFrames**: `synthesize()` now hashes `(text, voice_id, model)` and checks `.cache/hyperframes_narration/<hash>.mp3` before calling the ElevenLabs API — mirrors what the Manim engine already got for free from `manim_voiceover`'s own caching.
- **Dockerfile + requirements.txt + .dockerignore** added: one image bundling Python/Manim/LaTeX + Node/HyperFrames/headless-Chrome's Linux dependencies + FFmpeg. `gunicorn` pinned to `--workers 1` — required, not a tuning choice, since more worker processes would each get their own separate queue and silently break job tracking.
- **Real portability bug caught while wiring up Docker**: `app.py`'s `PYTHON` constant was hardcoded to the Windows `.venv/Scripts/python.exe` layout, which doesn't exist at all in the Docker image (system-wide `pip install`, no venv there). Fixed to use `sys.executable`, which resolves correctly in both environments.
- Documented in `AGENTS.md`/`README.md`: the queue's design and why it's in-process rather than Redis/Celery (single-server-instance assumption, with the explicit trigger for when to upgrade), and Render-specific deployment notes (Persistent Disk requirement — Render's default filesystem is ephemeral and wipes `videos_script/`/`videos/` on every redeploy; paid-plan requirement — free tier spins down on inactivity and can kill an in-progress background render).

## Verified

- Queue: fired two renders back-to-back via direct API calls — confirmed job 2 stayed `queued` while job 1 was `running`, then transitioned to `running` only after job 1 completed. Repeated through the actual dashboard UI (polling, spinner, modal) successfully.
- Narration cache: checked ElevenLabs quota via its own API before and after a repeat render of unchanged content — identical character count both times, confirming zero new API calls.
- `sys.executable` fix: re-ran a full render locally after the change to confirm nothing broke.

## Known caveat (not yet verified)

The Dockerfile itself was written from documented, known-good dependency lists (Manim's own Docker image, Puppeteer's standard Linux Chrome dependency list) but has **not** been build-tested — no Docker available in the development environment this session. Build and smoke-test it (one render per engine) before trusting it in production.
