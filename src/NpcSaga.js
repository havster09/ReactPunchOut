import { delay } from 'redux-saga';
import { put, takeEvery, all } from 'redux-saga/effects';

const helloSaga = function*() {
  console.log('jjjjj');
};

const incrementAsync =  function*() {
  yield delay(1000);
  yield put({ type: 'INCREMENT' });
};

const watchIncrementAsync = function*() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
};

const rootSaga = function*() {
  yield all([helloSaga(), watchIncrementAsync()]);
};

export default rootSaga;
