const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "../uploads/" });
const router = express.Router();

// +-INFO------------------------------------------------------+
// | /video-upload | Make video squared 1:1 adding background. |
// +-----------------------------------------------------------+

// +-REQUEST---------------------------------------------------+
// | /POST ${base_url}/api/video-upload                        |
// | Body type: form-data                                      |
// |                                                           |
// | Key: video, Value: *.mp4, *.mov (type: file)               |
// | (Optional) Key: bgcolor, Value: CSS color (type: text)    |
// +-----------------------------------------------------------+
router.post("/video-upload", upload.single("video"), (req, res, next) => {
  const videoPath = req.file.path; 
  const bgColor = req.body.bgcolor;

  const outputDirectory = path.join(__dirname, "temp");
  const outputPath = path.join(outputDirectory, "processed_video.mp4");
  
  // videoPath: ../uploads/d5b8297805c765f4517620f081ac4158
  // outputPath: /Users/user01/folder01/CustomVideoEditingService/api/temp/processed_video.mp4

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  try {
    // Set PATHs - make sure you installed ffmpeg on your machine | replace with your paths
    ffmpeg.setFfmpegPath("/usr/local/bin/ffmpeg");
    ffmpeg.setFfprobePath("/usr/local/bin/ffprobe");

    const command = ffmpeg(videoPath)
      .addOptions([
        `-filter_complex`,
        `scale='iw*sar':'ih',pad='max(iw\\,ih)':'max(iw\\,ih)':'(ow-iw)/2':'(oh-ih)/2':${
          bgColor || "black"
        }`,
        `-f mp4`,
        `-y`,
      ])
      .output(outputPath)
      .on("start", function (commandLine) {
        console.log("Spawned FFmpeg with command: " + commandLine);
      })
      .on("error", function (err, stdout, stderr) {
        console.error("Error:", err.message);
        console.error("ffmpeg stdout:", stdout);
        console.error("ffmpeg stderr:", stderr);
      })
      .on("end", function () {
        fs.readFile(outputPath, (err, data) => {
          if (err) {
            console.error("Error reading file:", err.message);
            res.status(500).send(err.message);
          } else {
            const base64 = data.toString("base64");
            res.set({
              "Content-Type": "text/plain",
              "Content-Disposition": "attachment; filename=processed_video.txt",
            });
            res.send(base64);
            fs.unlink(outputPath, (err) => {
              if (err)
                console.error("Error deleting temporary file:", err.message);
            });
          }
        });
      });
    command.run();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
