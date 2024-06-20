using Microsoft.AspNetCore.Mvc;
using QRCoder;

namespace WebApi.Extensions;

public static class QrCodeExtensions
{
    public static void AddQrCodeGenerationEndpoints(this WebApplication app)
    {
        app.MapGet(
            "/generate-qr-code",
            ([FromQuery] string code, IHttpContextAccessor ctx) =>
        {
            var qrGenerator = new QRCodeGenerator();
            var user = ctx.HttpContext!.User.Identity!.Name;
            var qrCodeData = qrGenerator.CreateQrCode(
                $"otpauth://totp/city-planner.budziszm.pl:{user}?secret={code}&issuer=City-planner",
                QRCodeGenerator.ECCLevel.Q);
            var qrCode = new Base64QRCode(qrCodeData);
            return Results.Ok(qrCode.GetGraphic(8));
        }).RequireAuthorization();
    }
}
