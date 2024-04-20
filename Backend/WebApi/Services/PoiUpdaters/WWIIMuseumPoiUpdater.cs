using HtmlAgilityPack;
using WebApi.Domain;
using WebApi.Extensions;

namespace WebApi.Services.PoiUpdaters;

public class WwiiMuseumPoiUpdater(ILogger<WwiiMuseumPoiUpdater> logger, IPoisManagerService poisManagerService, HttpClient httpClient) : IPoiUpdater
{
    public async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("Fetching latest data about Muzeum drugiej wojny światowej w gdańsku");
        
        const string iconSrc = "/assets/pois/0/icon.avif";
        const string bannerSrc = "/assets/pois/0/banner.avif";
        const string name = "Muzeum II wojny światowej w Gdańsku";
        const string description = "Muzeum II Wojny Światowej w Gdańsku to jedna z największych powierzchni wystawienniczych w Europie. Poznacie tu historię ludności cywilnej żyjącej w trakcie II wojny światowej, którą pokazano za pomocą nie tylko artefaktów, ale też nowoczesnych technologii. W Muzeum poznacie również historię bohaterów tego okresu - często zapomnianych i zepchniętych na margines historii. Dla dzieci poniżej 12. roku życia przygotowano specjalną przestrzeń pt. Podróż w czasie.";
        const string entranceName = "Główne wejście";
        const string entranceDescription = "Na placu Bartoszewskiego";
        const string imageAttribution = "https://visitgdansk.com/";
        const long entranceNodeId = 5364407951;
        var preferredSightseeingTime = TimeSpan.FromHours(6);

        const string websiteUrl = "https://muzeum1939.pl/godziny-otwarcia/4340.html";

        var page = await httpClient.GetStreamAsync(websiteUrl, cancellationToken);
        var doc = page.ToHtmlDocument();

        // var doc.DocumentNode.SelectSingleNode();

        // var poi = new Poi(
        //     name,
        //     description,
        //     [new PoiEntrance(entranceNodeId, entranceName, entranceDescription)],
        //     new PoiImage(bannerSrc, iconSrc, imageAttribution),
        //     [],
        //     preferredSightseeingTime,
        //     []
        // );
        
        // await poisManagerService.UpsertPoiAsync(poi, cancellationToken);

        throw new Exception();
    }
}