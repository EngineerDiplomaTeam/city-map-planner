import { ComponentStore } from '@ngrx/component-store';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../auth.service';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { authActions } from '../../auth.actions';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

export interface AuthenticateState {
  loading: boolean;
  view: 'auth-form' | '2fa-form' | 'confirm-email' | 'reset-password';
  confirmationEmailSentCount: number;
  snackBarRef?: MatSnackBarRef<unknown>;
}

@Injectable()
export class AuthenticateStore extends ComponentStore<AuthenticateState> {
  protected readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  public readonly store = inject(Store);
  private readonly snackBarRef = this.selectSignal(
    (state) => state.snackBarRef,
  );
  public readonly loading = this.selectSignal((state) => state.loading);
  public readonly view$ = this.select((state) => state.view);
  public readonly activationEmailSentCount = this.selectSignal(
    (state) => state.confirmationEmailSentCount,
  );

  constructor() {
    super({
      loading: false,
      view: 'auth-form',
      confirmationEmailSentCount: 0,
    });
  }

  private openErrorSnackBar(message: string): MatSnackBarRef<unknown> {
    return this.snackBar.open(message, undefined, {
      panelClass: 'error-snackbar',
    });
  }

  private unexpectedError(error: unknown): MatSnackBarRef<unknown> {
    console.warn('[Auth] an unexpected error occurred', error);
    return this.openErrorSnackBar('An unexpected error occurred');
  }

  private async handleLoginAttempt(
    email: string,
    password: string,
  ): Promise<void> {
    this.snackBarRef()?.dismiss();

    this.patchState(() => ({
      loading: true,
    }));

    const result = await firstValueFrom(
      this.authService.loginOrRegister(email, password).pipe(
        catchError((error: unknown) =>
          of({
            type: 'error',
            error,
          } as { type: 'error'; error: unknown }),
        ),
      ),
    );

    if (result.type === 'error') {
      return this.patchState(() => ({
        snackBarRef: this.unexpectedError(result.error),
        loading: false,
      }));
    }

    if (result.type === 'successLogin') {
      return this.store.dispatch(
        authActions.authenticatedSuccessfully({
          ...result,
          user: {
            email,
            refreshToken: result.refreshToken,
            accessToken: result.accessToken,
            tokenTimestamp: result.tokenTimestamp,
            expiresIn: result.expiresIn,
          },
        }),
      );
    }

    if (result.type === 'successRegister' || result.type === 'confirmEmail') {
      return this.patchState(() => ({
        view: 'confirm-email',
        loading: false,
      }));
    }

    if (result.type === 'badRegister') {
      const errors = Object.values(result.errors).join(' ');
      const ref = this.openErrorSnackBar(`Failed to register: ${errors}`);

      return this.patchState(() => ({
        loading: false,
        snackBarRef: ref,
      }));
    }

    const message =
      result.type === 'lockedOut'
        ? 'Account locked out'
        : 'Failed to authenticate';

    const ref = this.openErrorSnackBar(message);

    return this.patchState(() => ({
      loading: false,
      snackBarRef: ref,
    }));
  }

  public async onAuthFormSubmit(
    email: string,
    password: string,
  ): Promise<void> {
    await this.handleLoginAttempt(email, password);
  }

  public async sendActivationEmail(email: string): Promise<void> {
    if (this.loading()) return;
    this.snackBarRef()?.dismiss();

    this.patchState(() => ({
      loading: true,
    }));

    const error = await firstValueFrom(
      this.authService
        .sendActivationEmail(email)
        .pipe(map(() => false))
        .pipe(catchError((error: unknown) => of(error))),
    );

    if (error) {
      return this.patchState(() => ({
        snackBarRef: this.unexpectedError(error),
        loading: false,
      }));
    }

    this.patchState((state) => ({
      view: 'confirm-email',
      loading: false,
      confirmationEmailSentCount: state.confirmationEmailSentCount + 1,
    }));
  }

  public async sendForgotPasswordEmail(email: string): Promise<void> {
    if (this.loading()) return;
    this.snackBarRef()?.dismiss();

    this.patchState(() => ({
      loading: true,
    }));

    const error = await firstValueFrom(
      this.authService
        .sendForgotPasswordEmail(email)
        .pipe(map(() => false))
        .pipe(catchError((error: unknown) => of(error))),
    );

    if (error) {
      return this.patchState(() => ({
        snackBarRef: this.unexpectedError(error),
        loading: false,
      }));
    }

    this.patchState(() => ({
      loading: false,
      view: 'reset-password',
    }));
  }

  public async onForgotPasswordFormSubmit(
    email: string,
    resetCode: string,
    password: string,
  ): Promise<void> {
    if (this.loading()) return;
    this.snackBarRef()?.dismiss();

    this.patchState(() => ({
      loading: true,
    }));

    const error = await firstValueFrom(
      this.authService
        .resetPassword(email, resetCode, password)
        .pipe(map(() => false))
        .pipe(catchError((error: unknown) => of(error))),
    );

    if (error) {
      return this.patchState(() => ({
        snackBarRef: this.unexpectedError(error),
        loading: false,
      }));
    }

    // Now login user with new credentials
    await this.handleLoginAttempt(email, password);
  }
}
