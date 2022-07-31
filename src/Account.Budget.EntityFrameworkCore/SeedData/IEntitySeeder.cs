using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.SeedData;

public interface IEntitySeeder
{
    void Seed(ModelBuilder modelBuilder);
}
