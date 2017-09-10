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
    if (action.payload.sagaOrder === 1) {
      console.log('left jab');
      yield put({ type: types.SET_JAB_LEFT_STATE_PATTERN_ONE });
    }
    if (action.payload.sagaOrder === 2) {
      console.log('left cross');
      yield put({ type: types.SET_CROSS_LEFT_STATE_PATTERN_ONE });
    }
    if (action.payload.sagaOrder === 3) {
      console.log('left uppercut');
      yield put({ type: types.SET_UPPERCUT_LEFT_STATE_PATTERN_ONE });
    }
  }

  // yield call(delay, 1000);
  // yield put({ type: types.SET_JAB_LEFT_STATE });
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
