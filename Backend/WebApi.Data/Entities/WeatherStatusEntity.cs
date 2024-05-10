namespace WebApi.Data.Entities;

public class WeatherStatusEntity
{
    public long Id { get; set; }
    public DateTime Time { get; set; }
    public int WeatherCode { get; set; } 
    public double Temperature { get; set; }
}