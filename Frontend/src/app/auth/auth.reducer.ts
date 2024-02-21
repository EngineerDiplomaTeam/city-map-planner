import { createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';
export type UserAuthData = {
  email: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  tokenTimestamp: number;
};

export interface AuthState {
  dialogId?: string;
  user?: UserAuthData;
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
    (state, { user }): AuthState => ({
      ...state,
      user,
    }),
  ),
  on(
    authActions.loadedUserFromLocalStorage,
    (state, { user }): AuthState => ({
      ...state,
      user,
    }),
  ),
  on(
    authActions.refreshedUserAuthData,
    (state, { user }): AuthState => ({
      ...state,
      user,
    }),
  ),
  on(
    authActions.logout,
    (state): AuthState => ({
      ...state,
      user: undefined,
    }),
  ),
);
