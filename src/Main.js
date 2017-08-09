import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
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
