using WebApi.Data.Entities;
using WebApi.Data.Repositories;
using WebApi.Domain;

namespace WebApi.Services;

public interface IPoisManagerService
{
    public IAsyncEnumerable<Poi> GetAllPoisAsyncWithoutPageSnapshots();
    public IAsyncEnumerable<Poi> GetAllPoisAsyncWithPageSnapshots();
    public Task<Poi> UpsertPoiAsync(Poi poi, CancellationToken cancellationToken = default);
    public Task DeletePoiAsync(long id, CancellationToken cancellationToken = default);
}

public class PoisManagerService(IPoiRepository poiRepository) : IPoisManagerService
{
    public IAsyncEnumerable<Poi> GetAllPoisAsyncWithoutPageSnapshots()
    {
        return poiRepository.SelectAllPoisAsync(poi => new Poi(
            poi.Id,
            poi.Name,
            poi.Description,
            poi.Modified,
            poi.BusinessHoursPageUrl,
            poi.BusinessHoursPageXPath,
            null,
            poi.BusinessHoursPageModified,
            poi.HolidaysPageUrl,
            poi.HolidaysPageXPath,
            null,
            poi.HolidaysPageModified,
            poi.Entrances.Select(x => new PoiEntrance(
                x.OsmNodeId,
                x.Name,
                x.Description
            )).ToList(),
            poi.Images.Select(x => new PoiImage(
                x.FullSrc,
                x.IconSrc,
                x.Attribution
            )).ToList(),
            poi.PreferredWmoCodes.ToList(),
            poi.PreferredSightseeingTime,
            poi.BusinessTimes.Select(x => new PoiBusinessTime(
                x.EffectiveFrom,
                x.EffectiveTo,
                x.EffectiveDays,
                x.TimeFrom,
                x.TimeTo,
                (BusinessTimeState) x.State
            )).ToList()
        ));
    }

    public IAsyncEnumerable<Poi> GetAllPoisAsyncWithPageSnapshots()
    {
        return poiRepository.SelectAllPoisAsync(poi => new Poi(
            poi.Id,
            poi.Name,
            poi.Description,
            poi.Modified,
            poi.BusinessHoursPageUrl,
            poi.BusinessHoursPageXPath,
            poi.BusinessHoursPageSnapshot,
            poi.BusinessHoursPageModified,
            poi.HolidaysPageUrl,
            poi.HolidaysPageXPath,
            poi.HolidaysPageSnapshot,
            poi.HolidaysPageModified,
            poi.Entrances.Select(x => new PoiEntrance(
                x.OsmNodeId,
                x.Name,
                x.Description
            )).ToList(),
            poi.Images.Select(x => new PoiImage(
                x.FullSrc,
                x.IconSrc,
                x.Attribution
            )).ToList(),
            poi.PreferredWmoCodes.ToList(),
            poi.PreferredSightseeingTime,
            poi.BusinessTimes.Select(x => new PoiBusinessTime(
                x.EffectiveFrom,
                x.EffectiveTo,
                x.EffectiveDays,
                x.TimeFrom,
                x.TimeTo,
                (BusinessTimeState) x.State
            )).ToList()
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

        var openingTimeEntities = poi.BusinessTimes.Select(x => new BusinessTimeEntity
        {
            EffectiveFrom = x.EffectiveFrom,
            EffectiveTo = x.EffectiveTo,
            EffectiveDays = x.EffectiveDays,
            TimeFrom = x.TimeFrom,
            TimeTo = x.TimeTo,
            State = (BusinessTimeStateEntity) x.State
        }).ToList();

        var poiEntity = new PoiEntity
        {
            Id = poi.Id,
            Description = poi.Description,
            Modified = poi.Modified,
            BusinessHoursPageUrl = poi.BusinessHoursPageUrl,
            BusinessHoursPageXPath = poi.BusinessHoursPageXPath,
            BusinessHoursPageSnapshot = poi.BusinessHoursPageSnapshot,
            BusinessHoursPageModified = poi.BusinessHoursPageModified,
            HolidaysPageUrl = poi.HolidaysPageUrl,
            HolidaysPageXPath = poi.HolidaysPageXPath,
            HolidaysPageSnapshot = poi.HolidaysPageSnapshot,
            HolidaysPageModified = poi.HolidaysPageModified,
            Name = poi.Name,
            Entrances = entranceEntities.ToList(),
            PreferredSightseeingTime = poi.PreferredSightseeingTime,
            PreferredWmoCodes = poi.PreferredWmoCodes.ToArray(),
            BusinessTimes = openingTimeEntities.ToList(),
            Images = imageEntities.ToList(),
        };
        
        var upsertPoi = await poiRepository.UpsertPoiAsync(poiEntity, cancellationToken);
        
        return new Poi(
            upsertPoi.Id,
            upsertPoi.Name,
            upsertPoi.Description,
            upsertPoi.Modified,
            upsertPoi.BusinessHoursPageUrl,
            upsertPoi.BusinessHoursPageXPath,
            upsertPoi.BusinessHoursPageSnapshot,
            upsertPoi.BusinessHoursPageModified,
            upsertPoi.HolidaysPageUrl,
            upsertPoi.HolidaysPageXPath,
            upsertPoi.HolidaysPageSnapshot,
            upsertPoi.HolidaysPageModified,
            upsertPoi.Entrances.Select(x => new PoiEntrance(
                x.OsmNodeId,
                x.Name,
                x.Description
            )).ToList(),
            upsertPoi.Images.Select(x => new PoiImage(
                x.FullSrc,
                x.IconSrc,
                x.Attribution
            )).ToList(),
            upsertPoi.PreferredWmoCodes.ToList(),
            upsertPoi.PreferredSightseeingTime,
            upsertPoi.BusinessTimes.Select(x => new PoiBusinessTime(
                x.EffectiveFrom,
                x.EffectiveTo,
                x.EffectiveDays,
                x.TimeFrom,
                x.TimeTo,
                (BusinessTimeState) x.State
            )).ToList()
        );
    }

    public async Task DeletePoiAsync(long id, CancellationToken cancellationToken = default)
    {
        await poiRepository.DeletePoiAsync(id, cancellationToken);
    }
}