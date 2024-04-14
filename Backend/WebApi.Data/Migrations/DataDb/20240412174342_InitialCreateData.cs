using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebApi.Data.Migrations.DataDb
{
    /// <inheritdoc />
    public partial class InitialCreateData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "data");

            migrationBuilder.CreateTable(
                name: "nodes",
                schema: "data",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false),
                    lat = table.Column<double>(type: "double precision", nullable: false),
                    lon = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_nodes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "point_of_interests",
                schema: "data",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_point_of_interests", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tags",
                schema: "data",
                columns: table => new
                {
                    name = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tags", x => new { x.name, x.value });
                });

            migrationBuilder.CreateTable(
                name: "ways",
                schema: "data",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_ways", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "entrances",
                schema: "data",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    osm_node_id = table.Column<long>(type: "bigint", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_entrances", x => x.id);
                    table.ForeignKey(
                        name: "fk_entrances_nodes_osm_node_id",
                        column: x => x.osm_node_id,
                        principalSchema: "data",
                        principalTable: "nodes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "edges",
                schema: "data",
                columns: table => new
                {
                    from_id = table.Column<long>(type: "bigint", nullable: false),
                    to_id = table.Column<long>(type: "bigint", nullable: false),
                    way_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_edges", x => new { x.from_id, x.to_id });
                    table.ForeignKey(
                        name: "fk_edges_nodes_from_id",
                        column: x => x.from_id,
                        principalSchema: "data",
                        principalTable: "nodes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_edges_nodes_to_id",
                        column: x => x.to_id,
                        principalSchema: "data",
                        principalTable: "nodes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_edges_ways_way_id",
                        column: x => x.way_id,
                        principalSchema: "data",
                        principalTable: "ways",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "osm_tag_osm_way",
                schema: "data",
                columns: table => new
                {
                    ways_id = table.Column<long>(type: "bigint", nullable: false),
                    tags_name = table.Column<string>(type: "text", nullable: false),
                    tags_value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_osm_tag_osm_way", x => new { x.ways_id, x.tags_name, x.tags_value });
                    table.ForeignKey(
                        name: "fk_osm_tag_osm_way_tags_tags_name_tags_value",
                        columns: x => new { x.tags_name, x.tags_value },
                        principalSchema: "data",
                        principalTable: "tags",
                        principalColumns: new[] { "name", "value" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_osm_tag_osm_way_ways_ways_id",
                        column: x => x.ways_id,
                        principalSchema: "data",
                        principalTable: "ways",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "entrance_point_of_interest",
                schema: "data",
                columns: table => new
                {
                    entrances_id = table.Column<long>(type: "bigint", nullable: false),
                    point_of_interests_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_entrance_point_of_interest", x => new { x.entrances_id, x.point_of_interests_id });
                    table.ForeignKey(
                        name: "fk_entrance_point_of_interest_entrances_entrances_id",
                        column: x => x.entrances_id,
                        principalSchema: "data",
                        principalTable: "entrances",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_entrance_point_of_interest_point_of_interests_point_of_inte",
                        column: x => x.point_of_interests_id,
                        principalSchema: "data",
                        principalTable: "point_of_interests",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_edges_to_id",
                schema: "data",
                table: "edges",
                column: "to_id");

            migrationBuilder.CreateIndex(
                name: "ix_edges_way_id",
                schema: "data",
                table: "edges",
                column: "way_id");

            migrationBuilder.CreateIndex(
                name: "ix_entrance_point_of_interest_point_of_interests_id",
                schema: "data",
                table: "entrance_point_of_interest",
                column: "point_of_interests_id");

            migrationBuilder.CreateIndex(
                name: "ix_entrances_osm_node_id",
                schema: "data",
                table: "entrances",
                column: "osm_node_id");

            migrationBuilder.CreateIndex(
                name: "ix_osm_tag_osm_way_tags_name_tags_value",
                schema: "data",
                table: "osm_tag_osm_way",
                columns: new[] { "tags_name", "tags_value" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "edges",
                schema: "data");

            migrationBuilder.DropTable(
                name: "entrance_point_of_interest",
                schema: "data");

            migrationBuilder.DropTable(
                name: "osm_tag_osm_way",
                schema: "data");

            migrationBuilder.DropTable(
                name: "entrances",
                schema: "data");

            migrationBuilder.DropTable(
                name: "point_of_interests",
                schema: "data");

            migrationBuilder.DropTable(
                name: "tags",
                schema: "data");

            migrationBuilder.DropTable(
                name: "ways",
                schema: "data");

            migrationBuilder.DropTable(
                name: "nodes",
                schema: "data");
        }
    }
}
