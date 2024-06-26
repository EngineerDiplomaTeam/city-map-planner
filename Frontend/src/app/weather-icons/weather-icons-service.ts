import { Injectable } from '@angular/core';
import { WeatherStatus } from '../weather-api/WeatherStatus';

@Injectable({
  providedIn: 'root',
})
export class WeatherIconsService {
  public weatherIcons: { [key: number]: [string, string] } = {
    0: ['assets/weather/morning-icon-0.svg', 'Clear Sky'],
    1: ['assets/weather/day-cloudy-icon-1.svg', 'Mainly Clear'],
    2: ['assets/weather/cloud-icon-2.svg', 'Partly Cloudy'],
    3: ['assets/weather/cloudy-icon-3.svg', 'Overcast'],
    45: ['assets/weather/cloud-fog-icon.svg', 'Fog'],
    48: ['assets/weather/night-cloud-fog-icon.svg', 'Depositing Rime Fog'],
    51: ['assets/weather/cloud-small-rain-icon-61-.webp', 'Light Drizzle'],
    53: ['assets/weather/cloud-rain-icon-53-.svg', 'Moderate Drizzle'],
    55: ['assets/weather/cloud-rain-icon-53-.svg', 'Dense Drizzle'],
    56: ['assets/weather/cloud-rain-icon-53-.svg', 'Light Freezing Drizzle'],
    57: ['assets/weather/cloud-rain-icon-53-.svg', 'Dense Freezing Drizzle'],
    61: ['assets/weather/cloud-small-rain-icon-61-.webp', 'Slight Rain'],
    63: ['assets/weather/cloud-rain-icon-53-.svg', 'Moderate Rain'],
    65: ['assets/weather/cloud-rain-icon-53-.svg', 'Heavy Rain'],
    66: ['assets/weather/cloud-snow-icon.svg', 'Light Freezing Rain'],
    67: ['assets/weather/cloud-snow-icon.svg', 'Heavy Freezing Rain'],
    71: ['assets/weather/cloud-snow-icon.svg', 'Slight Snow Fall'],
    73: ['assets/weather/cloud-snow-icon.svg', 'Moderate Snow Fall'],
    75: ['assets/weather/cloud-snow-icon.svg', 'Heavy Snow Fall'],
    77: ['assets/weather/snow-icon.svg', 'Snow Grains'],
    80: ['assets/weather/day-cloud-rain-icon-80.svg', 'Slight Rain Showers'],
    81: ['assets/weather/day-cloud-rain-icon-80.svg', 'Moderate Rain Showers'],
    82: ['assets/weather/day-cloud-rain-icon-80.svg', 'Violent Rain Showers'],
    85: ['assets/weather/cloud-snow-icon.svg', 'Slight Snow Showers'],
    86: ['assets/weather/cloud-snow-icon.svg', 'Heavy Snow Showers'],
    95: ['assets/weather/flash-thunder-icon-95.svg', 'Thunderstorm'],
    96: [
      'assets/weather/cloud-rain-lightning-icon.svg',
      'Thunderstorm With Light Hail',
    ],
    99: [
      'assets/weather/cloud-rain-lightning-icon.svg',
      'Thunderstorm With HeavyHail',
    ],
  };
  findClosestWeather(
    statuses: WeatherStatus[],
    now: Date,
  ): WeatherStatus | null {
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

  // Function to get the IMG based on weather condition code
  public getWeatherIconSrc(weathercode: number): string {
    const img = this.weatherIcons[weathercode];
    if (!img) {
      throw new Error(`No IMG found for condition code: ${weathercode}`);
    }
    return img[0];
  }
  public getWeatherName(weathercode: number): string {
    const img = this.weatherIcons[weathercode];
    if (!img) {
      throw new Error(`No IMG found for condition code: ${weathercode}`);
    }
    return img[1];
  }
}
