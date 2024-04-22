namespace WebApi.Weather;

public class HourlyRequestBody
{
    public string[]? Time { get; set; }
    public int[] Weathercode { get; set; }
}