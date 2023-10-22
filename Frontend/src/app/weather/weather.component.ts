import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { startWith, Subject, switchMap } from 'rxjs';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherComponent {
  protected readonly reload$ = new Subject<void>();
  protected readonly weather$ = this.reload$.pipe(
    startWith(() => null),
    switchMap(() => this.http.get<WeatherForecast[]>('/Api/WeatherForecast')),
  );

  constructor(private readonly http: HttpClient) {}
}
