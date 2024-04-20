// ReSharper disable PropertyCanBeMadeInitOnly.Global
// ReSharper disable EntityFramework.ModelValidation.UnlimitedStringLength
// ReSharper disable CollectionNeverUpdated.Global
namespace WebApi.Data.Entities;

public class PoiEntity
{
    public long Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public ICollection<ImageEntity> Images { get; set; } = default!;
    public ICollection<EntranceEntity> Entrances { get; set; } = default!;
    public int[] PreferredWmoCodes { get; set; } = default!;
    public TimeSpan PreferredSightseeingTime { get; set; }
    public ICollection<OpeningTimeEntity> OpeningTimes { get; set; } = default!;
}
