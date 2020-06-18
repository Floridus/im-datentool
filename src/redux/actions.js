import { ADD_ALLIANCE_COLORS, RESET_ALLIANCE_COLORS, UPDATE_WORLD } from './constants';

export const addAllys = (allyList) => (
  {
    type: ADD_ALLIANCE_COLORS,
    allyList,
  }
);

export const resetAllys = () => (
  {
    type: RESET_ALLIANCE_COLORS,
  }
);

export const updateWorld = world => (
  {
    type: UPDATE_WORLD,
    world,
  }
);