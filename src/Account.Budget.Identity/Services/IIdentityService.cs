using Account.Budget.Identity.Tokens.Jwt;

namespace Account.Budget.Identity.Services;

/// <summary>
/// Identity service for managing user authentication.
/// </summary>
public interface IIdentityService
{
    /// <summary>
    /// Sign in the user with the specified <paramref name="userName"/>.
    /// </summary>
    /// <param name="userName">UserName to signin.</param>
    /// <param name="password">Password for signin.</param>
    /// <returns>The <see cref="JwtToken"/> object.</returns>
    Task<JwtToken> SignInAsync(string userName, string password);
    /// <summary>
    /// Sign out the user.
    /// </summary>
    Task SignOutAsync();
}
