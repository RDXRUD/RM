using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ResourceManagerAPI.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "employees",
                columns: table => new
                {
                    EmpID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ResourceName = table.Column<string>(type: "text", nullable: true),
                    EmailID = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employees", x => x.EmpID);
                });

            migrationBuilder.CreateTable(
                name: "employeetasks",
                columns: table => new
                {
                    EmployeeTaskID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EmpID = table.Column<int>(type: "integer", nullable: false),
                    TaskName = table.Column<string>(type: "text", nullable: true),
                    Start = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    Finish = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employeetasks", x => x.EmployeeTaskID);
                });

            migrationBuilder.CreateTable(
                name: "resources",
                columns: table => new
                {
                    ResourceID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EmpID = table.Column<int>(type: "integer", nullable: false),
                    EmailID = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resources", x => x.ResourceID);
                });

            migrationBuilder.CreateTable(
                name: "resourceskills",
                columns: table => new
                {
                    ResourceSkillID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ResourceID = table.Column<int>(type: "integer", nullable: false),
                    SkillSetID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_resourceskills", x => x.ResourceSkillID);
                });

            migrationBuilder.CreateTable(
                name: "skill",
                columns: table => new
                {
                    SkillID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Skill = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_skill", x => x.SkillID);
                });

            migrationBuilder.CreateTable(
                name: "skillgroup",
                columns: table => new
                {
                    SkillGroupID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SkillGroup = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_skillgroup", x => x.SkillGroupID);
                });

            migrationBuilder.CreateTable(
                name: "skillset",
                columns: table => new
                {
                    SkillSetID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SkillGroupID = table.Column<int>(type: "integer", nullable: false),
                    SkillID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_skillset", x => x.SkillSetID);
                });

            migrationBuilder.CreateTable(
                name: "uploadrecord",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserName = table.Column<string>(type: "text", nullable: true),
                    FileName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_uploadrecord", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserName = table.Column<string>(type: "text", nullable: true),
                    FullName = table.Column<string>(type: "text", nullable: true),
                    Password = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.UserID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "employees");

            migrationBuilder.DropTable(
                name: "employeetasks");

            migrationBuilder.DropTable(
                name: "resources");

            migrationBuilder.DropTable(
                name: "resourceskills");

            migrationBuilder.DropTable(
                name: "skill");

            migrationBuilder.DropTable(
                name: "skillgroup");

            migrationBuilder.DropTable(
                name: "skillset");

            migrationBuilder.DropTable(
                name: "uploadrecord");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
