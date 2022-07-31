using Account.Budget.EntityFrameworkCore.DbContextFactory;
using Account.Budget.EntityFrameworkCore.SeedData;
using Account.Budget.Web.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Account.Budget.EntityFrameworkCore.Models;

public class AccountDbContext : DbContextScopedBase
{
    public DbSet<User>? Users { get; set; }

    public AccountDbContext(DbContextOptions<AccountDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasKey(e => e.Id);

        this.EnsureSeeded<AccountDbContext, UserSeeder>(modelBuilder);
    }
}
