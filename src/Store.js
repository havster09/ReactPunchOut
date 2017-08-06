import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';

import createSagaMiddleware from 'redux-saga';
import rootSaga from './NpcSaga';
const sagaMiddleware = createSagaMiddleware();



import rootReducer from './Reducers';

const initialState = {
  npcHealth: 100
};

const enhancers = compose(
  applyMiddleware(sagaMiddleware, thunk, reduxImmutableStateInvariant())
);

export default function configureStore() {
  const store = createStore(rootReducer, initialState, composeWithDevTools(enhancers));
  sagaMiddleware.run(rootSaga);
  return store
}


