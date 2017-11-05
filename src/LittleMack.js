import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import connect from 'react-redux/es/connect/connect';
import Sprite from './native/components/sprite';
import { screenDimensions } from './Main';
import {
  getLeftPosition,
  getTopPosition,
  targetHeadOrBody,
  translateState
} from './helpers';
import { playerStates } from './Reducers';
import {
  reduceNpcHealth,
  setNpcState,
  setNpcStateSaga,
  setPatternStateSaga,
  setPlayerStateSaga,
  setPunchStatus
} from './Actions';

class LittleMack extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.littleMackImage = require('../assets/little_mack.png');

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
      gestureState: null,
      currentStep: 0
    };

    this.debug = false;

    this.aiLoop = this.aiLoop.bind(this);
    this.handlePlayerIsAttacking = this.handlePlayerIsAttacking.bind(this);
    this.handlePlayerIsBlocking = this.handlePlayerIsBlocking.bind(this);
    this.handlePlayerIsNotBlocking = this.handlePlayerIsNotBlocking.bind(this);
    this.isInIdleState = this.isInIdleState.bind(this);
    this.isInHitState = this.isInHitState.bind(this);
    this.isInAttackState = this.isInAttackState.bind(this);
    this.toggleDirection = this.toggleDirection.bind(this);
    this.aiHitRecover = this.aiHitRecover.bind(this);
    this.handleHitSuccess = this.handleHitSuccess.bind(this);
    this.handleHitFail = this.handleHitFail.bind(this);
  }

  componentDidMount() {
    this.loopID = this.context.loop.subscribe(this.aiLoop);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.loopID);
  }

  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  toggleDirection = () => {};

  toggleRepeat = () => {};

  aiLoop() {
    const {
      playerStateSaga,
      setPlayerStateSaga,
      punchStatus,
      setPunchStatus
    } = this.props;
    if (
      (this.isInHitState() || this.isInAttackState)
      && !this.watcher.spritePlaying
      && !this.isInBlockState()
    ) {
      console.log('setting default idles');
      setPlayerStateSaga({ ...playerStateSaga, ...playerStates.idle });
    }

    if (punchStatus.status) {
      if (punchStatus.timeStamp < this.context.loop.loopID) {
        setPunchStatus({
          status: false,
          timeStamp: null
        });
      }
    }
  }

  aiHitRecover() {}

  aiSetSagaSequence() {}

  handlePlayStateChanged = state => {
    const { playerStateSaga } = this.props;
    const { loop: { loopID } } = this.context;
    this.watcher = Object.assign({}, this.watcher, {
      spritePlaying: !!state,
      hasStopped: state ? this.watcher.hasStopped : this.watcher.hasStopped + 1,
      isHit: this.watcher.isHit ? false : this.watcher.isHit,
      lastMoveBeforeHit: {
        move: translateState(playerStateSaga.state),
        timeStamp: loopID
      }
    });
  };

  handlePlayerIsBlocking(gestureState) {
    const { playerStateSaga, setPlayerStateSaga } = this.props;
    const blockHead = targetHeadOrBody(screenDimensions, gestureState);
    // todo time with npcContact frame check if not already in same block state
    let blockState;
    if (blockHead) {
      blockState = playerStates.blockHead;
    } else {
      blockState = playerStates.blockBody;
    }
    return setPlayerStateSaga({
      ...playerStateSaga,
      ...blockState
    });
  }

  handlePlayerIsNotBlocking() {
    const { playerStateSaga, setPlayerStateSaga } = this.props;
    return setPlayerStateSaga({
      ...playerStateSaga,
      ...playerStates.idle
    });
  }

  handlePlayerIsAttacking(gestureState) {
    if (this.props.punchStatus.status) {
      return;
    }

    this.watcher.gestureState = gestureState;
    let playerAttack;
    const { playerStateSaga, setPlayerStateSaga } = this.props;
    let direction = gestureState.x0 < screenDimensions.width / 2 ? 1 : 0;
    const attackHead = targetHeadOrBody(screenDimensions, gestureState);

    if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
      if (attackHead) {
        playerAttack = playerStates.jab;
      } else {
        playerAttack = playerStates.bodyJab;
      }
      return setPlayerStateSaga({
        ...playerStateSaga,
        ...{ direction },
        ...playerAttack
      });
    } else {
      if (attackHead) {
        playerAttack = playerStates.powerCross;
      } else {
        playerAttack = playerStates.powerBodyCross;
      }
      return setPlayerStateSaga({
        ...playerStateSaga,
        ...{ direction },
        ...playerAttack
      });
    }
  }

  handleUpdateStepCount = currentStep => {
    const { playerStateSaga, npcReference } = this.props;
    this.watcher.currentStep = currentStep;
    if (this.isInAttackState()) {
      // todo switch for attack type
      if (playerStateSaga.state === 4 || playerStateSaga.state === 5) {
        if (currentStep === 0) {
          return npcReference.handleNpcIsAttacked(
            this.watcher.gestureState,
            playerStateSaga
          );
        }
      } else if (playerStateSaga.state === 6 || playerStateSaga.state === 7) {
        if (currentStep === 1) {
          return npcReference.handleNpcIsAttacked(
            this.watcher.gestureState,
            playerStateSaga
          );
        }
      }
    }
  };

  handleHitSuccess(punchPower, direction) {}

  handleHitFail(punchPower, direction) {}

  isInIdleState() {
    const { playerStateSaga } = this.props;
    return [0].indexOf(playerStateSaga.state) > -1;
  }

  isInBlockState() {
    const { playerStateSaga } = this.props;
    return [8, 9].indexOf(playerStateSaga.state) > -1;
  }

  isInHitState() {
    const { playerStateSaga } = this.props;
    return [1, 2, 3].indexOf(playerStateSaga.state) > -1;
  }

  isInAttackState() {
    const { playerStateSaga } = this.props;
    return [4, 5, 6, 7].indexOf(playerStateSaga.state) > -1;
  }

  render() {
    const { playerStateSaga, punchStatus } = this.props;

    return (
      <View>
        {this.debug &&
          <Text>
            {JSON.stringify(this.playerStateSaga, null, 4)}
          </Text>}
        <Sprite
          repeat={playerStateSaga.repeat}
          onPlayStateChanged={this.handlePlayStateChanged}
          onUpdateStepCount={this.handleUpdateStepCount}
          src={this.littleMackImage}
          scale={2}
          state={playerStateSaga.state}
          steps={playerSteps}
          // remember to add attacks to isInAttackState
          offset={[0, 0]}
          tileWidth={216}
          tileHeight={216}
          direction={playerStateSaga.direction}
          ticksPerFrame={playerStateSaga.ticksPerFrame}
          blockedPowerPunch={punchStatus}
          left={getLeftPosition(playerStateSaga, this.watcher.currentStep)}
          top={getTopPosition(playerStateSaga, this.watcher.currentStep)}
        />
      </View>
    );
  }
}

const playerSteps = [
  0, //0 still
  0, //1 hit_body
  0, //2 hit_hook
  0, //3 hit_jab
  1, //4 attack_jab
  1, //5 attack_body_jab
  2, //6 attack_power_cross
  2, //7 attack_power_body_cross
  0, //8 block_head
  0 //9 block_body
];

// todo add ref PropType
LittleMack.propTypes = {
  setPlayerStateSaga: PropTypes.func,
  playerStateSaga: PropTypes.object
};
LittleMack.contextTypes = {
  loop: PropTypes.object,
  engine: PropTypes.object,
  scale: PropTypes.number
};

// todo limit exposure to state to limit rerenders
const mapStateToProps = state => ({
  npcHealth: state.npcHealth,
  npcStateSaga: state.npcStateSaga,
  playerStateSaga: state.playerStateSaga,
  punchStatus: state.punchStatus
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

export default (LittleMack = connect(mapStateToProps, mapActionsToProps, null, {
  withRef: true
})(LittleMack));
