using System.Text.Json.Serialization;

namespace WebApi.Weather;

public class Minutely15Units
{
    public string? Time { get; set; }

    [JsonPropertyName("Temperature_2m")] public string? Temperature { get; set; }

    public string? Weathercode { get; set; }
}