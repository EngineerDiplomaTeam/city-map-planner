import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { MockInstance, ngMocks } from 'ng-mocks';
import { CommonModule } from '@angular/common'; // eslint-disable-line import/order
import { ApplicationModule, NgModule } from '@angular/core'; // eslint-disable-line import/order
import { BrowserModule } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations'; // eslint-disable-line import/order

ngMocks.autoSpy('jasmine');

ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(BrowserModule, true);

jasmine.getEnv().addReporter({
  specDone: MockInstance.restore,
  specStarted: MockInstance.remember,
  suiteDone: MockInstance.restore,
  suiteStarted: MockInstance.remember,
});

@NgModule({
  providers: [provideNoopAnimations()],
})
class GlobalTestingSetupModule {}

// Initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  [BrowserDynamicTestingModule, GlobalTestingSetupModule],
  platformBrowserDynamicTesting(),
  {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
);

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
}
