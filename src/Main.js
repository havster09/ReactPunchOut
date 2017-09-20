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
  setPatternStateSaga,
  setPlayerStateSaga
} from './Actions';
import LittleMack from './LittleMack';

export let screenDimensions;

export class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.dimensions = screenDimensions = Dimensions.get('window');

    this.handleNpcHit = this.handleNpcHit.bind(this);
    this.handlePlayerHit = this.handlePlayerHit.bind(this);
    this.handleSetNpcStateSaga = this.handleSetNpcStateSaga.bind(this);
    this.handleSetPatternStateSaga = this.handleSetPatternStateSaga.bind(this);
    this.handleSetPlayerStateSaga = this.handleSetPlayerStateSaga.bind(this);

    this.getNpcRef = this.getNpcRef.bind(this);
    this.npcRef = null;

    this.playerWatcher = {
      state: 0,
      ticksPerFrame: 20,
      direction: 0,
      repeat: false
    };
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

  handleSetPlayerStateSaga(state) {
    this.props.setPlayerStateSaga(state);
  }

  handleSetPatternStateSaga(patternType, state) {
    this.props.setPatternStateSaga(patternType, state);
  }

  handlePlayerHit(currentStep, npcState) {
    // todo check whether player is in a defensive state otherwise hit success
    const npcAttackType = translateState(npcState.state);
    switch (npcAttackType) {
      case 'jab':
      case 'cross':
        if (currentStep === 1) {
          this.playerWatcher = { ...this.playerWatcher, ...{ state: 2 } };
        }
        return this.props.setPlayerStateSaga(this.playerWatcher);
        break;
      case 'uppercut':
        if (currentStep === 1) {
          this.playerWatcher = { ...this.playerWatcher, ...{ state: 3 } };
        }
        return this.props.setPlayerStateSaga(this.playerWatcher);
        break;
      case 'body_jab':
        if (currentStep === 1) {
          this.playerWatcher = { ...this.playerWatcher, ...{ state: 1 } };
        }
        return this.props.setPlayerStateSaga(this.playerWatcher);
        break;
    }
  }

  getNpcRef(npcRef) {
    this.npcRef = npcRef;
  }

  render() {
    const { npcHealth, npcStateSaga, playerStateSaga } = this.props;
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
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <PistonHurricane
                ref={this.getNpcRef}
                npcStateSaga={npcStateSaga}
                onSetNpcStateSaga={this.handleSetNpcStateSaga}
                onSetPatternStateSaga={this.handleSetPatternStateSaga}
                onNpcHit={this.handleNpcHit}
                onPlayerHit={this.handlePlayerHit}
              />
              <LittleMack
               onSetPlayerStateSaga={this.handleSetPlayerStateSaga}
               playerStateSaga={playerStateSaga}
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
  npcStateSaga: state.npcStateSaga,
  playerStateSaga: state.playerStateSaga
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
  setPlayerStateSaga(state) {
    dispatch(setPlayerStateSaga(state));
  },
  setPatternStateSaga(patternType, state) {
    dispatch(setPatternStateSaga(patternType, state));
  }
});

export default (Main = connect(mapStateToProps, mapActionsToProps)(Main));
// todo powerpunch by charging before throwing
// todo power multiplier by counter punching
