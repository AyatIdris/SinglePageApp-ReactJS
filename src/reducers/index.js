import { combineReducers } from 'redux';
import controls from './controlsReducer';
import states from './statesReducer';
import control from './controlReducer';

export default combineReducers({
  controls: controls,
  states: states,
  control: control
});
