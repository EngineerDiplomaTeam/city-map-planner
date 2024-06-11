// ReSharper disable PropertyCanBeMadeInitOnly.Global

using Microsoft.EntityFrameworkCore;

namespace WebApi.Data.Entities;

[PrimaryKey(nameof(FromId), nameof(ToId))]
public class OsmEdgeEntity
{
    public long FromId { get; set; }
    public long ToId { get; set; }
    public long WayId { get; set; }
    public OsmNodeEntity From { get; set; } = null!;
    public OsmNodeEntity To { get; set; } = null!;
    public OsmWayEntity Way { get; set; } = null!;
};
