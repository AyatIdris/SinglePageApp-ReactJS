/* @flow */
import {
  type ControlId,
  type StateId,
  extractControlId,
  extractStateId,
} from './flow';

import Initial from './initial.json';

const StorageKey = 'appState';

type RepositoryState = {|
  +id: StateId,
  +isImplemented: boolean,
|};

type RepositoryControl = {|
  +id: ControlId,
  +name: string,
  +text: string,
  +state: RepositoryState | null,
|};

type RepositoryControlWithState = {|
  +id: ControlId,
  +name: string,
  +text: string,
  +state: RepositoryState,
|};

type RepositoryData = Map<ControlId, RepositoryControl>;

function extractRepositoryState(stateData: mixed): RepositoryState | null {
  if (!stateData) {
    return null;
  }

  /* Build the RepositoryState object while validating it */
  if (typeof stateData === 'object') {
    const { id, isImplemented } = stateData;

    if (typeof id === 'number' && typeof isImplemented === 'boolean') {
      return { id: extractStateId(id), isImplemented };
    }
  }

  throw new Error(`Not a RepositoryState: ${JSON.stringify(stateData)}`);
}

function extractRepositoryControl(controlData: mixed): RepositoryControl {
  /* Build the RepositoryControl object while validating it */
  if (controlData && typeof controlData === 'object') {
    const { id, name, text, state: stateData } = controlData;

    if (
      typeof id === 'number' &&
      typeof name === 'string' &&
      typeof text === 'string'
    ) {
      return {
        id: extractControlId(id),
        name,
        text,
        state: extractRepositoryState(stateData),
      };
    }
  }

  throw new Error(`Not a RepositoryControl: ${JSON.stringify(controlData)}`);
}

export default class Repository {
  +data: RepositoryData;
  lastControlId: ControlId;
  lastStateId: StateId;

  constructor(data: RepositoryData) {
    this.data = data;
    this.lastControlId = extractControlId(-1);
    this.lastStateId = extractStateId(-1);

    data.forEach(control => {
      if (control.id > this.lastControlId) {
        this.lastControlId = control.id;
      }
      if (control.state && control.state.id > this.lastStateId) {
        this.lastStateId = control.state.id;
      }
    });
  }

  putState(
    controlId: ControlId,
    isImplemented: boolean,
  ): RepositoryControlWithState {
    const control = this.data.get(controlId);
    if (!control) {
      throw new Error(`Control does not exist: ${controlId}`);
    }

    const id = extractStateId(++this.lastStateId);
    const state = { id, isImplemented };
    const newControl: RepositoryControlWithState = {
      id: control.id,
      name: control.name,
      text: control.text,
      state,
    };

    this.data.set(controlId, newControl);
    this.toLocalStorage();

    return newControl;
  }

  toLocalStorage() {
    const payload: Array<RepositoryControl> = Array.from(this.data.values());
    window.localStorage.setItem(StorageKey, JSON.stringify(payload));
  }

  static fromLocalStorage() {
    const serialized: string = window.localStorage.getItem(StorageKey);
    const payload = serialized ? JSON.parse(serialized) : Initial;

    if (!Array.isArray(payload)) {
      throw new Error(`Not an array`);
    }

    const data: RepositoryData = new Map();

    payload.forEach(controlData => {
      const control = extractRepositoryControl(controlData);
      data.set(control.id, control);
    });

    return new Repository(data);
  }
}
