namespace WebApi.Services;

public record SendGridOptions(string ApiKey, string SenderEmail, string SenderName)
{
    public SendGridOptions() : this(default!, default!, default!)
    {
        // IOptions requirement
    }
}