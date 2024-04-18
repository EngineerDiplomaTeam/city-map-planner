using System.Globalization;
using System.Text.Json;

namespace WebApi.Weather;

public class WeatherClient
{
   private readonly string _weatherApiUrl = "https://api.open-meteo.com/v1/forecast";
        private readonly HttpController httpController;

        /// <summary>
        /// Creates a new <seealso cref="OpenMeteoClient"/> object and sets the neccessary variables (httpController, CultureInfo)
        /// </summary>
        public WeatherClient()
        {
            httpController = new HttpController();
        }



        /// <summary>
        /// Performs one GET-Request
        /// </summary>
        /// <param name="options"></param>
        /// <returns>Awaitable Task containing WeatherForecast or NULL</returns>
        public async Task<WeatherForecast?> QueryAsync(WeatherForecastOptions options)
        {
            try
            {
                return await GetWeatherForecastAsync(options);
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Performs one GET-Request to get weather information
        /// </summary>
        /// <param name="latitude">City latitude</param>
        /// <param name="longitude">City longitude</param>
        /// <returns>Awaitable Task containing WeatherForecast or NULL</returns>
        public async Task<WeatherForecast?> QueryAsync(float latitude, float longitude)
        {
            WeatherForecastOptions options = new WeatherForecastOptions
            {
                Latitude = latitude,
                Longitude = longitude,
                
            };
            return await QueryAsync(options);
        }








        public WeatherForecast? Query(WeatherForecastOptions options)
        {
            return QueryAsync(options).GetAwaiter().GetResult();
        }

        public WeatherForecast? Query(float latitude, float longitude)
        {
            return QueryAsync(latitude, longitude).GetAwaiter().GetResult();
        }



        



        /// <summary>
        /// Converts a given weathercode to it's string representation
        /// </summary>
        /// <param name="weathercode"></param>
        /// <returns><see cref="string"/> Weathercode string representation</returns>
        public string WeathercodeToString(int weathercode)
        {
            switch (weathercode)
            {
                case 0:
                    return "Clear sky";
                case 1:
                    return "Mainly clear";
                case 2:
                    return "Partly cloudy";
                case 3:
                    return "Overcast";
                case 45:
                    return "Fog";
                case 48:
                    return "Depositing rime Fog";
                case 51:
                    return "Light drizzle";
                case 53:
                    return "Moderate drizzle";
                case 55:
                    return "Dense drizzle";
                case 56:
                    return "Light freezing drizzle";
                case 57:
                    return "Dense freezing drizzle";
                case 61:
                    return "Slight rain";
                case 63:
                    return "Moderate rain";
                case 65:
                    return "Heavy rain";
                case 66:
                    return "Light freezing rain";
                case 67:
                    return "Heavy freezing rain";
                case 71:
                    return "Slight snow fall";
                case 73:
                    return "Moderate snow fall";
                case 75:
                    return "Heavy snow fall";
                case 77:
                    return "Snow grains";
                case 80:
                    return "Slight rain showers";
                case 81:
                    return "Moderate rain showers";
                case 82:
                    return "Violent rain showers";
                case 85:
                    return "Slight snow showers";
                case 86:
                    return "Heavy snow showers";
                case 95:
                    return "Thunderstorm";
                case 96:
                    return "Thunderstorm with light hail";
                case 99:
                    return "Thunderstorm with heavy hail";
                default:
                    return "Invalid weathercode";
            }
        }

        private async Task<WeatherForecast?> GetWeatherForecastAsync(WeatherForecastOptions options)
        {
            try
            {
                HttpResponseMessage response = await httpController.Client.GetAsync(MergeUrlWithOptions(_weatherApiUrl, options));
                response.EnsureSuccessStatusCode();

                WeatherForecast? weatherForecast = await JsonSerializer.DeserializeAsync<WeatherForecast>(await response.Content.ReadAsStreamAsync(), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });
                return weatherForecast;
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine(e.StackTrace);
                return null;
            }

        }
        

        private string MergeUrlWithOptions(string url, WeatherForecastOptions? options)
        {
            if (options == null) return url;

            UriBuilder uri = new UriBuilder(url);
            bool isFirstParam = false;

            // If no query given, add '?' to start the query string
            if (uri.Query == string.Empty)
            {
                uri.Query = "?";

                // isFirstParam becomes true because the query string is new
                isFirstParam = true;
            }

            // Add the properties
            
            // Begin with Latitude and Longitude since they're required
            if (isFirstParam)
                uri.Query += "latitude=" +  options.Latitude.ToString(CultureInfo.InvariantCulture);
            else
                uri.Query += "&latitude=" + options.Latitude.ToString(CultureInfo.InvariantCulture);

            uri.Query += "&longitude=" + options.Longitude.ToString(CultureInfo.InvariantCulture);

            uri.Query += "&temperature_unit=" + options.Temperature_Unit.ToString();
            uri.Query += "&precipitation_unit=" + options.Precipitation_Unit.ToString();
            if (options.Timezone != string.Empty)
                uri.Query += "&timezone=" + options.Timezone;

            uri.Query += "&timeformat=" + options.Timeformat.ToString();

            uri.Query += "&past_days=" + options.Past_Days;

            if (options.Start_date != string.Empty)
                uri.Query += "&start_date=" + options.Start_date;
            if (options.End_date != string.Empty)
                uri.Query += "&end_date=" + options.End_date;

            // Now we iterate through hourly and daily

            // Hourly
            if (options.Hourly.Count > 0)
            {
                bool firstHourlyElement = true;
                uri.Query += "&hourly=";

                foreach (var option in options.Hourly)
                {
                    if (firstHourlyElement)
                    {
                        uri.Query += option.ToString();
                        firstHourlyElement = false;
                    }
                    else
                    {
                        uri.Query += "," + option.ToString();
                    }
                }
            }




            // Models
            if (options.Models.Count > 0)
            {
                bool firstModelsElement = true;
                uri.Query += "&models=";
                foreach (var option in options.Models)
                {
                    if (firstModelsElement)
                    {
                        uri.Query += option.ToString();
                        firstModelsElement = false;
                    }
                    else
                    {
                        uri.Query += "," + option.ToString();
                    }
                }
            }
            

            return uri.ToString();
        }


    }
