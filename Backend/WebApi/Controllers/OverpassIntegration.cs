using Microsoft.AspNetCore.Mvc;
using WebApi.Services;

namespace WebApi.Controllers;

[Controller]
[Route("[controller]/[action]")]
public class OverpassIntegration() : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> Enqueue(CancellationToken cancellationToken)
    {
        var query = await new StreamReader(Request.Body).ReadToEndAsync(cancellationToken);
        OsmUpdater.Queries.Enqueue(query);
        return Ok();
    }
}