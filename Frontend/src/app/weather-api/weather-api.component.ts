import {ChangeDetectionStrategy, Component, inject, input, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WeatherStatus } from "./weather-api.reducer";
import {PoiScheduleStore} from "../poi/poi-schedule/poi-schedule.store";
import {PointOfInterest} from "../poi/poi.reducer";
import {weatherApiActions} from "./weather-api.actions";
import {WeatherApiService} from "./weather-api.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
@Component({
  selector: 'app-weather-api',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './weather-api.component.html',
  styleUrl: './weather-api.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherApiComponent {
 protected readonly weatherapiservice = inject(WeatherApiService);

}
