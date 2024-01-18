const { createFFmpeg } = require("@ffmpeg/ffmpeg");

const ffmpeg = createFFmpeg({
  log: true,
});

async function convertMovToMp4(inputFile) {
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "input.mov", await fetchFile(inputFile));
  await ffmpeg.run(
    "-i",
    "input.mov",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "22",
    "-c:a",
    "copy",
    "output.mp4"
  );
  const data = ffmpeg.FS("readFile", "output.mp4");
  return new Blob([data.buffer], { type: "video/mp4" });
}

async function fetchFile(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

// usage example
convertMovToMp4("path/to/input.mov")
  .then((outputFile) => {
    // do something with the converted file
  })
  .catch((error) => {
    console.error(error);
  });
