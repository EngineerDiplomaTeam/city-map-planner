using System.Collections.Immutable;
using System.Runtime.CompilerServices;
using System.Text;
using System.Xml;
using System.Xml.Linq;
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

        using var reader = XmlReader.Create(contentStream, new XmlReaderSettings
        {
            Async = true,
        });

        while (await reader.ReadAsync())
        {
            if (reader is not {NodeType: XmlNodeType.Element, Name: "osm"}) continue;
            
            // Do not read whole <Osm> as it may contain thousands of items
            reader.MoveToAttribute("generator");
            var overpassFlavor = reader.GetAttribute("generator") ?? "unknown";
            
            logger.LogInformation("Got response from {OverpassFlavor}", overpassFlavor);
            break;
        }

        while (await reader.ReadAsync())
        {
            if (reader is not {NodeType: XmlNodeType.Element, Name: "way"} || await XNode.ReadFromAsync(reader, cancellationToken) is not XElement element) continue;

            var id = ulong.Parse(element.Attribute("id")?.Value ?? "0");
            
            var nodes = element
                .Elements("nd")
                .Select(x => (lat: x.Attribute("lat")?.Value, lon: x.Attribute("lon")?.Value))
                .Where(x => x.lat is not null && x.lon is not null)
                .Select(x => new OsmLatLon(double.Parse(x.lat!), double.Parse(x.lon!)));

            var tags = element
                .Elements("tag")
                .Select(x => (k: x.Attribute("k")?.Value, v: x.Attribute("v")?.Value))
                .Where(x => x.k is not null && x.v is not null)
                .ToImmutableDictionary(x => x.k!, x => x.v);

            yield return new OsmElement(
                Id: id,
                Type: tags.GetValueOrDefault("type") ?? "way",
                Name: tags.GetValueOrDefault("name"),
                Nodes: nodes
            );
        }
        
        yield break;
    }
}
