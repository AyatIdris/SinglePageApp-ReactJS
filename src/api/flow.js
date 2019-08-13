/* @flow */

/* Use opaque types so these IDs can't be confused for one another (outside of
  * when they're instantiated, of course) */

export opaque type ControlId: number = number;
export opaque type StateId: number = number;

export type Control = {|
  +id: ControlId,
  +name: string,
  +text: string,
|};

export type ControlState = {|
  +id: StateId,
  +controlId: ControlId,
  +isImplemented: boolean,
|};

export function extractControlId(r: number): ControlId {
  return r;
}

export function extractStateId(r: number): StateId {
  return r;
}
