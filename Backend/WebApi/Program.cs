using ChatGPT.Net;
using ChatGPT.Net.DTO.ChatGPT;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NSwag;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using WebApi.OverpassClient;
using WebApi.Data;
using WebApi.Data.Repositories;
using WebApi.Services;
using WebApi.Extensions;
using WebApi.Weather;

var builder = WebApplication.CreateBuilder(args);

// Open telemetry
builder.Logging.AddOpenTelemetry(logging =>
{
    logging.IncludeFormattedMessage = true;
    logging.IncludeScopes = true;
});

builder.Services.AddOpenTelemetry()
    .ConfigureResource(c => c.AddService("WebApi"))
    .WithMetrics(metrics =>
    {
        metrics
            .AddHttpClientInstrumentation()
            .AddRuntimeInstrumentation()
            .AddMeter("Microsoft.AspNetCore.Hosting", "Microsoft.AspNetCore.Server.Kestrel", "System.Net.Http", "WebApi");
    })
    .WithTracing(tracing =>
    {
        tracing.SetSampler<AlwaysOnSampler>();
        tracing
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddHttpClientInstrumentation();
    });

// Use the OTLP exporter
builder.Services.Configure<OpenTelemetryLoggerOptions>(x => x.AddOtlpExporter());
builder.Services.ConfigureOpenTelemetryMeterProvider(x => x.AddOtlpExporter());
builder.Services.ConfigureOpenTelemetryTracerProvider(x => x.AddOtlpExporter());

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<UserDataDbContext>(
    options => options.UseNpgsql(
        builder.Configuration.GetConnectionString("CityPlannerUserData"),
        x => x.MigrationsHistoryTable("ef_migrations_history", "user_data")
    )
);

var npgsqlDataSource = new NpgsqlDataSourceBuilder(builder.Configuration.GetConnectionString("CityPlannerData")).EnableRecordsAsTuples().Build();
builder.Services.AddDbContext<DataDbContext>(options => options.UseNpgsql(
    npgsqlDataSource,
    x => x.MigrationsHistoryTable("ef_migrations_history", "data")
));

builder.Services.AddTransient<IPathFindingService, PathFindingService>();
builder.Services.AddTransient<IDataRepository, DataRepository>();
builder.Services.AddTransient<IPathFindingRepository, PathFindingRepository>();
builder.Services.AddTransient<IPoiRepository, PoiRepository>();
builder.Services.AddTransient<IPoisManagerService, PoisManagerService>();
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddHttpClient();
builder.Services.AddHttpClient<IOverpassClient, OverpassApiClient>();
builder.Services.AddHostedService<PoiUpdater>();
builder.Services.AddHostedService<OsmUpdater>();
builder.Services.AddTransient<IOverpassCollectorService, OverpassCollectorService>();
builder.Services.AddTransient<ChatGpt>(_ => new ChatGpt(builder.Configuration.GetValue<string>("ChatGptApiToken") ?? throw new Exception("Missing ChatGptApiToken"), new ChatGptOptions()
{
    Model = "gpt-4",
    MaxTokens = 2_000,
}));

builder.Services.AddOpenApiDocument(settings => settings.PostProcess = document => document.Info = new OpenApiInfo
{
    Title = "City map planner backend API"
});

builder.Services.AddAuthorization();
builder.Services
    .AddIdentityApiEndpoints<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<UserDataDbContext>();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
    options.SignIn.RequireConfirmedEmail = true;
});

builder.Configuration.AddEnvironmentVariables(prefix: "CITY_MAP_PLANNER_");
builder.Services.Configure<SendGridOptions>(builder.Configuration.GetSection("SendGrid"));

builder.Services.AddHttpClient<IWeatherClient, WeatherClient>("WeatherClient",client =>
{
    client.BaseAddress = new Uri("https://api.open-meteo.com/v1/forecast");
});
builder.Services.AddTransient<IWeatherService, WeatherService>();
builder.Services.AddTransient<IWeatherRepository, WeatherRepository>();
// builder.Services.AddHostedService<WeatherUpdater>();

builder.Services.AddResponseCompression();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Add OpenAPI 3.0 document serving middleware
    // Available at: http://localhost:<port>/swagger/v1/swagger.json
    app.UseOpenApi();

    using var client = new HttpClient();
    var darkStyles = await client.GetStringAsync("https://raw.githubusercontent.com/Amoenus/SwaggerDark/master/SwaggerDark.css");

    // Add web UIs to interact with the document
    // Available at: http://localhost:<port>/swagger
    app.UseSwaggerUi(c =>
    {
        c.CustomInlineStyles = darkStyles;
    }
    );

    // Add ReDoc UI to interact with the document
    // Available at: http://localhost:<port>/redoc
    app.UseReDoc(options =>
    {
        options.Path = "/redoc";
    });
}

// Do not add here HTTPS redirection, we use NGINX for SSL
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<IdentityUser>();
app.AddAdditionalIdentityEndpoints();
app.UseResponseCompression();

app.Run();
