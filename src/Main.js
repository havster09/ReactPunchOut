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
  setPlayerStateSaga,
  setPunchStatus,
} from './Actions';
import LittleMack from './LittleMack';

export let screenDimensions;

export class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.dimensions = screenDimensions = Dimensions.get('window');

    this.getNpcRef = this.getNpcRef.bind(this);
    this.getPlayerRef = this.getPlayerRef.bind(this);
    this.npcRef = null;
    this.playerRef = null;
    this.gestureStateWatcher = {
      numberActiveTouches:null,
    }
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
       this.gestureStateWatcher.numberActiveTouches = gestureState.numberActiveTouches; // detect === 2
       // console.log(gestureState.numberActiveTouches);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        // todo set player redux state to handle player sprite and whether player can attack
        // todo count how many touches (if > 1) is blocking (if > 1 && x0 > some value) is weavings
        // (power, touchData)

        if (this.playerRef.isInIdleState()) {
          this.playerRef.handlePlayerIsAttacking(gestureState);
        }
        this.gestureStateWatcher.numberActiveTouches = null;
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

  getNpcRef(npcRef) {
    this.npcRef = npcRef.getWrappedInstance();
  }

  getPlayerRef(playerRef) {
    this.playerRef = playerRef.getWrappedInstance();
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
            <Text style={{ marginTop: 5 }}>
              {`Gesture Touches: ${this.gestureStateWatcher.numberActiveTouches}`}
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
                playerReference={this.playerRef}
              />
              <LittleMack
                ref={this.getPlayerRef}
                npcReference={this.npcRef}
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
  npcStateSaga: state.npcStateSaga,
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
  setPunchStatus(state) {
    dispatch(setPunchStatus(state));
  },
  setPatternStateSaga(patternType, state) {
    dispatch(setPatternStateSaga(patternType, state));
  }
});

export default (Main = connect(mapStateToProps, mapActionsToProps)(Main));
