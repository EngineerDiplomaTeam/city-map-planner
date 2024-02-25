using MoreLinq.Extensions;
using OverpassClient;
using WebApi.Data.Model;
using WebApi.Data.repositories;
using OsmNode = WebApi.Data.Model.OsmNode;

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

        var osmElements = await overpassClient.StreamElements(query, cancellationToken).ToListAsync(cancellationToken);

        var nodes = osmElements.SelectMany(element => element.Nodes.Select(node => new OsmNode(node.Id, node.Lat, node.Lon)));
        var edges = osmElements.SelectMany(element => element.Nodes.Pairwise((from, to) => new OsmEdge(from.Id, to.Id)));
        
        await dataRepository.InsertOsmNodes(nodes, cancellationToken);
        await dataRepository.InsertOsmEdges(edges, cancellationToken);
    }
}