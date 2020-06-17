import { UPDATE_WORLD } from './constants';

const INITIAL_STATE = {
  id: 48,
};

const worldReducer = (state = INITIAL_STATE, action) => {
  let newState;

  if (action.type === UPDATE_WORLD) {
    newState = { id: action.world };
    console.log(newState);
    return { ...state, ...newState };
  } else {
    return state;
  }
};

export default worldReducer;