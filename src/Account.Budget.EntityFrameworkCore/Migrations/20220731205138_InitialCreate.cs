using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Account.Budget.EntityFrameworkCore.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateModified = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "DateCreated", "DateModified", "Email", "FirstName", "LastName", "Password", "UserName" },
                values: new object[,]
                {
                    { 1L, new DateTime(2022, 7, 31, 16, 51, 38, 358, DateTimeKind.Local).AddTicks(56), null, "dustingriffith@outlook.com", "Dustin", "Griffith", "AQAAAAIAAYagAAAAEGqTUhj3Y4K7nTSkeehqX1pbP602epVvuoTAzb7Y8DDxoO5hlvmSwhxFXgp5s+jqHg==", "djarekg" },
                    { 2L, new DateTime(2022, 7, 31, 16, 51, 38, 455, DateTimeKind.Local).AddTicks(2995), null, "jdoe@idk.com", "John", "Doe", "AQAAAAIAAYagAAAAEIXtL49M2EKz7TraJTnsgl2YnV83gYxdtiLtTaUN+CbjM+v4yKnSUCXJd5IiCQEfng==", "jdoe" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName",
                table: "Users",
                column: "UserName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
