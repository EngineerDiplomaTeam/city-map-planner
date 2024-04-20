using MoreLinq.Extensions;
using OverpassClient;
using WebApi.Data.Entities;
using WebApi.Data.Repositories;

namespace WebApi.Services;

public interface IOverpassCollectorService
{
    public Task CollectForQuery(string query, CancellationToken cancellationToken = default);
}

public class OverpassCollectorService(
    ILogger<OverpassCollectorService> logger,
    IOverpassClient overpassClient,
    IDataRepository dataRepository
) : IOverpassCollectorService
{
    public async Task CollectForQuery(string query, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Collecting OSM data for query: {Query}", query);

        var osmWays = await overpassClient.StreamElements(query, cancellationToken).ToListAsync(cancellationToken);

        var tags = osmWays.SelectMany(way => way.Tags).Select(tag => new OsmTagEntity{ Name = tag.Name, Value = tag.Value });
        var ways = osmWays.Select(way => new OsmWayEntity{ Id = way.Id, Tags = way.Tags.Select(tag => new OsmTagEntity{ Name = tag.Name, Value = tag.Value }).ToList() });
        var nodes = osmWays.SelectMany(way => way.Nodes.Select(node => new OsmNodeEntity{ Id = node.Id, Lat = node.Lat, Lon = node.Lon }));
        var edges = osmWays.SelectMany(way => way.Tags.Contains(("oneway", "yes")) || way.Tags.Contains(("junction", "roundabout"))
            ? way.Nodes.Pairwise((from, to) => new OsmEdgeEntity { FromId = from.Id, ToId = to.Id, WayId = way.Id })
            : way.Nodes.Pairwise((from, to) => new OsmEdgeEntity{ FromId = from.Id, ToId =  to.Id, WayId = way.Id }).SelectMany(x => new[]{x, new() { FromId = x.ToId, ToId =  x.FromId, WayId = way.Id }}));

        logger.LogInformation("Replacing OSM data");
        await dataRepository.ReplaceOsmDataAsync(ways, tags, nodes, edges, cancellationToken);
    }
}