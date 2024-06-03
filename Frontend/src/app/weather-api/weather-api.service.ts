import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherStatus } from './WeatherStatus';

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  private http = inject(HttpClient);

  public listWeather(): Observable<WeatherStatus[]> {
    return this.http.get<WeatherStatus[]>('/Api/WeatherStatus/List');
  }
}
