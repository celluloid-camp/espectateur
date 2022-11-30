import { ActionType } from 'types/ActionTypes';
import { AnyAction } from 'redux';
import { HomeState } from 'types/StateTypes';

const initialState = {
  errors: {
    video: undefined,
    projects: undefined,
    createProject: undefined,
    joinProject: undefined
  },
  projects: [],
  video: undefined,
  createProjectLoading: false,
  loadingTime: 0,
  openJoinProject: false
} as HomeState;

export default (state = initialState, { type, payload }: AnyAction):
  HomeState => {
  switch (type) {
    case ActionType.SUCCEED_UPSERT_PROJECT:
      return {
        ...state,
        errors: {
          ...state.errors,
          video: undefined,
          createProject: undefined
        },
        video: undefined,
        createProjectLoading: false,
      };
    case ActionType.FAIL_UPSERT_PROJECT:
      return {
        ...state,
        errors: {
          ...state.errors,
          createProject: payload
        },
        createProjectLoading: false
      };
    case ActionType.TRIGGER_UPSERT_PROJECT_LOADING:
      return {
        ...state,
        createProjectLoading: true
      };
    case ActionType.FAIL_LOAD_VIDEO:
      return {
        ...state,
        errors: {
          ...state.errors,
          video: payload
        },
        video: undefined,
      };
    case ActionType.SUCCEED_LOAD_VIDEO:
      return {
        ...state,
        errors: {
          ...state.errors,
          video: undefined
        },
        video: payload
      };
    case ActionType.SUCCEED_LIST_PROJECTS:
      return {
        ...state,
        errors: {
          ...state.errors,
          projects: undefined,
        },
        projects: payload
      };
    case ActionType.DISCARD_NEW_VIDEO:
      return {
        ...state,
        errors: {
          ...state.errors,
          video: undefined
        },
        video: undefined
      };
    case ActionType.FAIL_LIST_PROJECTS:
      return {
        ...state,
        errors: {
          ...state.errors,
          projects: payload
        },
        projects: []
      };
    case ActionType.UPLOAD_PROGRESS:
      return  {
        ...state,
        loadingTime: payload
      };
    case ActionType.OPEN_JOIN_PROJECT:
      return  {
        ...state,
        openJoinProject: true
      };
    case ActionType.CANCEL_JOIN_PROJECT:
      return  {
        ...state,
        openJoinProject: false
      };
    case ActionType.FAIL_JOIN_PROJECT:
      return {
        ...state,
        errors: {
          ...state.errors,
          joinProject: payload
        }
      };
    case ActionType.SUCCEED_JOIN_PROJECT:
      return  {
        ...state,
        openJoinProject: false
      };
    default:
      return state;
  }
};