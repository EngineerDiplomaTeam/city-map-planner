using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;
using OverpassClient;
using WebApi.Data.repositories;
using OsmNode = WebApi.Data.Model.OsmNode;

namespace WebApi.Controllers;

[Controller]
[Route("[controller]/[action]")]
public class OverpassIntegration(IOverpassClient overpassClient, IDataRepository dataRepository) : ControllerBase
{
    [HttpPost]
    public async IAsyncEnumerable<OsmElement> Test([EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var query = await new StreamReader(Request.Body).ReadToEndAsync(cancellationToken);

        await foreach (var osmElement in overpassClient.StreamElements(query, cancellationToken))
        {
            await dataRepository.InsertOsmNodes(osmElement.Nodes.Select(x => new OsmNode(x.Id, x.Lat, x.Lon)), cancellationToken);
            
            yield return osmElement;
        }
    }
}