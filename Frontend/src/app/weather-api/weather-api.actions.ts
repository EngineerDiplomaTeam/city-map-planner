import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { WeatherStatus } from './weather-api.reducer';

export const weatherApiActions = createActionGroup({
  source: 'Weather',
  events: {
    'Load WeatherStatus': emptyProps(),
    'WeatherStatus loaded': props<{ weather: WeatherStatus[] }>(),
  },
});
