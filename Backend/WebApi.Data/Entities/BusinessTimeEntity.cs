// ReSharper disable PropertyCanBeMadeInitOnly.Global

using Microsoft.EntityFrameworkCore;

namespace WebApi.Data.Entities;

public enum BusinessTimeStateEntity
{
    Opened = 0,
    Closed = 1,
}

[PrimaryKey(nameof(PoiId), nameof(EffectiveFrom), nameof(EffectiveTo), nameof(EffectiveDays))]
public class BusinessTimeEntity
{
    public long PoiId { get; set; }
    public PoiEntity Poi { get; set; } = null!;

    public DateTime EffectiveFrom { get; set; }
    public DateTime EffectiveTo { get; set; }
    public DayOfWeek[] EffectiveDays { get; set; } = default!;

    public TimeOnly TimeFrom { get; set; }
    public TimeOnly TimeTo { get; set; }

    public BusinessTimeStateEntity State { get; set; }
}
