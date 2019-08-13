import { Options } from '../options';

import { getControlState, getControl, putControlState } from '../api';
import { updateState } from './statesActions';

export const FETCH_CONTROL_BEGIN = 'FETCH_CONTROL_BEGIN';
export const FETCH_CONTROL_SUCCESS = 'FETCH_CONTROL_SUCCESS';
export const UPDATE_CONTROL_STATE = 'UPDATE_CONTROL_STATE';

const fetchControlBegin = () => ({
  type: FETCH_CONTROL_BEGIN
});

const fetchControlSuccess = control => ({
  type: FETCH_CONTROL_SUCCESS,
  payload: { control }
});

const updateControlState = control => ({
  type: UPDATE_CONTROL_STATE,
  payload: { control }
});

export const updateControl = (id, isImplemented) => {
  return dispatch => {
    return putControlState(Number(id), Boolean(isImplemented), Options).then(
      controlState => {
        dispatch(updateControlState(controlState));
        dispatch(updateState(controlState));
        return controlState;
      }
    );
  };
};

export const fetchControl = id => {
  return dispatch => {
    dispatch(fetchControlBegin());
    return getControl(Number(id), Options).then(control => {
      const controlDetails = { name: control.name, text: control.text };
      getControlState(Number(id), Options).then(state => {
        const control = { ...controlDetails, ...state };
        dispatch(fetchControlSuccess(control));
        return control;
      });
    });
  };
};
