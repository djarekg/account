using Account.Budget.EntityFrameworkCore.Models;

namespace Account.Budget.EntityFrameworkCore.Services;

public interface IUserService
{
    Task<User?> GetUserAsync(string userName);
    Task<User?> GetUserAsync(int userId);
}
