# Video Studio — single-container image bundling both render engines:
#   - Manim (Python) needs FFmpeg + a LaTeX distribution for MathTex/Tex.
#   - HyperFrames (Node) needs FFmpeg + headless Chrome's runtime libraries
#     (Puppeteer's bundled Chromium, not the nested "--docker" render mode,
#     which needs its own Docker daemon and isn't used by this project).
#
# NOT verified by an actual build in development — written from documented,
# known-good dependency lists (Manim's own Docker image, Puppeteer's Linux
# Chrome dependency list). Build and test this before trusting it in
# production; if Chrome fails to launch, that's the most likely gap to debug
# first (container sandboxing/missing libs).

FROM python:3.12-slim-bookworm

# --- Node.js 22 (for the HyperFrames CLI) -----------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends curl gnupg ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# --- FFmpeg, LaTeX (Manim), build deps (pycairo/manimpango), headless Chrome
#     runtime libraries (HyperFrames/Puppeteer) ------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    build-essential pkg-config \
    libcairo2-dev libpango1.0-dev \
    texlive texlive-latex-extra texlive-fonts-extra texlive-science texlive-extra-utils tipa \
    fonts-liberation \
    libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libdrm2 \
    libgbm1 libgtk-3-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libxshmfence1 xdg-utils wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download/cache the pinned HyperFrames CLI package (and let it fetch its
# bundled Chromium) at build time, so the first real render in production
# doesn't pay that cost or depend on outbound network access at request time.
RUN npx --yes hyperframes@0.9.23 --version

COPY . .

ENV PORT=5000
EXPOSE 5000

# --workers 1 is REQUIRED, not a tuning choice: the render queue (app.py) is
# an in-process queue.Queue plus a single background worker thread. More than
# one gunicorn worker process would each get its own separate queue and job
# dict, silently breaking job tracking (a status poll could land on a worker
# process that never ran that job). --threads lets this one worker still
# handle multiple concurrent HTTP requests (enqueue + status polls) without
# serializing on the request layer — the actual rendering work happens in the
# background thread, not inside any request handler, so this is safe.
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:${PORT} --workers 1 --worker-class gthread --threads 4 --timeout 180 app:app"]
