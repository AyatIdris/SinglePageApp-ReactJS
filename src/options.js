/* @flow */
import { type Options as OptionsType } from './api';

/*
 *
 * You don't have to use this file to set up the API options when making API
 * calls, but it's a good idea to centralize options and set delay: false while
 * iterating on the app so you don't have to wait on the slow API constantly!
 *
 * E.g.:
 *
 * ```
 * import { getStates, } from './api';
 * import { Options } from './options';
 * ```
 *
 * Then, somewhere: `getStates(Options).then(...)`
 *
 */

export const Options: OptionsType = {
  delay: true,
  fail: false,
};
