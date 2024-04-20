namespace WebApi.Domain;

public enum PoiOpeningTimeType
{
    Opened = 0,
    Closed = 1,
}

public record PoiImage(
    string FullSrc,
    string? IconSrc,
    string Attribution
);

public record PoiEntrance(
    long OsmNodeId,
    string Name,
    string Description
);

public record PoiOpeningTime(
    DateTime From,
    DateTime To,
    PoiOpeningTimeType Type
);

public record Poi(
    long Id,
    string Name,
    string Description,
    ICollection<PoiEntrance> Entrances,
    ICollection<PoiImage> Images,
    ICollection<int> PreferredWmoCodes,
    TimeSpan PreferredSightseeingTime,
    ICollection<PoiOpeningTime> OpeningTimes
);
