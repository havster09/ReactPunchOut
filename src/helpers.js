import { PistonHurricaneMoveMap } from './Constants';

export const translateState = state => {
  const activeMove = PistonHurricaneMoveMap.find(
    move => move.stateKey === state
  );
  return activeMove.move;
};

export const playerIsInAttackState = playerStateSaga =>
  [4, 5, 6, 7].indexOf(playerStateSaga.state) > -1;

export const isPlayerPowerPunch = state => [6, 7].indexOf(state) > -1;
