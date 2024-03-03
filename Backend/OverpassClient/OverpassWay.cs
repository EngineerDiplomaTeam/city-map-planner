namespace OverpassClient;

public record OverpassWay(
    ulong Id,
    IEnumerable<OverpassNode> Nodes,
    IEnumerable<(string Name, string Value)> Tags
);