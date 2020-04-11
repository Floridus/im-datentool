import { combineReducers } from 'redux';

import allysReducer from './allysReducer';

export default combineReducers({
  allys: allysReducer,
});