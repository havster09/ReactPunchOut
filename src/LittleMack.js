import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Sprite from './native/components/sprite';
import * as types from './Constants';
import { screenDimensions } from './Main';
import { translateState } from './helpers';
import { playerStates } from './Reducers';

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
      gestureState: null
    };

    this.debug = false;

    this.aiLoop = this.aiLoop.bind(this);
    this.handlePlayerIsAttacking = this.handlePlayerIsAttacking.bind(this);
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
    console.log(screenDimensions);
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
    const { playerStateSaga, onSetPlayerStateSaga } = this.props;
    if (
      (this.isInHitState() || this.isInAttackState) &&
      !this.watcher.spritePlaying
    ) {
      onSetPlayerStateSaga({ ...playerStateSaga, ...playerStates.idle });
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

  handlePlayerIsAttacking(punchPower, gestureState) {
    console.log(gestureState);
    this.watcher.gestureState = gestureState;
    const { playerStateSaga, onSetPlayerStateSaga } = this.props;
    const direction = gestureState.x0 < screenDimensions.width / 2 ? 1 : 0;
    const attackHead = gestureState.y0 > screenDimensions.height / 2;

    // todo handle other attacks add fork for body and head punches

    if (gestureState.moveX === 0 && gestureState.moveY === 0) {
      return onSetPlayerStateSaga({
        ...playerStateSaga,
        ...{ direction },
        ...playerStates.jab
      });
    }
  }

  handleUpdateStepCount = currentStep => {
    const { playerStateSaga, onNpcAttacked } = this.props;
    if (this.isInAttackState()) {
      // todo switch for attack type
      if (currentStep === 1) {
        onNpcAttacked(this.watcher.gestureState);
      }
    }
  };

  handleHitSuccess(punchPower, direction) {}

  handleHitFail(punchPower, direction) {}

  isInIdleState() {
    const { playerStateSaga } = this.props;
    return [0].indexOf(playerStateSaga.state) > -1;
  }

  isInHitState() {
    const { playerStateSaga } = this.props;
    return [1, 2, 3].indexOf(playerStateSaga.state) > -1;
  }

  isInAttackState() {
    const { playerStateSaga } = this.props;
    return [4].indexOf(playerStateSaga.state) > -1;
  }

  render() {
    const { playerStateSaga } = this.props;
    return (
      <View>
        {this.debug &&
          <Text>
            {JSON.stringify(this.watcher.comboCount, null, 4)}
          </Text>}
        <Sprite
          repeat={playerStateSaga.repeat}
          onPlayStateChanged={this.handlePlayStateChanged}
          onUpdateStepCount={this.handleUpdateStepCount}
          src={this.littleMackImage}
          scale={2}
          state={playerStateSaga.state}
          steps={[
            0, //0 still
            0, //1 hit_body
            0, //2 hit_hook
            0, //3 hit_jab
            1 //4 attack_jab
          ]}
          offset={[0, 0]}
          tileWidth={216}
          tileHeight={216}
          direction={playerStateSaga.direction}
          ticksPerFrame={playerStateSaga.ticksPerFrame}
          left={-108}
          top={-90}
        />
      </View>
    );
  }
}

LittleMack.propTypes = {
  onSetPlayerStateSaga: PropTypes.func,
  onNpcAttacked: PropTypes.func,
  playerStateSaga: PropTypes.object
};
LittleMack.contextTypes = {
  loop: PropTypes.object,
  engine: PropTypes.object,
  scale: PropTypes.number
};

export default LittleMack;
