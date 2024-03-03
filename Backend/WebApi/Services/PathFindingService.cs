using System.Runtime.CompilerServices;
using WebApi.Controllers.PathFinding;
using WebApi.Data.Model;
using WebApi.Data.Repositories;
using WebApi.DTO;

namespace WebApi.Services;

public interface IPathFindingService
{
    IAsyncEnumerable<PathEdge> GetPathAsync(long startNodeId, long destinationNodeId,
        CancellationToken cancellationToken = default);
}

public class PathFindingService(
    IPathFindingRepository pathFindingRepository,
    ILogger<PathFindingService> logger) : IPathFindingService
{
    public async IAsyncEnumerable<PathEdge> GetPathAsync(
        long startNodeId, 
        long destinationNodeId, 
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var startNode = await pathFindingRepository.GetNodeByIdAsync(startNodeId, cancellationToken);
        if (startNode is null)
        {
            throw new NodeNotFoundException(startNodeId);
        }
        
        var destinationNode = await pathFindingRepository.GetNodeByIdAsync(destinationNodeId, cancellationToken);
        if (destinationNode is null)
        {
            throw new NodeNotFoundException(destinationNodeId);
        }
    
        logger.LogInformation("Looking for path from {@startNode} to {@destinationNode}", 
            startNode.Id, destinationNode.Id);

        Dictionary<OsmNode, double> fScore = [];
        Dictionary<OsmNode, double> gScore = [];
        Dictionary<OsmNode, OsmNode> cameFrom = [];
        var openSet = new SortedSet<OsmNode>(Comparer<OsmNode>.Create((left, right) => (int)(fScore[left] - fScore[right])));
        
        gScore[startNode] = 0;
        fScore[startNode] = GetDistance(startNode, destinationNode);
        openSet.Add(startNode);
        
        while (openSet.Count > 0)
        {
            var current = openSet.Min()!;
            openSet.Remove(current);

            if (current.Id == destinationNode.Id)
            {
                yield break; // Reconstruct Path
            }

            var edges = await pathFindingRepository.GetEdgesAsync(current, cancellationToken);
            foreach (var edge in edges)
            {
                var neighbour = edge.To;
                var tentativeGScore = gScore[current] + GetDistance(current, neighbour);

                if (gScore.TryGetValue(neighbour, out var neighbourGScore) &&
                    !(tentativeGScore < neighbourGScore)) continue;
                cameFrom[neighbour] = current;
                gScore[neighbour] = tentativeGScore;
                fScore[neighbour] = gScore[neighbour] + GetDistance(neighbour, destinationNode);

                if (openSet.Add(neighbour)) continue;
                openSet.Remove(neighbour);
                openSet.Add(neighbour);
            }
        }
    }

    private static double GetDistance(OsmNode left, OsmNode right)
    {
        const double earthRadiusKm = 6371;

        var dLat = ToRadians(left.Lat - right.Lat);
        var dLon = ToRadians(left.Lon - right.Lon);
        var leftLatInRadians = ToRadians(left.Lat);
        var rightLatInRadians = ToRadians(right.Lat);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Sin(dLon / 2) * Math.Sin(dLon / 2) * Math.Cos(leftLatInRadians) * Math.Cos(rightLatInRadians);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return earthRadiusKm * c;
    }
    
    private static double ToRadians(double angleIn10ThOfADegree) {
        // Angle in 10th of a degree converted to radians.
        return angleIn10ThOfADegree * Math.PI / 180;
    }
}

public sealed class NodeNotFoundException(long nodeId) : Exception($"Node with id {nodeId} not found");