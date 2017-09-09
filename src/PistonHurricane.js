import React from 'react';
import PropTypes from 'prop-types';
import Sprite from './native/components/sprite';
import { Text, View } from 'react-native';

class PistonHurricane extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.pistonHurricaneImage = require('../assets/piston_hurricane.png');

    this.loopID = null;

    this.state = {
      npcState: 2,
      loop: false,
      spritePlaying: true,
      ticksPerFrame: 10,
      dead: false,
      direction: 1,
      hasStopped: 0,
      hasHit: 0
    };
  }

  componentDidMount() {
    this.loopID = this.context.loop.subscribe(this.aiLoop.bind(this));
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.loopID);
  }

  componentWillReceiveProps(nextProps) {
    const { npcState, npcStateSaga } = this.props;
    if (
      nextProps.npcState !== this.npcState &&
      nextProps.npcStateSaga === npcStateSaga
    ) {
      return this.props.onSetNpcStateSaga(npcState);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log(nextProps, nextState);
    return true;
  }

  toggleDirection = () => {
    return this.props.npcStateSaga.direction > 0 ? 0 : 1;
  };

  toggleRepeat = () => {
    // console.log(this.props.npcState.repeat);
    return !this.props.npcStateSaga.repeat;
  };

  aiLoop() {
    // console.log(this.context.loop.loopID);
    if (this.context.loop.loopID && this.context.loop.loopID % 100 === 1) {
      const randomState = {
        state: Math.floor(Math.random() * 5),
        ticksPerFrame: 10,
        direction: this.toggleDirection(),
        repeat: this.toggleRepeat()
      };
      const idleState = {
        state: 0,
        ticksPerFrame: 10,
        direction: this.toggleDirection(),
        repeat: true
      };
      this.props.onNpcStateChange(idleState);
      // this.props.onSetPatternOneStateSaga(this.state, this.props.npcStateSaga);
    }

    // this.props.onNpcHit(30);
  }

  handlePlayStateChanged = state => {
    this.setState(
      Object.assign({}, this.state, {
        spritePlaying: state ? true : false,
        hasStopped: state ? this.state.hasStopped : this.state.hasStopped + 1
      })
    );
  };

  handleUpdateStepCount = currentStep => {
    // console.log(currentStep);
  };

  render() {
    const { npcState, npcStateSaga } = this.props;
    return (
      <View>
        <Sprite
          repeat={npcStateSaga.repeat}
          onPlayStateChanged={this.handlePlayStateChanged}
          onUpdateStepCount={this.handleUpdateStepCount}
          src={this.pistonHurricaneImage}
          scale={2}
          state={npcStateSaga.state}
          steps={[
            3, //0 idle
            1, //1 jab
            2, //2 cross
            2, //3 uppercut
            1, //4 body_jab
            0, //5 hit_jab
            0, //6 hit_cross
            0, //7 hit_body
            1, //8 dazed
            0, //8 weave
            0, //9 block_body
            0, //9 block_jab
            0, //10 block_uppercut
            0, //11 block_cross
            2, //12 knockdown
            1, //13 get up
            1, //14 pose
          ]}
          offset={[0, 0]}
          tileWidth={216}
          tileHeight={216}
          direction={npcStateSaga.direction}
          ticksPerFrame={npcStateSaga.ticksPerFrame}
        />
      </View>
    );
  }
}

PistonHurricane.propTypes = {
  onNpcHit: PropTypes.func,
  onNpcStateChange: PropTypes.func,
  onSetNpcStateSaga: PropTypes.func,
  onSetPatternOneStateSaga: PropTypes.func,
  npcState: PropTypes.object,
  npcStateSaga: PropTypes.object
};
PistonHurricane.contextTypes = {
  loop: PropTypes.object,
  engine: PropTypes.object,
  scale: PropTypes.number
};

export default PistonHurricane;
