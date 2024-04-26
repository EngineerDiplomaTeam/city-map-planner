using System.Text.RegularExpressions;
using WebApi.Domain;
using WebApi.Extensions;

namespace WebApi.Services;

public partial class PoiUpdater(IHttpClientFactory factory, ILogger<PoiUpdater> logger, IServiceProvider provider) : BackgroundService
{
    private static DateTime _lastFullUpdate = DateTime.MinValue;
    private readonly HttpClient _httpClient = factory.CreateClient();
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            if (DateTime.Now - _lastFullUpdate < TimeSpan.FromHours(1))
            {
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
                continue;
            }

            _lastFullUpdate = DateTime.Now;

            await ExecuteUpdate(stoppingToken);
        }
    }

    private async Task ExecuteUpdate(CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating page snapshots for all pois");

        var scope = provider.CreateScope();
        var poisManagerService = scope.ServiceProvider.GetRequiredService<IPoisManagerService>();

        var pois = await poisManagerService.GetAllPoisAsyncWithPageSnapshots().ToListAsync(cancellationToken);
        foreach (var poi in pois)
        {
            logger.LogInformation("Updating {PoiName}#{PoiId}", poi.Name, poi.Id);
            Poi? modified = null;
            
            if (poi.BusinessHoursPageUrl is not null)
            {
                var currentSnapshot = await ExtractTextFromPage(poi.BusinessHoursPageUrl, poi.BusinessHoursPageXPath, cancellationToken);

                if (string.Compare(currentSnapshot, poi.BusinessHoursPageSnapshot, StringComparison.InvariantCultureIgnoreCase) != 0)
                {
                    logger.LogInformation("Detected changes for {PoiName}#{PoiId} at business hours page", poi.Name, poi.Id);
                    modified = poi with { BusinessHoursPageModified = DateTime.Now.ToUniversalTime(), BusinessHoursPageSnapshot = currentSnapshot};
                }
            }
            
            if (poi.HolidaysPageUrl is not null)
            {
                var currentSnapshot = await ExtractTextFromPage(poi.HolidaysPageUrl, poi.HolidaysPageXPath, cancellationToken);

                if (string.Compare(currentSnapshot, poi.HolidaysPageSnapshot, StringComparison.InvariantCultureIgnoreCase) != 0)
                {
                    logger.LogInformation("Detected changes for {PoiName}#{PoiId} at holidays page", poi.Name, poi.Id);
                    modified = (modified ?? poi) with { HolidaysPageModified = DateTime.Now.ToUniversalTime(), HolidaysPageSnapshot = currentSnapshot };
                }
            }

            if (modified is not null)
            {
                await poisManagerService.UpsertPoiAsync(modified, cancellationToken);
            }
        }
        
        logger.LogInformation("Done updating page snapshots for all pois");
    }

    private async Task<string> ExtractTextFromPage(string url, string? xpath, CancellationToken cancellationToken)
    {
        var page = await _httpClient.GetStreamAsync(url, cancellationToken);
        var doc = page.ToHtmlDocument();

        var contentNode = xpath is null
            ? doc.DocumentNode
            : doc.DocumentNode.SelectSingleNode(xpath);

        var contentText = string.Join('\n', contentNode.SelectNodes(".//text()").Select(x => x.InnerText.Trim()));

        return CollapseNewLines().Replace(contentText, "\n").Trim();
    }

    [GeneratedRegex(@"(?:\r\n|\r(?!\n)|(?<!\r)\n){2,}")]
    private static partial Regex CollapseNewLines();
}