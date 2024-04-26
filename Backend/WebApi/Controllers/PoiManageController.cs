using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Domain;
using WebApi.Dto;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController, Authorize(Roles = "Administrator")]
[Route("[controller]")]
public class PoiManageController(IPoisManagerService poisManagerService) : ControllerBase
{
    [HttpGet]
    public async IAsyncEnumerable<PoiDto> List([EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var stream = poisManagerService.GetAllPoisAsyncWithoutPageSnapshots().WithCancellation(cancellationToken);

        await foreach (var entity in stream)
        {
            yield return new PoiDto(
                entity.Id,
                entity.Name,
                entity.Description,
                entity.Modified,
                entity.BusinessHoursPageUrl,
                entity.BusinessHoursPageXPath,
                entity.BusinessHoursPageModified,
                entity.HolidaysPageUrl,
                entity.HolidaysPageXPath,
                entity.HolidaysPageModified,
                entity.Entrances.Select(x => new PoiEntranceDto(
                    x.OsmNodeId,
                    x.Name,
                    x.Description
                )),
                entity.Images.Select(x => new PoiImageDto(
                    x.FullSrc,
                    x.IconSrc,
                    x.Attribution
                )),
                entity.PreferredWmoCodes,
                entity.PreferredSightseeingTime,
                entity.BusinessTimes.Select(x => new PoiBusinessTimeDto(
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

    [HttpPost]
    public async Task<ActionResult<PoiDto>> Upsert([FromBody] PoiDto poi, CancellationToken cancellationToken)
    {
        var domain = new Poi(
            poi.Id,
            poi.Name,
            poi.Description,
            DateTime.Now.ToUniversalTime(),
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
                null,
                null,
                x.Name,
                x.Description
            )).ToList(),
            poi.Images.Select(x => new PoiImage(
                x.FullSrc,
                x.IconSrc,
                x.Attribution
            )).ToList(),
            poi.PreferredWmoCodes.ToArray(),
            poi.PreferredSightseeingTime,
            poi.BusinessTimes.Select(x => new PoiBusinessTime(
                x.EffectiveFrom.ToUniversalTime(),
                x.EffectiveTo.ToUniversalTime(),
                x.EffectiveDays,
                x.TimeFrom,
                x.TimeTo,
                (BusinessTimeState) x.State
            )).ToList()
        );
        
        var entity = await poisManagerService.UpsertPoiAsync(domain, cancellationToken);
        
        return Ok(entity);
    }

    [HttpDelete]
    [Route("{id:int}")]
    public async Task<ActionResult> Delete([FromRoute] int id, CancellationToken cancellationToken)
    {
        await poisManagerService.DeletePoiAsync(id, cancellationToken);
        return Ok();
    }
}
