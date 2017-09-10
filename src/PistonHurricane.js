import React from 'react';
import PropTypes from 'prop-types';
import Sprite from './native/components/sprite';
import { Text, View } from 'react-native';

class PistonHurricane extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.pistonHurricaneImage = require('../assets/piston_hurricane.png');

    this.loopID = null;

    this.watcher = {
      spritePlaying: false,
      dead: false,
      hasStopped: 0,
      attacking: 0,
      hasHit: 0
    };

    this.debug = true;

    this.aiLoop = this.aiLoop.bind(this);
    this.handleNpcIsAttacked = this.handleNpcIsAttacked.bind(this);
  }

  componentDidMount() {
    this.loopID = this.context.loop.subscribe(this.aiLoop);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.loopID);
  }

  componentWillReceiveProps(nextProps) {
    const { npcStateSaga } = this.props;
    if (
      nextProps.npcStateSaga === npcStateSaga
    ) {
      return this.props.onSetNpcStateSaga(npcStateSaga);
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
    // add hit/attack etc states to make ai cleaner
    const { npcStateSaga } = this.props;
    // punched to idle
    if(!this.watcher.spritePlaying) {
      if((npcStateSaga.state > 3 && npcStateSaga.state < 8)) {
        if (this.context.loop.loopID) {
          const idleState = {
            state: 0,
            direction: this.toggleDirection(),
            repeat: false
          };
          return this.props.onSetNpcStateSaga(idleState);
        }
      }
    }
    else if(npcStateSaga.state === 0){
      const randomState = {
        state: Math.floor(Math.random() * 5),
        ticksPerFrame: 20,
        direction: this.toggleDirection(),
        repeat: this.toggleRepeat()
      };
      this.props.onSetNpcStateSaga(randomState);
    }
  }

  aiLoopAttacked() {
    if (this.context.loop.loopID) {
      const idleState = {
        state: 0,
        direction: this.toggleDirection(),
        repeat: false
      };
      return this.props.onSetNpcStateSaga(idleState);
    }
  }

  aiSetRandom() {
    const randomState = {
      state: Math.floor(Math.random() * 5),
      direction: this.toggleDirection(),
      ticksPerFrame: Math.floor(Math.random() *10 + 6),
    };
    this.props.onSetNpcStateSaga(randomState);
  }

  aiSetSagaSequence() {
    this.props.onSetPatternOneStateSaga(Object.assign({}, this.props.npcStateSaga, {

      sagaOrder: isNaN(this.props.npcStateSaga.sagaOrder)? 0: this.props.npcStateSaga.sagaOrder + 1,
    }));
  }

  handlePlayStateChanged = state => {
    const { npcStateSaga } = this.props;
    this.watcher = Object.assign({}, this.watcher, {
      spritePlaying: !!state,
      hasStopped: state ? this.watcher.hasStopped : this.watcher.hasStopped + 1
    });
  };

  handleUpdateStepCount = currentStep => {
    // console.log(currentStep);
  };

  handleNpcIsAttacked(count) {
    const testTouchState = {
      state: [5, 6, 7][Math.floor(Math.random() * 3)],
      ticksPerFrame: 12,
      direction: 0,
      repeat: false,
    };
    this.props.onSetNpcStateSaga(testTouchState);
  }



  render() {
    const { npcStateSaga } = this.props;
    return (
      <View>
        {this.debug &&
          <Text>
            {JSON.stringify(this.props, null, 4)}
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
