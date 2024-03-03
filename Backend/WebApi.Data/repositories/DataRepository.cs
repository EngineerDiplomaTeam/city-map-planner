using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApi.Data.Model;
using Z.BulkOperations;

namespace WebApi.Data.repositories;

public interface IDataRepository
{
    public Task InsertIgnoreOsmWaysAsync(IEnumerable<OsmWay> osmWays, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmWaysHugeAsync(IEnumerable<OsmWay> osmWays, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmTagsAsync(IEnumerable<OsmTag> osmTags, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmTagsHugeAsync(IEnumerable<OsmTag> osmTags, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmNodesAsync(IEnumerable<OsmNode> osmNodes, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmNodesHugeAsync(IEnumerable<OsmNode> osmNodes, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmEdgesAsync(IEnumerable<OsmEdge> osmEdges, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmEdgesHugeAsync(IEnumerable<OsmEdge> osmEdges, CancellationToken cancellationToken = default);
    public Task ReplaceOsmDataAsync(IEnumerable<OsmWay> osmWays, IEnumerable<OsmTag> osmTags, IEnumerable<OsmNode> osmNodes, IEnumerable<OsmEdge> osmEdges, CancellationToken cancellationToken = default);
}

public class DataRepository(DataDbContext dbContext, ILogger<DataRepository> logger) : IDataRepository
{
    private static readonly Action<BulkOperation> BulkActionIgnore = config =>
    {
        config.IncludeGraph = true;
        config.InsertKeepIdentity = true;
        config.UsePostgreSqlInsertOnConflictDoNothing = true;
        config.InsertIfNotExists = true;
    };

    public async Task InsertIgnoreOsmWaysAsync(IEnumerable<OsmWay> osmWays, CancellationToken cancellationToken = default)
    {
        await dbContext.Ways.UpsertRange(osmWays).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task InsertIgnoreOsmWaysHugeAsync(IEnumerable<OsmWay> osmWays, CancellationToken cancellationToken = default)
    {
        await dbContext.BulkInsertOptimizedAsync(osmWays, BulkActionIgnore, cancellationToken: cancellationToken);
    }

    public async Task InsertIgnoreOsmTagsAsync(IEnumerable<OsmTag> osmTags, CancellationToken cancellationToken = default)
    {
        await dbContext.Tags.UpsertRange(osmTags).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
    
    public async Task InsertIgnoreOsmTagsHugeAsync(IEnumerable<OsmTag> osmTags, CancellationToken cancellationToken = default)
    {
        await dbContext.BulkInsertOptimizedAsync(osmTags, BulkActionIgnore, cancellationToken: cancellationToken);
    }

    public async Task InsertIgnoreOsmNodesAsync(IEnumerable<OsmNode> osmNodes, CancellationToken cancellationToken = default)
    {
        await dbContext.Nodes.UpsertRange(osmNodes).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task InsertIgnoreOsmNodesHugeAsync(IEnumerable<OsmNode> osmNodes, CancellationToken cancellationToken = default)
    {
        await dbContext.BulkInsertOptimizedAsync(osmNodes, BulkActionIgnore, cancellationToken: cancellationToken);
    }

    public async Task InsertIgnoreOsmEdgesAsync(IEnumerable<OsmEdge> osmEdges, CancellationToken cancellationToken = default)
    {
        await dbContext.Edges.UpsertRange(osmEdges).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task InsertIgnoreOsmEdgesHugeAsync(IEnumerable<OsmEdge> osmEdges, CancellationToken cancellationToken = default)
    {
        await dbContext.BulkInsertOptimizedAsync(osmEdges, BulkActionIgnore, cancellationToken: cancellationToken);
    }

    public async Task ReplaceOsmDataAsync(IEnumerable<OsmWay> osmWays, IEnumerable<OsmTag> osmTags, IEnumerable<OsmNode> osmNodes, IEnumerable<OsmEdge> osmEdges, CancellationToken cancellationToken = default)
    {
        var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            logger.LogInformation("Truncating edges");
            await dbContext.Edges.ExecuteDeleteAsync(cancellationToken: cancellationToken);
            logger.LogInformation("Truncating nodes");
            await dbContext.Nodes.ExecuteDeleteAsync(cancellationToken: cancellationToken);
            logger.LogInformation("Truncating ways");
            await dbContext.Ways.ExecuteDeleteAsync(cancellationToken: cancellationToken);
            logger.LogInformation("Truncating tags");
            await dbContext.Tags.ExecuteDeleteAsync(cancellationToken: cancellationToken);
            
            logger.LogInformation("Inserting tags");
            await InsertIgnoreOsmTagsHugeAsync(osmTags, cancellationToken);
            logger.LogInformation("Inserting ways");
            await InsertIgnoreOsmWaysHugeAsync(osmWays, cancellationToken);
            logger.LogInformation("Inserting nodes");
            await InsertIgnoreOsmNodesHugeAsync(osmNodes, cancellationToken);
            logger.LogInformation("Inserting edges");
            await InsertIgnoreOsmEdgesHugeAsync(osmEdges, cancellationToken);
            
            logger.LogInformation("Commiting changes");
            await transaction.CommitAsync(cancellationToken);
        }
        catch
        {
            logger.LogWarning("Failed to replace OSM data");
            await transaction.RollbackAsync(cancellationToken);
        }
    }
}
