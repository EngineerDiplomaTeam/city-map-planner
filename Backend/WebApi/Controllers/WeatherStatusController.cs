using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dto;
using WebApi.Services;

namespace WebApi.Controllers;

[AllowAnonymous]
[ApiController, Route("[controller]/[action]")]
public class WeatherStatusController(IWeatherService weatherService, ILogger<WeatherStatusController> logger)
{
    public async IAsyncEnumerable<WeatherStatusDto> List([EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var stream = weatherService.GetAllWeatherStatusAsync().WithCancellation(cancellationToken);
        await foreach (var weatherstatus in stream)
        {
            
            yield return new WeatherStatusDto(
                weatherstatus.Time,
                weatherstatus.WeatherCode,
                weatherstatus.Temperature
            ); 
        }
    }
}