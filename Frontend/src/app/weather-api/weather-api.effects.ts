import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WeatherApiService } from './weather-api.service';
import { weatherApiActions } from './weather-api.actions';
import { exhaustMap, map } from 'rxjs';

export class WeatherApiEffects {
  private readonly actions$ = inject(Actions);
  private readonly weather = inject(WeatherApiService);

  public readonly loadWeatherStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(weatherApiActions.loadWeatherStatus),
      exhaustMap(() => this.weather.listWeather()),
      map((weather) => weatherApiActions.weatherStatusLoaded({ weather })),
    );
  });
}
