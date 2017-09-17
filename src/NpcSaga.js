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
  if (!action.payload.spritePlaying) {
    if (types.PATTERN_ONE[action.payload.sagaOrder - 1]) {
      yield put({ type: types.PATTERN_ONE[action.payload.sagaOrder - 1] });
    }
  }
}

function* npcPatternTwo(action) {
  if (!action.payload.spritePlaying) {
    if (types.PATTERN_TWO[action.payload.sagaOrder - 1]) {
      yield put({ type: types.PATTERN_TWO[action.payload.sagaOrder - 1] });
    }
  }
}

function* npcWatchSetSaga() {
  yield takeEvery(types.SET_PATTERN_ONE_SAGA_STATE, npcPatternOne);
  yield takeEvery(types.SET_PATTERN_TWO_SAGA_STATE, npcPatternTwo);
}

function* npcSetSagaStateWatcher() {
  yield takeEvery(types.SET_SAGA, npcSetSagaState);
}

const rootSaga = function*() {
  yield all([initSaga(), npcWatchSetSaga(), npcSetSagaStateWatcher()]);
};

export default rootSaga;
