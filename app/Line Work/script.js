const width = 1600;
const height = 600;
const centerY = height / 2;
const amplitude = 0;
const speed = 150;
const degrees = 45;

let startTime = 0;
let previousTime = 0;
let pausedTime = 0;
let paused = false;
let canvas, ctx;
let charObjs;

const start = () => {
  canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d");

  document.body.appendChild(canvas);
  window.addEventListener("blur", () => {
    if (!paused) {
      paused = true;
      pausedTime = Date.now() - startTime;
    }
  });
  window.addEventListener("focus", () => {
    if (paused) {
      paused = false;
      startTime = Date.now() - pausedTime;
      animate();
    }
  });

  charObjs = initScrollText("LET'S CRAWL, WALK, AND SOAR TOGETHER.");

  startTime = Date.now();
  previousTime = getTime();
  animate();
};

const initScrollText = (text) => {
  ctx.font = " 32px Courier New";

  let position = 0;

  return text.split("").map((char) => {
    const width = ctx.measureText(char).width;
    const charObj = {
      char,
      width,
      position,
    };

    position += width;
    return charObj;
  });
};

const getTime = () => {
  return paused ? pausedTime : Date.now() - startTime;
};

const scrollText = (dt) => {
  ctx.fillStyle = "white";

  charObjs.forEach((charObj) => {
    charObj.position += dt * speed;

    if (charObj.position > width) {
      charObj.position = -charObj.width;
    }

    const y = Math.sin(charObj.position / degrees) * amplitude;

    ctx.fillText(charObj.char, charObj.position, centerY + y);
  });
};

const animate = () => {
  const now = getTime();
  const dt = (now - previousTime) * 0.001; // delta time in seconds.
  previousTime = now;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  scrollText(dt);

  if (!paused) {
    requestAnimationFrame(animate);
  }
};

start();
