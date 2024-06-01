import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WeatherService } from './weather.service';
import { weatherActions } from './weather.actions';
import { exhaustMap, map } from 'rxjs';

export class WeatherEffects {
  private readonly actions$ = inject(Actions);
  private readonly weather = inject(WeatherService);

  public readonly loadWeatherStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(weatherActions.loadWeatherStatus),
      exhaustMap(() => this.weather.listWeather()),
      map((weather) => weatherActions.weatherStatusLoaded({ weather })),
    );
  });
}
