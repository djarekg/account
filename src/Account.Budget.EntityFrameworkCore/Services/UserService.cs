using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.Services;

/// <inheritdoc />
public sealed class UserService : IUserService
{
    private readonly AccountDbContext _dbContext;

    public UserService(AccountDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetUserAsync(string userName)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == userName);
    }

    public async Task<User?> GetUserAsync(int userId)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }
}
