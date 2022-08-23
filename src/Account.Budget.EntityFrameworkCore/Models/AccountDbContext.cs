using Account.Budget.EntityFrameworkCore.Extensions;
using Account.Budget.EntityFrameworkCore.SeedData;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.Models;

public class AccountDbContext : DbContext
{
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<AccountAccountType> AccountAccountTypes => Set<AccountAccountType>();
    public DbSet<AccountAddress> AccountAddresses => Set<AccountAddress>();
    public DbSet<AccountType> AccountTypes => Set<AccountType>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserAccount> UserAccounts => Set<UserAccount>();

    public AccountDbContext(DbContextOptions<AccountDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        this.EnsureSeeded<AccountDbContext, AccountSeeder>(modelBuilder);
        this.EnsureSeeded<AccountDbContext, AccountAccountTypeSeeder>(modelBuilder);
        this.EnsureSeeded<AccountDbContext, AccountAddressSeeder>(modelBuilder);
        this.EnsureSeeded<AccountDbContext, AccountTypeSeeder>(modelBuilder);
        this.EnsureSeeded<AccountDbContext, UserSeeder>(modelBuilder);
        this.EnsureSeeded<AccountDbContext, UserAccountSeeder>(modelBuilder);
    }
}
