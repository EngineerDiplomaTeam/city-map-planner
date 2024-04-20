using WebApi.Data.Entities;
using WebApi.Data.Repositories;
using WebApi.Domain;
using WebApi.Dto;

namespace WebApi.Services;

public interface IPoisManagerService
{
    public IAsyncEnumerable<Poi> GetAllPoisAsync();
    public Task<Poi> UpsertPoiAsync(Poi poi, CancellationToken cancellationToken = default);
    public Task DeletePoiAsync(long id, CancellationToken cancellationToken = default);
}

public class PoisManagerService(IPoiRepository poiRepository) : IPoisManagerService
{
    public IAsyncEnumerable<Poi> GetAllPoisAsync()
    {
        return poiRepository.SelectAllPoisAsync(x => new Poi(
            x.Id,
            x.Name,
            x.Description,
            x.Entrances.Select(e => new PoiEntrance(e.OsmNodeId, e.Name, e.Description)).ToList(),
            x.Images.Select(i => new PoiImage(i.FullSrc, i.IconSrc, i.Attribution)).ToList(),
            x.PreferredWmoCodes.ToList(),
            x.PreferredSightseeingTime,
            x.OpeningTimes.Select(o => new PoiOpeningTime(
                o.From, o.To, (PoiOpeningTimeType)o.Type)).ToList()
        ));
    }

    public async Task<Poi> UpsertPoiAsync(Poi poi, CancellationToken cancellationToken = default)
    {
        var imageEntities = poi.Images.Select(x => new ImageEntity
        {
            Attribution = x.Attribution,
            FullSrc = x.FullSrc,
            IconSrc = x.IconSrc,
        });

        var entranceEntities = poi.Entrances.Select(x => new EntranceEntity
        {
            Name = x.Name,
            Description = x.Description,
            OsmNodeId = x.OsmNodeId,
        });

        var openingTimeEntities = poi.OpeningTimes.Select(x => new OpeningTimeEntity
        {
            From = x.From,
            To = x.To,
            Type = (OpeningTimeType) x.Type,
        });

        var poiEntity = new PoiEntity
        {
            Id = poi.Id,
            Description = poi.Description,
            Name = poi.Name,
            Entrances = entranceEntities.ToList(),
            PreferredSightseeingTime = poi.PreferredSightseeingTime,
            PreferredWmoCodes = poi.PreferredWmoCodes.ToArray(),
            OpeningTimes = openingTimeEntities.ToList(),
            Images = imageEntities.ToList(),
        };
        
        var x = await poiRepository.UpsertPoiAsync(poiEntity, cancellationToken);
        
        return new Poi(
            x.Id,
            x.Name,
            x.Description,
            x.Entrances.Select(e => new PoiEntrance(e.OsmNodeId, e.Name, e.Description)).ToList(),
            x.Images.Select(i => new PoiImage(i.FullSrc, i.IconSrc, i.Attribution)).ToList(),
            x.PreferredWmoCodes.ToList(),
            x.PreferredSightseeingTime,
            x.OpeningTimes.Select(o => new PoiOpeningTime(o.From, o.To, (PoiOpeningTimeType)o.Type)).ToList()
        );
    }

    public async Task DeletePoiAsync(long id, CancellationToken cancellationToken = default)
    {
        await poiRepository.DeletePoiAsync(id, cancellationToken);
    }
}