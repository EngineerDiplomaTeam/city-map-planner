using Microsoft.AspNetCore.Mvc;
using WebApi.DTO;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class PoiController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<PoiDto>> List()
    {
        var lorem = new Bogus.DataSets.Lorem("pl").Paragraphs(5);
        const string iconSrc = "/assets/temp/icon.avif";
        const string bannerSrc = "/assets/temp/banner.avif";
        
        PoiDto[] pois =
        [
            new PoiDto(
                0,
                new PoiMapDto("Bazylika Mariacka", iconSrc, 54.3589836, 18.6526853),
                new PoiDetailsDto(bannerSrc, "Bazylika Mariacka w Gdańsku", lorem)
            ),
            new PoiDto(
                1,
                new PoiMapDto("Fontanna Neptuna", iconSrc, 54.3485459, 18.6484622),
                new PoiDetailsDto(bannerSrc, "Fontanna Neptuna", lorem)
            ),
            new PoiDto(
                2,
                new PoiMapDto("Muzeum II Wojny Światowej", iconSrc, 54.3560444, 18.6574016),
                new PoiDetailsDto(bannerSrc, "Muzeum II Wojny Światowej", lorem)
            )
        ];

        return Ok(pois);
    }
}
