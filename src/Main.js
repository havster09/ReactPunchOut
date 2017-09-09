import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Dimensions, Text, View, PanResponder } from 'react-native';
import { Loop, Stage } from 'react-game-kit/native';
import PistonHurricane from './PistonHurricane';
import { reduceNpcHealth, setNpcState, setNpcStateSaga, setPatternOneStateSaga } from './Actions';

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.dimensions = Dimensions.get('window');

    this.handleNpcHit = this.handleNpcHit.bind(this);
    this.handleNpcStateChange = this.handleNpcStateChange.bind(this);
    this.handleSetNpcStateSaga = this.handleSetNpcStateSaga.bind(this);
    this.handleSetPatternOneStateSaga = this.handleSetPatternOneStateSaga.bind(this);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
        console.log(evt);
        const testTouchState = {
          state: 3,
          ticksPerFrame: 10,
          direction: 0,
          repeat: false
        };
        this.handleNpcStateChange(testTouchState);
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    });
    console.log('init done');
  }

  handleNpcHit(damage) {
    this.props.reduceNpcHealth(damage);
  }

  handleNpcStateChange(state) {
    this.props.setNpcState(state);
  }

  handleSetNpcStateSaga(state) {
    this.props.setNpcStateSaga(state);
  }

  handleSetPatternOneStateSaga(state) {
    this.props.setPatternOneStateSaga(state);
  }

  render() {
    const { npcHealth, npcState, npcStateSaga } = this.props;
    return (
    <View {...this._panResponder.panHandlers}>
      <Loop>
        <Stage
          width={this.dimensions.width}
          height={this.dimensions.height}
          style={{ backgroundColor: '#fff' }}
        >
          <Text style={{ marginTop: 40 }}>
            {npcHealth}
          </Text>
          <Text style={{ marginTop: 40 }}>
            {npcStateSaga.state}
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <PistonHurricane
              npcState={npcState}
              npcStateSaga={npcStateSaga}
              onSetNpcStateSaga={this.handleSetNpcStateSaga}
              onNpcStateChange={this.handleNpcStateChange}
              onSetPatternOneStateSaga={this.handleSetPatternOneStateSaga}
              onNpcHit={this.handleNpcHit} />
          </View>
        </Stage>
      </Loop>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const mapStateToProps = state => ({
  npcHealth: state.npcHealth,
  npcState: state.npcState,
  npcStateSaga: state.npcStateSaga
});

const mapActionsToProps = (dispatch, store) => ({
  reduceNpcHealth(damage) {
    dispatch(reduceNpcHealth(damage));
  },
  setNpcState(state) {
    dispatch(setNpcState(state));
  },
  setNpcStateSaga(state) {
    dispatch(setNpcStateSaga(state));
  },
  setPatternOneStateSaga(state) {
    dispatch(setPatternOneStateSaga(state));
  }
});

export default (Main = connect(mapStateToProps, mapActionsToProps)(Main));

// todo add sequence pattern for state...so opponents have a set attack style...chained promises? dispatch action
// todo add idle stance frame
// todo extend sprite to hold last frame
// todo add touch events for player attacks
