using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using WebApi.Data.Entities;
using WebApi.Data.Repositories;
using WebApi.Domain;

namespace WebApi.Services;

public interface IPathFindingService
{
    IAsyncEnumerable<PathFindingIteration> FindPathAsync(long startOsmNodeId, long destinationOsmNodeId, CancellationToken cancellationToken = default);
    IAsyncEnumerable<PathFindingIteration> FindPathBetweenPoisAsync(long startPoiId, long destinationPoiId, CancellationToken cancellationToken = default);
}

public class PathFindingService(
    IPathFindingRepository pathFindingRepository,
    ILogger<PathFindingService> logger
) : IPathFindingService
{
    public async IAsyncEnumerable<PathFindingIteration> FindPathAsync(
        long startNodeId, 
        long destinationNodeId, 
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var startNode = await pathFindingRepository.GetNodeByIdAsync(startNodeId, Mapper, cancellationToken);
        
        var visited = new HashSet<long>([startNodeId]);
        var queue = new PriorityQueue<PathFindingIteration, double>([
            (new PathFindingIteration(false, [startNode]), 0)
        ]);
        
        while (queue.Count > 0 && !cancellationToken.IsCancellationRequested)
        {
            if (!queue.TryDequeue(out var pathFindingIteration, out var priority))
            {
                logger.LogError("Could not deque");
                break;
            }

            var (_, pathFindingRoute) = pathFindingIteration;

            var currentNode = pathFindingRoute[^1];

            var neighbours = await pathFindingRepository.GetNodeNeighboursAsync(currentNode.OsmNodeId, Mapper, cancellationToken);
            var notVisitedNeighbours = neighbours.Where(x => !visited.Contains(x.OsmNodeId));
            
            foreach (var neighbour in notVisitedNeighbours)
            {
                var concatenated = pathFindingRoute.Append(neighbour).ToArray();
                var iteration = new PathFindingIteration(neighbour.OsmNodeId == destinationNodeId, concatenated);
                var d = Haversine(neighbour.Lat, currentNode.Lat, neighbour.Lon, currentNode.Lon);
                
                queue.Enqueue(iteration, d + priority);
                visited.Add(neighbour.OsmNodeId);
        
                yield return iteration;
            }
        }
    }

    public async IAsyncEnumerable<PathFindingIteration> FindPathBetweenPoisAsync(long startPoiId, long destinationPoiId, CancellationToken cancellationToken = default)
    {
        var fromNode = await pathFindingRepository.GetNodeForPoiAsync(startPoiId, Mapper, cancellationToken);
        var toNode = await pathFindingRepository.GetNodeForPoiAsync(destinationPoiId, Mapper, cancellationToken);

        var iterations = FindPathAsync(fromNode.OsmNodeId, toNode.OsmNodeId, cancellationToken);
        await foreach (var iteration in iterations)
        {
            yield return iteration;
            if (iteration.Complete) break;
        }
    }

    private static double Haversine(double lat1, double lat2, double lon1, double lon2)
    {
        const double r = 6_378_100; // meters
            
        var sdlat = Math.Sin((lat2 - lat1) / 2);
        var sdlon = Math.Sin((lon2 - lon1) / 2);
        var q = sdlat * sdlat + Math.Cos(lat1) * Math.Cos(lat2) * sdlon * sdlon;
        var d = 2 * r * Math.Asin(Math.Sqrt(q));

        return d;
    }

    private static readonly Expression<Func<OsmNodeEntity, PathFindingNode>> Mapper = node => new PathFindingNode(node.Lat, node.Lon, node.Id);
}

