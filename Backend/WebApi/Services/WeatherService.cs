using WebApi.Data.Entities;
using WebApi.Data.Repositories;
using WebApi.Domain;

namespace WebApi.Services;

public interface IWeatherService
{
    public Task<WeatherStatus> AddWeatherStatusAsync(WeatherStatus weatherStatus,
        CancellationToken cancellationToken = default);

    public IAsyncEnumerable<WeatherStatus> GetAllWeatherStatusAsync();
}

public class WeatherService(IWeatherRepository weatherRepository) : IWeatherService
{
    public async Task<WeatherStatus> AddWeatherStatusAsync(WeatherStatus weatherStatus,
        CancellationToken cancellationToken = default)
    {
        var weatherStatusEntity = new WeatherStatusEntity
        {
            Id = weatherStatus.Id,
            Time = weatherStatus.Time,
            WeatherCode = weatherStatus.WeatherCode,
            Temperature = weatherStatus.Temperature
        };
        var upsertWeatherStatus = await weatherRepository.AddWeatherStatusAsync(weatherStatusEntity, cancellationToken);

        return new WeatherStatus(
            upsertWeatherStatus.Id,
            upsertWeatherStatus.Time,
            upsertWeatherStatus.WeatherCode,
            upsertWeatherStatus.Temperature
        );
    }

    public IAsyncEnumerable<WeatherStatus> GetAllWeatherStatusAsync()
    {
        return weatherRepository.SelectAllWeatherStatusAsync(weather => new WeatherStatus(
                weather.Id,
                weather.Time,
                weather.WeatherCode,
                weather.Temperature
            )
        );
    }
}