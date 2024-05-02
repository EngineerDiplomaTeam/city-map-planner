using System.Text.Json.Serialization;

namespace WebApi.Weather;

public class HourlyUnits
{
    public string? Time { get; set; }
    [JsonPropertyName("Temperature_2m")]
    public string? Temperature2m { get; set; }

    public string? Weathercode { get; set; }

    // New Weather models API
    [JsonPropertyName("Weathercode_best_matc")]
    public string? WeathercodeBestMatch { get; set; }
}