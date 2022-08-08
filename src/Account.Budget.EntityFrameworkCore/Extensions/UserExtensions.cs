using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Account.Budget.EntityFrameworkCore.Extensions;

/// <summary>
/// Account.Budget.EntityFrameworkCore.Models.User extension methods.
/// </summary>
public static class UserExtensions
{
    /// <summary>
    /// Get hashed password.
    /// </summary>
    /// <param name="user">The Account.Budget.EntityFrameworkCore.Models.User record to create hash password for.</param>
    /// <param name="password">The password to hash.</param>
    /// <returns>The hashed password.</returns>
    public static string? HashPassword(this User user, string password)
    {
        ArgumentException.ThrowIfNullOrEmpty(password, nameof(password));

        var hasher = new PasswordHasher<User>(new OptionsWrapper<PasswordHasherOptions>(new()));
        var hashedPassword = hasher?.HashPassword(user, password);

        return string.IsNullOrEmpty(hashedPassword) ? null : hashedPassword;
    }

    /// <summary>
    /// Validate passowrd.
    /// </summary>
    /// <param name="user">The Account.Budget.EntityFrameworkCore.Models.User record to validate password for.</param>
    /// <param name="password">The password to validate.</param>
    /// <returns></returns>
    public static bool VerifyPassword(this User user, string password)
    {
        ArgumentException.ThrowIfNullOrEmpty(password, nameof(password));

        var hasher = new PasswordHasher<User>(new OptionsWrapper<PasswordHasherOptions>(new()));
        return hasher?.VerifyHashedPassword(user, user.Password, password) == PasswordVerificationResult.Success;
    }
}
