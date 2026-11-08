import re
import subprocess
import sys
from pathlib import Path

import yaml
from flask import Flask, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename

ROOT = Path(__file__).parent.resolve()
SCRIPTS_DIR = ROOT / "videos_script"
VIDEOS_DIR = ROOT / "videos"
PYTHON = ROOT / ".venv" / "Scripts" / "python.exe"
RENDER_YAML = ROOT / "render_yaml.py"
RENDER_HYPERFRAMES = ROOT / "render_hyperframes.py"
PROMPT_FILE = ROOT / "prompt.md"

sys.path.insert(0, str(SCRIPTS_DIR))

QUALITY_FLAG = "-qh"  # 1080p60 final quality, ready to post
QUALITY_ARG = "qh"  # same quality, in render_yaml.py's -q arg form

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
            scripts.append({"file": path.name, "scenes": scenes, "video_type": "manim"})

    for pattern in ("*.yml", "*.yaml", "*.json"):
        for path in sorted(SCRIPTS_DIR.glob(pattern)):
            try:
                cfg = yaml.safe_load(path.read_text(encoding="utf-8"))
            except yaml.YAMLError:
                continue
            if cfg and "class_name" in cfg:
                scripts.append({
                    "file": path.name,
                    "scenes": [cfg["class_name"]],
                    "video_type": cfg.get("video_type", "manim"),
                })

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

    import os

    env = os.environ.copy()
    ffmpeg_bin = find_ffmpeg_bin()
    if ffmpeg_bin:
        env["PATH"] = ffmpeg_bin + os.pathsep + env.get("PATH", "")

    video_type = "manim"  # legacy .py scripts and any yml missing the field default to manim
    if script_path.suffix in (".yml", ".yaml", ".json"):
        try:
            cfg = yaml.safe_load(script_path.read_text(encoding="utf-8")) or {}
            video_type = cfg.get("video_type", "manim")
        except yaml.YAMLError:
            pass

    if video_type == "hyperframes":
        command = [str(PYTHON), str(RENDER_HYPERFRAMES), str(script_path)]
    elif script_path.suffix in (".yml", ".yaml", ".json"):
        command = [str(PYTHON), str(RENDER_YAML), str(script_path), "-q", QUALITY_ARG]
    else:
        command = [str(PYTHON), "-m", "manim", QUALITY_FLAG, str(script_path), scene_name]

    result = subprocess.run(
        command,
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        env=env,
    )

    if result.returncode != 0:
        return jsonify({"success": False, "error": result.stderr[-4000:]}), 500

    module_name = script_path.stem

    if video_type == "hyperframes":
        # render_hyperframes.py always writes videos/<slug>/<class_name>.mp4 directly.
        video_path = VIDEOS_DIR / module_name / f"{scene_name}.mp4"
        if not video_path.exists():
            return jsonify({"success": False, "error": "Render finished but video file not found"}), 500
    else:
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
    if not filename.endswith((".yml", ".yaml", ".json")):
        return jsonify({"success": False, "error": "Only .yml, .yaml, or .json files are allowed"}), 400

    content = file.read().decode("utf-8", errors="ignore")
    error = validate_yaml_content(content)
    if error:
        return jsonify({"success": False, "error": error}), 400

    dest = SCRIPTS_DIR / filename
    dest.write_text(content, encoding="utf-8")

    return jsonify({"success": True, "filename": filename})


def validate_yaml_content(content: str) -> str | None:
    """Returns an error message if invalid, else None."""
    try:
        cfg = yaml.safe_load(content)
    except yaml.YAMLError as e:
        return f"Invalid YAML/JSON: {e}"

    if not isinstance(cfg, dict):
        return "File must contain a YAML/JSON object."
    if "class_name" not in cfg:
        return "Missing required field: 'class_name'"

    video_type = cfg.get("video_type", "manim")
    if video_type not in ("manim", "hyperframes"):
        return f"Unknown video_type '{video_type}'. Must be 'manim' or 'hyperframes'."

    if video_type == "manim":
        if "type" not in cfg:
            return "Missing required field: 'type' (which Manim builder to use)"
        try:
            from builders import BUILDERS
        except ImportError:
            BUILDERS = {}
        if BUILDERS and cfg["type"] not in BUILDERS:
            return f"Unknown type '{cfg['type']}'. Known types: {', '.join(BUILDERS)}"
    else:  # hyperframes
        hf_type = cfg.get("type", "did_you_know")
        if hf_type != "did_you_know":
            return f"Unknown hyperframes type '{hf_type}'. Known types: did_you_know"
        narration = cfg.get("narration")
        if not isinstance(narration, dict):
            return "Missing required field: 'narration' (with hook, buildup, reveal)"
        for beat in ("hook", "buildup", "reveal"):
            if beat not in narration:
                return f"Missing narration beat: '{beat}'"
        if "reveal_number" not in cfg or "end" not in cfg.get("reveal_number", {}):
            return "Missing required field: 'reveal_number.end'"

    return None


@app.get("/api/prompt")
def api_prompt():
    if not PROMPT_FILE.exists():
        return jsonify({"error": "prompt.md not found"}), 404
    return PROMPT_FILE.read_text(encoding="utf-8"), 200, {"Content-Type": "text/plain; charset=utf-8"}


@app.post("/api/save_yaml")
def api_save_yaml():
    data = request.get_json(force=True)
    filename = (data.get("filename") or "").strip()
    content = data.get("content") or ""

    if not filename:
        return jsonify({"success": False, "error": "Filename is required"}), 400

    filename = secure_filename(filename)
    if not filename.endswith((".yml", ".yaml", ".json")):
        filename += ".yml"

    error = validate_yaml_content(content)
    if error:
        return jsonify({"success": False, "error": error}), 400

    dest = (SCRIPTS_DIR / filename).resolve()
    if SCRIPTS_DIR.resolve() not in dest.parents:
        return jsonify({"success": False, "error": "Invalid filename"}), 400

    dest.write_text(content, encoding="utf-8")
    return jsonify({"success": True, "filename": filename})


if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
