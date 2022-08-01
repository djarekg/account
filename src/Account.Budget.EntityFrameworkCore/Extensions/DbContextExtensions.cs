using Account.Budget.EntityFrameworkCore.DbContextFactory;
using Account.Budget.EntityFrameworkCore.Models;
using Account.Budget.EntityFrameworkCore.SeedData;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Account.Budget.Web.Extensions;

/// <summary>
/// Extensions for configurating the DbContext.
/// </summary>
public static class DbContextExtensions
{
    /// <summary>
    /// Add DbContext and configure for DB context factory and pooling.
    /// </summary>
    /// <param name="services">The Microsoft.Extensions.DependencyInjection.IServiceCollection to add services to.</param>
    /// <returns>An Microsoft.Extensions.DependencyInjection.IServiceCollection.</returns>
    public static IServiceCollection AddDbContextScopedFactory(this IServiceCollection services)
    {
        // Below is a minimal tenant resolution strategy, which registers a scoped ITenant service in DI.
        // In this sample, we simply accept the tenant ID as a request query, which means that a client can impersonate any
        // tenant. In a real application, the tenant ID would be set based on secure authentication data.
        services.AddHttpContextAccessor();
        services.AddScoped<ITenant>(sp =>
        {
            var accessor = sp.GetRequiredService<IHttpContextAccessor>();
            var tenantIdString = accessor?.HttpContext?.Request.Query["TenantId"];

#pragma warning disable CS8603
            return !string.IsNullOrEmpty(tenantIdString) && int.TryParse(tenantIdString, out var tenantId)
                ? new Tenant(tenantId)
                : null;
#pragma warning restore CS8603
        });

        return services;
    }

    /// <summary>
    /// Add AccountDbContext and configure for DB context factory and pooling.
    /// </summary>
    /// <param name="services">The Microsoft.Extensions.DependencyInjection.IServiceCollection to add services to.</param>
    /// <param name="configuration">The Microsoft.Extensions.Configuration.IConfiguration access configurations.</param>
    /// <returns>An Microsoft.Extensions.DependencyInjection.IServiceCollection.</returns>
    public static IServiceCollection AddAccountDbContext(this IServiceCollection services, IConfiguration configuration)
    {
#pragma warning disable CS8604
        services
            .AddPooledDbContextFactory<AccountDbContext>(
                o => o
                    .EnableSensitiveDataLogging()
                    .UseSqlServer(
                        configuration.GetConnectionString("Account"),
                        x => x.MigrationsAssembly("Account.Budget.EntityFrameworkCore")));
#pragma warning restore CS8604

        services.AddScoped<DbContextScopedFactory<AccountDbContext>>();

        return services;
    }

    public static TDbContext EnsureSeeded<TDbContext, TEntitySeeder>(this TDbContext context, ModelBuilder modelBuilder)
        where TDbContext : DbContext
        where TEntitySeeder : IEntitySeeder
    {
        var instance = Activator.CreateInstance<TEntitySeeder>();
        instance?.Seed(modelBuilder);

        return context;
    }
}
