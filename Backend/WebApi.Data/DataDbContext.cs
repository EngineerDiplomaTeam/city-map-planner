using Microsoft.EntityFrameworkCore;
using WebApi.Data.Model;

namespace WebApi.Data;

public class DataDbContext(DbContextOptions<DataDbContext> options) : DbContext(options)
{
    public DbSet<OsmWay> Ways { get; private set; } = null!;
    public DbSet<OsmTag> Tags { get; private set; } = null!;
    public DbSet<OsmNode> Nodes { get; private set; } = null!;
    public DbSet<OsmEdge> Edges { get; private set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSnakeCaseNamingConvention();
        optionsBuilder.EnableDetailedErrors();
        optionsBuilder.EnableDetailedErrors(true);
        optionsBuilder.EnableSensitiveDataLogging(true);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.HasDefaultSchema("data");

        // builder.Entity<OsmEdge>().HasKey(x => new{ x.FromNodeId, x.ToNodeId });
        // builder.Entity<OsmEdge>().HasOne(x => x.From).WithMany().HasForeignKey(x => x.FromNodeId);
        // builder.Entity<OsmEdge>().HasOne(x => x.To).WithMany().HasForeignKey(x => x.ToNodeId);
        // builder.Entity<OsmEdge>().HasOne(x => x.Way).WithMany().HasForeignKey(x => x.WayId);

        // builder.Entity<OsmTag>().HasKey(x => new { x.Name, x.Value });

        // builder.Entity<OsmWay>().HasMany(x => x.Tags).WithMany();
    }
}
