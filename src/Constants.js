export const REDUCE_NPC_HEALTH = 'REDUCE_NPC_HEALTH';
export const SET_NPC_STATE = 'SET_NPC_STATE';
export const SET_STILL_LEFT_STATE = 'SET_STILL_LEFT_STATE';
export const SET_JAB_LEFT_STATE = 'SET_JAB_LEFT_STATE';
export const SET_JAB_LEFT_SECOND_STATE = 'SET_JAB_LEFT_SECOND_STATE';
export const SET_CROSS_LEFT_STATE = 'SET_CROSS_LEFT_STATE';
export const SET_UPPERCUT_LEFT_STATE = 'SET_UPPERCUT_LEFT_STATE';

export const SET_PATTERN_ONE_SAGA_STATE = 'SET_PATTERN_ONE_SAGA_STATE';
export const SET_PATTERN_TWO_SAGA_STATE = 'SET_PATTERN_TWO_SAGA_STATE';

export const PATTERN_ONE = [
  SET_CROSS_LEFT_STATE,
  SET_UPPERCUT_LEFT_STATE,
  SET_CROSS_LEFT_STATE,
];

export const PATTERN_TWO = [
  SET_JAB_LEFT_STATE,
  SET_UPPERCUT_LEFT_STATE,
  SET_CROSS_LEFT_STATE,
  SET_UPPERCUT_LEFT_STATE,
];

export const SET_SAGA = 'SET_SAGA';
export const SET_SAGA_STATE = 'SET_SAGA_STATE';

export const PistonHurricaneMoveMap = [
  { stateKey: 0, move: 'still' },
  { stateKey: 1, move: 'idle' },
  { stateKey: 2, move: 'jab' },
  { stateKey: 3, move: 'cross' },
  { stateKey: 4, move: 'uppercut' },
  { stateKey: 5, move: 'body_jab' },
  { stateKey: 6, move: 'hit_jab' },
  { stateKey: 7, move: 'hit_cross' },
  { stateKey: 8, move: 'hit_body' },
  { stateKey: 9, move: 'dazed' },
  { stateKey: 10, move: 'weave' },
  { stateKey: 11, move: 'block_body' },
  { stateKey: 12, move: 'block_jab' },
  { stateKey: 13, move: 'block_uppercut' },
  { stateKey: 14, move: 'block_cross' },
  { stateKey: 15, move: 'knockdown' },
  { stateKey: 16, move: 'getup' },
  { stateKey: 17, move: 'pose' }
];
