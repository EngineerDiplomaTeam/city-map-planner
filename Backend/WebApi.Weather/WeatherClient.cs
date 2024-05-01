﻿
using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using static Microsoft.AspNetCore.Http.QueryString;

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

        // Now we iterate through hourly

        // Hourly
        if (options.Hourly.Count > 0)
        {
            var firstHourlyElement = true;
            
            String queryValue = null; 
            foreach (var option in options.Hourly)
                if (firstHourlyElement)
                {
                    queryValue += option.ToString();
                    firstHourlyElement = false;
                }
                else
                {
                    queryValue+= "," + option;
                }
            queryString.Add("hourly", queryValue);
        }
        String finalUrl = url + Create(queryString).ToString();

            
        return finalUrl;
    }
}