import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WeatherIconsService } from "../weather-icons/weather-icons-service";
import { WeatherApiService } from './weather-api.service';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { WeatherStatus } from './WeatherStatus';
import { map, Observable } from 'rxjs';
@Component({
  selector: 'app-weather-api',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, NgForOf, NgIf],
  templateUrl: './weather-api.component.html',
  styleUrl: './weather-api.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherApiComponent {
  private readonly weatherApiService = inject(WeatherApiService);
  protected readonly weatherIconService = inject(WeatherIconsService);
  protected weather = this.weatherApiService.listWeather();
  protected closestWeather$: Observable<WeatherStatus | null> =
    this.weatherApiService
      .listWeather()
      .pipe(
        map((statuses: WeatherStatus[]) => this.findClosestWeather(statuses)),
      );

  private findClosestWeather(statuses: WeatherStatus[]): WeatherStatus | null {
    const now = new Date();
    const roundedNow = this.roundToNearest15Minutes(now);
    let closest: WeatherStatus | null = null;
    const ms = 1000 * 60 * 15;
    for (const status of statuses) {
      const statusTime = new Date(status.time);

      if (statusTime.getTime() === roundedNow.getTime() - ms) {
        closest = status;
        break;
      } else if (statusTime.getTime() === roundedNow.getTime()) {
        closest = status;
        break;
      } else if (statusTime.getTime() === roundedNow.getTime() + ms) {
        closest = status;
        break;
      }
    }

    return closest;
  }

  private roundToNearest15Minutes(date: Date): Date {
    const ms = 1000 * 60 * 15; // 15 minutes in milliseconds
    const rounded = new Date(Math.round(date.getTime() / ms) * ms);
    // Ensure rounding to the previous 15 minutes if we are past the 7.5 minute mark
    if (rounded.getTime() > date.getTime()) {
      rounded.setTime(rounded.getTime() - ms);
    }
    return rounded;
  }
}
