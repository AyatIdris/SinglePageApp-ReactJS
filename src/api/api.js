/* @flow */
import { type ControlId, type Control, type ControlState } from './flow';

import Repository from './Repository';
import { mapIter, filterIter } from './util';

export type Options = {
  delay: boolean,
  fail: boolean,
};

type Deferred<T> = {
  resolve: T => mixed,
  promise: Promise<T>,
};

const LongDelay = 5000;
const ShortDelay = 1000;
const MaxRequests = 5;

let liveRequests = 0;
let requestQueue: Array<Deferred<void>> = [];

let t0: number;

let currentRepository: ?Repository;

function time() {
  const t = new Date().getTime() / 1000;

  if (!t0) {
    t0 = t;
  }

  const seconds = Math.round(t - t0);
  return `+${seconds}s`.padEnd(6);
}

function defer<T>(): Deferred<T> {
  let resolve;
  const promise = new Promise(r => (resolve = r));

  // $FlowFixMe: Promise callback evaluates immediately
  return { resolve, promise };
}

function ensureRepository(): Repository {
  if (!currentRepository) {
    currentRepository = Repository.fromLocalStorage();
  }
  return currentRepository;
}

function enterRequest(path: string): Promise<Repository> {
  const log = () => {
    console.log(`${time()} > ${path}`);
  };

  if (liveRequests >= MaxRequests) {
    console.log(`${time()} . ${path} (blocked: too many concurrent requests)`);
    const deferred = defer();
    requestQueue.push(deferred);
    return deferred.promise.then(() => {
      log();
      return ensureRepository();
    });
  }

  liveRequests++;
  log();
  return Promise.resolve(ensureRepository());
}

function exitRequest(path: string) {
  console.log(`${time()} < ${path}`);

  const deferred = requestQueue.shift();
  if (deferred) {
    deferred.resolve();
  } else {
    liveRequests--;
  }
}

function delayOrFailRequest<T>(
  options: Options,
  delayDuration: number,
  t: T,
): Promise<T> {
  const { delay, fail } = options;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('API Call Failed'));
      } else {
        resolve(t);
      }
    }, delay ? delayDuration : 0);
  });
}

function wrap<T>(
  options: Options,
  delayDuration: number,
  path: string,
  apply: Repository => T,
): Promise<T> {
  return enterRequest(path)
    .then(repository => apply(repository))
    .then(r => delayOrFailRequest(options, delayDuration, r))
    .finally(() => exitRequest(path));
}

export function getControls(options: Options): Promise<Array<Control>> {
  return wrap(options, LongDelay, 'GET /controls', repository => {
    const controlsIter = mapIter(
      repository.data.values(),
      ({ id, name, text }) => {
        return { id, name, text };
      },
    );

    return Array.from(controlsIter);
  });
}

export function getControl(
  controlId: ControlId,
  options: Options,
): Promise<Control> {
  return wrap(options, ShortDelay, `GET /controls/${controlId}`, repository => {
    const control = repository.data.get(controlId);
    if (!control) {
      throw new Error(`Control not found`);
    }
    const { id, name, text } = control;
    return { id, name, text };
  });
}

export function getControlState(
  controlId: ControlId,
  options: Options,
): Promise<?ControlState> {
  return wrap(
    options,
    ShortDelay,
    `GET /controls/${controlId}/state`,
    repository => {
      const control = repository.data.get(controlId);
      if (!control) {
        throw new Error(`Control not found`);
      }
      if (!control.state) {
        return null;
      }
      return {
        ...control.state,
        controlId: control.id,
      };
    },
  );
}

export function putControlState(
  controlId: ControlId,
  isImplemented: boolean,
  options: Options,
): Promise<ControlState> {
  return wrap(
    options,
    ShortDelay,
    `PUT /controls/${controlId}/state`,
    repository => {
      const control = repository.data.get(controlId);
      if (!control) {
        throw new Error(`Control not found: ${controlId}`);
      }
      const { id, state } = repository.putState(controlId, isImplemented);
      return {
        ...state,
        controlId: id,
      };
    },
  );
}

export function getStates(options: Options): Promise<Array<ControlState>> {
  return wrap(options, LongDelay, 'GET /states', repository => {
    const statesIter = filterIter(
      mapIter(repository.data.values(), control => {
        const { id, state } = control;
        if (!state) {
          return null;
        }
        return { ...state, controlId: id };
      }),
    );

    return Array.from(statesIter);
  });
}
