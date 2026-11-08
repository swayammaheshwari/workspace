# Video Studio

A pipeline for generating polished, trend-style short videos — one dashboard, one content folder, two render engines picked per-video by a `video_type` field:

- `video_type: manim` — math explainer videos (proofs, equations, geometry) using [Manim](https://www.manim.community/).
- `video_type: hyperframes` — "did you know" history/archaeology stat-reveal videos using [HyperFrames](https://hyperframes.heygen.com/) (HTML/CSS/GSAP motion graphics).

Both are narrated with [ElevenLabs](https://elevenlabs.io/), sharing one `.env` API key, one `videos_script/` content folder, one `videos/` output folder, and one dashboard.

**What's in here:**
- A YAML file per video (`videos_script/<name>.yml`) — narration, parameters, and a `video_type`/`type` pair selecting the engine and template. No code to touch for everyday editing.
- Manim engine: a small library of Python "builders" (`videos_script/builders/<type>.py`), one per video *type*, reused by any YAML of that type.
- HyperFrames engine: one shared, fixed "did you know" composition template (`hyperframes/template_index.html`).
- Two render scripts in `renderers/`: `render_yaml.py` (Manim) and `render_hyperframes.py` (HyperFrames) — the dashboard picks the right one automatically.
- A single Flask dashboard (`app.py` + `index.html`, port **5000**) with Play/Download/Import/Paste-YAML/Copy-AI-Prompt buttons for every video, regardless of engine. Rendering is queued and runs one video at a time in the background — clicking Play returns instantly and the UI polls for completion, so it's safe behind a reverse proxy/timeout and never runs two heavy renders at once.
- `prompt.md` — one copy-paste prompt covering both video families; it asks your topic, picks the right engine/type itself, and hands back one ready-to-paste YAML.
- `AGENTS.md` — full conventions for an AI agent working on this repo.
- `requirements.txt` / `Dockerfile` / `.dockerignore` — for deploying as a single container (see "Deploying" below).

## One-time setup

1. **Python 3.12+** and a virtual environment at `.venv`:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\python.exe -m pip install manim flask pyyaml python-dotenv "manim-voiceover[elevenlabs]" requests
   ```
2. **FFmpeg** on PATH.
3. **MiKTeX/LaTeX** on PATH — needed for any Manim video using `MathTex`/`Tex`/`Integer`.
4. **Node.js 22+** and **npm** — needed for the HyperFrames engine. First-time setup:
   ```bash
   cd hyperframes/demo
   npx hyperframes skills update
   ```
5. **An ElevenLabs API key** — get one free at [elevenlabs.io](https://elevenlabs.io/) (Profile → API Keys), then create a `.env` file in the project root:
   ```
   ELEVENLABS_API_KEY=your_key_here
   ```
   (`.env` is git-ignored — never commit it.)

## Running the dashboard

```bash
.\.venv\Scripts\python.exe app.py
```

Open **http://localhost:5000**. Every video shows as a card (tagged `⚡ manim` or `🏺 hyperframes`) with:
- **▶ Play** — renders it (reusing cached narration audio when the text hasn't changed) and opens the result in a modal player.
- **⬇ Download** — renders it and downloads the `.mp4`.
- **+ Import YAML/JSON** / **📝 Paste YAML** — add a new video's content directly, for either engine.
- **📋 Copy AI Prompt** — copies `prompt.md` to your clipboard, ready to paste into any AI chat.

Manim renders are **1080p60** by default (`QUALITY_FLAG`/`QUALITY_ARG` in `app.py`).

## Rendering from the command line

```bash
# Manim
.\.venv\Scripts\python.exe renderers\render_yaml.py videos_script/golden_ratio_spiral.yml -q qh

# HyperFrames
.\.venv\Scripts\python.exe renderers\render_hyperframes.py videos_script/dholavira.yml
```

## Deploying (Docker / Render)

A `Dockerfile` bundles everything both engines need (Python + Manim + LaTeX, Node + HyperFrames + headless Chrome's dependencies, FFmpeg) into one image.

```bash
docker build -t video-studio .
docker run -p 5000:5000 -e ELEVENLABS_API_KEY=your_key_here video-studio
```

**Deploying to Render specifically:**
1. Create a new **Web Service**, pointed at this repo, with **Docker** as the environment (Render detects the `Dockerfile` automatically).
2. Add `ELEVENLABS_API_KEY` as an environment variable in Render's dashboard — never commit `.env`.
3. **Attach a Persistent Disk** mounted over this app's working directory (or at least over `videos_script/` and `videos/`). Without one, every redeploy wipes out every uploaded script and rendered video — Render's default filesystem is ephemeral.
4. Use a **paid plan**, not the free tier — free-tier services spin down on inactivity, which can kill a render that's in progress in the background worker thread.
5. The Dockerfile's `CMD` runs `gunicorn --workers 1 ...` — **do not change `--workers` above 1**. The render queue is a single in-process `queue.Queue` + one background thread; more worker processes would each get their own separate queue, silently breaking job tracking (see `AGENTS.md`'s "render queue" section for the full reasoning, and the trigger for when to actually move to a shared queue like Redis+RQ instead).

The Dockerfile was written from documented, known-good dependency lists (Manim's own Docker image, Puppeteer's standard Linux Chrome dependencies) but hasn't been build-tested in development — build and smoke-test it (at least one render per engine) before relying on it in production.

## Current videos

- **`golden_ratio_spiral.yml`** (manim) — Fibonacci squares build up with a camera that tracks their growth, a golden spiral sweeps through, ending on `φ ≈ 1.618`.
- **`pythagorean_rearrangement.yml`** (manim) — a "proof without words" builder reused for right-triangle/algebraic identity reveals.
- **`euler_identity.yml`** (manim) — a point traces the unit circle as `e^{iθ}` rotates to `π`, landing on `-1` to reveal `e^{iπ} + 1 = 0`.
- **`dholavira.yml`** (hyperframes) — Dholavira, a 5,000-year-old Indus Valley Civilization city in Gujarat with over 100 engineered rainwater reservoirs.

---

See `AGENTS.md` for full project conventions (YAML schemas, the builder/template patterns, folder rules, and non-obvious gotchas found while building each engine) if you're adding a new video or working on this repo with an AI assistant.
