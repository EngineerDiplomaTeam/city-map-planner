namespace WebApi.Domain;

using PathFindingRoute = PathFindingNode[];
public record PathFindingNode(double Lat, double Lon, long OsmNodeId);

public record PathFindingIteration(bool Complete, PathFindingRoute Route);
