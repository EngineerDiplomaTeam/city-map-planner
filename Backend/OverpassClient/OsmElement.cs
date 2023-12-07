namespace OverpassClient;

public record OsmLatLon(double Lat, double Lon);

public record OsmElement(string? Name, string? Type, ulong Id, IEnumerable<OsmLatLon> Nodes);