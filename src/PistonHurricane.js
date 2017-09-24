import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Sprite from './native/components/sprite';
import * as types from './Constants';
import { screenDimensions } from './Main';
import {isPlayerPowerPunch, playerIsInAttackState, playerIsInIdleState, translateState} from './helpers';
import {npcStates} from "./Reducers";

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
      comboCount: 0,
    };

    this.debug = false;

    this.aiLoop = this.aiLoop.bind(this);
    this.handleNpcIsAttacked = this.handleNpcIsAttacked.bind(this);
    this.isInHitState = this.isInHitState.bind(this);
    this.toggleDirection = this.toggleDirection.bind(this);
    this.aiHitRecover = this.aiHitRecover.bind(this);
    this.aiSetPattern = this.aiSetPattern.bind(this);
    this.handleHitSuccess = this.handleHitSuccess.bind(this);
    this.handleHitFail = this.handleHitFail.bind(this);
    this.isHitBody = this.isHitBody.bind(this);
    this.npcCounterPunch = this.npcCounterPunch.bind(this);
  }

  componentDidMount() {
    this.loopID = this.context.loop.subscribe(this.aiLoop);
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
    const { npcStateSaga, playerStateSaga, blockedPowerPunch } = this.props;

    if (!this.watcher.spritePlaying && !blockedPowerPunch.status) {
      if (this.isInHitState()) {
        return this.aiHitRecover();
      } else if(playerIsInAttackState(playerStateSaga) || playerIsInIdleState(playerStateSaga)) {
        return this.aiSetSagaSequence();
      }
      else {
        return this.props.onSetNpcStateSaga(npcStates.stillLeft);
      }
    } else {
      if (!this.watcher.isHit) {
        if (npcStateSaga.state === 0) {
          return this.props.onSetNpcStateSaga(npcStates.danceLeft);
        }
        else if (blockedPowerPunch.status && blockedPowerPunch.timeStamp < this.context.loop.loopID + 20) {
          this.npcCounterPunch();
        }
      }
    }
  }

  npcCounterPunch() {
    this.props.onSetNpcStateSaga(npcStates.crossRight);
  }

  aiHitRecover() {
    this.watcher.comboCount = 0;
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

  handleUpdateStepCount = (currentStep) => {
    // todo add ticksPerFrame to sync with player hit ticksPerFrame
    const { npcStateSaga } = this.props;
    if([2,3,4,5,6,6,7,8].indexOf(npcStateSaga.state) > -1 && this.watcher.spritePlaying) {
      if(currentStep === 1) {
        this.props.onPlayerHit(currentStep, npcStateSaga);
      }
    }
  };

  handleNpcIsAttacked(punchPower, gestureState, playerStateSaga) {
    const { loop: { loopID } } = this.context;
    if(typeof punchPower === 'object') {
      punchPower = Math.max(...punchPower);
    }

    const direction = gestureState.x0 < screenDimensions.width / 2 ? 1 : 0;

    // temp test
    // return this.handleHitSuccess(punchPower, direction, playerStateSaga);

    let hitSuccess = false;
    if (this.watcher.lastMoveBeforeHit) {
      const { move, timeStamp } = this.watcher.lastMoveBeforeHit;
      const hitWindow = loopID - timeStamp;
      // todo put in variable to make combos based on moves player jabs vs player power punches
      if (hitWindow < 10 || this.isInHitState() && this.watcher.comboCount < 3) {
        hitSuccess = true;
      } else if (hitWindow < 50) {
        hitSuccess = this.getMoveHitSuccess(move, hitWindow);
      } else {
        if (this.isInIdleState()) {
          hitSuccess = true;
        }
      }
    }


    this.watcher.isHit = true;

    if (hitSuccess) {
      return this.handleHitSuccess(punchPower, direction, playerStateSaga);
    } else {
      return this.handleHitFail(punchPower, direction, playerStateSaga);
    }
  }

  handleHitSuccess(punchPower, direction, playerStateSaga) {
    const { state } = playerStateSaga;
    this.watcher.comboCount = this.watcher.comboCount + 1;
    let npcHitState;
    if(this.isHitBody(state)) {
      npcHitState = 8;
    }
    else {
      npcHitState = [6, 7][Math.floor(Math.random() * 2)]
    }
    const testTouchState = {
      state: npcHitState,
      ticksPerFrame: punchPower,
      direction,
      repeat: false
    };
    this.props.onSetNpcStateSaga(testTouchState);
    return this.props.onNpcHit(punchPower);
  }

  handleHitFail(punchPower, direction, playerStateSaga) {
    const { blockedPowerPunch } = this.props;
    const { state } = playerStateSaga;
    this.watcher.comboCount = 0;
    let npcDefensiveState;

    if(this.isHitBody(state)) {
      npcDefensiveState = 11;
    }
    else {
      npcDefensiveState = [10, 12, 13, 14][Math.floor(Math.random() * 3)];
    }

    if(isPlayerPowerPunch(state) && npcDefensiveState !== 10) { // not weave
      this.props.onBlockedPowerPunch(playerStateSaga);
    }

    const ticksPerFrame = blockedPowerPunch.status
      ? punchPower/2
      : punchPower;

    const testTouchState = {
      state: npcDefensiveState,
      ticksPerFrame,
      direction,
      repeat: false
    };
    this.props.onSetNpcStateSaga(testTouchState);
    return this.props.onNpcHit(punchPower);
  }

  getMoveHitSuccess(move, hitWindow) {
    switch (move) {
      case 'cross':
        if (hitWindow < 50) {
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

  isHitBody(state) {
    return [5,7].indexOf(state) > -1;
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
          left={-108}
          top={-90}
        />
      </View>
    );
  }
}

PistonHurricane.propTypes = {
  onNpcHit: PropTypes.func,
  onSetNpcStateSaga: PropTypes.func,
  onSetPatternStateSaga: PropTypes.func,
  onPlayerHit: PropTypes.func,
  onBlockedPowerPunch: PropTypes.func,
  npcStateSaga: PropTypes.object,
  blockedPowerPunch: PropTypes.shape({
    status: PropTypes.bool,
    timeStamp: PropTypes.number,
  })
};
PistonHurricane.contextTypes = {
  loop: PropTypes.object,
  engine: PropTypes.object,
  scale: PropTypes.number
};

export default PistonHurricane;
