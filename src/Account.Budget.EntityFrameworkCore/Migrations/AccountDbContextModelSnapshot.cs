﻿// <auto-generated />
using System;
using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Account.Budget.EntityFrameworkCore.Migrations
{
    [DbContext(typeof(AccountDbContext))]
    partial class AccountDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0-preview.6.22329.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("Account.Budget.EntityFrameworkCore.Models.User", b =>
                {
                    b.Property<long?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long?>("Id"), 1L, 1);

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime2")
                        .HasColumnOrder(1);

                    b.Property<DateTime?>("DateModified")
                        .HasColumnType("datetime2")
                        .HasColumnOrder(2);

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasColumnOrder(3);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)")
                        .HasColumnOrder(4);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)")
                        .HasColumnOrder(5);

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasColumnOrder(6);

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)")
                        .HasColumnOrder(7);

                    b.HasKey("Id");

                    b.HasIndex("UserName")
                        .IsUnique();

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1L,
                            DateCreated = new DateTime(2022, 7, 31, 16, 51, 38, 358, DateTimeKind.Local).AddTicks(56),
                            Email = "dustingriffith@outlook.com",
                            FirstName = "Dustin",
                            LastName = "Griffith",
                            Password = "AQAAAAIAAYagAAAAEGqTUhj3Y4K7nTSkeehqX1pbP602epVvuoTAzb7Y8DDxoO5hlvmSwhxFXgp5s+jqHg==",
                            UserName = "djarekg"
                        },
                        new
                        {
                            Id = 2L,
                            DateCreated = new DateTime(2022, 7, 31, 16, 51, 38, 455, DateTimeKind.Local).AddTicks(2995),
                            Email = "jdoe@idk.com",
                            FirstName = "John",
                            LastName = "Doe",
                            Password = "AQAAAAIAAYagAAAAEIXtL49M2EKz7TraJTnsgl2YnV83gYxdtiLtTaUN+CbjM+v4yKnSUCXJd5IiCQEfng==",
                            UserName = "jdoe"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
