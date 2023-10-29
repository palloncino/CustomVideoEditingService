const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const multer = require("multer");

const upload = multer({ dest: "../uploads/" });
const router = express.Router();

// +-INFO------------------------------------------------------+
// | /video-upload | Make video squared 1:1 adding background. |
// +-----------------------------------------------------------+

// +-REQUEST---------------------------------------------------+
// | /POST ${base_url}/api/video-upload
// | Body type: form-data
// | 
// | Key: video, Value: *.mp4, *.mov (type: file)
// | (Optional) Key: bgcolor, Value: CSS color (type: text)
// +-----------------------------------------------------------+
router.post("/video-upload", upload.single("video"), (req, res, next) => {
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

module.exports = router;