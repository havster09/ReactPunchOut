import { delay } from 'redux-saga';
import { call, put, takeEvery, all, takeLatest } from 'redux-saga/effects';
import * as types from './Constants';

const initSaga = function*() {
  console.log('init here');
};

function* npcSetSagaState(action) {
  if (action) {
    const payload = action.payload;
    yield put({ type: types.SET_SAGA_STATE, payload });
  } else {
    console.log('no action');
    yield;
  }
}

function* npcPatternOne(action) {
  console.log('run saga pattern',action.payload.sagaOrder);
  if (!action.payload.spritePlaying) {
    if(types.PATTERN_ONE[action.payload.sagaOrder-1]) {
      yield put({type: types.PATTERN_ONE[action.payload.sagaOrder-1]});
    }
  }
}

function* watchSetTest() {
  yield takeEvery(types.SET_PATTERN_ONE_SAGA_STATE, npcPatternOne);
}

function* npcSetSagaStateWatcher() {
  yield takeEvery(types.SET_SAGA, npcSetSagaState);
}

const rootSaga = function*() {
  yield all([initSaga(), watchSetTest(), npcSetSagaStateWatcher()]);
};

export default rootSaga;
