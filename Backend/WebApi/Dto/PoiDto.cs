using System.ComponentModel.DataAnnotations;

namespace WebApi.Dto;

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

public enum BusinessTimeStateDto
{
    Opened = 0,
    Closed = 1,
}

public record PoiBusinessTimeDto(
    [Required]
    DateTime EffectiveFrom,
    [Required]
    DateTime EffectiveTo,
    [Required]
    DayOfWeek[] EffectiveDays,
    [Required]
    TimeOnly TimeFrom,
    [Required]
    TimeOnly TimeTo,
    [Required]
    BusinessTimeStateDto State
);

public record PoiDto(
    long Id,
    string Name,
    string Description,
    DateTime? Modified,
    string? BusinessHoursPageUrl,
    string? BusinessHoursPageXPath,
    DateTime? BusinessHoursPageModified,
    string? HolidaysPageUrl,
    string? HolidaysPageXPath,
    DateTime? HolidaysPageModified,
    IEnumerable<PoiEntranceDto> Entrances,
    IEnumerable<PoiImageDto> Images,
    IEnumerable<int> PreferredWmoCodes,
    [Required]
    TimeSpan PreferredSightseeingTime,
    IEnumerable<PoiBusinessTimeDto> BusinessTimes
);
