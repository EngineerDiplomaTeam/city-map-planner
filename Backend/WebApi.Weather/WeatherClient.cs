using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace WebApi.Weather;

public class WeatherClient(ILogger<WeatherClient> logger)
{
    private readonly HttpClient _httpClient = new()
    {
        BaseAddress = new Uri("https://api.open-meteo.com/v1/forecast")
    };

    private readonly string _weatherApiUrl = "https://api.open-meteo.com/v1/forecast";



    public async Task<WeatherForecastApi?> QueryAsync(WeatherForecastOptionsApi optionsApi)
    {
        try
        {
            return await GetWeatherForecastAsync(optionsApi);
        }
        catch (Exception)
        {
            return null;
        }
    }

    /// <summary>
    ///     Performs one GET-Request to get weather information
    /// </summary>
    /// <param name="latitude">City latitude</param>
    /// <param name="longitude">City longitude</param>
    /// <returns>Awaitable Task containing WeatherForecast or NULL</returns>
    public async Task<WeatherForecastApi?> QueryAsync(float latitude, float longitude)
    {
        var options = new WeatherForecastOptionsApi
        {
            Latitude = latitude,
            Longitude = longitude
        };
        return await QueryAsync(options);
    }

    public WeatherForecastApi? Query(WeatherForecastOptionsApi optionsApi)
    {
        return QueryAsync(optionsApi).GetAwaiter().GetResult();
    }

    public WeatherForecastApi? Query(float latitude, float longitude)
    {
        return QueryAsync(latitude, longitude).GetAwaiter().GetResult();
    }


    public string WeatherCodeToString(int weatherCode)
    {
        if (Enum.IsDefined(typeof(WeatherCode), weatherCode))
        {
            return ((WeatherCode)weatherCode).ToString().Replace('_', ' ');
        }
        else
        {
            return "Invalid weather code";
        }
    }


    private async Task<WeatherForecastApi?> GetWeatherForecastAsync(WeatherForecastOptionsApi optionsApi)
    {
        try
        {
            var response = await _httpClient.GetAsync(MergeUrlWithOptions(_weatherApiUrl, optionsApi));
            response.EnsureSuccessStatusCode();

            var weatherForecast = await JsonSerializer.DeserializeAsync<WeatherForecastApi>(
                await response.Content.ReadAsStreamAsync(),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return weatherForecast;
        }
        catch (HttpRequestException e)
        {
            logger.LogError(e.Message);
            logger.LogError(e.StackTrace);
            return null;
        }
    }


    private string MergeUrlWithOptions(string url, WeatherForecastOptionsApi? options)
    {
        if (options == null) return url;

        var uri = new UriBuilder(url);
        var isFirstParam = false;

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
            uri.Query += "latitude=" + options.Latitude.ToString(CultureInfo.InvariantCulture);
        else
            uri.Query += "&latitude=" + options.Latitude.ToString(CultureInfo.InvariantCulture);

        uri.Query += "&longitude=" + options.Longitude.ToString(CultureInfo.InvariantCulture);
        uri.Query += "&temperature_unit=" + options.TemperatureUnit;
        uri.Query += "&precipitation_unit=" + options.PrecipitationUnit;
        if (options.Timezone != string.Empty)
            uri.Query += "&timezone=" + options.Timezone;

        uri.Query += "&timeformat=" + options.Timeformat;

        uri.Query += "&past_days=" + options.PastDays;

        if (options.StartDate != string.Empty)
            uri.Query += "&start_date=" + options.StartDate;
        if (options.EndDate != string.Empty)
            uri.Query += "&end_date=" + options.EndDate;

        // Now we iterate through hourly

        // Hourly
        if (options.Hourly.Count > 0)
        {
            var firstHourlyElement = true;
            uri.Query += "&hourly=";

            foreach (var option in options.Hourly)
                if (firstHourlyElement)
                {
                    uri.Query += option.ToString();
                    firstHourlyElement = false;
                }
                else
                {
                    uri.Query += "," + option;
                }
        }

        


        return uri.ToString();
    }
}