namespace WebApi.Weather;

internal class HttpController
{
    public HttpClient Client { get { return _httpClient; } }
    private readonly HttpClient _httpClient;

    public HttpController()
    {
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(
            new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json")
        );
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("om-dotnet");

    }
}