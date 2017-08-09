import * as types from './Constants';
import { store } from '../index';

export const reduceNpcHealth = damage => {
  let npcHealth = store.getState().npcHealth;
  npcHealth = npcHealth - damage;
  return dispatch =>
    dispatch({ type: types.REDUCE_NPC_HEALTH, payload: npcHealth });
};

export const setNpcState = npcState => {
  return dispatch => dispatch({ type: types.SET_NPC_STATE, payload: npcState });
};

export const setNpcStateSaga = npcState => {
  return dispatch => dispatch({ type: types.SET_SAGA, payload: npcState });
};
