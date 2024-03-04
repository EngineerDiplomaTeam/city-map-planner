using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace WebApi.Services;

public class EmailSender(ILogger<EmailSender> logger, IOptions<SendGridOptions> options) : IEmailSender
{
    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var (apiKey, senderEmail, senderName) = options.Value;
        
        var client = new SendGridClient(apiKey);
        var msg = new SendGridMessage()
        {
            From = new EmailAddress(senderEmail, senderName),
            Subject = subject,
            PlainTextContent = htmlMessage,
            HtmlContent = htmlMessage,
        };
        
        msg.AddTo(new EmailAddress(email));
        msg.SetClickTracking(false, false);

        var response = await client.SendEmailAsync(msg);

        if (response.IsSuccessStatusCode)
        {
            logger.LogInformation("Email to {Receiver} queued successfully", email);
        }
        else
        {
            var body = await response.Body.ReadAsStringAsync();
            var exception = new Exception(body);
            logger.LogError(exception, "Failed to queue email to {Receiver}", email);
        }
    }
}