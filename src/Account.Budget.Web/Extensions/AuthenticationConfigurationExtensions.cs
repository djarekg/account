using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Account.Budget.Web.Exceptions;

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

        return services;
    }
}
