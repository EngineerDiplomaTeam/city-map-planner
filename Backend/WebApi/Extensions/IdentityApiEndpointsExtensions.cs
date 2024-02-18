using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Extensions;

public static class IdentityApiEndpointsExtensions
{
    public static void AddAditionalIdentityEndpoints(this WebApplication app)
    {
        // https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0#log-out
        app
            .MapPost("/logout", async (SignInManager<IdentityUser> signInManager, [FromBody] object? empty) => 
            {
                if (empty == null) return Results.Unauthorized();
                await signInManager.SignOutAsync();
                return Results.Ok();
            })
            .WithOpenApi()
            .RequireAuthorization();

        app
            .MapGet("/exists", async (UserManager<IdentityUser> userManager, [FromQuery] string email) =>
            {
                var user = await userManager.FindByEmailAsync(email);

                return user is null
                    ? Results.NotFound()
                    : Results.Ok();
            })
            .WithOpenApi();
    }
}