import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

declare global {
  interface ArrayConstructor {
    // no unwrapping of promises
    fromAsync<T>(asyncIterable: AsyncIterable<T>): Promise<Array<T>>;
    // unwrapping of promises
    fromAsync<T>(
      iterableOrArrayLike: Iterable<T> | ArrayLike<T>,
    ): Promise<Array<Awaited<T>>>;

    // no unwrapping of promises passed to callback
    // but callback promise is unwrapped
    fromAsync<T, U>(
      asyncIterable: AsyncIterable<T>,
      mapperFn: (value: T) => U,
      thisArg?: any,
    ): Promise<Array<Awaited<U>>>;
    // unwrapping on both sides
    fromAsync<T, U>(
      iterableOrArrayLike: Iterable<T> | ArrayLike<T>,
      mapperFn: (value: Awaited<T>) => U,
      thisArg?: any,
    ): Promise<Array<Awaited<U>>>;
  }

  interface ReadableStream<R = any> {
    [Symbol.asyncIterator](): AsyncIterableIterator<R>;
  }
}

/**
 * A polyfill for `ReadableStream.protototype[Symbol.asyncIterator]`,
 * aligning as closely as possible to the specification.
 *
 * @see https://streams.spec.whatwg.org/#rs-asynciterator
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#async_iteration
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const reader = this.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// ReadableStream.prototype.values ??= function ({ preventCancel = false } = {}) {
//   const reader = this.getReader();
//   return {
//     async next() {
//       try {
//         const result = await reader.read();
//         if (result.done) {
//           reader.releaseLock();
//         }
//         return result;
//       } catch (e) {
//         reader.releaseLock();
//         throw e;
//       }
//     },
//     async return(value: any) {
//       if (!preventCancel) {
//         const cancelPromise = reader.cancel(value);
//         reader.releaseLock();
//         await cancelPromise;
//       } else {
//         reader.releaseLock();
//       }
//       return { done: true, value };
//     },
//     [Symbol.asyncIterator]() {
//       return this;
//     },
//   };
// };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line
// ReadableStream.prototype[Symbol.asyncIterator] ??= ReadableStream.prototype.values;

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
