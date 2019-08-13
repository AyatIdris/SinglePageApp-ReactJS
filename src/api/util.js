/* @flow */

export function* mapIter<T1, T2>(
  iter: Iterator<T1>,
  transform: T1 => T2,
): Iterator<T2> {
  for (let e of iter) {
    yield transform(e);
  }
}

export function* filterIter<T1>(
  iter: Iterator<T1>,
): Iterator<$NonMaybeType<T1>> {
  for (let e of iter) {
    if (e) {
      yield e;
    }
  }
}
