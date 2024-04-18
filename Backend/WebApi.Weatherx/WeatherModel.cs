

namespace WebApi.Weather;

public class WeatherModel
{
    public string Id { get; set; }
    public float Latitude { get; set; }
    public float Longitude { get; set; }
    public string Timezone { get; set; }
    public string? Weathercode { get; set; }
    public HourlyOptions Hourly { get { return _hourly; } set { if (value != null) _hourly = value; } }
    public WeatherModelOptions Models { get { return _models; } set { if (value != null) _models = value; } }
    public string Start_date { get; set; }
    public string End_date { get; set; }
    private HourlyOptions _hourly = new HourlyOptions();
    private WeatherModelOptions _models = new WeatherModelOptions(); // to delete

    
    public WeatherModel(float latitude, float longitude, string timezone, HourlyOptions hourly,int past_Days, string start_date, string end_date, WeatherModelOptions models)
    {
        Latitude = latitude;
        Longitude = longitude;
        Timezone = timezone;

        if (hourly != null)
            Hourly = hourly;
        if (models != null)
            Models = models;
        Start_date = start_date;
        End_date = end_date;
    }

}




