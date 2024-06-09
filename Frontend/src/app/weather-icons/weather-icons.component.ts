import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-weather-icons',
  standalone: true,
  imports: [],
  templateUrl: './weather-icons.component.html',
  styleUrl: './weather-icons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherIconsComponent {}
