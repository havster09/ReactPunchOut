import { PistonHurricaneMoveMap } from './Constants';

export const translateState = (state) => {
  const activeMove = PistonHurricaneMoveMap.find(
   move => move.stateKey === state
  );
  return activeMove.move;
};

