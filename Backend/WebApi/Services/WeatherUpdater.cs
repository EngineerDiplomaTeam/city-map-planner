using WebApi.Weather;
namespace WebApi.Services;


public class WeatherUpdater: BackgroundService
{
    private readonly IWeatherClient _weatherClient;
    private readonly ILogger<WeatherUpdater> _logger;

    public WeatherUpdater(IWeatherClient weatherClient, ILogger<WeatherUpdater> logger)
    {
        _weatherClient = weatherClient;
        _logger = logger;
    }
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

       
    
        WeatherForecastOptionsApi optionsApi = new WeatherForecastOptionsApi();
        optionsApi.Latitude = 54.34f; // For Gdansk
        optionsApi.Longitude = 18.64f; // For Gdansk
        optionsApi.StartDate = dateQueryStart; 
        optionsApi.EndDate = dateQueryEnd;
        optionsApi.Timezone = "Europe/Berlin";
        optionsApi.Hourly = new HourlyOptions(HourlyOptionsParameter.weathercode);

        // Api call to get the current weather in Gdansk
        WeatherForecastApi? weatherData = await _weatherClient.GetWeatherForecastAsync(optionsApi);
    
        if (weatherData != null && weatherData.Hourly != null)
        {
            // Iterate through the hourly weather codes and print them
            for (int i = 0; i < weatherData.Hourly.Weathercode.Length; i++)
            {
                _logger.LogInformation($"Hour {i + 1}: Weather code {weatherData.Hourly.Weathercode[i]}");
            }
        }
        else
        {
            _logger.LogError("Weather data is unavailable.");
        } 
    }
}