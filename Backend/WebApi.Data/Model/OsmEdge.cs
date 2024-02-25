namespace WebApi.Data.Model;

public sealed record OsmEdge(ulong FromNodeId, ulong ToNodeId)
{
    public OsmNode From { get; init; } = null!;
    public OsmNode To { get; init; } = null!;
};
