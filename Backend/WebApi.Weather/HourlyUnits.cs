
namespace WebApi.Weather
{
    public class HourlyUnits
    {
        public string? Time { get; set; }
        public string? Temperature_2m { get; set; }
        public string? Relativehumidity_2m { get; set; }
        public string? Dewpoint_2m { get; set; }
        public string? Apparent_temperature { get; set; }
        public string? Precipitation { get; set; }
        public string? Rain { get; set; }
        public string? Showers { get; set; }
        public string? Snowfall { get; set; }
        public string? Snow_depth { get; set; }
        public string? Freezinglevel_height { get; set; }
        public string? Weathercode { get; set; }

        // New Weather models API
        public string? Weathercode_best_match { get; set; }
    }
}
