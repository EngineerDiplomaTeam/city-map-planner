using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using WebApi.Services;

namespace WebApi.Controllers;

[Controller, Authorize(Roles = "Administrator")]
[Route("[controller]/[action]")]
public class OverpassIntegration : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> EnqueueQuery(CancellationToken cancellationToken)
    {
        var query = await new StreamReader(Request.Body).ReadToEndAsync(cancellationToken);
        OsmUpdater.Queries.Enqueue(query);
        return Ok();
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string[]), StatusCodes.Status200OK)]
    public Results<UnauthorizedHttpResult, Ok<string[]>> ListQueries()
    {
        var queries = OsmUpdater.Queries.ToArray();
        
        return TypedResults.Ok(queries);
    }
}
