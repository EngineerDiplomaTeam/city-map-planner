using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Logging;
using WebApi.Data.Entities;
using Z.BulkOperations;
using System.Linq.Expressions;

namespace WebApi.Data.Repositories;

public interface IWeatherRepository
{
    public Task InsertIgnoreWeatherStatusAsync(IEnumerable<WeatherStatusEntity> weatherStatus, CancellationToken cancellationToken = default);


    public  Task<WeatherStatusEntity> AddWeatherStatusAsync(WeatherStatusEntity weatherStatusEntity,
        CancellationToken cancellationToken = default);

    public IAsyncEnumerable<T> SelectAllWeatherStatusAsync<T>(Expression<Func<WeatherStatusEntity, T>> mapper);



}
public class WeatherRepository(DataDbContext dbContext, ILogger<DataRepository> logger) : IWeatherRepository
{
    

    public async Task InsertIgnoreWeatherStatusAsync(IEnumerable<WeatherStatusEntity> weatherstatus, CancellationToken cancellationToken = default)
    {
        await dbContext.WeatherStatus.UpsertRange(weatherstatus).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<WeatherStatusEntity> AddWeatherStatusAsync(WeatherStatusEntity weatherStatusEntity, CancellationToken cancellationToken = default)
    {
        EntityEntry<WeatherStatusEntity> entry;
        await using (var dbContextTransaction = await dbContext.Database.BeginTransactionAsync(cancellationToken))
        {

            entry = await dbContext.WeatherStatus.AddAsync(weatherStatusEntity, cancellationToken);
        
            await dbContext.SaveChangesAsync(cancellationToken);
            await dbContextTransaction.CommitAsync(cancellationToken);
        }

        return entry.Entity;
    }
    
    
    public IAsyncEnumerable<T> SelectAllWeatherStatusAsync<T>(Expression<Func<WeatherStatusEntity, T>> mapper)
    {
        return dbContext.WeatherStatus.AsSplitQuery().Select(mapper).AsAsyncEnumerable();
    }
}