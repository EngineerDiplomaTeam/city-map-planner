import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { WeatherStatus } from "./weather.reducer";

export const weatherActions = createActionGroup({
  source: 'Weather',
  events: {
    'Load WeatherStatus': emptyProps(),
    'WeatherStatus loaded': props<{ weather: WeatherStatus[] }>(),
  },
});