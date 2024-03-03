using Microsoft.EntityFrameworkCore;
using WebApi.Data.Model;

namespace WebApi.Data.Repositories;

public interface IPathFindingRepository
{
    Task<OsmNode?> GetNodeByIdAsync(long nodeId, CancellationToken cancellationToken = default);
    Task<IEnumerable<OsmNode>> GetNeighbours(OsmNode node, CancellationToken cancellationToken = default);
    Task<IEnumerable<OsmEdge>> GetEdgesAsync(OsmNode node, CancellationToken cancellationToken = default);
}

public class PathFindingRepository(DataDbContext dbContext) : IPathFindingRepository
{
    public Task<OsmNode?> GetNodeByIdAsync(long nodeId, CancellationToken cancellationToken = default)
    {
        return dbContext.Nodes
            .SingleOrDefaultAsync(n => n.Id == nodeId, cancellationToken);
    }

    public async Task<IEnumerable<OsmNode>> GetNeighbours(OsmNode node, CancellationToken cancellationToken = default)
    {
        return await dbContext.Nodes
            .Include(n => n.Edges)
            .ThenInclude(e => e.To)
            .SelectMany(n => n.Edges)
            .Select(e => e.To)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<OsmEdge>> GetEdgesAsync(OsmNode node, CancellationToken cancellationToken = default)
    {
        return (await dbContext.Nodes
            .Include(n => n.Edges)
            .ThenInclude(e => e.To)
            .Where(n => n.Id == node.Id)
            .SingleOrDefaultAsync(n => n.Id == node.Id, cancellationToken))?.Edges ?? [];
    }
}