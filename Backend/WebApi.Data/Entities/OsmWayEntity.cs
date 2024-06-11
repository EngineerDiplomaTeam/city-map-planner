// ReSharper disable PropertyCanBeMadeInitOnly.Global

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Data.Entities;

public class OsmWayEntity
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public long Id { get; set; }
    public ICollection<OsmTagEntity> Tags { get; set; } = [];
    public ICollection<OsmEdgeEntity> Edges { get; set; } = [];
}
