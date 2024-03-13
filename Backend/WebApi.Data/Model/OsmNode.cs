using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Data.Model;

public class OsmNode {
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public long Id { get; set; }
    
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public double Lat { get; set; }
    
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public double Lon { get; set; }
    
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public ICollection<OsmEdge> Edges { get; set; } = [];
};
