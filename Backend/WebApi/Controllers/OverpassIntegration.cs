using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;
using OverpassClient;

namespace WebApi.Controllers;

[Controller]
[Route("[controller]/[action]")]
public class OverpassIntegration(IOverpassClient overpassClient) : ControllerBase
{
    [HttpPost]
    public async IAsyncEnumerable<OsmElement> Test([EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var query = await new StreamReader(Request.Body).ReadToEndAsync(cancellationToken);

        await foreach (var osmElement in overpassClient.StreamElements(query, cancellationToken))
        {
            yield return osmElement;
        }
    }
}