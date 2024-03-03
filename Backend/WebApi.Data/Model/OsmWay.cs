using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Data.Model;

public class OsmWay
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public ulong Id { get; set; }
    
    // ReSharper disable once PropertyCanBeMadeInitOnly.Global
    public List<OsmTag> Tags { get; set; } = null!;
}
