// ReSharper disable PropertyCanBeMadeInitOnly.Global
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Data.Model;

public class OsmNode {
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public long Id { get; set; }
    public double Lat { get; set; }
    public double Lon { get; set; }
    public ICollection<OsmEdge> Edges { get; set; } = [];
    public ICollection<Entrance> Entrances { get; set; } = [];
};
