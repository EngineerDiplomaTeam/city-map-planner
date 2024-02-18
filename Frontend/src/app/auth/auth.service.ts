import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';

export type AuthResult =
  | {
      type: 'successLogin';
      accessToken: string;
      tokenType: string;
      expiresIn: number;
      refreshToken: string;
    }
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

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
}
