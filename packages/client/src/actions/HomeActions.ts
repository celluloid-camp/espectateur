import { openSignup } from 'actions/Signin';
import { UserRecord } from '@celluloid/types';
import { Dispatch } from 'redux';
import YoutubeService from 'services/YoutubeService';
import {
  ActionType,
  AsyncAction,
  createAction,
  createEmptyAction,
  createErrorAction,
} from 'types/ActionTypes';
import { Video } from 'types/VideoPlayerTypes';
import VideoService from 'services/VideoService';
import ProjectService from 'services/ProjectService';
import { t } from 'i18next';
import { Player } from '@celluloid/types/src/VideoTypes';

function getVideoIdYoutube(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
      const parsed = new URL(url);
      const id = parsed.hostname.endsWith('youtu.be')
      ? parsed.pathname.replace(/\//, '')
      : parsed.searchParams.get('v');
      return id ? resolve(id) : reject(new Error(`No File Selected`));
    });
}

function getVideoFileName(video?: File): Promise<string> {
  return new Promise((resolve, reject) => {
    let filename = video ? VideoService.upload(video) : undefined;
    return (filename ? resolve(filename) : reject());
  });
}

function getVideoIdLocal(filename: string): string {
  for (let i = filename.length; i > 0; i--) {
    if (filename[i] === '.') {
      return filename.substring(0, i);
    }
  }
  return filename;
}

export const failLoadVideo = (error: string) =>
  createErrorAction(ActionType.FAIL_LOAD_VIDEO, error);

export const succeedLoadVideo = (video: Video) =>
  createAction(ActionType.SUCCEED_LOAD_VIDEO, video);

export const loadVideoThunk = (player: string, url: string, user?: UserRecord, video?: File) => (dispatch: Dispatch):
  AsyncAction<Video, string> => {
    switch (player) {
      case 'Peertube': 
        {
          return getVideoIdYoutube(url)
          .then(id =>
            YoutubeService.getVideoNameById(id)
              .then((videoTitle: string) => {
                if (!user || user.role !== 'Teacher') {
                  dispatch(openSignup());
                }
                VideoService.create({
                  title: videoTitle,
                  player: 'Peertube',
                  path: id
                }).catch((error: Error) => {
                  return dispatch(failLoadVideo(error.message));
                });
                return dispatch(succeedLoadVideo({
                  id,
                  title: videoTitle,
                  thumbnailUrl: `http://img.youtube.com/vi/${id}/0.jpg`,
                  player: 'Peertube'
                }));
              })
          )
          .catch(() => dispatch(failLoadVideo(t('home.invalidLink'))));
        }
        break;
      case 'Local': 
        {
          return getVideoFileName(video)
          .then(filename =>
              VideoService.create({
              title: video ? getVideoIdLocal(video.name) : '',
              player: 'Local',
              path: getVideoIdLocal(filename)
            }).then(() => {
              return dispatch(succeedLoadVideo({
                id: getVideoIdLocal(filename),
                title: video ? getVideoIdLocal(video.name) : '',
                thumbnailUrl: `/api/video/${getVideoIdLocal(filename)}/image`,
                player: 'Local'
              }));
            })).catch((error: Error) => {
              if (error) {
                return dispatch(failLoadVideo(t('home.invalidVideoFile')));
              } else {
                return dispatch(failLoadVideo(t('home.noFileSelected')));
              }
            });
        } 
        break;
      default: 
        {
          throw new Error(t('home.invalidPlayer'));
        }
    }
  };

export const discardNewVideo = (player: Player, path: string) => {
  VideoService.delete(player, path);
  return createEmptyAction(ActionType.DISCARD_NEW_VIDEO);
};

export const sendingUploadProgress = (time: number) =>
  createAction(ActionType.UPLOAD_PROGRESS, time);

export const openJoinProject = () =>
  createEmptyAction(ActionType.OPEN_JOIN_PROJECT);

export const closeJoinProject = () =>
  createEmptyAction(ActionType.CANCEL_JOIN_PROJECT);

export const failJoinProject = (error: string) =>
createErrorAction(ActionType.FAIL_JOIN_PROJECT, error);

export const succeedJoinProject = () =>
  createEmptyAction(ActionType.SUCCEED_JOIN_PROJECT);

export const joinProject = (shareCode?: string) => (dispatch: Dispatch):
  Promise<void> => {
    return ProjectService.joinProject(shareCode)
     .then(() => {
      dispatch(succeedJoinProject());
     })
     .catch((error: Error) => {
      dispatch(failJoinProject(error.message));
     });
   };