import { createReducer, on } from '@ngrx/store';
import { weatherApiActions } from './weather-api.actions';

export type WeatherStatus = {
  time: string;
  weatherCode: number;
  temperature2M: number;
};

export const WEATHERAPISTATUS_FEATURE_KEY = 'weatherStatus';

export interface WeatherState {
  weatherStatus: WeatherStatus[];
}

const initialState: WeatherState = { weatherStatus: [] };

export const WeatherState = createReducer(
  initialState,
  on(
    weatherApiActions.weatherStatusLoaded,
    (state, { weather }): WeatherState => ({
      ...state,
      weatherStatus: weather,
    }),
  ),
);
