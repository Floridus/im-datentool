import { combineReducers } from 'redux';

import allysReducer from './allysReducer';
import worldReducer from './worldReducer';

export default combineReducers({
  allys: allysReducer,
  world: worldReducer,
});