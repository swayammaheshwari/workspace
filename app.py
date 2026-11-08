import re
import subprocess
import sys
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename

ROOT = Path(__file__).parent.resolve()
SCRIPTS_DIR = ROOT / "videos_script"
VIDEOS_DIR = ROOT / "videos"
PYTHON = ROOT / ".venv" / "Scripts" / "python.exe"

QUALITY_FLAG = "-qh"  # 1080p60 final quality, ready to post

SCENE_CLASS_RE = re.compile(r"^class\s+(\w+)\s*\([^)]*Scene[^)]*\)\s*:", re.MULTILINE)

app = Flask(__name__, static_folder=None)


def find_ffmpeg_bin() -> str | None:
    candidates = list((Path.home() / "AppData" / "Local" / "ffmpeg").glob("*/bin/ffmpeg.exe"))
    return str(candidates[0].parent) if candidates else None


def list_scripts():
    scripts = []
    for path in sorted(SCRIPTS_DIR.glob("*.py")):
        text = path.read_text(encoding="utf-8", errors="ignore")
        scenes = SCENE_CLASS_RE.findall(text)
        if scenes:
            scripts.append({"file": path.name, "scenes": scenes})
    return scripts


@app.get("/")
def index():
    return send_from_directory(ROOT, "index.html")


@app.get("/api/scripts")
def api_scripts():
    return jsonify(list_scripts())


@app.post("/api/render")
def api_render():
    data = request.get_json(force=True)
    script_name = data.get("script", "")
    scene_name = data.get("scene", "")

    script_path = (SCRIPTS_DIR / script_name).resolve()
    if SCRIPTS_DIR.resolve() not in script_path.parents or not script_path.exists():
        return jsonify({"success": False, "error": "Invalid script"}), 400

    env = None
    ffmpeg_bin = find_ffmpeg_bin()
    if ffmpeg_bin:
        import os

        env = os.environ.copy()
        env["PATH"] = ffmpeg_bin + os.pathsep + env.get("PATH", "")

    result = subprocess.run(
        [str(PYTHON), "-m", "manim", QUALITY_FLAG, str(script_path), scene_name],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        env=env,
    )

    if result.returncode != 0:
        return jsonify({"success": False, "error": result.stderr[-4000:]}), 500

    module_name = script_path.stem

    # The quality folder name (e.g. 480p15, 1080p60, or a custom resolution a
    # script sets via config.pixel_height/width) isn't fixed by QUALITY_FLAG
    # alone, so locate the actual output file rather than assuming a path.
    script_output_dir = VIDEOS_DIR / module_name
    candidates = list(script_output_dir.glob(f"*/{scene_name}.mp4")) if script_output_dir.is_dir() else []
    if not candidates:
        return jsonify({"success": False, "error": "Render finished but video file not found"}), 500
    video_path = max(candidates, key=lambda p: p.stat().st_mtime)

    # Some plugins (e.g. manim-voiceover) drop sidecar files (.srt, .wav) next
    # to the video; videos/ should only ever contain the final .mp4.
    output_dir = video_path.parent
    for sibling in output_dir.iterdir():
        if sibling.suffix.lower() != ".mp4":
            sibling.unlink()

    video_rel = video_path.relative_to(VIDEOS_DIR).as_posix()
    return jsonify({"success": True, "video_url": f"/videos/{video_rel}"})


@app.get("/videos/<path:filename>")
def serve_video(filename):
    return send_from_directory(VIDEOS_DIR, filename)


@app.get("/download/<path:filename>")
def download_video(filename):
    return send_from_directory(VIDEOS_DIR, filename, as_attachment=True)


@app.post("/api/upload")
def api_upload():
    file = request.files.get("file")
    if file is None or file.filename == "":
        return jsonify({"success": False, "error": "No file provided"}), 400

    filename = secure_filename(file.filename)
    if not filename.endswith(".py"):
        return jsonify({"success": False, "error": "Only .py files are allowed"}), 400

    dest = SCRIPTS_DIR / filename
    file.save(dest)

    return jsonify({"success": True, "filename": filename})


if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
