using Microsoft.EntityFrameworkCore;
using WebApi.Data.Model;

namespace WebApi.Data;

public class DataDbContext(DbContextOptions<DataDbContext> options) : DbContext(options)
{
    public DbSet<OsmWay> Ways { get; private set; } = null!;
    public DbSet<OsmTag> Tags { get; private set; } = null!;
    public DbSet<OsmNode> Nodes { get; private set; } = null!;
    public DbSet<OsmEdge> Edges { get; private set; } = null!;
    public DbSet<Entrance> Entrances { get; private set; } = null!;
    public DbSet<PointOfInterest> PointOfInterests { get; private set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSnakeCaseNamingConvention();
        optionsBuilder.EnableDetailedErrors();
        optionsBuilder.EnableSensitiveDataLogging();
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.HasDefaultSchema("data");

        builder.Entity<OsmEdge>()
            .HasOne(e => e.From)
            .WithMany(n => n.Edges);

        builder.Entity<OsmEdge>()
            .HasOne(e => e.To)
            .WithMany();

        builder.Entity<PointOfInterest>()
            .HasMany(x => x.Entrances)
            .WithMany(x => x.PointOfInterests);

        builder.Entity<Entrance>()
            .HasOne(x => x.OsmNode)
            .WithMany(x => x.Entrances);
    }
}
