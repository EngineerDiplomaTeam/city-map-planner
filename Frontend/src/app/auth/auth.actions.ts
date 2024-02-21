import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserAuthData } from './auth.reducer';

// https://ngrx.io/guide/store/action-groups
export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    'Open dialog': emptyProps(),
    'Dialog opened': props<{ id: string }>(),
    'Dialog closed': emptyProps(),
    'Authenticated successfully': props<{ user: UserAuthData }>(),
    'Load user from localStorage': emptyProps(),
    'Loaded user from localStorage': props<{ user: UserAuthData }>(),
    'Refreshed user auth data': props<{ user: UserAuthData }>(),
    Logout: emptyProps(),
    'Delete me': emptyProps(),
  },
});
