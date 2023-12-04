namespace OverpassClient;

public record OsmLatLon(double Lat, double Lon);

public record OsmElement(string Type, ulong Id, IEnumerable<OsmLatLon> Geometry);