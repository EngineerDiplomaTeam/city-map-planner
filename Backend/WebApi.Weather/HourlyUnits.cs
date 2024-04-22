namespace WebApi.Weather;

public class HourlyUnits
{
    public string? Time { get; set; }
    public string? Temperature_2m { get; set; }

    public string? Weathercode { get; set; }

    // New Weather models API
    public string? Weathercode_best_match { get; set; }
}