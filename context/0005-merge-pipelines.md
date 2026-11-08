# 0005 — Merge the Manim and HyperFrames pipelines into one

**Date:** 2026-11-08

## What was asked

Two separate dashboards/folders/prompts (one per engine) felt fragmented — merge into one dashboard, one content folder, with a `video_type` field per `.yml` selecting which engine renders it. Also asked whether math videos could move to HyperFrames entirely to simplify deployment to a single runtime; after weighing the real tradeoffs (no JS equivalent to Manim's camera/geometry system; re-verifying three already-correct videos; ongoing loss of Manim's built-in primitives for future math videos) the user chose to keep both engines rather than drop Manim.

## What changed

- Retired: `app_hyperframes.py`, `index_hyperframes.html`, `prompt_hyperframes.md`, `hyperframes_script/`, `hyperframes_videos/`.
- Every `.yml` now has a `video_type` field (`manim` or `hyperframes`); `app.py`'s `/api/render` reads it and dispatches to `render_yaml.py` or `render_hyperframes.py` accordingly, then locates that engine's known output path (Manim nests a quality subfolder, HyperFrames doesn't).
- Added `type: did_you_know` to the HyperFrames schema too (previously implicit, since only one template existed) — forward-looking for when a second HyperFrames template is added later, without building a full type→template registry before it's actually needed.
- `prompt.md` rewritten as one prompt covering both engines: the AI picks the right `video_type`/`type` for the topic itself and outputs one YAML in the matching shape.
- `index.html` shows a small engine badge (`⚡ manim` / `🏺 hyperframes`) per card.
- `AGENTS.md`/`README.md` rewritten around the unified architecture, each engine's own section preserved under one roof.

## Verified

Rendered one video per engine through the single merged dashboard in the same session (Dholavira via HyperFrames, and a user-edited Pythagorean-builder variant via Manim) — both completed and played correctly.
