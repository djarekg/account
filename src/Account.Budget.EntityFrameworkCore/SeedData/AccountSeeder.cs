using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.SeedData;

public class AccountSeeder : IEntitySeeder
{
    public void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Models.Account>().HasData(
            new Models.Account(2, "State Farm", "5555555555") { Id = 1 },
            new Models.Account(1, "AT&T Corporate", "5555555555") { Id = 2 }
        );
    }
}
