import { fork } from 'redux-saga/effects';
import rootNpcSaga from './NpcSaga';
import rootPlayerSaga from './PlayerSaga';

export default function* rootSaga () {
  yield [
    fork(rootNpcSaga),
    fork(rootPlayerSaga),
  ];
}