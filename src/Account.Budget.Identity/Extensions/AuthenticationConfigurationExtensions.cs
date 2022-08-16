using Account.Budget.Identity.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Account.Budget.Identity.Extensions;

public static class AuthenticationConfigurationExtensions
{
    public static IServiceCollection AddJwtBearerAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddAuthentication(
                JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(
                JwtBearerDefaults.AuthenticationScheme,
                options => configuration.Bind("JwtSettings", options))
            .AddCookie(
                CookieAuthenticationDefaults.AuthenticationScheme,
                options => configuration.Bind("CookieSettings", options));

        // add app specific services to DI container.
        services.AddScoped<IIdentityService, IdentityService>();

        return services;
    }
}
