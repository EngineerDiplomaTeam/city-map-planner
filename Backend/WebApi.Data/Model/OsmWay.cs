// ReSharper disable PropertyCanBeMadeInitOnly.Global
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Data.Model;

public class OsmWay
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public long Id { get; set; }
    public ICollection<OsmTag> Tags { get; set; } = [];
    public ICollection<OsmEdge> Edges { get; set; } = [];
}
