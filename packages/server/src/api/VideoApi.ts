import * as express from "express";
import { VideoData, VideoRecord } from "@celluloid/types";
import { isTeacher } from "auth/Utils";
import {
  insertVideo,
  hasAccessToVideo,
  isTeacherOrHasAccessToVideo,
  tryDeleteVideo,
  selectOne,
} from "store/VideoStore";
import * as multer from "multer";
//import { forEachObjIndexed } from "ramda";

var path = require("path");
var uuid = require("uuid");
var ffmpeg = require("ffmpeg");

const fs = require("fs");
const router = express.Router({ mergeParams: true });

let pathToVideoDir: string = process.env.CELLULOID_VIDEO_STORAGE_PATH;

if (!fs.existsSync(pathToVideoDir)) {
  fs.mkdirSync(pathToVideoDir);
}else{
  console.log("Folder storage videos exists in local");
  
}

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, process.env.CELLULOID_VIDEO_STORAGE_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".mp4" &&
      ext !== ".mkv" &&
      ext !== ".mts" &&
      ext !== ".wmv" &&
      ext !== ".avi" &&
      ext !== ".flv" &&
      ext !== ".m4a" &&
      ext !== ".mov" &&
      ext !== ".ogv" &&
      ext !== ".webm" &&
      ext !== ".m4v"
    ) {
      return callback(new Error());
    }
    callback(null, true);
  },
}).single("videoFile");

router.post("/", isTeacher, (req, res) => {
  const video = req.body as VideoData;
  insertVideo(video)
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((error: Error) => {
      if (error.stack.substring(55, 79) == "Video_path_player_unique") {
        console.error(
          "Video already in database, no insert needed:",
          error.message
        );
        return res.status(200);
      } else return res.status(500);
    });
});

router.post("/upload", isTeacher, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(400);
    } else {
      
      const file_extension: string = path.extname(req.file.path);
      const file_name: string = path.basename(req.file.path, file_extension);

      let videoProcess = new ffmpeg(req.file.path);
      
      videoProcess.then(
        (video) => {
          video.fnExtractFrameToJPG(
            process.env.CELLULOID_IMAGE_STORAGE_PATH,
            {
              frame_rate: 1,
              number: 1,
              file_name,
            },
            function (error, files) {
              if (!error) {
                console.log("Frames: " + files);
                return res.json({
                  filename: req.file.filename,
                });
              }
            }
          );
        },
        function (err) {
          console.error("Error: " + err);
        }
      );
      
      videoProcess.then(
        (video) => {
          
          if (
            file_extension == ".webm" ||
            video.metadata.video.codec == "vp8" ||
            video.metadata.audio.codec == "vorbis"
          ) {
            
            if (file_extension == ".webm") {
              video.setVideoFormat("webm");
            }
            if (video.metadata.video.codec == "vp8") {
              video.addCommand("-c:v", "libvpx");
              video.addCommand("-b:v", video.metadata.video.bitrate + "K");
            }
            if (video.metadata.audio.codec == "vorbis") {
              video.addCommand("-c:a", "libvorbis");
              video.addCommand("-b:a", video.metadata.audio.bitrate + "k");
            }
            
            video.save(
              process.env.CELLULOID_VIDEO_STORAGE_PATH +
                "/" +
                file_name +
                file_extension,
              function (error, file) {
                if (!error) {
                  console.log("Video file: " + file);
                  
                  fs.unlink(
                    process.env.CELLULOID_VIDEO_STORAGE_PATH +
                    "/" +
                      file_name +
                      file_extension,
                    (err) => {
                      if (!err) {
                        console.log("Old file deleted");
                      } else {
                        console.error(err);
                      }
                    }
                  );
                  selectOne("Local", file_name)
                    .then((video: VideoRecord) => {
                      if (!video) {
                        fs.unlink(
                          process.env.CELLULOID_VIDEO_STORAGE_PATH +
                            "/" +
                            file_name +
                            file_extension,
                          (err) => {
                            if (!err) {
                              console.log(
                                "Video deleted because of cancelation."
                              );
                            } else {
                              console.error(err);
                            }
                          }
                        );
                      }
                    })
                    .catch((error: Error) => {
                      console.error(error);
                    });
                } else {
                  console.log("==>");
                  console.log(error);
                }
              }
            );
          }
        },
        function (err) {
          console.error("Error: " + err);
        }
      );
    }
  });
});

router.get("/:path", hasAccessToVideo, (req, res) => {
  let hasVideo: boolean = false;
  let file_id = 0;
  fs.readdir(process.env.CELLULOID_VIDEO_STORAGE_PATH, function (err, files) {
    if (err) console.error("Could not list the directory:", err);
    for (let i = 0; i < files.length; i++)
      if (files[i].includes(req.params.path)) { hasVideo = true; file_id = files[i]; break;}
    if (hasVideo) {
      
      return fs.open(
        process.env.CELLULOID_VIDEO_STORAGE_PATH +
          
          file_id,
        "r+",
        function (err, fd) {
          if (err) {
            console.error(err);
            return res.status(500).send();
          } else {
            return fs.close(fd, function () {
              fs.rename(
                process.env.CELLULOID_VIDEO_STORAGE_PATH +
                  file_id,
                process.env.CELLULOID_VIDEO_STORAGE_PATH +
                  file_id,
                function (err) {
                  if (err) {
                    console.error(err);
                    return res.status(500).send();
                  } else {
                    return res
                      .status(200)
                      .sendFile(
                        process.env.CELLULOID_VIDEO_STORAGE_PATH +
                          file_id
                      );
                  }
                }
              );
            });
          }
        }
      );
    } else {
      console.error("Could not find the video:", err);
      return res.status(500).send();
    }
  });
});

router.get("/:path/image", isTeacherOrHasAccessToVideo, (req, res) => {
  let hasImage: boolean = false;
  fs.readdir(process.env.CELLULOID_IMAGE_STORAGE_PATH, function (err, files) {
    if (err) console.error("Could not list the directory:", err);
    for (let i = 0; i < files.length; i++)
      if (files[i] == req.params.path + "_1.jpg") hasImage = true;
    if (hasImage) {
      return res
        .status(200)
        .sendFile(
          process.env.CELLULOID_IMAGE_STORAGE_PATH +
            "/" +
            req.params.path +
            "_1.jpg"
        );
    } else {
      setTimeout(() => {
        return fs.readdir(
          process.env.CELLULOID_IMAGE_STORAGE_PATH,
          function (err, files) {
            if (err)
              console.error("Could not list the directory (2nd attempt):", err);
            for (let i = 0; i < files.length; i++) {
              if (files[i] == req.params.path + "_1.jpg") {
                return res
                  .status(200)
                  .sendFile(
                    process.env.CELLULOID_IMAGE_STORAGE_PATH +
                      "/" +
                      req.params.path +
                      "_1.jpg"
                  );
              }
            }
            console.error("Could not find the image:", err);
            return res.status(500).send();
          }
        );
      }, 3000);
    }
  });
});

router.delete("/:player/:path", isTeacher, (req, res) => {
  selectOne(req.params.player, req.params.path)
    .then((video: VideoRecord) => {
      tryDeleteVideo(video);
      return res.status(204).send();
    })
    .catch((error: Error) => {
      console.error(error);
    });
});

export default router;
