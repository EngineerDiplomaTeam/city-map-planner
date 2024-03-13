using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Extensions;

public static class IdentityApiEndpointsExtensions
{
    private static readonly string[] AdminEmails = ["electroluxv2@gmail.com", "miloszchoj@gmail.com"];
    public static void AddAdditionalIdentityEndpoints(this WebApplication app)
    {
        // https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-8.0#log-out
        app
            .MapPost("/logout", async (RoleManager<IdentityRole> roleManager, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, IHttpContextAccessor httpContext, [FromBody] object? empty) => 
            {
                if (empty == null) return Results.Unauthorized();
                
                var claimsPrincipal = httpContext.HttpContext?.User;

                if (claimsPrincipal is null) return Results.NotFound();

                var user = await userManager.GetUserAsync(claimsPrincipal);
                
                if (user is null) return Results.NotFound();

                if (AdminEmails.Contains(user.Email?.ToLowerInvariant()))
                {
                    if (!await roleManager.RoleExistsAsync("Administrator"))
                    {
                        await roleManager.CreateAsync(new IdentityRole("Administrator"));
                    }
                    
                    await userManager.AddToRoleAsync(user, "Administrator");
                }
                
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

        app
            .MapPost("/deleteMe", async (UserManager<IdentityUser> userManager, IHttpContextAccessor httpContext) =>
            {
                var claimsPrincipal = httpContext.HttpContext?.User;

                if (claimsPrincipal is null) return Results.NotFound();

                var user = await userManager.GetUserAsync(claimsPrincipal);

                if (user is null) return Results.BadRequest();

                app.Logger.LogInformation("User #{UserId} requested full data wipe", user.Id);

                var result = await userManager.DeleteAsync(user);

                if (result.Succeeded)
                {
                    app.Logger.LogInformation("User #{UserId} has been successfully removed", user.Id);
                    return Results.Ok();
                }

                var errors = string.Join("\n", result.Errors.Select(x => $"{x.Code}: {x.Description}"));
                var exception = new Exception(errors);

                app.Logger.LogError(exception, "Failed to delete user #{UserId}", user.Id);
                return Results.BadRequest(errors);
            });
    }
}