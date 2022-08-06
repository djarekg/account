using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Account.Budget.EntityFrameworkCore.Extensions;
using Account.Budget.EntityFrameworkCore.Models;
using Account.Budget.EntityFrameworkCore.Services;
using Account.Budget.Web.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Account.Budget.Web.Services;

/// <inheritdoc />
public sealed class IdentityService : IIdentityService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserService _userService;

    public IdentityService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IUserService userService)
    {
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
        _userService = userService;
    }

    public async Task<JwtToken> SignInAsync(string userName)
    {
        var user = await _userService.GetUserAsync(userName);
        ArgumentNullException.ThrowIfNull(user, nameof(user));

        var token = GetJwtToken(user);
        ArgumentNullException.ThrowIfNull(token, nameof(token));

        var context = _httpContextAccessor.HttpContext;
        ArgumentNullException.ThrowIfNull(context, nameof(context));

        await context.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            GetPrincipal(user.UserName),
            new()
            {
                IsPersistent = true,
                AllowRefresh = true,
                ExpiresUtc = DateTime.UtcNow.AddDays(1)
            });

        // return the token to API client
        return new(
            new JwtSecurityTokenHandler().WriteToken(token),
            token.ValidTo,
            user.FullName
        );
    }

    public async Task SignOutAsync()
    {
        var context = _httpContextAccessor.HttpContext;
        ArgumentNullException.ThrowIfNull(context, nameof(context));

        await context.SignOutAsync();
    }

    public async Task<JwtToken> ValidateCredentialsAndSignInAsync(string userName, string password)
    {
        if (await ValidateCredentialsAsync(userName, password))
        {
            return await SignInAsync(userName);
        }

        throw new UnauthorizedAccessException();
    }

    public async Task<bool> ValidateCredentialsAsync(string userName, string password)
    {
        var user = await _userService.GetUserAsync(userName);
        return user is not null && user.VerifyPassword(password);
    }

    /// <summary>
    /// Get the JWT token for the specified <paramref name="user"/>.
    /// </summary>
    /// <param name="user">User object.</param>
    /// <returns>JWT security token.</returns>
    private JwtSecurityToken GetJwtToken(User user)
    {
        JwtTokenConfiguration config = new(
            user.UserName,
            _configuration.GetSection("JwtToken:SigningKey").Value ?? string.Empty,
            _configuration.GetSection("JwtToken.Issuer").Value ?? string.Empty,
            _configuration.GetSection("JwtToken.Audience").Value ?? string.Empty,
            TimeSpan.FromMinutes(_configuration.GetSection("JwtToken.TokenTimeoutMinutes").Get<int>()),
            new[] { new Claim("UserState", user.ToString()) }
        );

        return JwtHelper.GetJwtToken(config);
    }

    /// <summary>
    /// Get the claims principal for the specified <paramref name="userName"/>.
    /// </summary>
    /// <param name="userName">UserName to get claims principal for.</param>
    /// <returns>New ClaimsPrincipal for user.</returns>
    private static ClaimsPrincipal GetPrincipal(string userName)
    {
        ClaimsIdentity identity = new(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, userName));
        identity.AddClaim(new Claim(ClaimTypes.Name, userName));
        ClaimsPrincipal principal = new(identity);

        const string claimType = "myNewClaim";
        if (!principal.HasClaim(claim => claim.Type == claimType))
        {
            ClaimsIdentity claimsIdentity = new(new[] { new Claim(claimType, "myClaimValue") });
            principal.AddIdentity(claimsIdentity);
        }

        return principal;
    }
}
