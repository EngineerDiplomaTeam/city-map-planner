﻿// <auto-generated />
using System;
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
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("OsmTagEntityOsmWayEntity", b =>
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
                        .HasName("pk_osm_tag_entity_osm_way_entity");

                    b.HasIndex("TagsName", "TagsValue")
                        .HasDatabaseName("ix_osm_tag_entity_osm_way_entity_tags_name_tags_value");

                    b.ToTable("osm_tag_entity_osm_way_entity", "data");
                });

            modelBuilder.Entity("WebApi.Data.Entities.BusinessTimeEntity", b =>
                {
                    b.Property<long>("PoiId")
                        .HasColumnType("bigint")
                        .HasColumnName("poi_id");

                    b.Property<DateTime>("EffectiveFrom")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("effective_from");

                    b.Property<DateTime>("EffectiveTo")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("effective_to");

                    b.Property<int[]>("EffectiveDays")
                        .HasColumnType("integer[]")
                        .HasColumnName("effective_days");

                    b.Property<int>("State")
                        .HasColumnType("integer")
                        .HasColumnName("state");

                    b.Property<TimeOnly>("TimeFrom")
                        .HasColumnType("time without time zone")
                        .HasColumnName("time_from");

                    b.Property<TimeOnly>("TimeTo")
                        .HasColumnType("time without time zone")
                        .HasColumnName("time_to");

                    b.HasKey("PoiId", "EffectiveFrom", "EffectiveTo", "EffectiveDays")
                        .HasName("pk_business_times");

                    b.ToTable("business_times", "data");
                });

            modelBuilder.Entity("WebApi.Data.Entities.EntranceEntity", b =>
                {
                    b.Property<long>("OsmNodeId")
                        .HasColumnType("bigint")
                        .HasColumnName("osm_node_id");

                    b.Property<long>("PoiId")
                        .HasColumnType("bigint")
                        .HasColumnName("poi_id");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.HasKey("OsmNodeId", "PoiId")
                        .HasName("pk_entrances");

                    b.HasIndex("PoiId")
                        .HasDatabaseName("ix_entrances_poi_id");

                    b.ToTable("entrances", "data");
                });

            modelBuilder.Entity("WebApi.Data.Entities.ImageEntity", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("Attribution")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("attribution");

                    b.Property<string>("FullSrc")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("full_src");

                    b.Property<string>("IconSrc")
                        .HasColumnType("text")
                        .HasColumnName("icon_src");

                    b.Property<long>("PoiId")
                        .HasColumnType("bigint")
                        .HasColumnName("poi_id");

                    b.HasKey("Id")
                        .HasName("pk_images");

                    b.HasIndex("PoiId")
                        .HasDatabaseName("ix_images_poi_id");

                    b.ToTable("images", "data");
                });

            modelBuilder.Entity("WebApi.Data.Entities.OsmEdgeEntity", b =>
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

            modelBuilder.Entity("WebApi.Data.Entities.OsmNodeEntity", b =>
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

            modelBuilder.Entity("WebApi.Data.Entities.OsmTagEntity", b =>
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

            modelBuilder.Entity("WebApi.Data.Entities.OsmWayEntity", b =>
                {
                    b.Property<long>("Id")
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    b.HasKey("Id")
                        .HasName("pk_ways");

                    b.ToTable("ways", "data");
                });

            modelBuilder.Entity("WebApi.Data.Entities.PoiEntity", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime?>("BusinessHoursPageModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("business_hours_page_modified");

                    b.Property<string>("BusinessHoursPageSnapshot")
                        .HasColumnType("text")
                        .HasColumnName("business_hours_page_snapshot");

                    b.Property<string>("BusinessHoursPageUrl")
                        .HasColumnType("text")
                        .HasColumnName("business_hours_page_url");

                    b.Property<string>("BusinessHoursPageXPath")
                        .HasColumnType("text")
                        .HasColumnName("business_hours_page_x_path");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<DateTime?>("HolidaysPageModified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("holidays_page_modified");

                    b.Property<string>("HolidaysPageSnapshot")
                        .HasColumnType("text")
                        .HasColumnName("holidays_page_snapshot");

                    b.Property<string>("HolidaysPageUrl")
                        .HasColumnType("text")
                        .HasColumnName("holidays_page_url");

                    b.Property<string>("HolidaysPageXPath")
                        .HasColumnType("text")
                        .HasColumnName("holidays_page_x_path");

                    b.Property<DateTime>("Modified")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("modified");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("name");

                    b.Property<TimeSpan>("PreferredSightseeingTime")
                        .HasColumnType("interval")
                        .HasColumnName("preferred_sightseeing_time");

                    b.Property<int[]>("PreferredWmoCodes")
                        .IsRequired()
                        .HasColumnType("integer[]")
                        .HasColumnName("preferred_wmo_codes");

                    b.HasKey("Id")
                        .HasName("pk_point_of_interests");

                    b.ToTable("point_of_interests", "data");
                });

            modelBuilder.Entity("WebApi.Data.Entities.WeatherStatusEntity", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<double>("Temperature")
                        .HasColumnType("double precision")
                        .HasColumnName("temperature");

                    b.Property<DateTime>("Time")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("time");

                    b.Property<int>("WeatherCode")
                        .HasColumnType("integer")
                        .HasColumnName("weather_code");

                    b.HasKey("Id")
                        .HasName("pk_weather_status");

                    b.ToTable("weather_status", "data");
                });

            modelBuilder.Entity("OsmTagEntityOsmWayEntity", b =>
                {
                    b.HasOne("WebApi.Data.Entities.OsmWayEntity", null)
                        .WithMany()
                        .HasForeignKey("WaysId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_osm_tag_entity_osm_way_entity_ways_ways_id");

                    b.HasOne("WebApi.Data.Entities.OsmTagEntity", null)
                        .WithMany()
                        .HasForeignKey("TagsName", "TagsValue")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_osm_tag_entity_osm_way_entity_tags_tags_name_tags_value");
                });

            modelBuilder.Entity("WebApi.Data.Entities.BusinessTimeEntity", b =>
                {
                    b.HasOne("WebApi.Data.Entities.PoiEntity", "Poi")
                        .WithMany("BusinessTimes")
                        .HasForeignKey("PoiId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_business_times_point_of_interests_poi_id");

                    b.Navigation("Poi");
                });

            modelBuilder.Entity("WebApi.Data.Entities.EntranceEntity", b =>
                {
                    b.HasOne("WebApi.Data.Entities.OsmNodeEntity", "OsmNode")
                        .WithMany("Entrances")
                        .HasForeignKey("OsmNodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_entrances_nodes_osm_node_id");

                    b.HasOne("WebApi.Data.Entities.PoiEntity", "Poi")
                        .WithMany("Entrances")
                        .HasForeignKey("PoiId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_entrances_point_of_interests_poi_id");

                    b.Navigation("OsmNode");

                    b.Navigation("Poi");
                });

            modelBuilder.Entity("WebApi.Data.Entities.ImageEntity", b =>
                {
                    b.HasOne("WebApi.Data.Entities.PoiEntity", "Poi")
                        .WithMany("Images")
                        .HasForeignKey("PoiId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_images_point_of_interests_poi_id");

                    b.Navigation("Poi");
                });

            modelBuilder.Entity("WebApi.Data.Entities.OsmEdgeEntity", b =>
                {
                    b.HasOne("WebApi.Data.Entities.OsmNodeEntity", "From")
                        .WithMany("Edges")
                        .HasForeignKey("FromId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_edges_nodes_from_id");

                    b.HasOne("WebApi.Data.Entities.OsmNodeEntity", "To")
                        .WithMany()
                        .HasForeignKey("ToId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_edges_nodes_to_id");

                    b.HasOne("WebApi.Data.Entities.OsmWayEntity", "Way")
                        .WithMany("Edges")
                        .HasForeignKey("WayId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("fk_edges_ways_way_id");

                    b.Navigation("From");

                    b.Navigation("To");

                    b.Navigation("Way");
                });

            modelBuilder.Entity("WebApi.Data.Entities.OsmNodeEntity", b =>
                {
                    b.Navigation("Edges");

                    b.Navigation("Entrances");
                });

            modelBuilder.Entity("WebApi.Data.Entities.OsmWayEntity", b =>
                {
                    b.Navigation("Edges");
                });

            modelBuilder.Entity("WebApi.Data.Entities.PoiEntity", b =>
                {
                    b.Navigation("BusinessTimes");

                    b.Navigation("Entrances");

                    b.Navigation("Images");
                });
#pragma warning restore 612, 618
        }
    }
}
