using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using WebApi.Data.Entities;

namespace WebApi.Data.Repositories;

public interface IPoiRepository
{
    public IAsyncEnumerable<T> SelectAllPoisAsync<T>(Expression<Func<PoiEntity, T>> mapper);
    public Task<PoiEntity> UpsertPoiAsync(PoiEntity poiEntity, CancellationToken cancellationToken = default);
    public Task DeletePoiAsync(long id, CancellationToken cancellationToken = default);
}

public class PoiRepository(DataDbContext dbContext) : IPoiRepository
{
    public IAsyncEnumerable<T> SelectAllPoisAsync<T>(Expression<Func<PoiEntity, T>> mapper)
    {
        return dbContext.PointOfInterests.Select(mapper).AsAsyncEnumerable();
    }

    public async Task<PoiEntity> UpsertPoiAsync(PoiEntity poiEntity, CancellationToken cancellationToken = default)
    {
        EntityEntry<PoiEntity> entry;
        
        await using (var dbContextTransaction = await dbContext.Database.BeginTransactionAsync(cancellationToken))
        {
            var current = await dbContext.PointOfInterests.FindAsync([poiEntity.Id], cancellationToken: cancellationToken);
        
            if (current is not null)
            {
                dbContext.PointOfInterests.Remove(current);
                await dbContext.SaveChangesAsync(cancellationToken);
            }

            entry = await dbContext.PointOfInterests.AddAsync(poiEntity, cancellationToken);
        
            await dbContext.SaveChangesAsync(cancellationToken);
            await dbContextTransaction.CommitAsync(cancellationToken);
        }
        
        return entry.Entity;
    }
    
    public async Task DeletePoiAsync(long id, CancellationToken cancellationToken = default)
    {
        await dbContext.PointOfInterests.Where(x => x.Id == id).ExecuteDeleteAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
