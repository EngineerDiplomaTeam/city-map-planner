using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Data.Model;

public record OsmNode([property: Key, DatabaseGenerated(DatabaseGeneratedOption.None)] ulong Id, double Lat, double Lon);
