
namespace WebApi.Dto;

using PathFindingRouteDto = IEnumerable<PathFindingNodeDto>;

public record PathFindingNodeDto(long OsmNodeId, double Lat, double Lon);

public record PathFiningIterationDto(bool Complete, PathFindingRouteDto Route);
