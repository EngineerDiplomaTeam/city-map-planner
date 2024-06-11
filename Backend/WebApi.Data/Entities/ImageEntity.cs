// ReSharper disable PropertyCanBeMadeInitOnly.Global
// ReSharper disable EntityFramework.ModelValidation.UnlimitedStringLength
namespace WebApi.Data.Entities;

public class ImageEntity
{
    public long Id { get; set; }
    public long PoiId { get; set; }
    public PoiEntity Poi { get; set; } = null!;
    public string FullSrc { get; set; } = null!;
    public string? IconSrc { get; set; }
    public string Attribution { get; set; } = null!;
}
