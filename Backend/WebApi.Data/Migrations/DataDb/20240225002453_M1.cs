using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Data.Migrations.DataDb
{
    /// <inheritdoc />
    public partial class M1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_edges_nodes_from_id",
                schema: "data",
                table: "edges");

            migrationBuilder.DropForeignKey(
                name: "fk_edges_nodes_to_id",
                schema: "data",
                table: "edges");

            migrationBuilder.DropIndex(
                name: "ix_edges_from_id",
                schema: "data",
                table: "edges");

            migrationBuilder.DropIndex(
                name: "ix_edges_to_id",
                schema: "data",
                table: "edges");

            migrationBuilder.DropColumn(
                name: "from_id",
                schema: "data",
                table: "edges");

            migrationBuilder.DropColumn(
                name: "to_id",
                schema: "data",
                table: "edges");

            migrationBuilder.CreateIndex(
                name: "ix_edges_to_node_id",
                schema: "data",
                table: "edges",
                column: "to_node_id");

            migrationBuilder.AddForeignKey(
                name: "fk_edges_nodes_from_node_id",
                schema: "data",
                table: "edges",
                column: "from_node_id",
                principalSchema: "data",
                principalTable: "nodes",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_edges_nodes_to_node_id",
                schema: "data",
                table: "edges",
                column: "to_node_id",
                principalSchema: "data",
                principalTable: "nodes",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_edges_nodes_from_node_id",
                schema: "data",
                table: "edges");

            migrationBuilder.DropForeignKey(
                name: "fk_edges_nodes_to_node_id",
                schema: "data",
                table: "edges");

            migrationBuilder.DropIndex(
                name: "ix_edges_to_node_id",
                schema: "data",
                table: "edges");

            migrationBuilder.AddColumn<decimal>(
                name: "from_id",
                schema: "data",
                table: "edges",
                type: "numeric(20,0)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "to_id",
                schema: "data",
                table: "edges",
                type: "numeric(20,0)",
                nullable: false,
                defaultValue: 0m);

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

            migrationBuilder.AddForeignKey(
                name: "fk_edges_nodes_from_id",
                schema: "data",
                table: "edges",
                column: "from_id",
                principalSchema: "data",
                principalTable: "nodes",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_edges_nodes_to_id",
                schema: "data",
                table: "edges",
                column: "to_id",
                principalSchema: "data",
                principalTable: "nodes",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
