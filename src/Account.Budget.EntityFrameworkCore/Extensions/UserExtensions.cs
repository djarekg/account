using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Account.Budget.EntityFrameworkCore.Extensions;

internal static class UserExtensions
{
    public static string? HashPassword(this User user, string password)
    {
        if (!string.IsNullOrEmpty(password))
        {
            var hasher = new PasswordHasher<User>(new OptionsWrapper<PasswordHasherOptions>(new()));
            string? hashedPassword = hasher?.HashPassword(user, password);

            if (!string.IsNullOrEmpty(hashedPassword))
            {
                return hashedPassword;
            }
        }

        throw new ArgumentNullException(nameof(password));
    }

    public static bool VerifyPassword(this User user, string password)
    {
        var hasher = new PasswordHasher<User>(new OptionsWrapper<PasswordHasherOptions>(new()));
        return hasher?.VerifyHashedPassword(user, user.Password, password) == PasswordVerificationResult.Success;
    }
}
