export type WeatherStatus = {
  time: string;
  weathercode: number;
  temperature2M: number;
};
export interface WeatherState {
  weatherStatus: WeatherStatus[];
}
