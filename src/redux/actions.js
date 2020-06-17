import { ADD_ALLIANCE_COLORS, UPDATE_WORLD } from './constants';

export const addAllys = allyList => (
  {
    type: ADD_ALLIANCE_COLORS,
    allyList,
  }
);

export const updateWorld = world => (
  {
    type: UPDATE_WORLD,
    world,
  }
);