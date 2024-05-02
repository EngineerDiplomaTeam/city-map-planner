using System.Runtime.CompilerServices;
using ChatGPT.Net;
using HtmlAgilityPack;
using Markdig;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Domain;
using WebApi.Dto;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController, Authorize(Roles = "Administrator")]
[Route("[controller]")]
public class PoiManageController(IPoisManagerService poisManagerService, ILogger<PoiManageController> logger) : ControllerBase
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
    public async Task<ActionResult> Delete([FromRoute] long id, CancellationToken cancellationToken)
    {
        await poisManagerService.DeletePoiAsync(id, cancellationToken);
        return Ok();
    }

    [HttpGet]
    [Route("{id:int}/Ai")]
    public async Task<ActionResult<IEnumerable<PoiBusinessTimeDto>>> Ai([FromRoute] long id, [FromServices] ChatGpt chat, CancellationToken cancellationToken)
    {
        var (businessPageSnapshot, holidaysPageSnapshot) = await poisManagerService.GetPoiPageSnapshotsAsync(id, cancellationToken);

        const string promt =
            """
            Analyse the following text and output only a single table of business times without explanation. The table must have the following columns:
            - date time range begins when business hours apply in form of "YYYY-MM-DD";
            - date time range ends when business hours apply in form of "YYYY-MM-DD";
            - days of the week when business hours apply in form of digits separated with a comma;
            - time range of business hours in form of "HH:MM - HH:MM";
            When business is closed on holiday, include a row with that information.
            """;
        
        var markdownDocument = await chat.Ask($"{promt} {businessPageSnapshot} {holidaysPageSnapshot}");

        // var markdownDocument = 
        //     """
        //     | Date Time Range Begins | Date Time Range Ends | Days of the Week | Time Range of Business Hours |
        //     |------------------------|----------------------|------------------|-----------------------------|
        //     | 2024-09-01             | 2024-06-30           | 2                | 10:00 - 16:00               |
        //     | 2024-09-01             | 2024-06-30           | 3,4,5,6,7        | 10:00 - 18:00               |
        //     | 2024-07-01             | 2024-08-31           | 2                | 10:00 - 16:00               |
        //     | 2024-07-01             | 2024-08-31           | 3,4,5,6,7        | 10:00 - 20:00               |
        //     | 2024-01-01             | 2024-01-01           | 7                | Closed                      |
        //     | 2024-03-30             | 2024-03-30           | 6                | Closed                      |
        //     | 2024-03-31             | 2024-03-31           | 7                | Closed                      |
        //     | 2024-04-01             | 2024-04-01           | 1                | Closed                      |
        //     | 2024-05-30             | 2024-05-30           | 4                | Closed                      |
        //     | 2024-11-01             | 2024-11-01           | 5                | Closed                      |
        //     | 2024-12-24             | 2024-12-24           | 2                | Closed                      |
        //     | 2024-12-25             | 2024-12-25           | 3                | Closed                      |
        //     | 2024-12-26             | 2024-12-26           | 4                | Closed                      |
        //     | 2024-12-31             | 2024-12-31           | 2                | Closed                      |
        //     """;

        var html = Markdown.ToHtml(markdownDocument, new MarkdownPipelineBuilder().UsePipeTables().Build());
        var htmlDocument = new HtmlDocument();
        
        htmlDocument.LoadHtml(html);

        var table = htmlDocument.DocumentNode.SelectSingleNode("//table");
        
        if (table is null)
        {
            throw new Exception("Invalid Ai response (missing table)");
        }

        var trs = table.SelectNodes(".//tr");

        if (trs is null)
        {
            throw new Exception("Invalid Ai response (missing trs)");
        }

        var businessTimes = new List<PoiBusinessTimeDto>(trs.Count);
        
        foreach (var row in trs)
        {
            var tds = row.SelectNodes(".//td");
            
            if (tds is null)
            {
                continue;
            }
            
            if (tds is not [var rangeBeginNode, var rangeEndNode, var daysOfWeekNode, var timeRangeNode])
            {
                throw new Exception($"Invalid Ai response (wrong column count: {tds.Count})");
            }

            if (!DateTime.TryParse(rangeBeginNode.InnerText, out var rangeBegin))
            {
                logger.LogWarning("Invalid range begin: {Actual}", rangeBeginNode.InnerText);
                continue;
            }
            
            if (!DateTime.TryParse(rangeEndNode.InnerText, out var rangeTo))
            {
                logger.LogWarning("Invalid range end: {Actual}", rangeEndNode.InnerText);
                continue;
            }

            var daysOfWeekStrings = daysOfWeekNode.InnerText.Split(",");
            var daysOfWeekEnums = new List<DayOfWeek>(daysOfWeekStrings.Length);
            
            foreach (var dayOfWeekString in daysOfWeekStrings)
            {
                if (!int.TryParse(dayOfWeekString, out var number))
                {
                    logger.LogWarning("Invalid day of week: {Actual}", dayOfWeekString);
                    continue;
                }

                if (!typeof(DayOfWeek).IsEnumDefined(number - 1))
                {
                    logger.LogWarning("Invalid day of week value: {Actual}", dayOfWeekString);
                    continue;
                }
                
                daysOfWeekEnums.Add((DayOfWeek) number - 1);
            }
            
            var timeParts = timeRangeNode.InnerText.Split('-');

            var state = timeParts.Length == 2
                ? BusinessTimeStateDto.Opened
                : BusinessTimeStateDto.Closed;

            var timeFrom = timeParts.Length != 2
                ? TimeOnly.MinValue
                : TimeOnly.Parse(timeParts[0]);
            
            var timeTo = timeParts.Length != 2
                ? TimeOnly.MaxValue
                : TimeOnly.Parse(timeParts[1]);
            
            var dto = new PoiBusinessTimeDto(
                rangeBegin > rangeTo ? rangeTo : rangeBegin, // Just AI being stupid
                rangeBegin < rangeTo ? rangeTo : rangeBegin,
                daysOfWeekEnums.ToArray(),
                timeFrom,
                timeTo,
                state
            );
            
            businessTimes.Add(dto);
        }
        
        return Ok(businessTimes);
    }
}
