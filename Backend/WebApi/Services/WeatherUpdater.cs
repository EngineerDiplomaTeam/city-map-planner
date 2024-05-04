using WebApi.Data.Entities;
using WebApi.Weather;
namespace WebApi.Services;


public class WeatherUpdater(
    IWeatherClient weatherClient,
    ILogger<WeatherUpdater> logger,
    IServiceProvider serviceProvider)
    : BackgroundService
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

       
    
        WeatherForecastOptionsApi optionsApi = new WeatherForecastOptionsApi();
        optionsApi.Latitude = 54.34f; // For Gdansk
        optionsApi.Longitude = 18.64f; // For Gdansk
        optionsApi.StartDate = dateQueryStart; 
        optionsApi.EndDate = dateQueryEnd;
        optionsApi.Timezone = "Europe/Berlin";
        
        optionsApi.Hourly.Add(HourlyOptionsParameter.weathercode);

        using var scope = serviceProvider.CreateScope();
        var collector = scope.ServiceProvider.GetRequiredService<IWeatherService>();
        
        // Api call to get the current weather in Gdansk
        WeatherForecastApi? weatherData = await weatherClient.GetWeatherForecastAsync(optionsApi);
    
        if (weatherData.Hourly != null)
        {
            // Iterate through the hourly weather codes and print them
            for (int i = 0; i < weatherData.Hourly.Weathercode.Length; i++)
            {
                if (weatherData.Hourly.Time != null)
                {
                    var weatherStatus = new WeatherStatusEntity()
                    {
                        Time = Convert.ToDateTime(weatherData.Hourly.Time[i]),
                        WeatherCode = weatherData.Hourly.Weathercode[i],
                    };
                
                    logger.LogInformation($"Hour {weatherData.Hourly.Time[i] }: Weather code {weatherData.Hourly.Weathercode[i]}");
                
                    await collector.AddWeatherStatusAsync(weatherStatus);
                }
            }
        }
        else
        {
            logger.LogError("Weather data is unavailable.");
        } 

    }

}