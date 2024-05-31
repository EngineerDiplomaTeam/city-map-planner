namespace WebApi.Dto;

public record WeatherStatusDto(
    DateTime Time,
    int Weathercode,
    double Temperature2M
);