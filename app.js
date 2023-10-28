const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const upload = multer({ dest: "uploads/" });

const app = express();
const router = express.Router();

app.use(router);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

router.get("/", function (req, res, next) {
  res.json({ title: "server running" });
});

const options = ["-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2"];

app.post("/api/video-upload", upload.single("video"), (req, res, next) => {
  const videoPath = req.file.path;
  try {
    let ffmpegOutcome = "";
    ffmpeg(videoPath)
      .outputOptions(options)
      .saveToFile("output.mp4", (error, info) => {
        if (info) {
          ffmpegOutcome = info;
        }
        if (error) {
          ffmpegOutcome = error;
        }
      });
    res.status(200).send({ ffmpegOutcome });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;
