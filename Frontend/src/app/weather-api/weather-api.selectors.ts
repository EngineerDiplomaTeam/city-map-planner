import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  WeatherState,
  WEATHERAPISTATUS_FEATURE_KEY,
} from './weather-api.reducer';

export const selectWeatherState = createFeatureSelector<WeatherState>(
  WEATHERAPISTATUS_FEATURE_KEY,
);

export const selectAllWeather = createSelector(
  selectWeatherState,
  (state) => state.weatherStatus,
);
