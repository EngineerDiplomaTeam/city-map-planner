// ReSharper disable PropertyCanBeMadeInitOnly.Global
namespace WebApi.Data.Model;

public class Entrance
{
    public long Id { get; set; }
    public long OsmNodeId { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public OsmNode OsmNode { get; set; } = null!;
    public ICollection<PointOfInterest> PointOfInterests { get; set; } = [];
}
