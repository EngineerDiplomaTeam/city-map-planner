using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Data.Model;

[PrimaryKey(nameof(Name), nameof(Value))]
public class OsmTag
{
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public string Name { get; set; } = null!;
    
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public string Value { get; set; } = null!;

    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public List<OsmWay> Ways { get; set; } = null!;
}
