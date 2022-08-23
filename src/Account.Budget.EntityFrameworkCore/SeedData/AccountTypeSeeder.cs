using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.SeedData;

public class AccountTypeSeeder : IEntitySeeder
{
    public void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountType>().HasData(
            new AccountType(AccountTypes.CarInsurance) { Id = (int)AccountTypes.CarInsurance },
            new AccountType(AccountTypes.CarPayment) { Id = (int)AccountTypes.CarPayment },
            new AccountType(AccountTypes.CellProvider) { Id = (int)AccountTypes.CellProvider },
            new AccountType(AccountTypes.HealthInsurance) { Id = (int)AccountTypes.HealthInsurance },
            new AccountType(AccountTypes.HomeInsurance) { Id = (int)AccountTypes.HomeInsurance },
            new AccountType(AccountTypes.Internet) { Id = (int)AccountTypes.Internet },
            new AccountType(AccountTypes.LifeInsurance) { Id = (int)AccountTypes.LifeInsurance },
            new AccountType(AccountTypes.Utilities) { Id = (int)AccountTypes.Utilities }
        );
    }
}
