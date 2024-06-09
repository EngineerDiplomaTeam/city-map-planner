import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherIconsService {
  public weatherIcons: { [key: number]: string } = {
    0: 'assets/weather/morning-icon-0.svg',
    1: 'assets/weather/day-cloudy-icon-1.svg',
    2: 'assets/weather/cloud-icon-2.svg',
    3: 'assets/weather/cloudy-icon-3.svg',
    45: 'assets/weather/cloud-fog-icon.svg',
    48: 'assets/weather/night-cloud-fog-icon.svg',
    51: 'assets/weather/cloud-small-rain-icon-61-.webp',
    53: 'assets/weather/cloud-rain-icon-53-.svg',
    55: 'assets/weather/cloud-rain-icon-53-.svg',
    56: 'assets/weather/cloud-rain-icon-53-.svg',
    57: 'assets/weather/cloud-rain-icon-53-.svg',
    61: 'assets/weather/cloud-small-rain-icon-61-',
    63: 'assets/weather/cloud-rain-icon-53-.svg',
    65: 'assets/weather/cloud-rain-icon-53-.svg',
    66: 'assets/weather/cloud-snow-icon.svg',
    67: 'assets/weather/cloud-snow-icon.svg',
    71: 'assets/weather/cloud-snow-icon.svg',
    73: 'assets/weather/cloud-snow-icon.svg',
    75: 'assets/weather/cloud-snow-icon.svg',
    77: 'assets/weather/snow-icon.svg',
    80: 'assets/weather/day-cloud-rain-icon-80.svg',
    81: 'assets/weather/day-cloud-rain-icon-80.svg',
    82: 'assets/weather/day-cloud-rain-icon-80.svg',
    85: 'assets/weather/cloud-snow-icon.svg',
    86: 'assets/weather/cloud-snow-icon.svg',
    95: 'assets/weather/flash-thunder-icon-95.svg',
    96: 'assets/weather/cloud-rain-lightning-icon.svg',
    99: 'assets/weather/cloud-rain-lightning-icon.svg',
  };

  // Function to get the SVG based on weather condition code
  public getWeatherIcon(weathercode: number): string {
    const img = this.weatherIcons[weathercode];
    if (!img) {
      throw new Error(`No IMG found for condition code: ${weathercode}`);
    }
    return img;
  }
}
