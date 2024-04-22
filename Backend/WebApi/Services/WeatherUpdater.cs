using WebApi.Weather;
namespace WebApi.Services;


public class WeatherUpdater(ILogger<WeatherUpdater> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var _lastUpdate = DateTime.MinValue;
        while (!stoppingToken.IsCancellationRequested)
        {
            if (DateTime.Now - _lastUpdate < TimeSpan.FromDays(1))
            {
                await Task.Delay(TimeSpan.FromSeconds(10));
                continue;
            }
            _lastUpdate = DateTime.Now;
            await doUpdate();
        }
    }

    private async Task doUpdate()
    {
        DateTime thisDay = DateTime.Today;
        DateTime theDayAfterTomorrow = DateTime.Today.AddDays(2);
        string FormatDateForOpenMeteo = "yyyy-MM-dd";

        string DateQueryStart = thisDay.ToString(FormatDateForOpenMeteo);
        string DateQueryEnd = theDayAfterTomorrow.ToString(FormatDateForOpenMeteo);// Example Weather for three days
        WebApi.Weather.WeatherClient client = new WebApi.Weather.WeatherClient();
    
        WeatherForecastOptionsApi optionsApi = new WeatherForecastOptionsApi();
        optionsApi.Latitude = 54.34f; // For Gdansk
        optionsApi.Longitude = 18.64f; // For Gdansk
        optionsApi.Start_date = DateQueryStart; 
        optionsApi.End_date = DateQueryEnd;
        optionsApi.Timezone = "Europe%2FBerlin";
        optionsApi.Hourly = new HourlyOptions(HourlyOptionsParameter.weathercode);

        // Api call to get the current weather in Gdansk
        WeatherForecastApi weatherData = await client.QueryAsync(optionsApi);
    
        if (weatherData != null && weatherData.Hourly != null && weatherData.Hourly.Weathercode != null)
        {
            // Iterate through the hourly weather codes and print them
            for (int i = 0; i < weatherData.Hourly.Weathercode.Length; i++)
            {
                logger.LogInformation($"Hour {i + 1}: Weather code {weatherData.Hourly.Weathercode[i]}");
            }
        }
        else
        {
            logger.LogDebug("Weather data is unavailable.");
        } 
    }
}