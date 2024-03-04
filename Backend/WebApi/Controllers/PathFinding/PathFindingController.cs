using Microsoft.AspNetCore.Mvc;
using WebApi.DTO;
using WebApi.Services;

namespace WebApi.Controllers.PathFinding;

[ApiController]
[Route("[controller]")]
public class PathFindingController(ILogger<PathFindingController> logger) : ControllerBase
{
    [HttpGet]
    public IAsyncEnumerable<PathEdge> GetPath(
        [FromQuery] long startingNodeId,
        [FromQuery] long destinationNodeId,
        IPathFindingService pathFindingService,
        CancellationToken cancellationToken)
    {
        return pathFindingService.GetPathAsync(startingNodeId, destinationNodeId, cancellationToken);
    }
}