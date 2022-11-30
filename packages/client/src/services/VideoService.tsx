import { VideoData } from '@celluloid/types';
import * as Constants from './Constants';
import axios from 'axios';
import store from '../index';

import { sendingUploadProgress } from 'actions/HomeActions';
import { Player } from '@celluloid/types/src/VideoTypes';

export default class Videos {
  static create(video: VideoData) {
    const headers = {
      Accepts: 'application/json',
      'Content-type': 'application/json',
    };
    return fetch('/api/video', {
      method: 'POST',
      headers: new Headers(headers),
      credentials: 'include',
      body: JSON.stringify(video), 
    }).then((response) => {
      if (response.status === 201 || response.status === 400) {
        return response.json();
      } else if (response.status === 200) {
        return response;
      } else if (response.status === 401) {
        throw new Error(Constants.ERR_NOT_LOGGED_IN);
      } else {
        throw new Error(Constants.ERR_UNAVAILABLE);
      }
    });
  }
  static upload(video: File): Promise<string> {
    let formData = new FormData();
    formData.append('videoFile', video, video.name);
  // console.log("sending file to server !! "+ video.name);
    return axios
      .post(`/api/video/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          store.dispatch(
            sendingUploadProgress(progressEvent.loaded / progressEvent.total)
          );
        },
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data.filename;
        } else {
           console.log('Error : ' + res.data);
        }
        throw new Error(
          `Could not perform Video API request (error ${res.status})`
        );
      });
  }
  static delete(player: Player, path: string) {
    const headers = {
      Accepts: 'application/json',
      'Content-type': 'application/json',
    };
    return fetch(`/api/video/${player}/${path}`, {
      method: 'DELETE',
      headers: new Headers(headers),
      credentials: 'include',
    }).then((response) => {
      if (response.status === 204 || response.status === 400) {
        return Promise.resolve();
      } else if (response.status === 401) {
        throw new Error(Constants.ERR_NOT_LOGGED_IN);
      } else if (response.status === 403) {
        throw new Error(Constants.ERR_UPDATE_PROJECT_AUTH);
      }
      throw new Error(Constants.ERR_UNAVAILABLE);
    });
  }
}
