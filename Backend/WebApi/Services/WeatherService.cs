using WebApi.Data;
using WebApi.Data.Entities;

namespace WebApi.Services;

public interface IWeatherService
{
    Task AddWeatherStatusAsync(WeatherStatusEntity weatherStatusEntity);
}

public class WeatherService(DataDbContext dbContext) : IWeatherService
{
    private readonly DataDbContext _dbContext = dbContext;

    public async Task AddWeatherStatusAsync(WeatherStatusEntity weatherStatusEntity)
    {
        _dbContext.WeatherStatus.Add(weatherStatusEntity);
        await _dbContext.SaveChangesAsync();
    }
}