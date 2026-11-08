"""Turn a videos_script/*.yml file into a rendered video.

Usage:
    .venv/Scripts/python.exe renderers/render_yaml.py videos_script/golden_ratio_spiral.yml [-q ql|qm|qh]
"""
import argparse
import os
import sys
from pathlib import Path

import yaml
from dotenv import load_dotenv

ROOT = Path(__file__).parent.parent.resolve()  # project root (this file lives in renderers/)
load_dotenv(ROOT / ".env")

# manim-voiceover's ElevenLabsService reads ELEVEN_API_KEY; we store it as
# ELEVENLABS_API_KEY in .env (the more common/expected name), so map it here.
if "ELEVENLABS_API_KEY" in os.environ and "ELEVEN_API_KEY" not in os.environ:
    os.environ["ELEVEN_API_KEY"] = os.environ["ELEVENLABS_API_KEY"]

sys.path.insert(0, str(ROOT / "videos_script"))

from manim import MovingCameraScene, config, tempconfig  # noqa: E402
from manim_voiceover import VoiceoverScene  # noqa: E402
from manim_voiceover.services.elevenlabs import ElevenLabsService  # noqa: E402

from builders import BUILDERS  # noqa: E402

QUALITY_MAP = {
    "ql": ("low_quality", "480p15"),
    "qm": ("medium_quality", "720p30"),
    "qh": ("high_quality", "1080p60"),
}


def make_scene_class(cfg):
    class YamlDrivenScene(VoiceoverScene, MovingCameraScene):
        def construct(self):
            self.camera.background_color = cfg.get("background_color", "#0b0d14")
            self.set_speech_service(
                ElevenLabsService(
                    voice_name=cfg.get("voice"),
                    model=cfg.get("model", "eleven_multilingual_v2"),
                    transcription_model=None,
                )
            )
            BUILDERS[cfg["type"]](self, cfg)

    return YamlDrivenScene


def render(yml_path: Path, quality: str = "qh"):
    cfg = yaml.safe_load(yml_path.read_text(encoding="utf-8"))

    if cfg["type"] not in BUILDERS:
        raise ValueError(f"Unknown builder type '{cfg['type']}'. Known types: {list(BUILDERS)}")

    quality_name, quality_dir = QUALITY_MAP[quality]
    slug = yml_path.stem
    class_name = cfg.get("class_name", slug)

    SceneClass = make_scene_class(cfg)
    SceneClass.__name__ = class_name

    with tempconfig(
        {
            "quality": quality_name,
            "media_dir": str(ROOT / ".cache"),
            "video_dir": str(ROOT / "videos" / slug / quality_dir),
            "output_file": class_name,
        }
    ):
        SceneClass().render()

    video_path = ROOT / "videos" / slug / quality_dir / f"{class_name}.mp4"

    # Clean up any sidecar files (.srt, .wav) manim-voiceover drops next to the video.
    if video_path.parent.is_dir():
        for sibling in video_path.parent.iterdir():
            if sibling.suffix.lower() != ".mp4":
                sibling.unlink()

    return video_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("yml_path", type=Path)
    parser.add_argument("-q", "--quality", choices=["ql", "qm", "qh"], default="qh")
    args = parser.parse_args()

    result = render(args.yml_path, args.quality)
    print(f"Video ready at: {result}")
