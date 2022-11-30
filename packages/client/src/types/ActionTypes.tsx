import { Action as ReduxAction } from 'redux';

export enum ActionType {

  APPLICATION_UPDATED = 'APPLICATION_UPDATED',
  OPEN_LOGIN = 'OPEN_LOGIN',
  SUCCEED_LOGIN = 'SUCCEED_LOGIN',
  FAIL_LOGIN = 'FAIL_LOGIN',

  OPEN_SIGNUP = 'OPEN_SIGNUP',
  FAIL_SIGNUP = 'FAIL_SIGNUP',
  OPEN_CONFIRM_SIGNUP = 'OPEN_CONFIRM_SIGNUP',
  FAIL_CONFIRM_SIGNUP = 'FAIL_CONFIRM_SIGNUP',
  SUCCEED_SIGNUP = 'SUCCEED_SIGNUP',

  OPEN_STUDENT_SIGNUP = 'OPEN_STUDENT_SIGNUP',
  FAIL_STUDENT_SIGNUP = 'FAIL_STUDENT_SIGNUP',
  SUCCEED_STUDENT_SIGNUP = 'SUCCEED_STUDENT_SIGNUP',

  OPEN_JOIN_PROJECT = 'OPEN_JOIN_PROJECT',
  SUCCEED_JOIN_PROJECT = 'SUCCEED_JOIN_PROJECT',
  CANCEL_JOIN_PROJECT = 'CANCEL_JOIN_PROJECT',
  FAIL_JOIN_PROJECT = 'FAIL_JOIN_PROJECT',

  OPEN_RESET_PASSWORD = 'OPEN_RESET_PASSWORD',
  FAIL_RESET_PASSWORD = 'FAIL_RESET_PASSWORD',
  OPEN_CONFIRM_RESET_PASSWORD = 'OPEN_CONFIRM_RESET_PASSWORD',
  FAIL_CONFIRM_RESET_PASSWORD = 'FAIL_CONFIRM_RESET_PASSWORD',
  SUCCEED_RESET_PASSWORD = 'SUCCEED_RESET_PASSWORD',

  CLOSE_SIGNIN = 'CLOSE_SIGNIN',
  TRIGGER_SIGNIN_LOADING = 'TRIGGER_SIGNIN_LOADING',

  FAIL_GET_CURRENT_USER = 'FAILED_CURRENT_USER',
  SUCCEED_GET_CURRENT_USER = 'SUCCESS_CURRENT_USER',

  FAIL_LOGOUT = 'FAIL_LOGOUT',

  FAIL_LOAD_VIDEO = 'FAIL_LOAD_VIDEO',
  SUCCEED_LOAD_VIDEO = 'SUCCEED_LOAD_VIDEO',
  DISCARD_NEW_VIDEO = 'DISCARD_NEW_VIDEO',

  FAIL_LIST_PROJECTS = 'FAIL_LIST_PROJECTS',
  SUCCEED_LIST_PROJECTS = 'SUCCEED_LIST_PROJECTS',

  TRIGGER_LIST_TAGS = 'TRIGGER_LIST_TAGS',
  FAIL_LIST_TAGS = 'FAIL_LIST_TAGS',
  SUCCEED_LIST_TAGS = 'SUCCEED_LIST_TAGS',
  TRIGGER_INSERT_TAG = 'TRIGGER_INSERT_TAG',
  SUCCEED_INSERT_TAG = 'SUCCEED_INSERT_TAG',
  FAIL_INSERT_TAG = 'FAIL_INSERT_TAG',

  CLEAR_PROJECT = 'CLEAR_PROJECT',

  FAIL_LOAD_PROJECT = 'LOAD_PROJECT',
  SUCCEED_LOAD_PROJECT = 'SUCCEED_LOAD_PROJECT',

  TRIGGER_UPSERT_PROJECT_LOADING = 'TRIGGER_UPSERT_PROJECT_LOADING',
  FAIL_UPSERT_PROJECT = 'FAIL_UPSERT_PROJECT',
  SUCCEED_UPSERT_PROJECT = 'SUCCEED_UPSERT_PROJECT',

  TRIGGER_DELETE_PROJECT_LOADING = 'TRIGGER_DELETE_PROJECT_LOADING',
  FAIL_DELETE_PROJECT = 'FAIL_DELETE_PROJECT',
  SUCCEED_DELETE_PROJECT = 'SUCCEED_DELETE_PROJECT',

  OPEN_SHARE_PROJECT = 'OPEN_SHARE_PROJECT',
  CANCEL_SHARE_PROJECT = 'CANCEL_SHARE_PROJECT',

  TRIGGER_SHARE_PROJECT_LOADING = 'TRIGGER_SHARE_PROJECT_LOADING',
  FAIL_SHARE_PROJECT = 'FAIL_SHARE_PROJECT',
  SUCCEED_SHARE_PROJECT = 'SUCCEED_SHARE_PROJECT',

  TRIGGER_UNSHARE_PROJECT_LOADING = 'TRIGGER_UNSHARE_PROJECT_LOADING',
  FAIL_UNSHARE_PROJECT = 'FAIL_UNSHARE_PROJECT',
  SUCCEED_UNSHARE_PROJECT = 'SUCCEED_UNSHARE_PROJECT',

  TRIGGER_SET_PROJECT_PUBLIC_LOADING = 'TRIGGER_SET_PROJECT_PUBLIC_LOADING',
  FAIL_SET_PROJECT_PUBLIC = 'FAIL_SET_PROJECT_PUBLIC',
  SUCCEED_SET_PROJECT_PUBLIC = 'SUCCEED_SET_PROJECT_PUBLIC',

  TRIGGER_SET_PROJECT_COLLABORATIVE_LOADING = 'TRIGGER_SET_PROJECT_COLLABORATIVE_LOADING',
  FAIL_SET_PROJECT_COLLABORATIVE = 'FAIL_SET_PROJECT_COLLABORATIVE',
  SUCCEED_SET_PROJECT_COLLABORATIVE = 'SUCCEED_SET_PROJECT_COLLABORATIVE',

  TRIGGER_LIST_ANNOTATIONS_LOADING = 'TRIGGER_LIST_ANNOTATIONS_LOADING',
  FAIL_LIST_ANNOTATIONS = 'FAIL_LIST_ANNOTATIONS',
  SUCCEED_LIST_ANNOTATIONS = 'SUCCEED_LIST_ANNOTATIONS',

  TRIGGER_FOCUS_ANNOTATION = 'TRIGGER_FOCUS_ANNOTATION',
  TRIGGER_BLUR_ANNOTATION = 'TRIGGER_BLUR_ANNOTATION',
  TRIGGER_EDIT_ANNOTATION = 'TRIGGER_EDIT_ANNOTATION',
  TRIGGER_ADD_ANNOTATION = 'TRIGGER_NEW_ANNOTATION',
  TRIGGER_CANCEL_ANNOTATION = 'TRIGGER_CANCEL_ANNOTATION',

  TRIGGER_UPSERT_ANNOTATION_LOADING = 'TRIGGER_UPSERT_ANNOTATION_LOADING',
  FAIL_UPSERT_ANNOTATION = 'FAIL_UPSERT_ANNOTATION',
  SUCCEED_ADD_ANNOTATION = 'SUCCEED_ADD_ANNOTATION',
  SUCCEED_UPDATE_ANNOTATION = 'SUCCEED_UPDATE_ANNOTATION',

  TRIGGER_LIST_COMMENTS_LOADING = 'TRIGGER_LIST_COMMENTS_LOADING',
  FAIL_LIST_COMMENTS = 'FAIL_LIST_COMMENTS',
  SUCCEED_LIST_COMMENTS = 'SUCCEED_LIST_COMMENTS',

  TRIGGER_DELETE_ANNOTATION_LOADING = 'TRIGGER_DELETE_ANNOTATION_LOADING',
  FAIL_DELETE_ANNOTATION = 'FAIL_DELETE_ANNOTATION',
  SUCCEED_DELETE_ANNOTATION = 'SUCCEED_DELETE_ANNOTATION',
  SWITCHING_ANNOTATION_SHOWING_MODE = 'SWITCHING_ANNOTATION_SHOWING_MODE',
  SWITCH_OWN_ANNOTATIONS = 'SWITCH_OWN_ANNOTATIONS',

  TRIGGER_UPSERT_COMMENT_LOADING = 'TRIGGER_UPSERT_COMMENT_LOADING',
  FAIL_UPSERT_COMMENT = 'FAIL_UPSERT_COMMENT',
  SUCCEED_ADD_COMMENT = 'SUCCEED_ADD_COMMENT',
  SUCCEED_UPDATE_COMMENT = 'SUCCEED_UPDATE_COMMENT',

  TRIGGER_DELETE_COMMENT_LOADING = 'TRIGGER_DELETE_COMMENT_LOADING',
  FAIL_DELETE_COMMENT = 'FAIL_DELETE_COMMENT',
  SUCCEED_DELETE_COMMENT = 'SUCCEED_DELETE_COMMENT',

  TRIGGER_EDIT_COMMENT = 'TRIGGER_EDIT_COMMENT',
  TRIGGER_ADD_COMMENT = 'TRIGGER_ADD_COMMENT',
  TRIGGER_CANCEL_EDIT_COMMENT = 'TRIGGER_CANCEL_EDIT_COMMENT',

  PLAYER_REQUEST_SEEK = 'PLAYER_REQUEST_SEEK',
  PLAYER_NOTIFY_SEEK = 'PLAYER_NOTIFY_SEEK',
  UPLOAD_PROGRESS = 'UPLOAD_PROGRESS',
  DATA_FEEDBACK = 'DATA_FEEDBACK',
  PLAYER_SWITCH_MODE = 'PLAYER_SWITCH_MODE',
  PLAYER_SWITCH_SEQUENCING = 'PLAYER_SWITCH_SEQUENCING'

}

export interface Action<T> extends ReduxAction {
  type: ActionType;
  payload?: T;
  error: boolean;
}

export interface EmptyAction extends Action<null> { }

export type AsyncAction<S, E> = Promise<Required<Action<S | E>>>;

export function createAction<P>(type: ActionType, payload: P):
  Required<Action<P>> {
  return { type, payload, error: false };
}

export function createOptionalAction<P>(type: ActionType, payload?: P):
  Action<P> {
  return { type, payload, error: false };
}

export function createEmptyAction(type: ActionType):
  EmptyAction {
  return { type, error: false };
}

export function createErrorAction<P>(type: ActionType, payload: P):
  Required<Action<P>> {
  return { type, payload, error: true };
}