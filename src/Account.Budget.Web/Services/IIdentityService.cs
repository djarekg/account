using Account.Budget.EntityFrameworkCore.Models;
using Account.Budget.Web.Security;
using Microsoft.AspNetCore.Authentication;

namespace Account.Budget.Web.Services;

/// <summary>
/// Identity service for managing user authentication.
/// </summary>
public interface IIdentityService
{
    /// <summary>
    /// Sign in the user with the specified <paramref name="userName"/>.
    /// </summary>
    /// <param name="userName">UserName to signin.</param>
    /// <returns>The <see cref="JwtToken"/> object.</returns>
    Task<JwtToken> SignInAsync(string userName);
    /// <summary>
    /// Sign out the user.
    /// </summary>
    Task SignOutAsync();
    /// <summary>
    /// Validate and signin the user with the specified <paramref name="login"/>.
    /// </summary>
    /// <param name="userName">UserName for signin.</param>
    /// <param name="password">Passowrd for signin.</param>
    /// <returns>The <see cref="JwtToken"/> object.</returns>
    Task<JwtToken> ValidateCredentialsAndSignInAsync(string userName, string password);
    /// <summary>
    /// Validate the user with the specified <paramref name="login"/>.
    /// </summary>
    /// <param name="userName">UserName for signin.</param>
    /// <param name="password">Passowrd for signin.</param>
    /// <returns>True if the credentials are valid, otherwise false.</returns>
    Task<bool> ValidateCredentialsAsync(string userName, string password);
}
