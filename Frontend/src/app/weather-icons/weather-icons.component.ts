import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { AsyncPipe, NgIf, CommonModule } from '@angular/common';
import { WeatherStatus } from '../weather-api/WeatherStatus';
import { map, Observable } from 'rxjs';
import { WeatherApiService } from '../weather-api/weather-api.service';
import { WeatherIconsService } from './weather-icons-service';

@Component({
  selector: 'app-weather-icons',
  standalone: true,
  imports: [AsyncPipe, NgIf, CommonModule],
  templateUrl: './weather-icons.component.html',
  styleUrl: './weather-icons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherIconsComponent {
  private readonly weatherApiService = inject(WeatherApiService);
  protected readonly weatherIconService = inject(WeatherIconsService);

  protected now = new Date();
  @Input() data!: string;
  @Input() dateFormat!: Date;

  protected closestWeather$: Observable<WeatherStatus | null> =
    this.weatherApiService
      .listWeather()
      .pipe(
        map((statuses: WeatherStatus[]) =>
          this.weatherIconService.findClosestWeather(
            statuses,
            this.dateValue(),
          ),
        ),
      );
  protected dateValue(): Date {
    if (this.dateFormat != null) {
      return this.dateFormat;
    } else if (this.data == null) {
      return this.now;
    } else {
      return this.transform(this.data);
    }
  }

  public transform(
    value: (Date & string) | string | (number[] & string),
  ): Date {
    let date: Date;

    if (typeof value === 'string') {
      date = new Date(value);
    } else if (Array.isArray(value)) {
      const [
        year,
        month,
        day,
        hours,
        minutes,
        seconds,
        milliseconds,
      ]: number[] & string = value;
      date = new Date(
        Date.UTC(year, month - 1, day, hours, minutes, seconds, milliseconds),
      );
    } else {
      throw new Error('Invalid date input');
    }

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date input');
    }

    return new Date(date.toUTCString());
  }
}
