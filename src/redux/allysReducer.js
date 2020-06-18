import { ADD_ALLIANCE_COLORS, RESET_ALLIANCE_COLORS } from './constants';

const INITIAL_STATE = {
  list: [],
};

const allysReducer = (state = INITIAL_STATE, action) => {
  let newState;

  if (action.type === ADD_ALLIANCE_COLORS) {
    if (state.list.length === 0)
      newState = { list: action.allyList };
    return { ...state, ...newState };
  } else if (action.type === RESET_ALLIANCE_COLORS) {
    newState = { list: [] };
    return { ...state, ...newState };
  } else {
    return state;
  }
};

export default allysReducer;