import { PistonHurricaneMoveMap, spriteDefaultPos } from './Constants';

export const translateState = state => {
  const activeMove = PistonHurricaneMoveMap.find(
    move => move.stateKey === state
  );
  return activeMove.move;
};

export const playerIsInAttackState = playerStateSaga =>
  [4, 5, 6, 7].indexOf(playerStateSaga.state) > -1;

export const playerIsInIdleState = playerStateSaga => playerStateSaga.state === 0;

export const isPlayerPowerPunch = state => [6, 7].indexOf(state) > -1;

const leftPositionByDirection = (stateSaga, currentStep) => {
  if (stateSaga.position.left[currentStep]) {
    if (stateSaga.direction) {
      return stateSaga.position.left[currentStep];
    } else {
      return 1 - stateSaga.position.left[currentStep];
    }
  }
  return 0;
};

export const getLeftPosition = (stateSaga, currentStep) => stateSaga.position
 ? leftPositionByDirection(stateSaga, currentStep) + spriteDefaultPos.left
 : spriteDefaultPos.left;

const topPosition = (stateSaga, currentStep) => {
  if (stateSaga.position.top[currentStep]) {
    return stateSaga.position.top[currentStep];
  }
  return 0;
};

export const getTopPosition = (stateSaga, currentStep) => stateSaga.position
 ? topPosition(stateSaga, currentStep) + spriteDefaultPos.top
 : spriteDefaultPos.top;