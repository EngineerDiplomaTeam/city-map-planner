using System.Collections.Concurrent;
using System.Diagnostics;

namespace WebApi.Services;

public class OsmUpdater(ILogger<OsmUpdater> logger, IServiceProvider serviceProvider) : BackgroundService
{
    private static DateTime _lastFullUpdate = DateTime.Today;
    public static readonly ConcurrentQueue<string> Queries = new();

    private const string OsmGdańskQuery = 
        """
        [out:xml][timeout:25];
        area["boundary"="administrative"]["name"="Gdańsk"] -> .a;
        (
          way(area.a);
        );
        out geom;
        """;

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            if (DateTime.Now - _lastFullUpdate > TimeSpan.FromDays(1))
            {
                _lastFullUpdate = DateTime.Now;
                Queries.Enqueue(OsmGdańskQuery);
            }

            if (!Queries.TryDequeue(out var query))
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