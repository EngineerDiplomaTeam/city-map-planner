using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using NSwag;
using WebApi;
using WebApi.Data;
using WebApi.Data.repositories;
using WebApi.Services;
using WebApi.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCoreRegistry();

builder.Services.AddDbContext<UserDataDbContext>(
    options => options.UseNpgsql(
        builder.Configuration.GetConnectionString("CityPlannerUserData"),
        x => x.MigrationsHistoryTable("ef_migrations_history", "user_data")
    )
);

builder.Services.AddDbContext<DataDbContext>(
    options => options.UseNpgsql(
        builder.Configuration.GetConnectionString("CityPlannerData"),
        x => x.MigrationsHistoryTable("ef_migrations_history", "data")
    )
);

builder.Services.AddTransient<IDataRepository, DataRepository>();

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<UserDataDbContext>();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
    options.SignIn.RequireConfirmedEmail = true;
});

builder.Configuration.AddEnvironmentVariables(prefix: "CITY_MAP_PLANNER_");
builder.Services.Configure<SendGridOptions>(builder.Configuration.GetSection("SendGrid"));
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddHostedService<OsmUpdater>();
builder.Services.AddTransient<IOverpassCollectorService, OverpassCollectorService>();
builder.Services.AddOpenApiDocument(settings => settings.PostProcess = document => document.Info = new OpenApiInfo
{
    Title = "City map planner backend API"
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Add OpenAPI 3.0 document serving middleware
    // Available at: http://localhost:<port>/swagger/v1/swagger.json
    app.UseOpenApi();

    // Add web UIs to interact with the document
    // Available at: http://localhost:<port>/swagger
    app.UseSwaggerUi(c => c.CustomStylesheetPath = "/swagger-ui/dark.css");

    app.UseStaticFiles();

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

app.Run();
