// ReSharper disable PropertyCanBeMadeInitOnly.Global
using Microsoft.EntityFrameworkCore;

namespace WebApi.Data.Model;

[PrimaryKey(nameof(Name), nameof(Value))]
public class OsmTag
{
    public string Name { get; set; } = null!;
    public string Value { get; set; } = null!;
    public List<OsmWay> Ways { get; set; } = null!;
}
