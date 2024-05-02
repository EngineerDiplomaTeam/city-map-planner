namespace WebApi.Weather;

public class HourlyResponseBody
{
    public string[]? Time { get; set; }
    public int[] Weathercode { get; set; }
}