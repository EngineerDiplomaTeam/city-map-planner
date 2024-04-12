﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using WebApi.Data;

#nullable disable

namespace WebApi.Data.Migrations.DataDb
{
    [DbContext(typeof(DataDbContext))]
    partial class DataDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasDefaultSchema("data")
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("EntrancePointOfInterest", b =>
                {
                    b.Property<long>("EntrancesId")
                        .HasColumnType("bigint")
                        .HasColumnName("entrances_id");

                    b.Property<long>("PointOfInterestsId")
                        .HasColumnType("bigint")
                        .HasColumnName("point_of_interests_id");

                    b.HasKey("EntrancesId", "PointOfInterestsId")
                        .HasName("pk_entrance_point_of_interest");

                    b.HasIndex("PointOfInterestsId")
                        .HasDatabaseName("ix_entrance_point_of_interest_point_of_interests_id");

                    b.ToTable("entrance_point_of_interest", "data");
                });

            modelBuilder.Entity("OsmTagOsmWay", b =>
                {
                    b.Property<long>("WaysId")
                        .HasColumnType("bigint")
                        .HasColumnName("ways_id");

                    b.Property<string>("TagsName")
                        .HasColumnType("text")
                        .HasColumnName("tags_name");

                    b.Property<string>("TagsValue")
                        .HasColumnType("text")
                        .HasColumnName("tags_value");

                    b.HasKey("WaysId", "TagsName", "TagsValue")
                        .HasName("pk_osm_tag_osm_way");

                    b.HasIndex("TagsName", "TagsValue")
                        .HasDatabaseName("ix_osm_tag_osm_way_tags_name_tags_value");

                    b.ToTable("osm_tag_osm_way", "data");
                });

            modelBuilder.Entity("WebApi.Data.Model.Entrance", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<long>("OsmNodeId")
                        .HasColumnType("bigint")
                        .HasColumnName("osm_node_id");

                    b.HasKey("Id")
                        .HasName("pk_entrances");

                    b.HasIndex("OsmNodeId")
                        .HasDatabaseName("ix_entrances_osm_node_id");

                    b.ToTable("entrances", "data");
                });

            modelBuilder.Entity("WebApi.Data.Model.OsmEdge", b =>
                {
                    b.Property<long>("FromId")
                        .HasColumnType("bigint")
                        .HasColumnName("from_id");

                    b.Property<long>("ToId")
                        .HasColumnType("bigint")
                        .HasColumnName("to_id");

                    b.Property<long>("WayId")
                        .HasColumnType("bigint")
                        .HasColumnName("way_id");

                    b.HasKey("FromId", "ToId")
                        .HasName("pk_edges");

                    b.HasIndex("ToId")
                        .HasDatabaseName("ix_edges_to_id");

                    b.HasIndex("WayId")
                        .HasDatabaseName("ix_edges_way_id");

                    b.ToTable("edges", "data");
                });

            modelBuilder.Entity("WebApi.Data.Model.OsmNode", b =>
                {
                    b.Property<long>("Id")
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    b.Property<double>("Lat")
                        .HasColumnType("double precision")
                        .HasColumnName("lat");

                    b.Property<double>("Lon")
                        .HasColumnType("double precision")
                        .HasColumnName("lon");

                    b.HasKey("Id")
                        .HasName("pk_nodes");

                    b.ToTable("nodes", "data");
                });

            modelBuilder.Entity("WebApi.Data.Model.OsmTag", b =>
                {
                    b.Property<string>("Name")
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<string>("Value")
                        .HasColumnType("text")
                        .HasColumnName("value");

                    b.HasKey("Name", "Value")
                        .HasName("pk_tags");

                    b.ToTable("tags", "data");
                });

            modelBuilder.Entity("WebApi.Data.Model.OsmWay", b =>
                {
                    b.Property<long>("Id")
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    b.HasKey("Id")
                        .HasName("pk_ways");

                    b.ToTable("ways", "data");
                });

            modelBuilder.Entity("WebApi.Data.Model.PointOfInterest", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.HasKey("Id")
                        .HasName("pk_point_of_interests");

                    b.ToTable("point_of_interests", "data");
                });

            modelBuilder.Entity("EntrancePointOfInterest", b =>
                {
                    b.HasOne("WebApi.Data.Model.Entrance", null)
                        .WithMany()
                        .HasForeignKey("EntrancesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_entrance_point_of_interest_entrances_entrances_id");

                    b.HasOne("WebApi.Data.Model.PointOfInterest", null)
                        .WithMany()
                        .HasForeignKey("PointOfInterestsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_entrance_point_of_interest_point_of_interests_point_of_inte");
                });

            modelBuilder.Entity("OsmTagOsmWay", b =>
                {
                    b.HasOne("WebApi.Data.Model.OsmWay", null)
                        .WithMany()
                        .HasForeignKey("WaysId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_osm_tag_osm_way_ways_ways_id");

                    b.HasOne("WebApi.Data.Model.OsmTag", null)
                        .WithMany()
                        .HasForeignKey("TagsName", "TagsValue")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_osm_tag_osm_way_tags_tags_name_tags_value");
                });

            modelBuilder.Entity("WebApi.Data.Model.Entrance", b =>
                {
                    b.HasOne("WebApi.Data.Model.OsmNode", "OsmNode")
                        .WithMany("Entrances")
                        .HasForeignKey("OsmNodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_entrances_nodes_osm_node_id");

                    b.Navigation("OsmNode");
                });

            modelBuilder.Entity("WebApi.Data.Model.OsmEdge", b =>
                {
                    b.HasOne("WebApi.Data.Model.OsmNode", "From")
                        .WithMany("Edges")
                        .HasForeignKey("FromId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_edges_nodes_from_id");

                    b.HasOne("WebApi.Data.Model.OsmNode", "To")
                        .WithMany()
                        .HasForeignKey("ToId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_edges_nodes_to_id");

                    b.HasOne("WebApi.Data.Model.OsmWay", "Way")
                        .WithMany("Edges")
                        .HasForeignKey("WayId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_edges_ways_way_id");

                    b.Navigation("From");

                    b.Navigation("To");

                    b.Navigation("Way");
                });

            modelBuilder.Entity("WebApi.Data.Model.OsmNode", b =>
                {
                    b.Navigation("Edges");

                    b.Navigation("Entrances");
                });

            modelBuilder.Entity("WebApi.Data.Model.OsmWay", b =>
                {
                    b.Navigation("Edges");
                });
#pragma warning restore 612, 618
        }
    }
}
