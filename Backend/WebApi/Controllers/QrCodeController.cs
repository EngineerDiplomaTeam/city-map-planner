using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QRCoder;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class QrCodeController : ControllerBase
{
    [HttpGet, Route("/Generate"), Authorize]
    public IActionResult Generate([FromQuery] string code)
    {
        var qrGenerator = new QRCodeGenerator();
        var user = User.Identity!.Name;
        var qrCodeData = qrGenerator.CreateQrCode($"otpauth://totp/city-planner.budziszm.pl:{user}?secret={code}&issuer=City-planner", 
            QRCodeGenerator.ECCLevel.Q);
        var qrCode = new BitmapByteQRCode(qrCodeData);
        return Ok(new { QrCode = Convert.ToBase64String(qrCode.GetGraphic(20)) });
    }
}