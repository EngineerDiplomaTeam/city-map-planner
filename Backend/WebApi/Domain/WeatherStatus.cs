namespace WebApi.Domain;

public record WeatherStatus(
    DateTime Time,
    int WeatherCode,
    double Temperature
);