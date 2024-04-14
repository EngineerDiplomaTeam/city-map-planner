using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using WebApi.Data.Model;

namespace WebApi.Data.Repositories;

public interface IPathFindingRepository
{
    Task<T> GetNodeByIdAsync<T>(long nodeId, Expression<Func<OsmNode, T>> mapper, CancellationToken cancellationToken = default);
    Task<T[]> GetNodeNeighboursAsync<T>(long nodeId, Expression<Func<OsmNode, T>> mapper, CancellationToken cancellationToken = default);
    Task<T> GetNodeForPoiAsync<T>(long poiId, Expression<Func<OsmNode, T>> mapper, CancellationToken cancellationToken = default);
}

public class PathFindingRepository(DataDbContext dbContext) : IPathFindingRepository
{
    public async Task<T> GetNodeByIdAsync<T>(long nodeId, Expression<Func<OsmNode, T>> mapper, CancellationToken cancellationToken = default)
    {
        return await dbContext.Nodes.Where(x => x.Id == nodeId).Select(mapper).FirstAsync(cancellationToken);
    }

    public async Task<T[]> GetNodeNeighboursAsync<T>(long nodeId, Expression<Func<OsmNode, T>> mapper, CancellationToken cancellationToken = default)
    {
        return await dbContext.Nodes.Where(x => x.Id == nodeId).SelectMany(x => x.Edges).Select(x => x.To).Select(mapper).ToArrayAsync(cancellationToken);
    }

    public async Task<T> GetNodeForPoiAsync<T>(long poiId, Expression<Func<OsmNode, T>> mapper, CancellationToken cancellationToken = default)
    {
        return await dbContext.PointOfInterests
            .Where(x => x.Id == poiId)
            .Select(x => x.Entrances.First())
            .Select(x => x.OsmNode)
            .Select(mapper)
            .FirstAsync(cancellationToken);
    }
}