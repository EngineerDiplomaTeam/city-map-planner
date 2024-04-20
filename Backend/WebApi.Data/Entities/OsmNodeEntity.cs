// ReSharper disable PropertyCanBeMadeInitOnly.Global

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Data.Entities;

public class OsmNodeEntity {
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public long Id { get; set; }
    public double Lat { get; set; }
    public double Lon { get; set; }
    public ICollection<OsmEdgeEntity> Edges { get; set; } = [];
    public ICollection<EntranceEntity> Entrances { get; set; } = [];
};
