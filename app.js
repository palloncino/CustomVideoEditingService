const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const upload = multer({ dest: "uploads/" });

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/video-upload", upload.single("video"), (req, res, next) => {
  const videoPath = req.file.path;
  const bgColor = req.body.bgcolor;
  try {
    ffmpeg.setFfmpegPath("/usr/local/bin/ffmpeg");
    ffmpeg.setFfprobePath("/usr/local/bin/ffprobe");
    ffmpeg(videoPath)
      .addOptions([
        `-filter_complex`,
        `scale='iw*sar':'ih',pad='max(iw\\,ih)':'max(iw\\,ih)':'(ow-iw)/2':'(oh-ih)/2':${
          bgColor || "black"
        }`,
      ])
      .on("start", function (commandLine) {
        console.log("Spawned FFmpeg with command: " + commandLine);
      })
      .on("error", function (err, stdout, stderr) {
        console.error("Error:", err.message);
        console.error("ffmpeg stdout:", stdout);
        console.error("ffmpeg stderr:", stderr);
      })
      .on("end", function (output) {
        console.log("Video processed:", output);
        res
          .status(200)
          .send({ message: "Video processed successfully", output });
      })
      .on("stderr", function (stderrLine) {
        console.log("Stderr output: " + stderrLine);
      })
      .on("stdout", function (stdoutLine) {
        console.log("Stdout output: " + stdoutLine);
      })
      .saveToFile("uploaded_video.mp4");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;
