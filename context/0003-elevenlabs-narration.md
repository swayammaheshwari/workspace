# 0003 — Switch narration from gTTS to ElevenLabs

**Date:** 2026-11-08

## What was asked

The gTTS narration voice quality wasn't good enough — switch to ElevenLabs for real, natural-sounding voiceover, built directly into the same script per video (no separate audio-only variant files).

## What changed

- Installed `manim-voiceover[elevenlabs]`, added `.env` (git-ignored) holding `ELEVENLABS_API_KEY`.
- All three Manim builders (`golden_ratio_spiral`, `pythagorean_rearrangement`, `euler_identity`) converted to `VoiceoverScene` + `ElevenLabsService`, narration wrapped per-beat with a pattern that keeps existing animation timing intact and only pads with a trailing `wait()` if the narration audio runs longer than the visuals already take.

## Non-obvious bugs found while wiring this up

- `ElevenLabsService` reads the env var `ELEVEN_API_KEY`, not `ELEVENLABS_API_KEY` — `render_yaml.py` now maps one to the other at startup.
- The installed `elevenlabs` SDK (pinned `<0.3` by `manim-voiceover`) returns each voice's `.name` as the **full label including its description** (e.g. `"Daniel - Steady Broadcaster"`), not just `"Daniel"` — using the short name silently falls back to a different voice.
- The SDK's own default TTS model (`eleven_monolingual_v1`) is deprecated; `model="eleven_multilingual_v2"` must be passed explicitly.
- `transcription_model=None` must be passed to `ElevenLabsService`, or it tries to interactively prompt to install optional transcription packages — which hangs/crashes in a non-interactive render.

## Verified

Rendered all three videos end-to-end with real ElevenLabs audio; confirmed via the ElevenLabs API's own quota endpoint that character usage matched expectations (and stayed well within the free tier's 10,000/month limit).
