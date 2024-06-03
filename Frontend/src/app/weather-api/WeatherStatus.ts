export type WeatherStatus = {
  time: string;
  weatherCode: number;
  temperature2M: number;
};
export interface WeatherState {
  weatherStatus: WeatherStatus[];
}
