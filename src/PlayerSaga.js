import { delay } from 'redux-saga';
import { call, put, takeEvery, all, takeLatest } from 'redux-saga/effects';
import * as types from './Constants';

function* playerSetSagaState(action) {
  if (action) {
    const payload = action.payload;
    yield put({ type: types.SET_PLAYER_SAGA_STATE, payload });
  } else {
    console.log('no action');
    yield;
  }
}

function* playerSetSagaStateWatcher() {
  yield takeEvery(types.SET_PLAYER_SAGA, playerSetSagaState);
}

const rootSaga = function*() {
  yield all([playerSetSagaStateWatcher()]);
};

export default rootSaga;
