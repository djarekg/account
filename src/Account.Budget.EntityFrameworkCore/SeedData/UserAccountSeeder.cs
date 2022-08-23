using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.SeedData;

public class UserAccountSeeder : IEntitySeeder
{
    public void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserAccount>().HasData(
            new UserAccount(1, 1),
            new UserAccount(1, 2),
            new UserAccount(1, 3),
            new UserAccount(1, 4),
            new UserAccount(1, 5),
            new UserAccount(1, 6),
            new UserAccount(1, 7),
            new UserAccount(1, 8),
            new UserAccount(2, 1),
            new UserAccount(2, 3),
            new UserAccount(2, 4),
            new UserAccount(2, 6)
        );
    }
}
