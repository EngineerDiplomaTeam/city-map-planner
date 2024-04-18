using WebApi.Weather;
namespace WebApi.Services;


public class WeatherUpdater : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var _lastUpdate = DateTime.Now;
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
    
        WeatherForecastOptions options = new WeatherForecastOptions();
        options.Latitude = 54.34f; // For Gdansk
        options.Longitude = 18.64f; // For Gdansk
        options.Start_date = DateQueryStart; 
        options.End_date = DateQueryEnd;
        options.Hourly = new HourlyOptions(HourlyOptionsParameter.weathercode);

        // Api call to get the current weather in Gdansk
        WeatherForecast weatherData = await client.QueryAsync(options);
    
        if (weatherData != null && weatherData.Hourly != null && weatherData.Hourly.Weathercode != null)
        {
            // Iterate through the hourly weather codes and print them
            for (int i = 0; i < weatherData.Hourly.Weathercode.Length; i++)
            {
                Console.WriteLine($"Hour {i + 1}: Weather code {weatherData.Hourly.Weathercode[i]}");
            }
        }
        else
        {
            Console.WriteLine("Weather data is unavailable.");
        } 
    }
}