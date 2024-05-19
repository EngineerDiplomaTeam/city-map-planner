using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Data.Entities;


public class WeatherStatusEntity
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }
    public DateTime Time { get; set; }
    public int WeatherCode { get; set; } 
    public double Temperature { get; set; }
}