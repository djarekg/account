using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.SeedData;

public class AccountAddressSeeder : IEntitySeeder
{
    public void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountAddress>().HasData(
            new AccountAddress("Orlando", "FL", "450 N Goldenrod Rd", null, "32807") { Id = 1 },
            new AccountAddress("Charlotte", "NC", "550 South Tryon Street", null, "28202") { Id = 2 },
            new AccountAddress("Orlando", "FL", "9150 Curry Ford Rd", null, "32825") { Id = 3 },
            new AccountAddress("Orlando", "FL", "3354 Curry Ford Rd,", null, "32806") { Id = 4 },
            new AccountAddress("Chicago", "IL", "225 North Michigan Ave,", null, "60601") { Id = 5 },
            new AccountAddress("Orlando", "FL", "9001 E Colonial Dr,", null, "32817") { Id = 6 }
        );
    }
}
