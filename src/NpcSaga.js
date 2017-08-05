import { SET_NPC_STATE } from './Constants';
import { takeLatest, call, select } from 'redux-saga/effects';

function* putNpcState({state}) {
  debugger;
  const currentNpcState = yield select(npcState); // getNpcState
  yield call(() => {
    console.log(currentNpcState)
  });
}

export function* currentNpcStateSaga() {
  yield takeLatest(SET_NPC_STATE, putNpcState)
}