using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Data.Entities;
using WebApi.Domain;
using WebApi.Dto;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class PoiController(IPoisManagerService poisManagerService) : ControllerBase
{
    [HttpGet]
    public async IAsyncEnumerable<PoiDto> List([EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var stream = poisManagerService.GetAllPoisAsync().WithCancellation(cancellationToken);

        await foreach (var entity in stream)
        {
            yield return new PoiDto(
                entity.Id,
                entity.Name,
                entity.Description,
                entity.Entrances.Select(x => new PoiEntranceDto(x.OsmNodeId, x.Name, x.Description)),
                entity.Images.Select(x => new PoiImageDto(x.FullSrc, x.IconSrc, x.Attribution)),
                entity.PreferredWmoCodes,
                entity.PreferredSightseeingTime,
                entity.OpeningTimes.Select(x => new PoiOpeningTimeDto(x.From, x.To, (PoiOpeningTimeTypeDto) x.Type))
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
            poi.Entrances.Select(x => new PoiEntrance(x.OsmNodeId, x.Name, x.Description)).ToList(),
            poi.Images.Select(x => new PoiImage(x.FullSrc, x.IconSrc, x.Attribution)).ToList(),
            poi.PreferredWmoCodes.ToArray(),
            poi.PreferredSightseeingTime,
            poi.OpeningTimes.Select(x => new PoiOpeningTime(x.From.ToUniversalTime(), x.To.ToUniversalTime(), (PoiOpeningTimeType) x.Type)).ToList()
        );
        
        var entity = await poisManagerService.UpsertPoiAsync(domain, cancellationToken);
        
        return Ok(entity);
    }
}
