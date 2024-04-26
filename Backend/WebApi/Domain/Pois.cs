namespace WebApi.Domain;

public record PoiImage(
    string FullSrc,
    string? IconSrc,
    string Attribution
);

public record PoiEntrance(
    long OsmNodeId,
    double? Lon,
    double? Lat,
    string Name,
    string Description
);

public enum BusinessTimeState
{
    Opened = 0,
    Closed = 1,
}

public record PoiBusinessTime(
    DateTime EffectiveFrom,
    DateTime EffectiveTo,
    DayOfWeek[] EffectiveDays,
    TimeOnly TimeFrom,
    TimeOnly TimeTo,
    BusinessTimeState State
);

public record Poi(
    long Id,
    string Name,
    string Description,
    DateTime Modified,
    string? BusinessHoursPageUrl,
    string? BusinessHoursPageXPath,
    string? BusinessHoursPageSnapshot,
    DateTime? BusinessHoursPageModified,
    string? HolidaysPageUrl,
    string? HolidaysPageXPath,
    string? HolidaysPageSnapshot,
    DateTime? HolidaysPageModified,
    ICollection<PoiEntrance> Entrances,
    ICollection<PoiImage> Images,
    ICollection<int> PreferredWmoCodes,
    TimeSpan PreferredSightseeingTime,
    ICollection<PoiBusinessTime> BusinessTimes
);
