using Microsoft.EntityFrameworkCore;
using WebApi.Data.Entities;

namespace WebApi.Data;

public class DataDbContext(DbContextOptions<DataDbContext> options) : DbContext(options)
{
    public DbSet<OsmWayEntity> Ways { get; private set; } = null!;
    public DbSet<OsmTagEntity> Tags { get; private set; } = null!;
    public DbSet<OsmNodeEntity> Nodes { get; private set; } = null!;
    public DbSet<OsmEdgeEntity> Edges { get; private set; } = null!;
    public DbSet<EntranceEntity> Entrances { get; private set; } = null!;
    public DbSet<ImageEntity> PoiImages { get; private set; } = null!;
    public DbSet<BusinessTimeEntity> OpeningTimes { get; private set; } = null!;
    public DbSet<PoiEntity> PointOfInterests { get; private set; } = null!;

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

        builder.Entity<OsmEdgeEntity>()
            .HasOne(e => e.From)
            .WithMany(n => n.Edges);

        builder.Entity<OsmEdgeEntity>()
            .HasOne(e => e.To)
            .WithMany();
    }
}
