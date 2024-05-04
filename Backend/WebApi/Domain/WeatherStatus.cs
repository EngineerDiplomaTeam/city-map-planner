namespace WebApi.Domain;

public record WeatherStatus(
    long Id,
    DateTime Time,
    int WeatherCode
);

