using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dto;
using WebApi.Services;

namespace WebApi.Controllers;

[AllowAnonymous]
[ApiController, Route("[controller]/[action]")]
public class PoiMapController(IPoisManagerService poisManagerService, ILogger<PoiMapController> logger)
{
    public async IAsyncEnumerable<PoiOnMapDto> List([EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var stream = poisManagerService.GetAllPoisAsyncWithoutPageSnapshots().WithCancellation(cancellationToken);

        await foreach (var poi in stream)
        {
            var iconSrc = poi.Images.FirstOrDefault(x => x.IconSrc is not null)?.IconSrc;

            if (iconSrc is null)
            {
                logger.LogWarning("Poi without map icon skipped: {PoiName}#{PoiId}", poi.Name, poi.Id);
                continue;
            }
            
            var bannerSrc = poi.Images.FirstOrDefault()?.FullSrc;

            if (bannerSrc is null)
            {
                logger.LogWarning("Poi without map banner skipped: {PoiName}#{PoiId}", poi.Name, poi.Id);
                continue;
            }

            var firstEntrance = poi.Entrances.FirstOrDefault();

            if (firstEntrance is null)
            {
                logger.LogWarning("Poi without entrance skipped: {PoiName}#{PoiId}", poi.Name, poi.Id);
                continue;
            }
            
            yield return new PoiOnMapDto(
                poi.Id,
                new PoiOnMapMapDto(
                    poi.Name,
                    iconSrc,
                    firstEntrance.Lat!.Value,
                    firstEntrance.Lon!.Value
                ),
                new PoiOnMapDetailsDto(
                    bannerSrc,
                    poi.Name,
                    poi.Description
                ),
                poi.PreferredSightseeingTime,
                poi.BusinessTimes.Select(x => new PoiBusinessTimeDto(
                    x.EffectiveFrom,
                    x.EffectiveTo,
                    x.EffectiveDays,
                    x.TimeFrom,
                    x.TimeTo,
                    (BusinessTimeStateDto) x.State
                ))
            );
        }
    }
}