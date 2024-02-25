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

            modelBuilder.Entity("WebApi.Data.Model.OsmEdge", b =>
                {
                    b.Property<decimal>("FromNodeId")
                        .HasColumnType("numeric(20,0)")
                        .HasColumnName("from_node_id");

                    b.Property<decimal>("ToNodeId")
                        .HasColumnType("numeric(20,0)")
                        .HasColumnName("to_node_id");

                    b.HasKey("FromNodeId", "ToNodeId")
                        .HasName("pk_edges");

                    b.HasIndex("ToNodeId")
                        .HasDatabaseName("ix_edges_to_node_id");

                    b.ToTable("edges", "data");
                });

            modelBuilder.Entity("WebApi.Data.Model.OsmNode", b =>
                {
                    b.Property<decimal>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("numeric(20,0)")
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

            modelBuilder.Entity("WebApi.Data.Model.OsmEdge", b =>
                {
                    b.HasOne("WebApi.Data.Model.OsmNode", "From")
                        .WithMany()
                        .HasForeignKey("FromNodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_edges_nodes_from_node_id");

                    b.HasOne("WebApi.Data.Model.OsmNode", "To")
                        .WithMany()
                        .HasForeignKey("ToNodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_edges_nodes_to_node_id");

                    b.Navigation("From");

                    b.Navigation("To");
                });
#pragma warning restore 612, 618
        }
    }
}
