import React from 'react';
import { Provider } from 'react-redux';
import Main from './src/Main';

import configureStore from './src/Store';
const store = configureStore();


class App extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Provider store={store}>
        <Main/>
      </Provider>
    );
  }
}

export default App;
