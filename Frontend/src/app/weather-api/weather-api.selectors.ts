import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WEATHERSTATUS_FEATURE_KEY, WeatherState } from './weather-api.reducer';

export const selectWeatherState = createFeatureSelector<WeatherState>(
  WEATHERSTATUS_FEATURE_KEY,
);

export const selectAllWeather = createSelector(
  selectWeatherState,
  (state) => state.weatherStatus,
);
