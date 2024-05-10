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
        optionsApi.Timezone = "Europe/Warsaw";

        optionsApi.Minutely15.Add(Minutely15OptionsParameter.weathercode);
        optionsApi.Minutely15.Add(Minutely15OptionsParameter.temperature_2m);
        

        // Api call to get the current weather in Gdansk
        WeatherForecastApi? weatherData = await weatherClient.GetWeatherForecastAsync(optionsApi);

        WeatherStatus? update;



        // Weather Database is null
        if (weatherAll.Count == 0)
        {
            if (weatherData != null && weatherData.Minutely15 != null)
                for (int i = 0; i < weatherData.Minutely15.Weathercode.Length; i++)
                {
                    if (weatherData.Minutely15.Time != null)
                    {
                        var id = i + 1;
                        update = new WeatherStatus(id, ToDateTime(weatherData.Minutely15.Time[i]).ToUniversalTime(),
                            weatherData.Minutely15.Weathercode[i],
                            Convert.ToDouble(weatherData.Minutely15.Temperature2M[i]));
                        logger.LogInformation("Add new weatherCode");

                        await weatherService.AddWeatherStatusAsync(update, cancellationToken);
                    }
                }
        }
        else
        {
            if (weatherData != null && weatherData.Minutely15 != null)
            {
                for (int i = 0; i < weatherData.Minutely15.Weathercode.Length; i++)
                {
                    var x = weatherAll.Find(info => weatherData.Minutely15.Time != null && info.Time == ToDateTime(weatherData.Minutely15.Time[i]).ToUniversalTime());
                    if (x == null)
                    {
                        if (weatherData.Minutely15.Time != null)
                        {
                            update = new WeatherStatus(weatherAll.Count +  i + 1,
                                ToDateTime(weatherData.Minutely15.Time[i]).ToUniversalTime(),
                                weatherData.Minutely15.Weathercode[i],weatherData.Minutely15.Temperature2M[i]);
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