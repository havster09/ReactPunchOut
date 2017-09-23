import { combineReducers } from 'redux';
import * as types from './Constants';

const initialState = {
  npcHealth: 100,
  npcStateSaga: { state: 0, ticksPerFrame: 20, direction: 0, repeat: false },
  playerStateSaga: { state: 0, ticksPerFrame: 10, direction: 0, repeat: false }
};

export const npcStates = {
  stillLeft: { state: 0, ticksPerFrame: 200, direction: 0, repeat: false },
  jabLeft: { state: 2, ticksPerFrame: 12, direction: 0, repeat: false },
  jabLeftSecond: { state: 2, ticksPerFrame: 100, direction: 0, repeat: false },
  crossLeft: { state: 3, ticksPerFrame: 10, direction: 0, repeat: false },
  uppercutLeft: { state: 4, ticksPerFrame: [20,10,30], direction: 0, repeat: false },
  bodyJabLeft: { state: 5, ticksPerFrame: 6, direction: 0, repeat: false },
  stillRight: { state: 0, ticksPerFrame: 200, direction: 1, repeat: false },
  jabRight: { state: 2, ticksPerFrame: 12, direction: 1, repeat: false },
  jabRightSecond: { state: 2, ticksPerFrame: 100, direction: 1, repeat: false },
  crossRight: { state: 3, ticksPerFrame: 10, direction: 1, repeat: false },
  uppercutRight: { state: 4, ticksPerFrame: [20,10,30], direction: 1, repeat: false },
  bodyJabRight: { state: 5, ticksPerFrame: 6, direction: 1, repeat: false }
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
    case types.SET_STILL_LEFT_STATE:
      return npcStates.stillLeft;
    case types.SET_JAB_LEFT_STATE:
      return npcStates.jabLeft;
    case types.SET_JAB_LEFT_SECOND_STATE:
      return npcStates.jabLeftSecond;
    case types.SET_CROSS_LEFT_STATE:
      return npcStates.crossLeft;
    case types.SET_UPPERCUT_LEFT_STATE:
      return npcStates.uppercutLeft;
    case types.SET_BODY_JAB_LEFT_STATE:
      return npcStates.bodyJabLeft;
    case types.SET_STILL_RIGHT_STATE:
      return npcStates.stillRight;
    case types.SET_JAB_RIGHT_STATE:
      return npcStates.jabRight;
    case types.SET_JAB_RIGHT_SECOND_STATE:
      return npcStates.jabRightSecond;
    case types.SET_CROSS_RIGHT_STATE:
      return npcStates.crossRight;
    case types.SET_UPPERCUT_RIGHT_STATE:
      return npcStates.uppercutRight;
    case types.SET_BODY_JAB_RIGHT_STATE:
      return npcStates.bodyJabRight;
    case types.SET_SAGA_STATE:
      return action.payload;
    default:
      return state;
  }
};

export const playerStates = {
  idle: { state: 0, ticksPerFrame: 100, direction: 1 },
  hitBody: { state: 1 },
  hitUppercut: { state: 2 },
  hitHead: { state: 3 },
  jab: { state: 4, ticksPerFrame: [5,10] },
  bodyJab: { state: 5, ticksPerFrame: [5,10] },
  powerCross: { state: 6, ticksPerFrame: [12,10,30] },
  powerBodyCross: { state: 7, ticksPerFrame: [12,10,30] },
};

const playerStateSaga = (state = initialState.playerStateSaga, action) => {
  switch (action.type) {
    case types.SET_PLAYER_SAGA_STATE:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  npcHealth,
  npcStateSaga,
  playerStateSaga
});
