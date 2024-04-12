using WebApi.Data.Repositories;
using WebApi.DTO;

namespace WebApi.Services;

public interface IPoisService
{
    public Task<IList<PoiDto>> GetAllPois();
}

public class PoisService(IPoiRepository poiRepository) : IPoisService
{
    public async Task<IList<PoiDto>> GetAllPois()
    {
        const string iconSrc = "/assets/temp/icon.avif";
        const string bannerSrc = "/assets/temp/banner.avif";

        return await poiRepository.SelectAllPois(x => new PoiDto(
            x.Id,
            new PoiMapDto(
                x.Name,
                iconSrc,
                x.Entrances.First().OsmNode.Lat,
                x.Entrances.First().OsmNode.Lon
            ),
            new PoiDetailsDto(
                bannerSrc,
                x.Name,
                x.Description
            )
        ));
    }
}