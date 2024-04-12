using Microsoft.AspNetCore.Mvc;
using WebApi.DTO;
using WebApi.Services;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class PoiController(IPoisService poisService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PoiDto>>> List()
    {
        var pois = await poisService.GetAllPois();

        return Ok(pois);
    }
}
