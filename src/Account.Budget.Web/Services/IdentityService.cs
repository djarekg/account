using System;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Account.Budget.EntityFrameworkCore.Extensions;
using Account.Budget.EntityFrameworkCore.Models;
using Account.Budget.EntityFrameworkCore.Services;
using Account.Budget.Web.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Configuration;

namespace Account.Budget.Web.Services;

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

    public async Task<object> SignInAsync(string userName)
    {
        var user = await _userService.GetUserAsync(userName);

        ArgumentNullException.ThrowIfNull(user, nameof(user));

        JwtTokenConfiguration jwtTokenConfiguration = new(
            user.UserName,
            _configuration.GetSection("JwtToken:SigningKey").Get<string>(),
            _configuration.GetSection("JwtToken.Issuer").Get<string>(),
            _configuration.GetSection("JwtToken.Audience").Get<string>(),
            TimeSpan.FromMinutes(_configuration.GetSection("JwtToken.TokenTimeoutMinutes").Get<int>()),
            new[] { new Claim("UserState", user.ToString()) }
        );

        // create a new token with token helper and add our claim
        var token = JwtHelper.GetJwtToken(jwtTokenConfiguration);

        ClaimsIdentity identity = new(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.UserName));
        identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
        ClaimsPrincipal principal = new(identity);

        const string claimType = "myNewClaim";
        if (!principal.HasClaim(claim => claim.Type == claimType))
        {
            ClaimsIdentity claimsIdentity = new(new[] { new Claim(claimType, "myClaimValue") });
            principal.AddIdentity(claimsIdentity);
        }

        var context = _httpContextAccessor.HttpContext;

        ArgumentNullException.ThrowIfNull(context, nameof(context));

        await context.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    AllowRefresh = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(1)
                });

        // return the token to API client
        return new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expires = token.ValidTo,
            displayName = user.FullName
        };
    }

    public async Task<object> ValidateCredentialsAndSignInAsync(Login login)
    {
        if (await ValidateCredentialsAsync(login))
        {
            return await SignInAsync(login.UserName);
        }

        throw new UnauthorizedAccessException();
    }

    public async Task<bool> ValidateCredentialsAsync(Login login)
    {
        var user = await _userService.GetUserAsync(login.UserName);
        return user is not null && user.VerifyPassword(login.Password);
    }
}
