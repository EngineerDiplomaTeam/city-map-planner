using WebApi.Data.Entities;
using WebApi.Domain;
using WebApi.Weather;
using static System.Convert;

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
            await DoUpdate(stoppingToken);
        }
    }

    private async Task DoUpdate(CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating WeatherCode for next 3  days");

        using var scope = serviceProvider.CreateScope();
        var weatherService = scope.ServiceProvider.GetRequiredService<IWeatherService>();
        var weatherAll = await weatherService.GetAllWeatherStatusAsync().ToListAsync(cancellationToken);

        DateTime thisDay = DateTime.Today;
        DateTime theDayAfterTomorrow = DateTime.Today.AddDays(2);
        string formatDateForOpenMeteo = "yyyy-MM-dd";

        string dateQueryStart = thisDay.ToString(formatDateForOpenMeteo);
        string dateQueryEnd = theDayAfterTomorrow.ToString(formatDateForOpenMeteo); // Example Weather for three days



        WeatherForecastOptionsApi optionsApi = new WeatherForecastOptionsApi();
        optionsApi.Latitude = 54.34f; // For Gdansk
        optionsApi.Longitude = 18.64f; // For Gdansk
        optionsApi.StartDate = dateQueryStart;
        optionsApi.EndDate = dateQueryEnd;
        optionsApi.Timezone = "Europe/Berlin";

        optionsApi.Hourly.Add(HourlyOptionsParameter.weathercode);



        // Api call to get the current weather in Gdansk
        WeatherForecastApi? weatherData = await weatherClient.GetWeatherForecastAsync(optionsApi);

        WeatherStatus? update;



        // Weather Database is null
        if (weatherAll.Count == 0)
        {
            for (int i = 0; i < weatherData.Hourly.Weathercode.Length; i++)
            {

                if (weatherData.Hourly.Time != null)
                {
                    update = new WeatherStatus(i+1, ToDateTime(weatherData.Hourly.Time[i]).ToUniversalTime(),
                        weatherData.Hourly.Weathercode[i]);
                    // logger.LogInformation($"Hour {weatherData.Hourly.Time[i] }: Weather code {weatherData.Hourly.Weathercode[i]}");
                    logger.LogInformation("Add new weatherCode");

                    await weatherService.AddWeatherStatusAsync(update, cancellationToken);
                }
            }

        }
        else
        {
            if (weatherData.Hourly != null)
            {
                for (int i = 0; i < weatherData.Hourly.Weathercode.Length; i++)
                {
                    var x = weatherAll.Find(info => info.Time == ToDateTime(weatherData.Hourly.Time[i]).ToUniversalTime());
                    if (x != null)
                    {
                        break;
                    }
                    else
                    {
                        if (weatherData.Hourly.Time != null)
                        {
                            update = new WeatherStatus(weatherAll.Count + 1,
                                ToDateTime(weatherData.Hourly.Time[i]).ToUniversalTime(),
                                weatherData.Hourly.Weathercode[i]);
                            logger.LogInformation("Add new weatherCode");
                            await weatherService.AddWeatherStatusAsync(update, cancellationToken);
                        }
                    }
                }



            }
            else
            {
                logger.LogError("Weather data is unavailable.");
            }
        }
    }

}