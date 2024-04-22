namespace WebApi.Weather;

public class WeatherForecastOptionsApi
{
    private HourlyOptions _hourly = new();
    private WeatherModelOptions _models = new();

    public WeatherForecastOptionsApi(float latitude, float longitude, TemperatureUnitType temperature_Unit,
          string timezone, HourlyOptions hourly, TimeformatType timeformat,
        int past_Days, string start_date, string end_date, WeatherModelOptions models)
    {
        Latitude = latitude;
        Longitude = longitude;
        Temperature_Unit = temperature_Unit;
        Timezone = timezone;

        if (hourly != null)
            Hourly = hourly;
        if (models != null)
            Models = models;


        Timeformat = timeformat;
        Past_Days = past_Days;
        Start_date = start_date;
        End_date = end_date;
    }

    public WeatherForecastOptionsApi(float latitude, float longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
        Temperature_Unit = TemperatureUnitType.celsius;
        Precipitation_Unit = PrecipitationUnitType.mm;
        Timeformat = TimeformatType.iso8601;
        Timezone = "GMT";

        Start_date = string.Empty;
        End_date = string.Empty;
    }

    public WeatherForecastOptionsApi()
    {
        Latitude = 0f;
        Longitude = 0f;
        Temperature_Unit = TemperatureUnitType.celsius;
        Precipitation_Unit = PrecipitationUnitType.mm;
        Timeformat = TimeformatType.iso8601;
        Timezone = "GMT";

        Start_date = string.Empty;
        End_date = string.Empty;
    }

    /// <summary>
    ///     Geographical WGS84 coordinate of the location
    /// </summary>
    public float Latitude { get; set; }

    /// <summary>
    ///     Geographical WGS84 coordinate of the location
    /// </summary>
    public float Longitude { get; set; }

    /// <summary>
    ///     Default is "celsius". Use "fahrenheit" to convert temperature to fahrenheit
    /// </summary>
    public TemperatureUnitType Temperature_Unit { get; set; }

    /// <summary>
    ///     Default is "kmh". Other options: "ms", "mph", "kn"
    /// </summary>


    /// <summary>
    ///     Default is "mm". Other options: "inch"
    /// </summary>
    public PrecipitationUnitType Precipitation_Unit { get; set; }

    /// <summary>
    ///     Default is "land". Other options: "sea": prefers grid-cells on sea level, "nearest": nearest grid cell
    /// </summary>


    /// <summary>
    ///     Default is "GMT". Any time zone name from the time zone database is supported.
    /// </summary>
    public string Timezone { get; set; }

    public HourlyOptions Hourly
    {
        get => _hourly;
        set
        {
            if (value != null) _hourly = value;
        }
    }

    public WeatherModelOptions Models
    {
        get => _models;
        set
        {
            if (value != null) _models = value;
        }
    }


    /// <summary>
    ///     Default is "iso8601". Other options: "unixtime".
    ///     Please note that all timestamp are in GMT+0!
    ///     See https://open-meteo.com/en/docs for more info
    /// </summary>
    public TimeformatType Timeformat { get; set; }

    /// <summary>
    ///     Default is "0". Other options: "1", "2"
    /// </summary>
    /// <value></value>
    public int Past_Days { get; set; }

    /// <summary>
    ///     The time interval to get weather data. A day must be specified as an ISO8601 date (e.g. 2022-06-30).
    ///     (yyyy-mm-dd)
    ///     https://open-meteo.com/en/docs
    /// </summary>
    public string Start_date { get; set; }

    /// <summary>
    ///     The time interval to get weather data. A day must be specified as an ISO8601 date (e.g. 2022-06-30).
    ///     (yyyy-mm-dd)
    ///     https://open-meteo.com/en/docs
    /// </summary>
    public string End_date { get; set; }
}

