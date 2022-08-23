using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.SeedData;

public class AccountAccountTypeSeeder : IEntitySeeder
{
    public void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountAccountType>().HasData(
            new AccountAccountType(1, AccountTypes.CarInsurance),
            new AccountAccountType(1, AccountTypes.HomeInsurance),
            new AccountAccountType(1, AccountTypes.LifeInsurance),
            new AccountAccountType(2, AccountTypes.CellProvider),
            new AccountAccountType(2, AccountTypes.Internet)
        );
    }
}
