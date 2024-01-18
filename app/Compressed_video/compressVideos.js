const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

// Define input and output folders
const inputFolder = "input_videos";
const outputFolder = "compressed_videos";

// Create output folder if it doesn't exist
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Function to compress videos
function compressVideos(videoPaths) {
  videoPaths.forEach((videoPath) => {
    const videoName = path.basename(videoPath);
    const compressedVideoPath = path.join(outputFolder, videoName);

    ffmpeg()
      .input(videoPath)
      .outputOptions("-crf 28") // Adjust compression quality (lower value means higher quality)
      .output(compressedVideoPath)
      .on("end", () => {
        console.log(`Compression of ${videoName} complete.`);
      })
      .on("error", (err) => {
        console.error(`Error compressing ${videoName}: ${err.message}`);
      })
      .run();
  });
}

// List of input video paths (modify this according to your use case)
const inputVideoPaths = ["input_videos/video1.mp4"];

compressVideos(inputVideoPaths);
