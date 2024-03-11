using Microsoft.AspNetCore.Mvc;
using WebApi.DTO;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]")]
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
}