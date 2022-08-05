using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Account.Budget.EntityFrameworkCore.Extensions;

public static class UserExtensions
{
    public static string? HashPassword(this User user, string password)
    {
        ArgumentException.ThrowIfNullOrEmpty(password, nameof(password));

        var hasher = new PasswordHasher<User>(new OptionsWrapper<PasswordHasherOptions>(new()));
        var hashedPassword = hasher?.HashPassword(user, password);

        return string.IsNullOrEmpty(hashedPassword) ? null : hashedPassword;
    }

    public static bool VerifyPassword(this User user, string password)
    {
        ArgumentException.ThrowIfNullOrEmpty(password, nameof(password));

        var hasher = new PasswordHasher<User>(new OptionsWrapper<PasswordHasherOptions>(new()));
        return hasher?.VerifyHashedPassword(user, user.Password, password) == PasswordVerificationResult.Success;
    }
}
