# 0001 — Build the Manim math video pipeline

**Date:** 2026-11-08

## What was asked

Set up a from-scratch pipeline to generate trending-style math explainer videos, with a local dashboard to render/preview them, starting from a machine with no Python, FFmpeg, LaTeX, or Manim installed.

## What changed

- Installed Python 3.12 (via Python Manager), a `.venv`, Manim, FFmpeg (portable build), and MiKTeX (LaTeX) — hit and resolved a Windows Smart App Control block on `dvisvgm.exe` along the way (user disabled it after being walked through the tradeoffs).
- `manim.cfg` added to route intermediate build artifacts to `.cache/` and keep `videos/` holding only final `.mp4` files.
- Built a content/logic-separation architecture: `videos_script/<name>.yml` holds narration + params only; `videos_script/builders/<type>.py` holds the actual Manim animation/geometry code, registered in a `BUILDERS` dict.
- `render_yaml.py` — reads a `.yml`, finds its builder, dynamically builds and renders a Manim `Scene`.
- A Flask dashboard (`app.py` + `index.html`) — lists scripts, renders on Play/Download, shows the result in a modal.
- Three videos built and verified by rendering and visually scrubbing frames (not just checking for exceptions):
  - `golden_ratio_spiral` — Fibonacci squares + camera-tracked zoom + decorative spiral, ending on `φ ≈ 1.618`.
  - `pythagorean_rearrangement` — four triangles pinwheel around `c²`, then translate to expose `a²`/`b²`.
  - `euler_identity` — a point traces the unit circle to reveal `e^{iπ} + 1 = 0`.

## Bugs found by actually watching the rendered frames (not caught by a clean exit code)

- A `FadeOut` that removed only a label, leaving the shape behind to blend with the next frame.
- Camera zoom math backwards (zoomed in instead of out), making formula text render oversized/cropped.
- A decorative spiral scaled against the wrong reference unit, rendering invisibly small.

## Notes

This established the "content vs. logic separation" and "render low quality, visually verify, then render final" conventions that every later engine/pipeline in this project follows.
