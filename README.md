# Creater : Swayam Maheshwari

# This is the project which has express backend and mongodb , postgres , redis database  and using typescript 
# In frontend Next ts with latest version 14 and redux included

## Getting Started

To begin, clone the repository:

```bash
git clone https://github.com/swayammaheshwari/workspace
```

```bash
cd workspace
```
# For Frontend

```bash
git checkout frontend/next_14
```

# For Backend

```bash
git checkout backend/express_ts
```

```bash
cp .env.example .env
npm i
```

# then you can use following commands :

```bash
    npm run dev  # for development mode (this will start a server on port 5000)
    npm build    # for production mode (no hot reload)
    npm start    # alias of "npm run build" + "serve dist"
```

## Math Video Generator (Manim)

This project also includes a small pipeline for generating animated math videos (the kind that trend on Shorts/Reels/TikTok) using [Manim](https://www.manim.community/), plus a local dashboard to render and preview them in the browser.

### How it works

- `videos_script/` — your Manim scripts live here. Each `.py` file contains one or more `Scene` subclasses (e.g. `class MyScene(Scene):`). If a scene has narration, build it into this same file using `VoiceoverScene` — don't create a separate "_audio" variant of a script.
- `videos/` — only final rendered `.mp4` files go here (organized as `videos/<script_name>/<quality>/<SceneName>.mp4`). Manim-voiceover's sidecar files (`.srt`, `.wav`) are automatically deleted after each render so this folder only ever has the video.
- `.cache/` — intermediate build artifacts (Tex, text, partial movie files, logs) that Manim generates while rendering. Git-ignored, safe to delete anytime.
- `app.py` — a Flask server that scans `videos_script/` for scenes, renders the chosen one with Manim on demand, serves/downloads the result, and accepts new script uploads.
- `index.html` — the dashboard UI: one card per script, with a **Play** and **Download** button per scene, plus an **Import Script** button.

### Prerequisites (one-time setup)

- Python 3.12+ (installed via Python Manager / `py install 3.12`)
- A virtual environment at `.venv` with `manim`, `flask`, and `manim-voiceover[gtts]` installed
- FFmpeg available on PATH (used by Manim to encode video)
- MiKTeX/LaTeX on PATH — required for any script using `MathTex`/`Tex`/`Integer`/`DecimalNumber` (all three example scripts use `MathTex` for crisp equation rendering)
- Internet connection at render time for any script using `GTTSService` (narration), since it calls Google's TTS API

### Running the dashboard

```bash
.\.venv\Scripts\python.exe app.py
```

Then open **http://localhost:5000** in your browser. Each scene is shown as a card with two buttons:

- **▶ Play** — renders the scene with Manim (including narration, if the script uses `VoiceoverScene`) and opens the finished video in a modal player on the same page.
- **⬇ Download** — renders the scene and downloads the resulting MP4 file.

The dashboard renders at `-qh` (1080p60, post-ready quality) by default — see `QUALITY_FLAG` in `app.py` to change it.

### Adding a new video script

**Option A — write it directly:**

1. Create a new `.py` file in `videos_script/` with a `Scene` subclass, e.g.:

```python
from manim import *

class MyNewScene(Scene):
    def construct(self):
        ...
```

2. Refresh the dashboard page — the new script/scene appears automatically.
3. Click Play or Download.

**Option B — import an existing script:**

Click **+ Import Script** on the dashboard and choose a `.py` file — it's uploaded and saved directly into `videos_script/`, then the list refreshes automatically. (See [`prompt.md`](prompt.md) for a prompt you can give any AI to generate a script like this.)

### Rendering manually from the command line (without the dashboard)

```bash
.\.venv\Scripts\python.exe -m manim -ql videos_script/golden_ratio_spiral.py GoldenRatioSpiral
```

- `-ql` = low quality / fast preview (480p) — use this while iterating on a script
- `-qh` = high quality / final render (1080p60) — what the dashboard uses by default

### Example scripts included

Three polished, post-ready videos (1080p60, MathTex equations, smooth camera work, narrated with `VoiceoverScene` + gTTS):

- **`golden_ratio_spiral.py`** (`GoldenRatioSpiral`) — Fibonacci squares build up one by one with a camera that tracks their growth, a decorative golden spiral sweeps through them, ending on `φ = (1+√5)/2 ≈ 1.618`.
- **`pythagorean_rearrangement.py`** (`PythagoreanRearrangement`) — a "proof without words": four triangles pinwheel around a tilted `c²` square, then smoothly translate (no rotation) into two exposed squares, `a²` and `b²`, revealing `a² + b² = c²`.
- **`euler_identity.py`** (`EulerIdentity`) — a point traces the unit circle as `e^{iθ}` rotates from `0` to `π`, live-updating the formula and angle value, landing exactly on `-1` to reveal `e^{iπ} + 1 = 0`.

All three were verified by rendering and visually inspecting multiple frames (not just checking for render errors) before the final high-quality pass — worth doing for any script with precise geometry (shape rearrangements, camera framing, `always_redraw` + `Transform` interactions) since those bugs don't show up as exceptions, only as wrong pixels.