import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY, AuthState } from './auth.reducer';

const selectAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectOpenedDialogId = createSelector(
  selectAuthState,
  (state) => state.dialogId,
);

export const selectUserAccount = createSelector(
  selectAuthState,
  (state) => state.user,
);
