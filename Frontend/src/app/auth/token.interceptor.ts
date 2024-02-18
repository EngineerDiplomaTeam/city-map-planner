import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { from, switchMap } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/Api/Refresh')) return next(req);

  const authService = inject(AuthService);
  const userToken = from(authService.getAccessToken());

  return userToken.pipe(
    switchMap((userToken) =>
      next(
        req.clone({
          headers: req.headers.set('Authorization', `Bearer ${userToken}`),
        }),
      ),
    ),
  );
};
