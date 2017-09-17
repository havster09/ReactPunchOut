import * as types from './Constants';
import { store } from '../index';

export const reduceNpcHealth = punchPower => {
  let npcHealth = store.getState().npcHealth;
  npcHealth = npcHealth - punchPower;
  return dispatch =>
    dispatch({ type: types.REDUCE_NPC_HEALTH, payload: npcHealth });
};

export const setNpcState = npcState => {
  return dispatch => dispatch({ type: types.SET_NPC_STATE, payload: npcState });
};

export const setNpcStateSaga = npcState => {
  return dispatch => dispatch({ type: types.SET_SAGA, payload: npcState });
};

export const setPatternStateSaga  = (patternType, npcState) => {
  let selectedPattern;
  switch (patternType) {
    case 0:
      selectedPattern = types.SET_PATTERN_ONE_SAGA_STATE;
      break;
    case 1:
      selectedPattern = types.SET_PATTERN_TWO_SAGA_STATE;
      break;
    default:
      selectedPattern = types.SET_PATTERN_ONE_SAGA_STATE;
  }
  return dispatch => dispatch({ type: selectedPattern, payload: npcState });
};