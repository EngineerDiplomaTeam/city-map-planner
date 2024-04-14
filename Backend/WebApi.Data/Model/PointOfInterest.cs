// ReSharper disable PropertyCanBeMadeInitOnly.Global
namespace WebApi.Data.Model;

public class PointOfInterest
{
    public long Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public ICollection<Entrance> Entrances = [];
}