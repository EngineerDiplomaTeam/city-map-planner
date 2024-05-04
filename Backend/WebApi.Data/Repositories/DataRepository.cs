using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApi.Data.Entities;
using Z.BulkOperations;

namespace WebApi.Data.Repositories;

public interface IDataRepository
{
    public Task InsertIgnoreOsmWaysAsync(IEnumerable<OsmWayEntity> osmWays, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmWaysHugeAsync(IEnumerable<OsmWayEntity> osmWays, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmTagsAsync(IEnumerable<OsmTagEntity> osmTags, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmTagsHugeAsync(IEnumerable<OsmTagEntity> osmTags, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmNodesAsync(IEnumerable<OsmNodeEntity> osmNodes, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmNodesHugeAsync(IEnumerable<OsmNodeEntity> osmNodes, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmEdgesAsync(IEnumerable<OsmEdgeEntity> osmEdges, CancellationToken cancellationToken = default);
    public Task InsertIgnoreOsmEdgesHugeAsync(IEnumerable<OsmEdgeEntity> osmEdges, CancellationToken cancellationToken = default);
    public Task ReplaceOsmDataAsync(IEnumerable<OsmWayEntity> osmWays, IEnumerable<OsmTagEntity> osmTags, IEnumerable<OsmNodeEntity> osmNodes, IEnumerable<OsmEdgeEntity> osmEdges, CancellationToken cancellationToken = default);
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

    public async Task InsertIgnoreOsmWaysAsync(IEnumerable<OsmWayEntity> osmWays, CancellationToken cancellationToken = default)
    {
        await dbContext.Ways.UpsertRange(osmWays).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task InsertIgnoreOsmWaysHugeAsync(IEnumerable<OsmWayEntity> osmWays, CancellationToken cancellationToken = default)
    {
        await dbContext.BulkInsertOptimizedAsync(osmWays, BulkActionIgnore, cancellationToken: cancellationToken);
    }

    public async Task InsertIgnoreOsmTagsAsync(IEnumerable<OsmTagEntity> osmTags, CancellationToken cancellationToken = default)
    {
        await dbContext.Tags.UpsertRange(osmTags).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
    
    public async Task InsertIgnoreOsmTagsHugeAsync(IEnumerable<OsmTagEntity> osmTags, CancellationToken cancellationToken = default)
    {
        await dbContext.BulkInsertOptimizedAsync(osmTags, BulkActionIgnore, cancellationToken: cancellationToken);
    }

    public async Task InsertIgnoreOsmNodesAsync(IEnumerable<OsmNodeEntity> osmNodes, CancellationToken cancellationToken = default)
    {
        await dbContext.Nodes.UpsertRange(osmNodes).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task InsertIgnoreOsmNodesHugeAsync(IEnumerable<OsmNodeEntity> osmNodes, CancellationToken cancellationToken = default)
    {
        await dbContext.BulkInsertOptimizedAsync(osmNodes, BulkActionIgnore, cancellationToken: cancellationToken);
    }

    public async Task InsertIgnoreOsmEdgesAsync(IEnumerable<OsmEdgeEntity> osmEdges, CancellationToken cancellationToken = default)
    {
        await dbContext.Edges.UpsertRange(osmEdges).NoUpdate().RunAsync(cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task InsertIgnoreOsmEdgesHugeAsync(IEnumerable<OsmEdgeEntity> osmEdges, CancellationToken cancellationToken = default)
    {
        await dbContext.BulkInsertOptimizedAsync(osmEdges, BulkActionIgnore, cancellationToken: cancellationToken);
    }

    public async Task ReplaceOsmDataAsync(IEnumerable<OsmWayEntity> osmWays, IEnumerable<OsmTagEntity> osmTags, IEnumerable<OsmNodeEntity> osmNodes, IEnumerable<OsmEdgeEntity> osmEdges, CancellationToken cancellationToken = default)
    {
        var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            logger.LogInformation("Backing up poi entrances");
            var entrances = await dbContext.Entrances.ToListAsync(cancellationToken);

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
            
            logger.LogInformation("Restoring poi entrances");
            await dbContext.Entrances.UpsertRange(entrances).NoUpdate().RunAsync(cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            
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
