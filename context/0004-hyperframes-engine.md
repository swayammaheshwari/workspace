# 0004 — Add the HyperFrames "did you know" engine

**Date:** 2026-11-08

## What was asked

Add a second video pipeline for a "did you know" style Instagram niche (history/archaeology facts, Hindu/Indian archaeology emphasized), using HeyGen's open-source HyperFrames tool (HTML/CSS/GSAP rendered to video) — a separate dashboard, its own content format, with duration/aspect-ratio living in the YAML rather than asked at render time.

## What changed

- Verified HyperFrames was a legitimate project (not just social-media hype) before installing: HeyGen's open-source repo, Apache-2.0, Node 22+ + FFmpeg only, no required paid API key for the core CLI/render path.
- Installed via `npx`, scaffolded a shared project at `hyperframes/demo/`, installed HyperFrames' own Claude-oriented skill docs (`/hyperframes`, `/hyperframes-cli`, `/hyperframes-registry`, `/media-use`) and read them before building anything, per the tool's own guidance that compositions written without consulting them tend to break.
- Pulled in the `count-up` registry component instead of hand-building a number-reveal animation.
- Built `hyperframes/template_index.html` — a %%TOKEN%%-based composition template: title card → buildup → animated count-up reveal → held stat → source caption.
- `render_hyperframes.py` — generates narration per beat via the ElevenLabs REST API directly (not `manim_voiceover`, since this isn't a Manim scene), probes each beat's duration via `ffprobe`, concatenates them, fills the template's timing/content tokens, and shells out to `npx hyperframes check`/`render`.
- First video: `dholavira.yml` — Dholavira, a 5,000-year-old Indus Valley Civilization city with 100+ engineered rainwater reservoirs.
- A second dashboard (later retired in favor of a merged one — see 0005) mirroring the Manim dashboard's shape.

## Bugs found by actually scrubbing rendered frames

- The `count-up` mount was invisible entirely — fixed by adding `data-width`/`data-height` to its host div (a plain content `<div>` doesn't need them, but a `data-composition-src` mount does, confirmed via `npx hyperframes timeline --json`).
- The `count-up` component's internal animation is hardcoded to ~3 seconds regardless of its host's `data-duration`, and goes blank (not held) once that internal window ends. Fixed by mounting it at its native 3s duration, then layering a separate static "held" number element that cross-fades in right as the pop-in visually lands, covering the rest of the beat's narration.
