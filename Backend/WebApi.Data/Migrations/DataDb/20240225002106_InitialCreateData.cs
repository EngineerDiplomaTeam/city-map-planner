using Microsoft.EntityFrameworkCore.Migrations;

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
                    id = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    lat = table.Column<double>(type: "double precision", nullable: false),
                    lon = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_nodes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "edges",
                schema: "data",
                columns: table => new
                {
                    from_node_id = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    to_node_id = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    from_id = table.Column<decimal>(type: "numeric(20,0)", nullable: false),
                    to_id = table.Column<decimal>(type: "numeric(20,0)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_edges", x => new { x.from_node_id, x.to_node_id });
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
                });

            migrationBuilder.CreateIndex(
                name: "ix_edges_from_id",
                schema: "data",
                table: "edges",
                column: "from_id");

            migrationBuilder.CreateIndex(
                name: "ix_edges_to_id",
                schema: "data",
                table: "edges",
                column: "to_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "edges",
                schema: "data");

            migrationBuilder.DropTable(
                name: "nodes",
                schema: "data");
        }
    }
}
