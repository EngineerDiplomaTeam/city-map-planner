using System.Runtime.CompilerServices;
using System.Text;
using Microsoft.Extensions.Logging;

namespace OverpassClient;

public interface IOverpassClient
{
    public IAsyncEnumerable<OsmElement> StreamElements(string query, CancellationToken cancellationToken = default);
}

public class OverpassApiClient(HttpClient httpClient, ILogger<OverpassApiClient> logger) : IOverpassClient
{
    public async IAsyncEnumerable<OsmElement> StreamElements(string query, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        const string uri = "https://overpass-api.de/api/interpreter";
        var request = new HttpRequestMessage(HttpMethod.Post, uri)
        {
            Content = new StringContent(query, Encoding.UTF8),
        };
        
        var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

        response.EnsureSuccessStatusCode();

        var contentStream = await response.Content.ReadAsStreamAsync(cancellationToken);

        await foreach (var osmElement in contentStream.DeserializeAsyncEnumerable<OsmElement>("elements").WithCancellation(cancellationToken))
        {
            yield return osmElement;
        }
    }
}
