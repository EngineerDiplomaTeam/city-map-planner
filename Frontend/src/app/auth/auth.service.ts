import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  EMPTY,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserAccount } from './auth.selectors';
import { UserAuthData } from './auth.reducer';
import { authActions } from './auth.actions';

export type AuthResult =
  | ({
      type: 'successLogin';
    } & Omit<UserAuthData, 'email'>)
  | {
      type: 'badLogin';
    }
  | {
      type: 'lockedOut';
    }
  | {
      type: 'successRegister';
    }
  | {
      type: 'badRegister';
      errors: Record<string, string[]>;
    }
  | {
      type: 'confirmEmail';
    };

export interface User2faData {
  sharedKey: string;
  recoveryCodesLeft: number;
  isTwoFactorEnabled: boolean;
  isMachineRemembered: boolean;
}

export interface Enable2faResponse {
  sharedKey: string;
  recoveryCodesLeft: number;
  recoveryCodes: string[];
  isTwoFactorEnabled: boolean;
  isMachineRemembered: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);
  private readonly userAuthData = this.store.selectSignal(selectUserAccount);
  private get currentSeconds(): number {
    return Math.round(Date.now() / 1000);
  }

  public async getAccessToken(): Promise<string> {
    const currentAuthData = this.userAuthData();
    if (!currentAuthData) return '';

    if (
      Date.now() / 1_000 - currentAuthData.tokenTimestamp >
      currentAuthData.expiresIn
    ) {
      const fresh = await this.refresh(currentAuthData.refreshToken);
      this.store.dispatch(
        authActions.refreshedUserAuthData({
          user: {
            email: currentAuthData.email,
            accessToken: fresh.accessToken,
            expiresIn: fresh.expiresIn,
            refreshToken: fresh.refreshToken,
            tokenTimestamp: this.currentSeconds,
          },
        }),
      );
      return fresh.accessToken;
    }

    return currentAuthData.accessToken;
  }

  public loginOrRegister(
    email: string,
    password: string,
  ): Observable<AuthResult> {
    const body = {
      email,
      password,
    };

    return this.http.get(`/Api/Exists?email=${email}`).pipe(
      map(() => true),
      catchError(async () => false),
      map((accountExists) =>
        accountExists === true ? '/Api/Login' : '/Api/Register',
      ),
      switchMap((endpoint) =>
        this.http.post(endpoint, body).pipe(
          map(
            (x): AuthResult =>
              endpoint === '/Api/Login'
                ? (Object.assign({}, x, {
                    type: 'successLogin',
                    tokenTimestamp: this.currentSeconds,
                  }) as AuthResult)
                : { type: 'successRegister' },
          ),
          // eslint-disable-next-line
          catchError((response: HttpErrorResponse): Observable<AuthResult> => {
            // Client side error
            if (response.error instanceof ErrorEvent || response.status === 0) {
              return throwError(() => response.error);
            }

            // Backend responded error
            const body = response.error;

            if (endpoint === '/Api/Login') {
              // Backend will add detail property when a user has to activate email
              if (body['detail'] === 'NotAllowed') {
                return of({
                  type: 'confirmEmail',
                });
              } else if (body['detail'] === 'LockedOut') {
                return of({
                  type: 'lockedOut',
                });
              } else if (body['detail'] === 'RequiresTwoFactor') {

              } else {
                return of({
                  type: 'badLogin',
                });
              }
            }

            const errors = (
              body as { type: 'badRegister'; errors: Record<string, string[]> }
            ).errors;

            return of({
              type: 'badRegister',
              errors,
            });
          }),
        ),
      ),
    );
  }

  public sendActivationEmail(email: string): Observable<unknown> {
    return this.http.post('/Api/ResendConfirmationEmail', { email });
  }

  public sendForgotPasswordEmail(email: string): Observable<unknown> {
    return this.http.post('/Api/ForgotPassword', { email });
  }

  public resetPassword(
    email: string,
    resetCode: string,
    newPassword: string,
  ): Observable<unknown> {
    return this.http.post('/Api/ResetPassword', {
      email,
      resetCode,
      newPassword,
    });
  }

  private async refresh(
    refreshToken: string,
  ): Promise<Omit<UserAuthData, 'email'>> {
    return await firstValueFrom(
      this.http.post<Omit<UserAuthData, 'email'>>('/Api/Refresh', {
        refreshToken,
      }),
    );
  }

  public async logout(): Promise<never> {
    return await firstValueFrom(
      this.http.post<never>('/Api/Logout', {}).pipe(catchError(() => EMPTY)),
    );
  }

  public async get2faData(): Promise<User2faData> {
    return await firstValueFrom(
      this.http.post<User2faData>('/Api/Manage/2fa', {}),
    );
  }

  public async getQrCode(code: string): Promise<string> {
    return await firstValueFrom(
      this.http.get<string>('/Api/generate-qr-code', {
        params: {
          code,
        },
      }),
    );
  }

  public async deleteMe(): Promise<void> {
    await firstValueFrom(this.http.post('/Api/DeleteMe', {}));
  }

  public async verify2fa(otp: string): Promise<Enable2faResponse> {
    return await firstValueFrom(
      this.http.post<Enable2faResponse>('/Api/Manage/2fa', {
        enable: true,
        twoFactorCode: otp,
      }),
    );
  }

  public async disable2fa() {
    return await firstValueFrom(
      this.http.post('/Api/Manage/2fa', {
        resetSharedKey: true,
      }),
    );
  }

  public async resetRecoveryCodes(): Promise<string[]> {
    return await firstValueFrom(
      this.http
        .post<{ recoveryCodes: string[] }>('/Api/Manage/2fa', {
          resetRecoveryCodes: true,
        })
        .pipe(map((r) => r.recoveryCodes)),
    );
  }
}
