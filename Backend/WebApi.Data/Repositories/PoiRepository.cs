using System.Linq.Expressions;
using WebApi.Data.Model;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Data.Repositories;

public interface IPoiRepository
{
    public Task<IList<T>> SelectAllPoisAsync<T>(Expression<Func<PointOfInterest, T>> mapper);
}

public class PoiRepository(DataDbContext dbContext) : IPoiRepository
{
    public async Task<IList<T>> SelectAllPoisAsync<T>(Expression<Func<PointOfInterest, T>> mapper)
    {
        return await dbContext.PointOfInterests.Select(mapper).ToListAsync();
    }
}