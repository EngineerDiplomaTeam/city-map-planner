import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, exhaustMap, map, switchMap } from 'rxjs';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { authActions } from './auth.actions';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectUserAccount } from './auth.selectors';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  public readonly openAuthDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.openDialog),
      exhaustMap(
        async () =>
          this.dialog.open(AuthDialogComponent, {
            width: '90svw',
            height: '70svh',
          }).id,
      ),
      map((id) => authActions.dialogOpened({ id })),
    );
  });

  public readonly authDialogClosed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.dialogOpened),
      switchMap(
        ({ id }) => this.dialog.getDialogById(id)?.afterClosed() ?? EMPTY,
      ),
      map(() => authActions.dialogClosed()),
    );
  });

  public readonly saveUserToLocalStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          authActions.authenticatedSuccessfully,
          authActions.refreshedUserAuthData,
        ),
        switchMap(() => this.store.select(selectUserAccount)),
        map((user) => localStorage.setItem('user', JSON.stringify(user))),
      );
    },
    { dispatch: false },
  );

  public readonly loadUserFromLocalStorage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.loadUserFromLocalStorage),
      map(() => {
        const json = localStorage.getItem('user');
        if (!json) return undefined;

        try {
          return JSON.parse(json);
        } catch (e) {
          console.warn(e, '[Auth] Failed to parse stored user');
          return undefined;
        }
      }),
      map((user) => authActions.loadedUserFromLocalStorage({ user })),
    );
  });

  public readonly deleteMe$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.deleteMe),
      switchMap(() => this.authService.deleteMe()),
      map(() => authActions.logout()),
    );
  });

  public readonly removeUserFromLocalStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.logout),
        map(() => {
          localStorage.removeItem('user');
        }),
      );
    },
    { dispatch: false },
  );
}
