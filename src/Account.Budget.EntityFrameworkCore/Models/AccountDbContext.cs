using Account.Budget.EntityFrameworkCore.Extensions;
using Account.Budget.EntityFrameworkCore.SeedData;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.Models;

public class AccountDbContext : DbContext
{
    public DbSet<User> Users { get; set; } = default!;

    public AccountDbContext(DbContextOptions<AccountDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasKey(e => e.Id);

        this.EnsureSeeded<AccountDbContext, UserSeeder>(modelBuilder);
    }
}
