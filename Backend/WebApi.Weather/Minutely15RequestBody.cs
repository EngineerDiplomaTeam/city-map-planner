using System.Text.Json.Serialization;

namespace WebApi.Weather;

public class Minutely15ResponseBody
{
    public string[]? Time { get; set; }
    public int[] Weathercode { get; set; }
    
    [JsonPropertyName("temperature_2m")]
    public double[] Temperature2m { get; set; }
}