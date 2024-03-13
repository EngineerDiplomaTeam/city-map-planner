namespace OverpassClient;

public record OverpassWay(
    long Id,
    IEnumerable<OverpassNode> Nodes,
    IEnumerable<(string Name, string Value)> Tags
);