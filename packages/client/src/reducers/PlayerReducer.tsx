import { AnyAction } from 'redux';
import { ActionType } from 'types/ActionTypes';
import { PlayerState } from 'types/StateTypes';

const initialState = {
  seeking: false,
  performance_mode: false,
  sequencing: false
} as PlayerState;

export default (state = initialState, { type, payload }: AnyAction): PlayerState => {
  switch (type) {
    case ActionType.PLAYER_NOTIFY_SEEK:
      return {
        ...state,
        seeking: false,
      };
    case ActionType.PLAYER_REQUEST_SEEK:
      return {
        ...state,
        seeking: true,
        seekTarget: payload,
      };
    case ActionType.PLAYER_SWITCH_MODE:
      return {
        ...state,
        performance_mode: !state.performance_mode 
      };
    case ActionType.PLAYER_SWITCH_SEQUENCING:
        return {
          ...state,
          sequencing: !state.sequencing
        };
    default:
      return state;
  }
};