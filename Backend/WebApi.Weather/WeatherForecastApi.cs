using System.Text.Json.Serialization;

namespace WebApi.Weather;

/// <summary>
///     Weather Forecast API response
/// </summary>
public class WeatherForecastApi
{
    /// <summary>
    ///     WGS84 of the center of the weather grid-cell which was used to generate this forecast.
    ///     This coordinate might be up to 5 km away.
    /// </summary>
    public float Latitude { get; set; }

    /// <summary>
    ///     WGS84 of the center of the weather grid-cell which was used to generate this forecast.
    ///     This coordinate might be up to 5 km away.
    /// </summary>
    public float Longitude { get; set; }


    public float Elevation { get; set; }


    [JsonPropertyName("generationtime_ms")]
    public double GenerationTime { get; set; }


    [JsonPropertyName("utc_offset_seconds")]
    public int UtcOffset { get; set; }


    public string? Timezone { get; set; }

    /// <summary>
    ///     Timezone abbreviation
    /// </summary>
    /// <example>CEST</example>

    [JsonPropertyName("timezone_abbreviation")]
    public string? TimezoneAbbreviation { get; set; }


    /// <summary>
    ///     For each selected <see cref="minutely15OptionsParameter" />, the unit will be listed here
    /// </summary>

    [JsonPropertyName("minutely_15_units")]
    public Minutely15Units? Minutely15Units { get; set; }

    /// <summary>
    ///     For each selected weather variable, data will be returned as a floating point array.
    ///     Additionally a time array will be returned with ISO8601 timestamps.
    /// </summary>

    [JsonPropertyName("minutely_15")]
    public Minutely15ResponseBody? Minutely15 { get; set; }
}