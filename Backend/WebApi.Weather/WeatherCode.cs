namespace WebApi.Weather;

public enum WeatherCode
{
    ClearSky = 0,
    MainlyClear = 1,
    PartlyCloudy = 2,
    Overcast = 3,
    Fog = 45,
    DepositingRimeFog = 48,
    LightDrizzle = 51, // mżawka
    ModerateDrizzle = 53, // Deszcz
    DenseDrizzle = 55, // Deszcz
    LightFreezingDrizzle = 56, // Deszcz
    DenseFreezingDrizzle = 57,// Deszcz
    SlightRain = 61,// Deszcz
    ModerateRain = 63,// Deszcz
    HeavyRain = 65,// Deszcz
    LightFreezingRain = 66, // Deszcz i  snieg
    HeavyFreezingRain = 67, // Deszcz i  snieg
    SlightSnowFall = 71, // snieg
    ModerateSnowFall = 73, // snieg
    HeavySnowFall = 75, // snieg
    SnowGrains = 77,// snieg
    SlightRainShowers = 80, //deszcz
    ModerateRainShowers = 81,//deszcz
    ViolentRainShowers = 82,//deszcz
    SlightSnowShowers = 85, // snieg
    HeavySnowShowers = 86, // snieg
    Thunderstorm = 95, // burza
    ThunderstormWithLightHail = 96, //burza
    ThunderstormWithHeavyHail = 99,//burza
    InvalidWeatherCode = -1
}