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
                        .HasColumnType("bigint")
                        .HasColumnOrder(1);

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long?>("Id"), 1L, 1);

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime2")
                        .HasColumnOrder(2);

                    b.Property<DateTime?>("DateModified")
                        .HasColumnType("datetime2")
                        .HasColumnOrder(3);

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasColumnOrder(4);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)")
                        .HasColumnOrder(5);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)")
                        .HasColumnOrder(6);

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasColumnOrder(7);

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)")
                        .HasColumnOrder(8);

                    b.HasKey("Id");

                    b.HasIndex("UserName")
                        .IsUnique();

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1L,
                            DateCreated = new DateTime(2022, 8, 1, 6, 25, 8, 998, DateTimeKind.Local).AddTicks(1722),
                            Email = "dustingriffith@outlook.com",
                            FirstName = "Dustin",
                            LastName = "Griffith",
                            Password = "AQAAAAIAAYagAAAAEHQnZWSIab+vozQhoB/+ARoCsr1USdQLj2ppLIQFcFEw+kLAbs+cJsLj1sIBbM8yGQ==",
                            UserName = "djarekg"
                        },
                        new
                        {
                            Id = 2L,
                            DateCreated = new DateTime(2022, 8, 1, 6, 25, 9, 106, DateTimeKind.Local).AddTicks(5306),
                            Email = "jdoe@idk.com",
                            FirstName = "John",
                            LastName = "Doe",
                            Password = "AQAAAAIAAYagAAAAEKJJDQuhMb55VtksVB8aRDvfbHK2Ya7yAnrK8GDLrd73y7GjSnMflZquwIJ7VUiZoQ==",
                            UserName = "jdoe"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
