import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Sprite from './native/components/sprite';
import * as types from './Constants';

class PistonHurricane extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.pistonHurricaneImage = require('../assets/piston_hurricane.png');

    this.loopID = null;

    this.watcher = {
      spritePlaying: false,
      isDead: false,
      isHit: false,
      hasStopped: 0,
      attacking: 0,
      hasHit: 0
    };

    this.debug = false;

    this.aiLoop = this.aiLoop.bind(this);
    this.handleNpcIsAttacked = this.handleNpcIsAttacked.bind(this);
    this.isInHitState = this.isInHitState.bind(this);
    this.toggleDirection = this.toggleDirection.bind(this);
  }

  componentDidMount() {
    this.loopID = this.context.loop.subscribe(this.aiLoop);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.loopID);
  }

  componentWillReceiveProps(nextProps) {
    const { npcStateSaga } = nextProps;
    console.log(npcStateSaga);
  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log(nextProps, nextState);
    return true;
  }

  toggleDirection = () => {
    return this.props.npcStateSaga.direction? 0 : 1;
  };

  toggleRepeat = () => {
    // console.log(this.props.npcState.repeat);
    return !this.props.npcStateSaga.repeat;
  };

  aiLoop() {
    // add hit/attack etc states to make ai cleaner
    const { npcStateSaga } = this.props;
    // punched to idle
    if(!this.watcher.spritePlaying) {
      if(this.isInHitState()) {
        if (this.context.loop.loopID) {
          this.watcher.isHit = false;
          const idleState = {
            state: 0,
            direction: this.toggleDirection(),
            repeat: false
          };
          return this.props.onSetNpcStateSaga(idleState);
        }
      }
      else {
        return this.aiSetSagaSequence();
      }
    }
    else {
      if(!this.watcher.isHit) {
        if(npcStateSaga.state === 0){
          const idleDanceState = {
            state: 1,
            ticksPerFrame: 20,
            repeat: false
          };
          return this.props.onSetNpcStateSaga(idleDanceState);
        }
      }
    }
  }

  aiLoopAttacked() {

  }

  aiSetRandom() {

  }

  aiSetSagaSequence() {
    if(this.watcher.hasStopped < types.PATTERN_ONE.length) {
      // console.log('has stopped',this.watcher.hasStopped);
      return this.props.onSetPatternOneStateSaga(Object.assign({}, this.props.npcStateSaga, {
        sagaOrder: isNaN(this.watcher.hasStopped)? 0: this.watcher.hasStopped + 1,
      }));
    }
    else {
      this.watcher.hasStopped = 0;
    }
  }

  handlePlayStateChanged = state => {
    const { npcStateSaga } = this.props;
    this.watcher = Object.assign({}, this.watcher, {
      spritePlaying: !!state,
      hasStopped: state ? this.watcher.hasStopped : this.watcher.hasStopped + 1,
      isHit: this.watcher.isHit ? false : this.watcher.isHit,
    });
  };

  handleUpdateStepCount = currentStep => {
    // console.log(currentStep);
  };

  handleNpcIsAttacked(count) {
    this.watcher.isHit = true;
    const testTouchState = {
      state: [6,7,8][Math.floor(Math.random() * 3)],
      ticksPerFrame: count, // harder the hit the more longer the hit frame
      repeat: false,
    };
    this.props.onSetNpcStateSaga(testTouchState);
    return this.props.onNpcHit(count);
  }

  isInHitState() {
    const { npcStateSaga } = this.props;
    return [6,7,8].indexOf(npcStateSaga.state) > -1;
  }

  render() {
    const { npcStateSaga } = this.props;
    return (
      <View>
        {this.debug &&
          <Text>
            {JSON.stringify(this.watcher, null, 4)}
          </Text>}
        <Sprite
          repeat={npcStateSaga.repeat}
          onPlayStateChanged={this.handlePlayStateChanged}
          onUpdateStepCount={this.handleUpdateStepCount}
          src={this.pistonHurricaneImage}
          scale={2}
          state={npcStateSaga.state}
          steps={[
            0, //0 still
            3, //1 idle
            1, //2 jab
            2, //3 cross
            2, //4 uppercut
            1, //5 body_jab
            0, //6 hit_jab
            0, //7 hit_cross
            0, //8 hit_body
            1, //9 dazed
            0, //10 weave
            0, //11 block_body
            0, //12 block_jab
            0, //13 block_uppercut
            0, //14 block_cross
            2, //15 knockdown
            1, //16 get up
            1 //17 pose
          ]}
          offset={[0, 0]}
          tileWidth={216}
          tileHeight={216}
          direction={npcStateSaga.direction}
          ticksPerFrame={npcStateSaga.ticksPerFrame}
          pattern={npcStateSaga.pattern}
        />
      </View>
    );
  }
}

PistonHurricane.propTypes = {
  onNpcHit: PropTypes.func,
  onSetNpcStateSaga: PropTypes.func,
  onSetPatternOneStateSaga: PropTypes.func,
  npcStateSaga: PropTypes.object
};
PistonHurricane.contextTypes = {
  loop: PropTypes.object,
  engine: PropTypes.object,
  scale: PropTypes.number
};

export default PistonHurricane;
