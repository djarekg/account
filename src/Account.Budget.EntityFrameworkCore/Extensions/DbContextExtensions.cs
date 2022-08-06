using Account.Budget.EntityFrameworkCore.Models;
using Account.Budget.EntityFrameworkCore.SeedData;
using Account.Budget.EntityFrameworkCore.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Account.Budget.EntityFrameworkCore.Extensions;

/// <summary>
/// Extensions for configurating the DbContext.
/// </summary>
public static class DbContextExtensions
{
    /// <summary>
    /// Add AccountDbContext and configure pooling.
    /// </summary>
    /// <param name="services">The Microsoft.Extensions.DependencyInjection.IServiceCollection to add services to.</param>
    /// <param name="configuration">The Microsoft.Extensions.Configuration.IConfiguration access configurations.</param>
    /// <returns>An Microsoft.Extensions.DependencyInjection.IServiceCollection.</returns>
    public static IServiceCollection AddAccountDbContext(this IServiceCollection services, IConfiguration configuration)
    {
#pragma warning disable CS8604
        services
                .AddDbContextPool<AccountDbContext>(
                o => o
                    .EnableSensitiveDataLogging()
                    .UseSqlServer(
                        configuration.GetConnectionString("Account"),
                        x => x.MigrationsAssembly("Account.Budget.EntityFrameworkCore")));
#pragma warning restore CS8604

        services.AddScoped<IUserService, UserService>();

        return services;
    }

    /// <summary>
    /// Ensure the database is created and seeded.
    /// </summary>
    /// <param name="context">The Microsoft.EntityFramework.DbContext.</param>
    /// <param name="modelBuilder">The Microsoft.EntityFramework.ModelBuilder.</param>
    /// <typeparam name="TDbContext"></typeparam>
    /// <typeparam name="TEntitySeeder"></typeparam>
    /// <returns>The Microsoft.EntityFramework.DbContext.</returns>
    public static TDbContext EnsureSeeded<TDbContext, TEntitySeeder>(this TDbContext context, ModelBuilder modelBuilder)
        where TDbContext : DbContext
        where TEntitySeeder : IEntitySeeder
    {
        var instance = Activator.CreateInstance<TEntitySeeder>();
        instance?.Seed(modelBuilder);

        return context;
    }
}
