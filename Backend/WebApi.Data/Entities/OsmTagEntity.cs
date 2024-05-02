// ReSharper disable PropertyCanBeMadeInitOnly.Global

using Microsoft.EntityFrameworkCore;

namespace WebApi.Data.Entities;

[PrimaryKey(nameof(Name), nameof(Value))]
public class OsmTagEntity
{
    public string Name { get; set; } = null!;
    public string Value { get; set; } = null!;
    public List<OsmWayEntity> Ways { get; set; } = null!;
}
