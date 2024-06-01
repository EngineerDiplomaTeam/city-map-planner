import { createReducer, on } from '@ngrx/store';
import { weatherActions } from './weather.actions';

export type WeatherStatus = {
  time: string;
  weathercode: number;
  temperature: number;
};

export const WEATHERSTATUS_FEATURE_KEY = 'weatherStatus';

export interface WeatherState {
  weatherStatus: WeatherStatus[];
}

const initialState: WeatherState = { weatherStatus: [] };

export const WeatherState = createReducer(
  initialState,
  on(
    weatherActions.weatherStatusLoaded,
    (state, { weather }): WeatherState => ({
      ...state,
      weatherStatus: weather,
    }),
  ),
);
