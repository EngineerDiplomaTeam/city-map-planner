// ReSharper disable PropertyCanBeMadeInitOnly.Global
// ReSharper disable EntityFramework.ModelValidation.UnlimitedStringLength
// ReSharper disable CollectionNeverUpdated.Global
namespace WebApi.Data.Entities;

public class PoiEntity
{
    public long Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime Modified { get; set; }
    public string? BusinessHoursPageUrl { get; set; }
    public string? BusinessHoursPageXPath { get; set; }
    public string? BusinessHoursPageSnapshot { get; set; }
    public DateTime? BusinessHoursPageModified { get; set; }
    public string? HolidaysPageUrl { get; set; }
    public string? HolidaysPageXPath { get; set; }
    public string? HolidaysPageSnapshot { get; set; }
    public DateTime? HolidaysPageModified { get; set; }
    public ICollection<ImageEntity> Images { get; set; } = default!;
    public ICollection<EntranceEntity> Entrances { get; set; } = default!;
    public int[] PreferredWmoCodes { get; set; } = default!;
    public TimeSpan PreferredSightseeingTime { get; set; }
    public ICollection<BusinessTimeEntity> BusinessTimes { get; set; } = default!;
}
