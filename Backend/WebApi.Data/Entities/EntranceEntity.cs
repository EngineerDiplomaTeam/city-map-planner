// ReSharper disable PropertyCanBeMadeInitOnly.Global
// ReSharper disable EntityFramework.ModelValidation.UnlimitedStringLength
// ReSharper disable CollectionNeverUpdated.Global

using Microsoft.EntityFrameworkCore;

namespace WebApi.Data.Entities;

[PrimaryKey(nameof(OsmNodeId), nameof(PoiId))]
public class EntranceEntity
{
    public long OsmNodeId { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public OsmNodeEntity OsmNode { get; set; } = null!;
    public long PoiId { get; set; }
    public PoiEntity Poi { get; set; } = null!;
}
