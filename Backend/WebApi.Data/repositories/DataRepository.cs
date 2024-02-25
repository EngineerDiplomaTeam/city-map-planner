using EFCore.BulkExtensions;
using Microsoft.EntityFrameworkCore;
using WebApi.Data.Model;

namespace WebApi.Data.repositories;

public interface IDataRepository
{
    public Task InsertOsmNodes(IEnumerable<OsmNode> osmNodes, CancellationToken cancellationToken = default);
    public Task InsertOsmEdges(IEnumerable<OsmEdge> osmEdges, CancellationToken cancellationToken = default);
}

public class DataRepository(DataDbContext dbContext) : IDataRepository
{
    private readonly List<string> _noProperties = [string.Empty];
    
    public async Task InsertOsmNodes(IEnumerable<OsmNode> osmNodes, CancellationToken cancellationToken = default)
    {
        await dbContext.BulkInsertOrUpdateAsync(osmNodes, config => config.PropertiesToIncludeOnUpdate = _noProperties, cancellationToken: cancellationToken);
        // await dbContext.Nodes.UpsertRange(osmNodes).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task InsertOsmEdges(IEnumerable<OsmEdge> osmEdges, CancellationToken cancellationToken = default)
    {
        await dbContext.BulkInsertOrUpdateAsync(osmEdges, config => config.PropertiesToIncludeOnUpdate = _noProperties, cancellationToken: cancellationToken);
        // await dbContext.Edges.UpsertRange(osmEdges).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
