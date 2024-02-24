namespace OverpassClient;

public record OsmNode(ulong Id, double Lat, double Lon);

public record OsmElement(string? Name, string? Type, ulong Id, IEnumerable<OsmNode> Nodes);