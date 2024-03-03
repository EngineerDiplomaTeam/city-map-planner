using MoreLinq.Extensions;
using OverpassClient;
using WebApi.Data.Model;
using WebApi.Data.repositories;

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

        var tags = osmWays.SelectMany(way => way.Tags).Select(tag => new OsmTag{ Name = tag.Name, Value = tag.Value });
        var ways = osmWays.Select(way => new OsmWay{ Id = way.Id, Tags = way.Tags.Select(tag => new OsmTag{ Name = tag.Name, Value = tag.Value }).ToList() });
        var nodes = osmWays.SelectMany(way => way.Nodes.Select(node => new OsmNode{ Id = node.Id, Lat = node.Lat, Lon = node.Lon }));
        var edges = osmWays.SelectMany(way => way.Nodes.Pairwise((from, to) => new OsmEdge{ FromId = from.Id, ToId =  to.Id, WayId = way.Id }));
        
        logger.LogInformation("Replacing OSM data");
        await dataRepository.ReplaceOsmDataAsync(ways, tags, nodes, edges, cancellationToken);
    }
}