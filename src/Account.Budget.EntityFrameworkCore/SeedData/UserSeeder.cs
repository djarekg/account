using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.SeedData;

public class UserSeeder : IEntitySeeder
{
    public void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User(1, "djarekg", "test", "Dustin", "Griffith", "dustingriffith@outlook.com"),
            new User(2, "jdoe", "test", "John", "Doe", "jdoe@idk.com")
        );
    }
}
