import { createActionGroup, emptyProps, props } from '@ngrx/store';

// https://ngrx.io/guide/store/action-groups
export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    'Open dialog': emptyProps(),
    'Dialog opened': props<{ id: string }>(),
    'Dialog closed': emptyProps(),
    'Authenticated successfully': props<{
      email: string;
      accessToken: string;
      expiresIn: number;
      refreshToken: string;
    }>(),
  },
});
