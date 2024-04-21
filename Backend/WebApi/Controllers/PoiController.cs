using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Domain;
using WebApi.Dto;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class PoiController(IPoisManagerService poisManagerService) : ControllerBase
{
    [HttpGet, AllowAnonymous]
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
                entity.Entrances.Select(x => new PoiEntranceDto(x.OsmNodeId, x.Name, x.Description)),
                entity.Images.Select(x => new PoiImageDto(x.FullSrc, x.IconSrc, x.Attribution)),
                entity.PreferredWmoCodes,
                entity.PreferredSightseeingTime,
                entity.BusinessTimes.Select(x => new PoiOpeningTimeDto(x.From, x.To, (PoiOpeningTimeTypeDto) x.Type))
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
            poi.Entrances.Select(x => new PoiEntrance(x.OsmNodeId, x.Name, x.Description)).ToList(),
            poi.Images.Select(x => new PoiImage(x.FullSrc, x.IconSrc, x.Attribution)).ToList(),
            poi.PreferredWmoCodes.ToArray(),
            poi.PreferredSightseeingTime,
            poi.OpeningTimes.Select(x => new PoiBusinessTime(x.From.ToUniversalTime(), x.To.ToUniversalTime(), (PoiOpeningTimeType) x.Type)).ToList()
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
