export function* pairwise<T>(iterable: Iterable<T>): Generator<[T, T], void> {
  const iterator = iterable[Symbol.iterator]();
  let a = iterator.next();
  if (a.done) return;
  let b = iterator.next();
  while (!b.done) {
    yield [a.value, b.value];
    a = b;
    b = iterator.next();
  }
}
