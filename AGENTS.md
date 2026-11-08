# AGENTS.md

Instructions for an AI agent working on this repository. This project is **one dashboard, one `videos_script/` folder, one `videos/` output folder** — but it renders through **two engines**, picked per-video by a `video_type` field in that video's `.yml`:

- `video_type: manim` — math explainer videos (proofs, equations, geometry), rendered with Manim + `render_yaml.py`.
- `video_type: hyperframes` — "did you know" history/archaeology stat-reveal videos (HTML/CSS/GSAP motion graphics), rendered with HyperFrames + `render_hyperframes.py`.

Both share the same ElevenLabs `.env` key, the same dashboard (`app.py` / `index.html`, port 5000), and the same `prompt.md` (which asks the user's topic, picks the right `video_type`/`type` itself, and hands back one YAML). **Never mix engines within one video** — a math proof is `manim`, a stat-reveal fact is `hyperframes`; pick one per `.yml`.

## `context/` — write a log entry for every completed change (always do this)

After finishing any requested change to this project — a new video, a new feature, a bug fix, a refactor, a docs update, anything — **create a new file in `context/`** documenting it. This is not optional busywork: it's how the user (and any future agent/session) can see what changed and why without re-reading the whole conversation.

- **Filename**: `context/NNNN-short-kebab-case-slug.md`, where `NNNN` is the next sequential 4-digit number after the highest one already in `context/` (check with a directory listing first — don't guess or reuse a number).
- **Content**, roughly in this shape (see existing files in `context/` for real examples):
  ```markdown
  # NNNN — Short title

  **Date:** YYYY-MM-DD

  ## What was asked
  (what the user actually requested, in their own terms)

  ## What changed
  (the actual files/behavior changed, concretely — not vague)

  ## Bugs found / non-obvious gotchas (if any)
  (anything that silently failed, rendered wrong, or needed a workaround — this is often the most valuable part)

  ## Verified
  (what you actually tested/observed, not just "should work")
  ```
- Write it **after** the change is done and verified, as the last step of that unit of work — not before, and not as a running draft updated mid-task.
- One file per logical change, not one file per tool call — if a single user request spans many edits (e.g. "add the queue, fix the paths, add a Dockerfile"), that's one `context/` entry covering all of it, not three.
- Keep it honest: if something wasn't actually tested (e.g. a Dockerfile with no Docker available to build it), say so explicitly rather than implying it was verified.

## Project structure

```
videos_script/
  <name>.yml              # content for ONE video: video_type, type, narration, params
  builders/                # Manim-engine builders only
    __init__.py             # BUILDERS registry: {type_name: build_function}
    <type_name>.py           # Manim animation/geometry code for that video TYPE
renderers/
  render_yaml.py             # manim engine: reads a .yml, finds its builder, renders via manim
  render_hyperframes.py      # hyperframes engine: reads a .yml, fills the shared template, renders via hyperframes CLI
hyperframes/
  demo/                     # the single shared HyperFrames project (used by every hyperframes video)
    index.html                # OVERWRITTEN per-render by renderers/render_hyperframes.py — never hand-edit
    compositions/components/count-up.html   # registry component, shared, added once
  template_index.html      # the hyperframes composition TEMPLATE (%%TOKEN%% placeholders)
app.py                      # single Flask dashboard — routes render by video_type
index.html                  # single dashboard UI (shows an engine badge per card)
videos/                     # FINAL .mp4 files only, for BOTH engines — nothing else ever goes here
.cache/                     # Manim's intermediate build artifacts — git-ignored, safe to delete
manim.cfg                   # routes Manim's intermediate output to .cache/, final video to videos/
.env                         # ELEVENLABS_API_KEY — git-ignored, never commit, shared by both engines
prompt.md                   # ONE reusable prompt covering both video families — see below
context/                    # one markdown log entry per completed change — see above, always write one
```

## The core convention: content vs. logic are separate (both engines)

- A `.yml` holds **only** the variable content for one video: `video_type`, `type`, `class_name`, `voice`, `background_color`, `title_text`, a `narration` dict, and (for `hyperframes`) `reveal_number`/`source_text`/`aspect_ratio`.
- The actual rendering logic lives in code, reused across any `.yml` with the same `video_type`+`type`:
  - `manim`: `videos_script/builders/<type>.py`, a function `build(scene, cfg)`.
  - `hyperframes`: currently one fixed template (`type: did_you_know`) in `hyperframes/template_index.html` — there's no per-type builder registry yet since only one hyperframes template exists. If you add a second hyperframes `type`, that's when to introduce a registry mirroring `builders/__init__.py` — don't build that abstraction before it's needed.
- **Never** create a `_audio` or otherwise duplicated variant of a video. Narration is always built into the one script/template — one `.yml` per video, period.
- Adding a brand-new *kind* of Manim video: write `videos_script/builders/<new_type>.py` with `build(scene, cfg)`, register it in `builders/__init__.py`'s `BUILDERS` dict, write a `.yml` with `video_type: manim`, `type: <new_type>`.
- Adding a brand-new *kind* of HyperFrames video (a second visual template beyond the stat-reveal format): that's a template-level change to `hyperframes/template_index.html` and `render_hyperframes.py`'s substitution logic — it's more involved than the Manim case since there's no registry yet (see above).
- Adding a whole new **engine** (neither Manim nor HyperFrames fits, e.g. a request needing a different rendering approach entirely) is a project-level decision, not something to improvise inside an existing `.yml` — flag it rather than forcing a mismatched video_type.

## `prompt.md` (the AI content-generation prompt)

One file, not two. It documents both families' existing `type`s, and the AI using it is expected to pick the right `video_type`/`type` for the topic itself (stating its pick, not asking the user to choose blindly) before asking 2-3 clarifying questions in a single message. Output is always exactly one YAML file — no Python/HTML, ever, from that prompt. When a new `type` is added to either engine, update `prompt.md`'s family list so the AI knows it's available.

---

# Engine: Manim (math videos)

## Narration pattern (do not deviate)

Inside a builder, wrap each beat like this — keep the already-tuned animation timing untouched, and pad with a trailing `wait` only if the narration runs longer:

```python
with scene.voiceover(text=narration["beat_name"]) as tracker:
    scene.play(SomeAnimation(...), run_time=0.8)
    scene.wait(0.5)
    remaining = tracker.duration - 1.3  # sum of the run_times/waits above
    if remaining > 0:
        scene.wait(remaining)
```

Do not stretch an animation's `run_time` to match `tracker.duration` unless that animation IS the centerpiece of the beat (e.g. a rotation that should last as long as its narration) — stretching a quick UI animation to match a long narration line looks slow and unnatural.

## ElevenLabs specifics (non-obvious gotchas)

- `manim_voiceover.services.elevenlabs.ElevenLabsService` reads the env var `ELEVEN_API_KEY`, **not** `ELEVENLABS_API_KEY`. `render_yaml.py` maps `.env`'s `ELEVENLABS_API_KEY` → `ELEVEN_API_KEY` at startup — don't rename the `.env` key, the mapping is already handled.
- The installed `elevenlabs` SDK (pinned `<0.3` by `manim-voiceover`) returns each voice's `.name` as the **full label including its description**, e.g. `"Daniel - Steady Broadcaster"`, not just `"Daniel"`. Use the full string in `voice:`, or the service silently falls back to the first available voice.
- Always pass `model="eleven_multilingual_v2"` (or another current model) explicitly — the SDK's own default (`eleven_monolingual_v1`) is deprecated and the API call fails.
- Always pass `transcription_model=None` to `ElevenLabsService` — otherwise it tries to interactively prompt to install optional transcription packages, which hangs/crashes in a non-interactive render.
- Narration audio is cached by content hash in `.cache/voiceovers/`, so re-rendering a `.yml` whose narration text hasn't changed does **not** re-call the ElevenLabs API or consume quota.
- Check remaining quota anytime: `GET https://api.elevenlabs.io/v1/user` with header `xi-api-key: <key>` → `subscription.character_count` / `character_limit`.

## Rendering

```bash
.\.venv\Scripts\python.exe renderers\render_yaml.py videos_script/<name>.yml -q ql   # fast 480p preview while iterating
.\.venv\Scripts\python.exe renderers\render_yaml.py videos_script/<name>.yml -q qh   # final 1080p60
```

## Verification discipline (important)

For any builder with non-trivial geometry, camera moves, or `always_redraw`/`Transform` combinations: **render at `-ql` and visually inspect multiple frames** (via a browser, scrubbing to different timestamps) before trusting it — a silent rendering success does not mean the visual is correct. Bugs like these do not raise exceptions, they just produce wrong pixels:
- A `FadeOut` that only removes a *label* but leaves the actual shape/polygon behind, causing it to blend with whatever's drawn next.
- Camera zoom math backwards (zooming in when you meant to zoom out to fit more content), causing text to render oversized/cropped.
- A decorative element (e.g. a spiral) scaled against the wrong reference unit, making it tiny/invisible or wildly oversized.
- `always_redraw(...)` + `Transform(...)` on the same mobject: the updater overwrites the transform every frame. Call `.clear_updaters()` on the mobject before transforming it.

Only move to a final `-qh` render after the `-ql` pass looks correct frame-by-frame.

---

# Engine: HyperFrames ("did you know" videos)

## How a render actually works

Unlike the Manim engine (which dynamically builds a Scene class in Python), HyperFrames compositions are plain HTML/CSS/GSAP files rendered by the `hyperframes` Node CLI. There is **one shared project** (`hyperframes/demo/`) whose `index.html` gets **regenerated from scratch** on every render:

1. `render_hyperframes.py` reads a `.yml`'s `narration` dict (`hook`, `buildup`, `reveal`).
2. For each beat, it calls the ElevenLabs REST API directly (`/v1/text-to-speech/{voice_id}`) — this engine does **not** use `manim_voiceover`; it's a standalone `requests`-based call. Each call is cached first: `synthesize()` hashes `(text, voice_id, model)` and checks `.cache/hyperframes_narration/<hash>.mp3` before hitting the API, so re-rendering a `.yml` whose narration hasn't changed costs **zero** ElevenLabs quota (mirrors the Manim engine's own `manim_voiceover` caching, implemented independently since this engine doesn't go through that library).
3. Each beat's mp3 duration is probed via `ffprobe`, concatenated into one `assets/narration.mp3`, and used to compute cumulative `data-start` times for each text beat.
4. `hyperframes/template_index.html`'s `%%TOKEN%%` placeholders are substituted with the computed timings + content, and the result overwrites `hyperframes/demo/index.html`.
5. `npx hyperframes check` (lint) then `npx hyperframes render -o <path>` run from inside `hyperframes/demo/`.
6. The output moves to `videos/<yml_stem>/<ClassName>.mp4` — note: **flat**, no quality subfolder (unlike the Manim engine's `videos/<yml_stem>/<quality_dir>/<ClassName>.mp4`). `app.py`'s render handler knows to look up each engine's output differently based on `video_type`.

**Never hand-edit `hyperframes/demo/index.html` directly** — it's build output, overwritten on the next render. Edit `hyperframes/template_index.html` instead.

## YAML content schema (`video_type: hyperframes`)

```yaml
video_type: hyperframes
type: did_you_know           # the only hyperframes type today
class_name: PascalCaseName
topic: "one-line description"
aspect_ratio: landscape | portrait | square   # -> 1920x1080 | 1080x1920 | 1080x1080
duration_seconds: 20        # advisory only — actual length is narration-driven, never stretched/compressed
voice: "Daniel - Steady Broadcaster"   # must be the FULL label from /v1/voices, see gotcha below
background_color: "#0b0d14"
accent_color: green | blue | violet    # matches the count-up registry component's accent enum
title_text: "Did you know?"
narration:
  hook: "..."       # ~3-4s hook line
  buildup: "..."    # 1-2 sentences of context
  reveal: "..."     # states the number in words (TTS reads this aloud)
reveal_number:
  start: 0
  end: 100          # the numeral the animated counter lands on
  prefix: ""
  suffix: "+ reservoirs"
source_text: "Source: ..."
```

## HyperFrames-specific gotchas (non-obvious, found the hard way)

- **ElevenLabs voice names include the full label.** `/v1/voices`' `name` field is `"Daniel - Steady Broadcaster"`, not just `"Daniel"` — use the full string in `voice:`. (Same lesson as the Manim engine's gotcha above, arrived at independently since this engine calls the REST API directly rather than through `manim_voiceover`.)
- **The `count-up` registry component's internal animation length is hardcoded to ~3 seconds**, regardless of its mount's `data-duration`. Mounting it with a longer duration does **not** make it hold its final frame — past its own internal 3s, it just goes blank. The fix used here: mount it with `data-duration="3"` (its native length), then layer a separate static "held" text element (`#reveal-hold`) that cross-fades in right as the pop-in visually lands (~2.4s in), covering the rest of that beat's narration.
- **A `data-composition-src` mount needs explicit `data-width`/`data-height` on its host div.** Omitting them results in the sub-composition rendering as a blank box — confirmed via `npx hyperframes timeline --json`, which is the right tool to debug "something isn't showing" rather than guessing.
- Only one shared HyperFrames project exists (`hyperframes/demo/`) rather than one folder per video — this keeps `npx hyperframes skills update`/registry additions a one-time setup. If per-video custom compositions beyond the template are ever needed, that's a sign to build a real type→template registry (mirroring `builders/`), not to hand-edit `demo/index.html`.

## Verification discipline (same lesson as Manim, same consequence)

After any template change, render once and scrub to the reveal beat specifically — a missing/blank number reveal produces no error, no lint failure, nothing in `stdout`. `npx hyperframes timeline --json` and `npx hyperframes snapshot --at <seconds>` are the tools for this; don't rely on "render exited 0" as proof of correctness.

## Rendering

```bash
.\.venv\Scripts\python.exe renderers\render_hyperframes.py videos_script/<name>.yml
```

---

## Dashboard (`app.py`, single, port 5000)

- Scans `videos_script/*.yml`/`*.yaml`/`*.json` (via `class_name` field, reporting each's `video_type` too) and legacy `*.py` (via regex for `class X(...Scene...):`, always treated as `video_type: manim`).
- `QUALITY_FLAG`/`QUALITY_ARG` control the Manim engine's default render quality (currently `-qh` / `qh`); the HyperFrames engine has no equivalent quality flag today.
- `/api/upload` and `/api/save_yaml` accept `.yml`/`.yaml`/`.json` for either engine; `validate_yaml_content` branches its checks on `video_type`.
- `index.html` shows a small engine badge (`⚡ manim` / `🏺 hyperframes`) per card so it's clear which renderer a video uses at a glance.

## The render queue (do not remove — this is load-bearing for deployment)

`/api/render` does **not** render synchronously. Rendering takes anywhere from ~15s to a couple minutes, and a blocking request that long risks being killed by a reverse proxy/platform timeout once this is deployed (Render, etc. commonly cap request duration well under that). Instead:

- `POST /api/render` validates the script path, pushes `(job_id, script_path, scene_name)` onto an in-process `queue.Queue`, and returns **immediately** with `{"success": true, "job_id": ..., "status": "queued"}` (HTTP 202).
- A single background worker thread (`_render_worker`, started once at module import time as a daemon thread) pulls jobs off that queue **one at a time** and calls `do_render(...)` — the actual subprocess dispatch to `render_yaml.py` or `render_hyperframes.py`, i.e. exactly the logic that used to live directly in the request handler before the queue existed.
- `GET /api/jobs/<job_id>` reports that job's current state: `queued` → `running` → `done` (with `video_url`) or `failed` (with `error`). `index.html`'s JS polls this every 1.5s after enqueueing, instead of awaiting a single blocking response.
- Jobs are processed **strictly one at a time** — this is intentional, not a limitation to "fix": video rendering is CPU-heavy, and two renders racing for the same CPU/GPU tends to make both slower and more failure-prone, not faster.

**Why in-process and in-memory, not Redis/Celery:** this project runs as a single server instance. An in-process `queue.Queue` + one worker thread is the simplest thing that actually solves the two real problems (blocking requests, concurrent renders) at this scale. The explicit trigger to replace it with a persistent/shared queue (Redis + RQ/Celery, or a SQLite-backed one) is **running more than one server instance/replica** — each instance would otherwise have its own separate queue and job dict, so a status poll landing on a different instance than the one that ran the job would see "unknown job_id." Don't add that complexity before it's actually needed.

**Jobs are not persisted.** If the server process restarts while a job is `queued` or `running`, that job's state is gone — the client's poll loop will just get a 404 on `/api/jobs/<job_id>` and should treat that as a failure. This is consistent with the in-memory design above; if job durability across restarts becomes a real requirement, that's part of the same "move to a persistent queue" trigger.
