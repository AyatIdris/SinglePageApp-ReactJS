/* @flow */
import {
  extractControlId,
  extractStateId,
  type StateId,
  type ControlId,
  type Control,
  type ControlState,
} from './flow';

import {
  getControls,
  getControl,
  getControlState,
  putControlState,
  getStates,
  type Options,
} from './api';

export type { StateId, ControlId, Control, ControlState, Options };

export {
  getControls,
  getControl,
  getControlState,
  putControlState,
  getStates,
  extractControlId,
  extractStateId,
};
