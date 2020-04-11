import { ADD_ALLIANCE_COLORS } from './constants';

export const addAllys = allyList => (
  {
    type: ADD_ALLIANCE_COLORS,
    allyList,
  }
);