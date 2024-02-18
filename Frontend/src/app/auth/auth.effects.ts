import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, exhaustMap, map, switchMap } from 'rxjs';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import { authActions } from './auth.actions';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialog = inject(MatDialog);

  public readonly openAuthDialog$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.openDialog),
      exhaustMap(
        async () =>
          this.dialog.open(AuthDialogComponent, {
            width: '90svw',
            height: '70svh',
            disableClose: true,
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
}
