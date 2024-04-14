namespace WebApi.DTO;

public record PoiMapDto(
    string Label,
    string IconSrc,
    double Lat,
    double Lon
);

public record PoiDetailsDto(
    string BannerSrc,
    string Title,
    string Description
);

public record PoiDto(
    long Id,
    PoiMapDto Map,
    PoiDetailsDto Details
);
