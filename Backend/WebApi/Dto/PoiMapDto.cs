namespace WebApi.Dto;

public record PoiOnMapDetailsDto(
    string BannerSrc,
    string Title,
    string Description
);

public record PoiOnMapMapDto(
    string Label,
    string IconSrc,
    double Lat,
    double Lon
);

public record PoiOnMapDto(
    long Id,
    PoiOnMapMapDto Map,
    PoiOnMapDetailsDto Details,
    TimeSpan PreferredSightseeingTime,
    IEnumerable<PoiBusinessTimeDto> BusinessHours,
    IEnumerable<int> PreferredWmoCodes
);
