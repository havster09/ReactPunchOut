import { PistonHurricaneMoveMap } from './Constants';

export const translateState = (state) => {
  const activeMove = PistonHurricaneMoveMap.find(
   move => move.stateKey === state
  );
  return `State: ${activeMove.stateKey} Move: ${activeMove.move}`;
};

