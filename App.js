import React from 'react';
import Main from './src/Main';
import GestureControls from './src/GestureControls';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return <Main />;
    // return <GestureControls />;
  }
}

export default App;
