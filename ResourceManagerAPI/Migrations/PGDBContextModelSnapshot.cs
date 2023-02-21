﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using ResourceManagerAPI.DBContext;

#nullable disable

namespace ResourceManagerAPI.Migrations
{
    [DbContext(typeof(PGDBContext))]
    partial class PGDBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ResourceManagerAPI.Models.Employee", b =>
                {
                    b.Property<int>("EmpID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("EmpID"));

                    b.Property<string>("EmailID")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ResourceName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("EmpID");

                    b.ToTable("employees");
                });

            modelBuilder.Entity("ResourceManagerAPI.Models.EmployeeSkills", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<string>("EmailID")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SkillID")
                        .HasColumnType("integer");

                    b.HasKey("ID");

                    b.ToTable("employeeskills");
                });

            modelBuilder.Entity("ResourceManagerAPI.Models.EmployeeTasks", b =>
                {
                    b.Property<int>("EmpID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("EmpID"));

                    b.Property<DateTime>("Finish")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("Start")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("TaskName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("EmpID");

                    b.ToTable("employeetasks");
                });

            modelBuilder.Entity("ResourceManagerAPI.Models.SkillSet", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<string>("Skill")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SkillGroup")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ID");

                    b.ToTable("skillset");
                });

            modelBuilder.Entity("ResourceManagerAPI.Models.Skills", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ID"));

                    b.Property<string>("Skill")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SkillGroup")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SkillID")
                        .HasColumnType("integer");

                    b.HasKey("ID");

                    b.ToTable("skills");
                });

            modelBuilder.Entity("ResourceManagerAPI.Models.Users", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("UserID"));

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("UserID");

                    b.ToTable("users");
                });
#pragma warning restore 612, 618
        }
    }
}
