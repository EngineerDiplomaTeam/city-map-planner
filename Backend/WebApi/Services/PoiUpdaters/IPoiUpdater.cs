namespace WebApi.Services.PoiUpdaters;

public interface IPoiUpdater
{
    public Task ExecuteAsync(CancellationToken cancellationToken);
}
