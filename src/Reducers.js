import { combineReducers } from 'redux';
import * as types from './Constants';

const initialState = {
  npcHealth: 100,
  npcState: { state: 0, ticksPerFrame: 10, direction: 0, repeat: true }
};

const npsStates = {
  jabLeft: { state: 1, ticksPerFrame: 10, direction: 0, repeat: true },
  crossLeft: { state: 2, ticksPerFrame: 10, direction: 0, repeat: false }
};

const npcHealth = (state = initialState.npcHealth, action) => {
  switch (action.type) {
    case types.REDUCE_NPC_HEALTH:
      return action.payload;
    default:
      return state;
  }
};

const npcState = (state = initialState.npcState, action) => {
  switch (action.type) {
    case types.SET_NPC_STATE:
      return action.payload;
    default:
      return state;
  }
};

const npcStateSaga = (state = initialState.npcState, action) => {
  switch (action.type) {
    case types.SET_JAB_LEFT_STATE:
      return npsStates.jabLeft;
    case types.SET_CROSS_LEFT_STATE:
      return npsStates.crossLeft;
    case types.SET_SAGA_STATE:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  npcHealth,
  npcState,
  npcStateSaga
});
