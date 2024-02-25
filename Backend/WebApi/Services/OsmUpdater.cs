using System.Collections.Concurrent;
using System.Diagnostics;

namespace WebApi.Services;

public class OsmUpdater(ILogger<OsmUpdater> logger, IServiceProvider serviceProvider) : BackgroundService
{
    public static readonly ConcurrentQueue<string> Queries = new();
    
    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            var query = Queries.FirstOrDefault();
            
            if (query is null)
            {
                logger.LogInformation("Waiting for query");
                await Task.Delay(TimeSpan.FromSeconds(5), cancellationToken);
                continue;
            }

            using var scope = serviceProvider.CreateScope();
            var collector = scope.ServiceProvider.GetRequiredService<IOverpassCollectorService>();

            logger.LogInformation("Executing query");
            var sw = new Stopwatch();
            sw.Start();
            await collector.CollectForQuery(query, cancellationToken);
            sw.Stop();
            logger.LogInformation("Executed query, {QueryElapsed} elapsed", sw.Elapsed);
        }
    }
}