using WebApi.Weather;
namespace WebApi.Services;


public class WeatherUpdater(ILogger<WeatherClient> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var lastUpdate = DateTime.MinValue;
        while (!stoppingToken.IsCancellationRequested)
        {
            if (DateTime.Now - lastUpdate < TimeSpan.FromDays(1))
            {
                await Task.Delay(TimeSpan.FromSeconds(10));
                continue;
            }
            lastUpdate = DateTime.Now;
            await DoUpdate();
        }
    }

    private async Task DoUpdate()
    {
        DateTime thisDay = DateTime.Today;
        DateTime theDayAfterTomorrow = DateTime.Today.AddDays(2);
        string formatDateForOpenMeteo = "yyyy-MM-dd";

        string dateQueryStart = thisDay.ToString(formatDateForOpenMeteo);
        string dateQueryEnd = theDayAfterTomorrow.ToString(formatDateForOpenMeteo);// Example Weather for three days
        WebApi.Weather.WeatherClient client = new WebApi.Weather.WeatherClient(logger);
    
        WeatherForecastOptionsApi optionsApi = new WeatherForecastOptionsApi();
        optionsApi.Latitude = 54.34f; // For Gdansk
        optionsApi.Longitude = 18.64f; // For Gdansk
        optionsApi.StartDate = dateQueryStart; 
        optionsApi.EndDate = dateQueryEnd;
        optionsApi.Timezone = "Europe%2FBerlin";
        optionsApi.Hourly = new HourlyOptions(HourlyOptionsParameter.weathercode);

        // Api call to get the current weather in Gdansk
        WeatherForecastApi? weatherData = await client.QueryAsync(optionsApi);
    
        if (weatherData != null && weatherData.Hourly != null)
        {
            // Iterate through the hourly weather codes and print them
            for (int i = 0; i < weatherData.Hourly.Weathercode.Length; i++)
            {
                logger.LogInformation($"Hour {i + 1}: Weather code {weatherData.Hourly.Weathercode[i]}");
            }
        }
        else
        {
            logger.LogError("Weather data is unavailable.");
        } 
    }
}