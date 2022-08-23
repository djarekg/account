using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.SeedData;

public class UserSeeder : IEntitySeeder
{
    public void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User("djarekg", "test", "Dustin", "Griffith", "dustingriffith@outlook.com") { Id = 1 },
            new User("jdoe", "test", "John", "Doe", "jdoe@idk.com") { Id = 2 }
        );
    }
}
