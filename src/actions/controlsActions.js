import { Options } from '../options';

import { getControls } from '../api';

export const FETCH_CONTROLS_BEGIN = 'FETCH_CONTROLS_BEGIN';
export const FETCH_CONTROLS_SUCCESS = 'FETCH_CONTROLS_SUCCESS';

const fetchControlsBegin = () => ({
  type: FETCH_CONTROLS_BEGIN
});

const fetchControlsSuccess = controls => ({
  type: FETCH_CONTROLS_SUCCESS,
  payload: { controls }
});

export const fetchControls = () => {
  return dispatch => {
    dispatch(fetchControlsBegin());
    return getControls(Options).then(controls => {
      dispatch(fetchControlsSuccess(controls));
      return controls;
    });
  };
};
