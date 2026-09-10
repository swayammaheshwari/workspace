const { spawn } = require("child_process");
const readline = require("readline");
const path = require("path");

const curlScript = path.join(__dirname, "curl.sh");

function parseTodayTime(input) {
  const trimmed = input.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) {
    throw new Error('Invalid time. Use format HH:MM, e.g. "19:10".');
  }

  const [, hours, minutes, seconds = "0"] = match;
  const h = Number(hours);
  const m = Number(minutes);
  const s = Number(seconds);

  if (h > 23 || m > 59 || s > 59) {
    throw new Error("Invalid time. Hours, minutes, or seconds out of range.");
  }

  const target = new Date();
  target.setHours(h, m, s, 0);

  return target;
}

function runCurlScript() {
  console.log(`Running ${curlScript} at ${new Date().toLocaleString()}`);

  const child = spawn("bash", [curlScript], {
    cwd: __dirname,
    stdio: "inherit",
  });

  child.on("error", (err) => {
    console.error("Failed to run curl.sh:", err.message);
    process.exit(1);
  });

  child.on("close", (code) => {
    process.exit(code ?? 0);
  });
}

function schedule(timeInput) {
  let targetTime;

  try {
    targetTime = parseTodayTime(timeInput);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const delayMs = targetTime.getTime() - Date.now();

  if (delayMs <= 0) {
    console.error("That time has already passed today.");
    process.exit(1);
  }

  const delaySec = Math.round(delayMs / 1000);
  console.log(
    `Scheduled curl.sh for today at ${targetTime.toLocaleTimeString()} (in ${delaySec}s)`
  );

  setTimeout(runCurlScript, delayMs);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("input the time: ", (answer) => {
  rl.close();
  schedule(answer);
});
