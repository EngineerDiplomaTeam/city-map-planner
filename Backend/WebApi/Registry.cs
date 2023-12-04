using OverpassClient;

namespace WebApi;

public static class Registry
{
    public static IServiceCollection AddCoreRegistry(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddHttpClient<IOverpassClient, OverpassApiClient>();

        return serviceCollection;
    }
}