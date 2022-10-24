import {
  ProjectCreateData,
  ProjectGraphRecord,
  ProjectRecord,
  ProjectShareData,
  UserRecord,
  VideoRecord,
} from "@celluloid/types";
import { isProjectOwner, isTeacher } from "auth/Utils";
import { Router } from "express";
import * as ProjectStore from "store/ProjectStore";
import * as bcrypt from "bcrypt";

import AnnotationsApi from "./AnnotationApi";
import { getOneVideoIdFromVideo, tryDeleteVideo } from "store/VideoStore";

const router = Router({ mergeParams: true });

router.use("/:projectId/annotations", AnnotationsApi);

function fetchMembers(
  project: ProjectRecord,
  user?: UserRecord
): PromiseLike<UserRecord[]> {
  if (project.collaborative || (user && user.id === project.userId)) {
    return ProjectStore.selectProjectMembers(project.id);
  } else if (user) {
    return ProjectStore.isMember(project.id, user).then((member) =>
      member ? Promise.resolve([user]) : Promise.resolve([])
    );
  } else {
    return Promise.resolve([]);
  }
}

router.get("/", (req, res) => {
  return ProjectStore.selectAll(req.user as UserRecord)
    .then((projects: ProjectGraphRecord[]) =>
      Promise.all(
        projects.map((project) =>
          fetchMembers(project, req.user as UserRecord).then(
            (members: UserRecord[]) => ({ ...project, members })
          )
        )
      )
    )
    .then((result: ProjectGraphRecord[]) => res.json(result))
    .catch((error: Error) => {
      // tslint:disable-next-line:no-console
      console.error("Failed to fetch projects from database:", error);
      return res.status(500).send();
    });
});

router.get("/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const user = req.user as UserRecord;
  ProjectStore.selectOne(projectId, user)
    .then((project: ProjectGraphRecord) => {
      return res.json(project);
    })
    .catch((error: Error) => {
      // tslint:disable-next-line:no-console
      console.error(`Failed to fetch project ${projectId}:`, error);
      if (error.message === "ProjectNotFound") {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).send();
      }
    });
});

router.post("/", isTeacher, (req, res) => {
  const user = req.user as UserRecord;
  const project = req.body as ProjectCreateData;
  ProjectStore.insert(project, user)
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((error: Error) => {
      // tslint:disable-next-line:no-console
      console.error("Failed to create project:", error);
      return res.status(500).send();
    });
});

router.put("/:projectId", isTeacher, isProjectOwner, (req, res) => {
  ProjectStore.update(req.body, req.params.projectId)
    .then((result) => res.status(200).json(result))
    .catch((error) => {
      // tslint:disable-next-line:no-console
      console.error("Failed to update project:", error);
      return res.status(500).send();
    });
});

router.delete("/:projectId", isTeacher, isProjectOwner, (req, res) => {
  ProjectStore.selectOne(req.params.projectId, req.user as UserRecord).then(
    (project) => {
      ProjectStore.del(req.params.projectId)
        .then(() => {
          tryDeleteVideo((project as ProjectCreateData).video as VideoRecord);
          return res.status(204).send();
        })
        .catch((error) => {
          console.error("Failed to delete project:", error);
          return res.status(500).send();
        });
    }
  );
});

router.get("/:projectId/members", (req, res) => {
  const projectId = req.params.projectId;
  const user = req.user as UserRecord;
  ProjectStore.selectOne(projectId, user)
    .then((project: ProjectGraphRecord) =>
      fetchMembers(project, req.user as UserRecord)
    )
    .then((members) => res.status(200).json(members))
    .catch((error) => {
      console.error("Failed to list project members:", error);
      if (error.message === "ProjectNotFound") {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).send();
      }
    });
});

router.put("/:projectId/share", isTeacher, isProjectOwner, (req, res) => {
  const projectId = req.params.projectId;
  ProjectStore.shareById(projectId, req.body)
    .then(() => ProjectStore.selectOne(projectId, req.user as UserRecord))
    .then((project) => res.status(200).json(project))
    .catch((error) => {
      console.error(`Failed to share project with id ${projectId}:`, error);
      return res.status(500).send();
    });
});

router.delete("/:projectId/share", isTeacher, isProjectOwner, (req, res) => {
  const projectId = req.params.projectId;
  ProjectStore.unshareById(projectId)
    .then(() => ProjectStore.selectOne(projectId, req.user as UserRecord))
    .then((project) => res.status(200).json(project))
    .catch((error) => {
      console.error(`Failed to unshare project with id ${projectId}:`, error);
      return res.status(500).send();
    });
});

router.put("/:projectId/public", isTeacher, isProjectOwner, (req, res) => {
  const projectId = req.params.projectId;
  ProjectStore.setPublicById(projectId, true)
    .then(() => ProjectStore.selectOne(projectId, req.user as UserRecord))
    .then((project) => res.status(200).json(project))
    .catch((error) => {
      console.error(
        `Failed to set project public with id ${projectId}:`,
        error
      );
      return res.status(500).send();
    });
});

router.delete("/:projectId/public", isTeacher, isProjectOwner, (req, res) => {
  const projectId = req.params.projectId;
  ProjectStore.setPublicById(projectId, false)
    .then(() => ProjectStore.selectOne(projectId, req.user as UserRecord))
    .then((project) => res.status(200).json(project))
    .catch((error) => {
      console.error(
        `Failed to unset public on project with id ${projectId}:`,
        error
      );
      return res.status(500).send();
    });
});

router.put(
  "/:projectId/collaborative",
  isTeacher,
  isProjectOwner,
  (req, res) => {
    const projectId = req.params.projectId;
    return ProjectStore.setCollaborativeById(projectId, true)
      .then(() => ProjectStore.selectOne(projectId, req.user as UserRecord))
      .then((project) => res.status(200).json(project))
      .catch((error) => {
        console.error(
          `Failed to unset collaborative on project with id ${projectId}:`,
          error
        );
        return res.status(500).send();
      });
  }
);

router.delete(
  "/:projectId/collaborative",
  isTeacher,
  isProjectOwner,
  (req, res) => {
    const projectId = req.params.projectId;
    return ProjectStore.setCollaborativeById(projectId, false)
      .then(() => ProjectStore.selectOne(projectId, req.user as UserRecord))
      .then((project) => res.status(200).json(project))
      .catch((error) => {
        console.error(
          `Failed to unset collaborative on project with id ${projectId}:`,
          error
        );
        return res.status(500).send();
      });
  }
);

router.put("/:projectId/metadata", isTeacher, isProjectOwner, (req, res) => {
  const projectId = req.params.projectId;
  getOneVideoIdFromVideo(projectId)
    .then((json) => {
      ProjectStore.updataMetaData(json.videoId, req.body);
    })
    .then(() => res.status(200).json("OK"))
    .catch((error) => {
      // tslint:disable-next-line:no-console
      console.error("Failed to update video:", error);
      return res.status(500).send();
    });
});

router.post("/join/:shareCode", (req, res) => {
  const user = req.user as UserRecord;
  const parts: string[] = req.params.shareCode.split("-");
  if (
    parts.length != 3 ||
    parts[0] === "" ||
    parts[1] === "" ||
    parts[2] === ""
  ) {
    return res.status(500).send();
  }
  const sharePassword = parts.slice(-2).join("-");
  const shareName = parts.slice(0, -1).slice(0, -1).join("-");
  return ProjectStore.selectOneByShareName(shareName)
    .then((project: ProjectGraphRecord | undefined) => {
      if (
        project &&
        bcrypt.compareSync(
          sharePassword,
          (project as ProjectShareData).sharePassword
        )
      ) {
        if (user.id === project.userId) {
          return res.status(503).send();
        }
        ProjectStore.insertMember(user.id, project.id)
          .then(() => {
            return res.status(201).send();
          })
          .catch(() => {
            return res.status(503).send();
          });
      } else {
        return res.status(500).send();
      }
    })
    .catch((error: Error) => {
      console.error(error);
      return res.status(500).send();
    });
});

export default router;
