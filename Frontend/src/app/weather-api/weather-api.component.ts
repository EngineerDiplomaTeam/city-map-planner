import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-weather-api',
  standalone: true,
  imports: [],
  templateUrl: './weather-api.component.html',
  styleUrl: './weather-api.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherApiComponent {

}
