import {
  VideoData,
  ProjectRecord,
  VideoRecord,
  Player,
  UserRecord,
} from "@celluloid/types";
import { database, getExactlyOne } from "backends/Database";
import { NextFunction, Request, Response } from "express";
import { selectAllFromVideo, selectAll } from "./ProjectStore";
const fs = require("fs");

export function getOneVideoId(video: VideoData) {
  const query = () =>
    database
      .select(database.raw('"Video".id'))
      .from("Video")
      .where("player", video.player)
      .andWhere("Video.path", video.path)
      .first();
  return query();
}

export function getOneVideoIdFromVideo(id: string) {
  const query = () =>
    database.select("Project.videoId").from("Project").where("id", id).first();
  return query();
}

export function insertVideo(video: VideoData) {
  const query = () =>
    database("Video")
      .insert({
        id: database.raw("uuid_generate_v4()"),
        title: video.title,
        player: video.player,
        path: video.path,
      })
      .returning("*")
      .then(getExactlyOne);
  return query();
}

export function hasAccessToVideo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let access = false;
  selectAllFromVideo(req.params.path, "Local")
    .map((project) => {
      if (project.public === true) {
        access = true;
      }
      return project.id;
    })
    .then((ids: string[]) => {
      if (!req.user && !access) {
        console.error("User must be authenticated");
        return null;
        Promise.resolve(
          res.status(401).json({
            error: "AuthenticationRequired",
          })
        );
      } else if (!access) {
        selectAll(req.user as UserRecord)
          .map((project) => {
            return project.id;
          })
          .then((userProjectsIds: string[]) => {
            for (let i = 0; i < userProjectsIds.length; i++) {
              if (ids.includes(userProjectsIds[i])) {
                access = true;
              }
            }
            if (access) {
              return Promise.resolve(next());
            } else {
              console.error(
                "User must have access to a project which contain this video"
              );
              return null;
              Promise.resolve(
                res.status(403).json({
                  error: "AccessRequired",
                })
              );
            }
          });
      } else {
        return Promise.resolve(next());
      }
    });
}

export function isTeacherOrHasAccessToVideo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user && (req.user as UserRecord).role === "Teacher") {
    return Promise.resolve(next());
  } else {
    hasAccessToVideo(req, res, next);
  }
}

export function del(videoId: string) {
  return database("Video").where("id", videoId).del();
}

export function tryDeleteVideo(video: VideoRecord) {
  selectAllFromVideo(video.path, video.player).then(
    (projects: ProjectRecord[]) => {
      if (projects && projects.length === 0) {
        del(video.id)
          .then(() => {
            console.log("Video deleted from database.");
            if (video.player === "Local") {
              fs.unlink(
                process.env.CELLULOID_VIDEO_STORAGE_PATH +
                  "/" +
                  video.path +
                  ".mp4",
                (err) => {
                  if (!err) {
                    console.log("Video file deleted.");
                  } else if (err.code === "EBUSY") {
                    console.log(
                      "File is actualy busy, it will be deleted later."
                    );
                  } else {
                    console.error(err);
                  }
                }
              );
              fs.unlink(
                process.env.CELLULOID_IMAGE_STORAGE_PATH +
                  "/" +
                  video.path +
                  "_1.jpg",
                (err) => {
                  if (!err) {
                    console.log("Video thumbnail deleted.");
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
        console.error("Other project use this video, it can not be deleted.");
        return;
      }
    }
  );
}

export function selectOne(player: Player, path: string) {
  const query = () =>
    database
      .select(database.raw('"Video".*'))
      .from("Video")
      .where("player", player)
      .andWhere("Video.path", path)
      .first();
  return query();
}
