import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Sprite from './native/components/sprite';
import * as types from './Constants';
import { screenDimensions } from './Main';
import { translateState } from './helpers';

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
      comboCount: 0
    };

    this.debug = false;

    this.aiLoop = this.aiLoop.bind(this);
    this.handlePlayerIsAttacking = this.handlePlayerIsAttacking.bind(this);
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
    if ((this.isInHitState() || this.isInAttackState) && !this.watcher.spritePlaying) {
      onSetPlayerStateSaga({ ...playerStateSaga, ...{ state: 0, direction: 1 } });
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

  handleUpdateStepCount = currentStep => {};

  handlePlayerIsAttacking(punchPower, gestureState) {
    console.log(punchPower, gestureState);
    const { playerStateSaga, onSetPlayerStateSaga } = this.props;
    const direction = gestureState.x0 < screenDimensions.width / 2 ? 1 : 0;
    onSetPlayerStateSaga({ ...playerStateSaga, ...{ state: 4, direction } });
  }

  handleHitSuccess(punchPower, direction) {}

  handleHitFail(punchPower, direction) {}

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
            0, //4 attack_jab
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
  playerStateSaga: PropTypes.object
};
LittleMack.contextTypes = {
  loop: PropTypes.object,
  engine: PropTypes.object,
  scale: PropTypes.number
};

export default LittleMack;
