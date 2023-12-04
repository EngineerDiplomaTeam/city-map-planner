namespace OverpassClient;

public record OsmResponse(double Version, string Generator, IAsyncEnumerable<OsmElement> Elements);
