// ReSharper disable PropertyCanBeMadeInitOnly.Global

using Microsoft.EntityFrameworkCore;

namespace WebApi.Data.Entities;

public enum OpeningTimeType
{
    Opened = 0,
    Closed = 1,
}

[PrimaryKey(nameof(From), nameof(To), nameof(PoiId))]
public class BusinessTimeEntity
{
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public long PoiId { get; set; }
    public PoiEntity Poi { get; set; } = null!;
    public OpeningTimeType Type { get; set; }
}
