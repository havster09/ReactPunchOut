import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  PanResponder,
  Image
} from 'react-native';
import { Loop, Stage } from 'react-game-kit/native';
import PistonHurricane from './PistonHurricane';
import { translateState } from './helpers';

import {
  reduceNpcHealth,
  setNpcState,
  setNpcStateSaga,
  setPatternStateSaga
} from './Actions';
import LittleMack from './LittleMack';

export let screenDimensions;

export class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.dimensions = screenDimensions = Dimensions.get('window');

    this.handleNpcHit = this.handleNpcHit.bind(this);
    this.handleSetNpcStateSaga = this.handleSetNpcStateSaga.bind(this);
    this.handleSetPatternStateSaga = this.handleSetPatternStateSaga.bind(this);

    this.getNpcRef = this.getNpcRef.bind(this);
    this.npcRef = null;
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
        // todo handle pass release to toggle direction
        // todo set player redux state to handle player sprite and whether player can attack
        // (power, touchData)
        this.npcRef.handleNpcIsAttacked(
          Math.floor(Math.random() * 30) + 10,
          gestureState
        );
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

  static getDimensions() {
    return this.dimensions;
  }

  handleNpcHit(punchPower = 1) {
    this.props.reduceNpcHealth(punchPower);
  }

  handleSetNpcStateSaga(state) {
    this.props.setNpcStateSaga(state);
  }

  handleSetPatternStateSaga(patternType, state) {
    this.props.setPatternStateSaga(patternType, state);
  }

  getNpcRef(npcRef) {
    this.npcRef = npcRef;
  }

  render() {
    const { npcHealth, npcStateSaga } = this.props;
    return (
      <View {...this._panResponder.panHandlers}>
        <Loop>
          <Stage
            width={this.dimensions.width}
            height={this.dimensions.height}
            style={{ backgroundColor: '#fff' }}
          >
            <Text style={{ marginTop: 5 }}>
              {npcHealth}
            </Text>
            <Text style={{ marginTop: 5 }}>
              {`Move: ${translateState(npcStateSaga.state)}`}
            </Text>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
                <PistonHurricane
                  ref={this.getNpcRef}
                  npcStateSaga={npcStateSaga}
                  onSetNpcStateSaga={this.handleSetNpcStateSaga}
                  onSetPatternStateSaga={this.handleSetPatternStateSaga}
                  onNpcHit={this.handleNpcHit}
                />
                <LittleMack
                  playerStateSaga={{
                    state: 0,
                    ticksPerFrame: 6,
                    direction: 0,
                    repeat: false
                  }}
                />
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
  setPatternStateSaga(patternType, state) {
    dispatch(setPatternStateSaga(patternType, state));
  }
});

export default (Main = connect(mapStateToProps, mapActionsToProps)(Main));
// todo powerpunch by charging before throwing
// todo power multiplier by counter punching
