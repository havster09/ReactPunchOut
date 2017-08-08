import { delay } from 'redux-saga';
import { call, put, takeEvery, all, takeLatest } from 'redux-saga/effects';
import * as types from './Constants';

const helloSaga = function*() {
  console.log('jjjjj');
};

function* npcPatternOne() {
  yield put({ type: types.SET_JAB_LEFT_STATE });
  yield call(delay, 1000);
  yield put({ type: types.SET_CROSS_LEFT_STATE });
  yield call(delay, 1000);
  yield put({ type: types.SET_JAB_LEFT_STATE });
}

 function* watchSetTest() {
  yield takeEvery('SET_TEST', npcPatternOne);
}

const rootSaga = function*() {
  yield all([helloSaga(), watchSetTest()]);
};

export default rootSaga;
