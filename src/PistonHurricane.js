import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Sprite from './native/components/sprite';
import * as types from './Constants';
import { screenDimensions } from './Main';
import { translateState } from './helpers';

class PistonHurricane extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.pistonHurricaneImage = require('../assets/piston_hurricane.png');

    this.loopID = null;

    this.watcher = {
      spritePlaying: false,
      isDead: false,
      isHit: false,
      isPlayingPattern: 0,
      hasStopped: 0,
      attacking: 0,
      hasHit: 0,
      lastMoveBeforeHit: null,
      comboCount: 0
    };

    this.debug = true;

    this.aiLoop = this.aiLoop.bind(this);
    this.handleNpcIsAttacked = this.handleNpcIsAttacked.bind(this);
    this.isInHitState = this.isInHitState.bind(this);
    this.toggleDirection = this.toggleDirection.bind(this);
    this.aiHitRecover = this.aiHitRecover.bind(this);
    this.aiSetPattern = this.aiSetPattern.bind(this);
    this.handleHitSuccess = this.handleHitSuccess.bind(this);
    this.handleHitFail = this.handleHitFail.bind(this);
  }

  componentDidMount() {
    this.loopID = this.context.loop.subscribe(this.aiLoop);
    console.log(screenDimensions);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.loopID);
  }

  componentWillReceiveProps(nextProps) {
    const { npcStateSaga } = nextProps;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  toggleDirection = () => {
    return this.props.npcStateSaga.direction ? 0 : 1;
  };

  toggleRepeat = () => {
    // console.log(this.props.npcState.repeat);
    return !this.props.npcStateSaga.repeat;
  };

  aiLoop() {
    const { npcStateSaga } = this.props;
    if (!this.watcher.spritePlaying) {
      if (this.isInHitState()) {
        return this.aiHitRecover();
      } else {
        return this.aiSetSagaSequence();
      }
    } else {
      if (!this.watcher.isHit) {
        if (npcStateSaga.state === 0) {
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

  aiHitRecover() {
    this.watcher.comboCount = 0;
    this.watcher.isHit = false;
    const idleState = {
      state: 0,
      direction: this.toggleDirection(),
      repeat: false
    };
    return this.props.onSetNpcStateSaga(idleState);
  }

  aiLoopAttacked() {}

  aiSetRandom() {}

  aiSetSagaSequence() {
    this.aiSetPattern(this.watcher.isPlayingPattern);
  }

  aiSetPattern(patternType) {
    let selectedPattern;
    switch (patternType) {
      case 0:
        selectedPattern = types.PATTERN_ONE;
        break;
      case 1:
        selectedPattern = types.PATTERN_TWO;
        break;
      default:
        selectedPattern = types.PATTERN_ONE;
    }

    if (this.watcher.hasStopped < selectedPattern.length) {
      const npcState = Object.assign({}, this.props.npcStateSaga, {
        sagaOrder: isNaN(this.watcher.hasStopped)
          ? 0
          : this.watcher.hasStopped + 1
      });
      // console.log(patternType);
      return this.props.onSetPatternStateSaga(patternType, npcState);
    } else {
      this.watcher.hasStopped = 0;
      this.watcher.isPlayingPattern = this.watcher.isPlayingPattern < 1 ? 1 : 0;
    }
  }

  handlePlayStateChanged = state => {
    const { npcStateSaga } = this.props;
    const { loop: { loopID } } = this.context;
    this.watcher = Object.assign({}, this.watcher, {
      spritePlaying: !!state,
      hasStopped: state ? this.watcher.hasStopped : this.watcher.hasStopped + 1,
      isHit: this.watcher.isHit ? false : this.watcher.isHit,
      lastMoveBeforeHit: {
        move: translateState(npcStateSaga.state),
        timeStamp: loopID
      }
    });
  };

  handleUpdateStepCount = currentStep => {
    // todo trigger player isHit logic here after 1 frame if player is vulnerable
    // console.log(currentStep);
  };

  handleNpcIsAttacked(punchPower, gestureState) {
    const { npcStateSaga } = this.props;
    const { loop: { loopID } } = this.context;
    console.log(translateState(npcStateSaga.state));

    let hitSuccess = false;
    if (this.watcher.lastMoveBeforeHit) {
      const { move, timeStamp } = this.watcher.lastMoveBeforeHit;
      const hitWindow = loopID - timeStamp;
      console.log(hitWindow);
      // todo put in variable to make combos based on moves player jabs vs player power punches
      if (hitWindow < 10 || this.isInHitState() && this.watcher.comboCount < 3) {
        hitSuccess = true;
      } else if (hitWindow < 50) {
        hitSuccess = this.getMoveHitSuccess(move, hitWindow);
      } else {
        // todo too late when attack move ends handle playerHit logic
        if (!this.isInIdleState()) return;
      }
    }

    const direction = gestureState.x0 < screenDimensions.width / 2 ? 1 : 0;
    this.watcher.isHit = true;

    if (hitSuccess) {
      return this.handleHitSuccess(punchPower, direction);
    } else {
      return this.handleHitFail(punchPower, direction);
    }
  }

  handleHitSuccess(punchPower, direction) {
    this.watcher.comboCount = this.watcher.comboCount + 1;
    const testTouchState = {
      state: [6, 7, 8][Math.floor(Math.random() * 3)],
      ticksPerFrame: punchPower,
      direction,
      repeat: false
    };
    this.props.onSetNpcStateSaga(testTouchState);
    return this.props.onNpcHit(punchPower);
  }

  handleHitFail(punchPower, direction) {
    this.watcher.comboCount = 0;
    const testTouchState = {
      state: [10, 11, 12, 13, 14][Math.floor(Math.random() * 2)],
      ticksPerFrame: Math.ceil(punchPower / 2),
      direction,
      repeat: false
    };
    this.props.onSetNpcStateSaga(testTouchState);
    return this.props.onNpcHit(punchPower);
  }

  getMoveHitSuccess(move, hitWindow) {
    switch (move) {
      case 'cross':
        if (hitWindow < 30) {
          return true;
        }
        break;
      case 'uppercut':
        if (hitWindow < 50) {
          return true;
        }
        break;
      default:
        return false;
    }
  }

  isInIdleState() {
    const { npcStateSaga } = this.props;
    return npcStateSaga.state === 1 && npcStateSaga.state === 0;
  }

  isInHitState() {
    const { npcStateSaga } = this.props;
    return [6, 7, 8, 9].indexOf(npcStateSaga.state) > -1;
  }

  render() {
    const { npcStateSaga } = this.props;
    return (
      <View>
        {this.debug &&
          <Text>
            {JSON.stringify(this.watcher.comboCount, null, 4)}
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
  onNpcAttackContact: PropTypes.func, // todo trigger in main via this.handleUpdateStepCount(move)
  onSetNpcStateSaga: PropTypes.func,
  onSetPatternStateSaga: PropTypes.func,
  npcStateSaga: PropTypes.object
};
PistonHurricane.contextTypes = {
  loop: PropTypes.object,
  engine: PropTypes.object,
  scale: PropTypes.number
};

export default PistonHurricane;
