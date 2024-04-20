using System.ComponentModel.DataAnnotations;

namespace WebApi.Dto;

public enum PoiOpeningTimeTypeDto
{
    Opened = 0,
    Closed = 1,
}

public record PoiImageDto(
    string FullSrc,
    string? IconSrc,
    string Attribution
);

public record PoiEntranceDto(
    [Required]
    long OsmNodeId,
    string Name,
    string Description
);

public record PoiOpeningTimeDto(
    [Required]
    DateTime From,
    [Required]
    DateTime To,
    [Required]
    PoiOpeningTimeTypeDto Type
);

public record PoiDto(
    long Id,
    string Name,
    string Description,
    IEnumerable<PoiEntranceDto> Entrances,
    IEnumerable<PoiImageDto> Images,
    IEnumerable<int> PreferredWmoCodes,
    [Required]
    TimeSpan PreferredSightseeingTime,
    IEnumerable<PoiOpeningTimeDto> OpeningTimes
);
