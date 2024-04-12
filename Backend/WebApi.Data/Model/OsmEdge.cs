using Microsoft.EntityFrameworkCore;

namespace WebApi.Data.Model;

[PrimaryKey(nameof(FromId), nameof(ToId))]
public class OsmEdge
{
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public long FromId { get; set; }
    
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public long ToId { get; set; }
    
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public long WayId { get; set; }
    
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public OsmNode From { get; set; } = null!;
    
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public OsmNode To { get; set; } = null!;
    
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public OsmWay Way { get; set; } = null!;
};
