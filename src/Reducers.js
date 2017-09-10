import { combineReducers } from 'redux';
import * as types from './Constants';

const initialState = {
  npcHealth: 100,
  npcStateSaga: { state: 0, ticksPerFrame: 20, direction: 0, repeat: false }
};

export const npcStates = {
  jabLeft: { state: 2, ticksPerFrame: 12, direction: 0, repeat: false },
  crossLeft: { state: 3, ticksPerFrame: 12, direction: 0, repeat: false },
  upperLeft: { state: 4, ticksPerFrame: 12, direction: 0, repeat: false },

  jabLeftPatternOne: { state: 2, ticksPerFrame: 12, direction: 0, repeat: false },
  crossLeftPatternOne: { state: 3, ticksPerFrame: 12, direction: 0, repeat: false },
  upperLeftPatternOne: { state: 4, ticksPerFrame: 12, direction: 0, repeat: false, sagaOrder: -1 },
};

const npcHealth = (state = initialState.npcHealth, action) => {
  switch (action.type) {
    case types.REDUCE_NPC_HEALTH:
      return action.payload;
    default:
      return state;
  }
};

const npcStateSaga = (state = initialState.npcStateSaga, action) => {
  switch (action.type) {
    case types.SET_JAB_LEFT_STATE:
      return npcStates.jabLeft;
    case types.SET_CROSS_LEFT_STATE:
      return npcStates.crossLeft;
    case types.SET_UPPERCUT_LEFT_STATE:
      return npcStates.upperLeft;
    case types.SET_JAB_LEFT_STATE_PATTERN_ONE:
      return npcStates.jabLeftPatternOne;
    case types.SET_CROSS_LEFT_STATE_PATTERN_ONE:
      return npcStates.crossLeftPatternOne;
    case types.SET_UPPERCUT_LEFT_STATE_PATTERN_ONE:
      return npcStates.upperLeftPatternOne;
    case types.SET_SAGA_STATE:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  npcHealth,
  npcStateSaga
});
