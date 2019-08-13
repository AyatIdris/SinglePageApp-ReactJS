import { getStates } from '../api';
import { Options } from '../options';

export const FETCH_STATES_BEGIN = 'FETCH_STATES_BEGIN';
export const FETCH_STATES_SUCCESS = 'FETCH_STATES_SUCCESS';
export const REPLACE_STATE = 'REPLACE_STATE';

const fetchStatesBegin = () => ({
  type: FETCH_STATES_BEGIN
});

const fetchStatesSuccess = states => ({
  type: FETCH_STATES_SUCCESS,
  payload: { states }
});

const replaceState = controlState => ({
  type: REPLACE_STATE,
  payload: { controlState }
});

export const updateState = controlState => dispatch =>
  dispatch(replaceState(controlState));

export const fetchStates = () => {
  return dispatch => {
    dispatch(fetchStatesBegin());
    return getStates(Options).then(states => {
      dispatch(fetchStatesSuccess(states));
      return states;
    });
  };
};
