
using System.Globalization;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using static Microsoft.AspNetCore.Http.QueryString;

namespace WebApi.Weather;

public interface IWeatherClient
{
    Task<WeatherForecastApi?> GetWeatherForecastAsync(WeatherForecastOptionsApi optionsApi);
}

public class WeatherClient(ILogger<WeatherClient> logger, HttpClient client) : IWeatherClient
{
    
    private readonly string _weatherApiUrl = "https://api.open-meteo.com/v1/forecast";



    public async Task<WeatherForecastApi?> QueryAsync(WeatherForecastOptionsApi optionsApi)
    {
        try
        {
            return await GetWeatherForecastAsync(optionsApi);
        }
        catch (Exception)
        {
            logger.LogError("Not Working");
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
    

    public async Task<WeatherForecastApi?> GetWeatherForecastAsync(WeatherForecastOptionsApi optionsApi)
    {
        try
        {
            var response = await client.GetAsync(MergeUrlWithOptions(_weatherApiUrl, optionsApi));
            response.EnsureSuccessStatusCode();

            var weatherForecast = await JsonSerializer.DeserializeAsync<WeatherForecastApi>(
                await response.Content.ReadAsStreamAsync(),
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (weatherForecast != null) return weatherForecast;
        }
        catch (HttpRequestException e)
        {
            logger.LogError(e, "padło na wysyłaniu requesta");
            logger.LogError(e.StackTrace);
            return null;
        }

        return null;
    }


    private string MergeUrlWithOptions(string url, WeatherForecastOptionsApi? options)
    {

        if (options == null) return url;

        var queryString = QueryHelpers.ParseQuery("?");
        queryString.Add("latitude", options.Latitude.ToString(CultureInfo.InvariantCulture));
        queryString.Add("longitude", options.Longitude.ToString(CultureInfo.InvariantCulture));
        queryString.Add("temperature_unit", options.TemperatureUnit.ToString());
        queryString.Add("precipitation_unit", options.PrecipitationUnit.ToString());
        if (options.Timezone != string.Empty)
            queryString.Add("timezone", options.Timezone);
        queryString.Add("timeformat", options.Timeformat.ToString());
        queryString.Add("past_days", options.PastDays.ToString());

        if (options.StartDate != string.Empty)
            queryString.Add("start_date", options.StartDate);
        if (options.EndDate != string.Empty)
            queryString.Add("end_date", options.EndDate);

        // Now we iterate through minutely15

        // minutely15
        if (options.Minutely15.Count > 0)
        {
            var firstminutely15Element = true;
            
            StringBuilder queryValue = new StringBuilder();
            
            foreach (var option in options.Minutely15)
                if (firstminutely15Element)
                {
                    queryValue.Append(option.ToString());
                    firstminutely15Element = false;
                }
                else
                {
                    queryValue.Append("," + option.ToString());
                }
            queryString.Add("minutely_15", queryValue.ToString());
        }
        String finalUrl = url + Create(queryString).ToString();

            
        return finalUrl;
    }
}