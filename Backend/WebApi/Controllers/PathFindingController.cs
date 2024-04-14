using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dto;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
[AllowAnonymous]
public class PathFindingController(ILogger<PathFindingController> logger) : ControllerBase
{
    [HttpGet]
    public IAsyncEnumerable<PathFiningIterationDto> GetPathBetweenPois(
        [FromQuery][Required] long startingPoiId,
        [FromQuery][Required] long destinationPoiId,
        IPathFindingService pathFindingService,
        CancellationToken cancellationToken)
    {
        return pathFindingService
            .FindPathBetweenPoisAsync(startingPoiId, destinationPoiId, cancellationToken)
            .Select(x => new PathFiningIterationDto(x.Complete, x.Route.Select(n => new PathFindingNodeDto(n.OsmNodeId, n.Lat, n.Lon))));
    }
}
