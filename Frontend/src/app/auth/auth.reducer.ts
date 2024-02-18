import { createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { AuthService } from './auth.service';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  dialogId?: string;
  user?: {
    email: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
  };
}

const initialState: AuthState = {};

export const authReducer = createReducer(
  initialState,
  on(
    authActions.dialogOpened,
    (state, { id }): AuthState => ({
      ...state,
      dialogId: id,
    }),
  ),
  on(
    authActions.dialogClosed,
    (state): AuthState => ({
      ...state,
      dialogId: undefined,
    }),
  ),
  on(
    authActions.authenticatedSuccessfully,
    (state, user): AuthState => ({
      ...state,
      user,
    }),
  ),
);
