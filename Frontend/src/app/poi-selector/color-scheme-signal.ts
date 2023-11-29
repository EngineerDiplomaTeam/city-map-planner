import { ChangeDetectorRef, DestroyRef, inject, signal } from '@angular/core';

const mediaQueryList = window.matchMedia('(prefers-color-scheme: light)');
const currentColorScheme = () => (mediaQueryList.matches ? 'light' : 'dark');

export const useColorScheme = () => {
  const cdr = inject(ChangeDetectorRef);
  const destroyRef = inject(DestroyRef);

  const internalSignal = signal(currentColorScheme());
  const listener = () => {
    internalSignal.set(currentColorScheme());
    cdr.detectChanges();
  };

  mediaQueryList.addEventListener('change', listener);
  destroyRef.onDestroy(() =>
    mediaQueryList.removeEventListener('change', listener),
  );

  return internalSignal.asReadonly();
};
