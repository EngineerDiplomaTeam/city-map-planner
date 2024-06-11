namespace WebApi.Weather;

public class WeatherForecastOptionsApi
{
    public WeatherForecastOptionsApi(float latitude, float longitude, TemperatureUnitType temperatureUnit,
        string timezone, List<Minutely15OptionsParameter> minutely15, TimeformatType timeformat,
        int pastDays, string startDate, string endDate)
    {
        Latitude = latitude;
        Longitude = longitude;
        TemperatureUnit = temperatureUnit;
        Timezone = timezone;
        Minutely15 = minutely15;
        Timeformat = timeformat;
        PastDays = pastDays;
        StartDate = startDate;
        EndDate = endDate;
    }


    public WeatherForecastOptionsApi()
    {
        Latitude = 0f;
        Longitude = 0f;
        TemperatureUnit = TemperatureUnitType.celsius;
        PrecipitationUnit = PrecipitationUnitType.mm;
        Timeformat = TimeformatType.iso8601;
        Timezone = "GMT";

        StartDate = string.Empty;
        EndDate = string.Empty;
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
    public TemperatureUnitType TemperatureUnit { get; set; }


    /// <summary>
    ///     Default is "mm". Other options: "inch"
    /// </summary>
    public PrecipitationUnitType PrecipitationUnit { get; set; }

    /// <summary>
    ///     Default is "GMT". Any time zone name from the time zone database is supported.
    /// </summary>
    public string Timezone { get; set; }

    public List<Minutely15OptionsParameter> Minutely15 { get; set; } = new(); // lista Enumów


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
    public int PastDays { get; set; }

    /// <summary>
    ///     The time interval to get weather data. A day must be specified as an ISO8601 date (e.g. 2022-06-30).
    ///     (yyyy-mm-dd)
    ///     https://open-meteo.com/en/docs
    /// </summary>
    public string StartDate { get; set; }

    /// <summary>
    ///     The time interval to get weather data. A day must be specified as an ISO8601 date (e.g. 2022-06-30).
    ///     (yyyy-mm-dd)
    ///     https://open-meteo.com/en/docs
    /// </summary>
    public string EndDate { get; set; }
}