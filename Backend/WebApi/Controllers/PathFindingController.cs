using System.Collections.Immutable;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoreLinq;
using WebApi.Data;
using WebApi.Data.Model;
using WebApi.DTO;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
[AllowAnonymous]
public class PathFindingController(ILogger<PathFindingController> logger) : ControllerBase
{
    [HttpGet]
    public IAsyncEnumerable<PathDto> GetPath(
        [FromQuery] long startingNodeId,
        [FromQuery] long destinationNodeId,
        IPathFindingService pathFindingService,
        CancellationToken cancellationToken)
    {
        return pathFindingService.GetPathAsync(startingNodeId, destinationNodeId, cancellationToken);
    }

    private static dynamic Map(OsmNode f, OsmNode t)
    {
        return new
        {
            From = new
            {
                Lat = f.Lat,
                Lon = f.Lon,
            },
            To = new
            {
                Lat = t.Lat,
                Lon = t.Lon,
            }
        };
    }

    record PathFindingStep(OsmNode Start,  ICollection<OsmNode> Path);
    
    private static double Haversine(double lat1, double lat2, double lon1, double lon2)
    {
        const double r = 6378100; // meters
            
        var sdlat = Math.Sin((lat2 - lat1) / 2);
        var sdlon = Math.Sin((lon2 - lon1) / 2);
        var q = sdlat * sdlat + Math.Cos(lat1) * Math.Cos(lat2) * sdlon * sdlon;
        var d = 2 * r * Math.Asin(Math.Sqrt(q));

        return d;
    }

    [HttpGet]
    public async IAsyncEnumerable<object> Test([FromQuery] long from, [FromQuery] long to, DataDbContext dataDbContext)
    {
        // 8496368788
        // 4285080101
        
        // w = 287696926
        // var n1 = (await dataDbContext.Nodes.FindAsync((long) 1582534349))!;
        // var n2 = await dataDbContext.Edges.Where(x => x.FromId == n1.Id).Select(x => x.To).ToListAsync();
        //
        // yield return n2.Select(x => Map(n1, x));
        var start = await dataDbContext.Nodes.FindAsync(from);
        
        var visited = new HashSet<long>([from]);
        var queue = new PriorityQueue<PathFindingStep, double>([(new PathFindingStep(start!, [start]), 0)]);
        var c = 0;
        
        while (queue.Count > 0 && c < 1_000)
        {
            c++;
            queue.TryDequeue(out var elem, out var prio);
            var (node, path) = elem!;
            
            
            var neighbours = await dataDbContext.Nodes.Where(x => x.Id == node.Id).SelectMany(x => x.Edges).Select(x => x.To).ToListAsync();
            var notVisitedNeighbours = neighbours.Where(x => !visited.Contains(x.Id));
            
            foreach (var neighbour in notVisitedNeighbours)
            {
                var concatenated = path.Concat([neighbour]).ToList();
                var d = Haversine(neighbour.Lat, node.Lat, neighbour.Lon, node.Lon);
                
                queue.Enqueue(new PathFindingStep(neighbour, concatenated), d + prio);
                visited.Add(neighbour.Id);
        
                yield return concatenated.Pairwise(Map);
                
                if (path.Any(x => x.Id == to))
                {
                    logger.LogCritical("Found it!");
                    yield break;
                }
            }
        }
    }
}
