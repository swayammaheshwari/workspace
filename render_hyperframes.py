"""Turn a videos_script/*.yml file (video_type: hyperframes) into a rendered
"Did you know" video.

Usage:
    .venv/Scripts/python.exe render_hyperframes.py videos_script/dholavira.yml
"""
import argparse
import json
import os
import subprocess
from pathlib import Path

import requests
import yaml
from dotenv import load_dotenv

ROOT = Path(__file__).parent.resolve()
load_dotenv(ROOT / ".env")

PROJECT_DIR = ROOT / "hyperframes" / "demo"
TEMPLATE_PATH = ROOT / "hyperframes" / "template_index.html"
VIDEOS_DIR = ROOT / "videos"
ASSETS_DIR = PROJECT_DIR / "assets" / "narration"

ELEVEN_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
ELEVEN_MODEL = "eleven_multilingual_v2"

RESOLUTIONS = {
    "landscape": (1920, 1080),
    "portrait": (1080, 1920),
    "square": (1080, 1080),
}

ACCENT_HEX = {
    "green": "#71f5a7",
    "blue": "#61a8ff",
    "violet": "#c5a3ff",
}

COUNT_UP_POP_DURATION = 3.0  # fixed, baked into the registry component itself
COUNT_UP_LAND_TIME = 2.4  # when its pop-in visually settles, for a seamless handoff


def find_ffmpeg_bin() -> str | None:
    candidates = list((Path.home() / "AppData" / "Local" / "ffmpeg").glob("*/bin/ffmpeg.exe"))
    return str(candidates[0].parent) if candidates else None


def ffmpeg_env():
    env = os.environ.copy()
    bin_dir = find_ffmpeg_bin()
    if bin_dir:
        env["PATH"] = bin_dir + os.pathsep + env.get("PATH", "")
    return env


def get_voice_id(voice_label: str, env) -> str:
    """ElevenLabs' /v1/voices 'name' field includes the full label, e.g.
    'Daniel - Steady Broadcaster' — match it as-is, but also accept just the
    short name ('Daniel') as a fallback."""
    resp = requests.get(
        "https://api.elevenlabs.io/v1/voices",
        headers={"xi-api-key": ELEVEN_API_KEY},
        timeout=15,
    )
    resp.raise_for_status()
    voices = resp.json()["voices"]

    target = voice_label.strip().lower()
    for v in voices:
        if v["name"].strip().lower() == target:
            return v["voice_id"]

    short_target = target.split(" - ")[0].strip()
    for v in voices:
        if v["name"].strip().lower().split(" - ")[0].strip() == short_target:
            return v["voice_id"]

    raise ValueError(f"Voice '{voice_label}' not found. Available: {[v['name'] for v in voices]}")


def synthesize(text: str, voice_id: str, out_path: Path):
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={"xi-api-key": ELEVEN_API_KEY, "Content-Type": "application/json"},
        json={"text": text, "model_id": ELEVEN_MODEL},
        timeout=60,
    )
    resp.raise_for_status()
    out_path.write_bytes(resp.content)


def probe_duration(path: Path, env) -> float:
    ffprobe = "ffprobe"
    bin_dir = find_ffmpeg_bin()
    if bin_dir:
        ffprobe = str(Path(bin_dir) / "ffprobe.exe")
    result = subprocess.run(
        [ffprobe, "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)],
        capture_output=True,
        text=True,
        env=env,
    )
    return float(json.loads(result.stdout)["format"]["duration"])


def concat_audio(parts: list[Path], out_path: Path, env):
    ffmpeg = "ffmpeg"
    bin_dir = find_ffmpeg_bin()
    if bin_dir:
        ffmpeg = str(Path(bin_dir) / "ffmpeg.exe")

    list_file = out_path.parent / "concat_list.txt"
    list_file.write_text("\n".join(f"file '{p.resolve().as_posix()}'" for p in parts), encoding="utf-8")

    subprocess.run(
        [ffmpeg, "-y", "-f", "concat", "-safe", "0", "-i", str(list_file), "-c", "copy", str(out_path)],
        check=True,
        capture_output=True,
        env=env,
    )
    list_file.unlink()


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def render(yml_path: Path):
    cfg = yaml.safe_load(yml_path.read_text(encoding="utf-8"))
    env = ffmpeg_env()

    class_name = cfg["class_name"]
    aspect_ratio = cfg.get("aspect_ratio", "landscape")
    width, height = RESOLUTIONS[aspect_ratio]
    bg_color = cfg.get("background_color", "#0b0d14")
    accent = cfg.get("accent_color", "green")

    narration = cfg["narration"]
    reveal = cfg["reveal_number"]
    source_text = cfg.get("source_text", "")

    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    voice_id = get_voice_id(cfg.get("voice", "Daniel"), env)

    beats = ["hook", "buildup", "reveal"]
    durations = {}
    mp3_paths = {}
    for beat in beats:
        mp3_path = ASSETS_DIR / f"{beat}.mp3"
        synthesize(narration[beat], voice_id, mp3_path)
        mp3_paths[beat] = mp3_path
        durations[beat] = probe_duration(mp3_path, env)

    narration_mp3 = PROJECT_DIR / "assets" / "narration.mp3"
    concat_audio([mp3_paths[b] for b in beats], narration_mp3, env)

    hold_tail = 1.2  # seconds the final beat's visuals hold after narration ends
    buildup_start = durations["hook"]
    reveal_start = buildup_start + durations["buildup"]
    reveal_beat_duration = durations["reveal"] + hold_tail
    total_duration = reveal_start + reveal_beat_duration

    reveal_hold_start = reveal_start + COUNT_UP_LAND_TIME
    reveal_hold_duration = max(0.1, total_duration - reveal_hold_start)

    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    substitutions = {
        "%%CLASS_NAME%%": class_name,
        "%%BG_COLOR%%": bg_color,
        "%%WIDTH%%": str(width),
        "%%HEIGHT%%": str(height),
        "%%TOTAL_DURATION%%": f"{total_duration:.2f}",
        "%%TEXT_FONT_SIZE%%": "72" if aspect_ratio == "landscape" else "64",
        "%%BUILDUP_FONT_SIZE%%": "40" if aspect_ratio == "landscape" else "36",
        "%%SOURCE_FONT_SIZE%%": "24",
        "%%HOOK_TEXT%%": esc(cfg.get("title_text", narration["hook"])),
        "%%HOOK_DURATION%%": f"{durations['hook']:.2f}",
        "%%BUILDUP_TEXT%%": esc(narration["buildup"]),
        "%%BUILDUP_START%%": f"{buildup_start:.2f}",
        "%%BUILDUP_DURATION%%": f"{durations['buildup']:.2f}",
        "%%REVEAL_START%%": f"{reveal_start:.2f}",
        "%%REVEAL_HOLD_START%%": f"{reveal_hold_start:.2f}",
        "%%REVEAL_HOLD_DURATION%%": f"{reveal_hold_duration:.2f}",
        "%%SOURCE_DURATION%%": f"{reveal_beat_duration:.2f}",
        "%%SOURCE_TEXT%%": esc(source_text),
        "%%COUNT_START%%": str(reveal.get("start", 0)),
        "%%COUNT_END%%": str(reveal["end"]),
        "%%COUNT_PREFIX%%": reveal.get("prefix", ""),
        "%%COUNT_SUFFIX%%": reveal.get("suffix", ""),
        "%%COUNT_ACCENT%%": accent,
        "%%ACCENT_HEX%%": ACCENT_HEX.get(accent, ACCENT_HEX["green"]),
        "%%COUNT_FONT_SIZE%%": "140" if aspect_ratio == "landscape" else "110",
    }
    for token, value in substitutions.items():
        template = template.replace(token, value)

    (PROJECT_DIR / "index.html").write_text(template, encoding="utf-8")

    check = subprocess.run(
        ["npx", "hyperframes", "check", "--json"],
        cwd=str(PROJECT_DIR),
        capture_output=True,
        text=True,
        env=env,
        shell=True,
    )
    if check.returncode != 0:
        print(check.stdout)
        print(check.stderr)
        raise RuntimeError("hyperframes check failed — see output above")

    slug = yml_path.stem
    out_dir = VIDEOS_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{class_name}.mp4"

    render_result = subprocess.run(
        ["npx", "hyperframes", "render", "-o", str(out_path)],
        cwd=str(PROJECT_DIR),
        capture_output=True,
        text=True,
        env=env,
        shell=True,
    )
    if render_result.returncode != 0:
        print(render_result.stdout)
        print(render_result.stderr)
        raise RuntimeError("hyperframes render failed — see output above")

    return out_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("yml_path", type=Path)
    args = parser.parse_args()

    result = render(args.yml_path)
    print(f"Video ready at: {result}")
