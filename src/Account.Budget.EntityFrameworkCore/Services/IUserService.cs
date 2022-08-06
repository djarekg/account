using Account.Budget.EntityFrameworkCore.Models;

namespace Account.Budget.EntityFrameworkCore.Services;

/// <summary>
/// User service to manage users.
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Get the user with the specified <paramref name="userName"/>.
    /// </summary>
    /// <param name="userName">UserName to find user by.</param>
    /// <returns>User object.</returns>
    Task<User?> GetUserAsync(string userName);
    /// <summary>
    /// Get the user with the specified <paramref name="userId"/>.
    /// </summary>
    /// <param name="userId">UserId to find user by.</param>
    /// <returns>User object.</returns>
    Task<User?> GetUserAsync(int userId);
}
