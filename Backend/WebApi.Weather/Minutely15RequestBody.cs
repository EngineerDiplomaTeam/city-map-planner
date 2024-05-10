using System.Text.Json.Serialization;

namespace WebApi.Weather;

public class Minutely15ResponseBody
{
    public string[]? Time { get; set; } = null!;
    public int[] Weathercode { get; set; } = null!;
    
    [JsonPropertyName("temperature_2m")]
    public double[] Temperature2M { get; set; } = null!;
}