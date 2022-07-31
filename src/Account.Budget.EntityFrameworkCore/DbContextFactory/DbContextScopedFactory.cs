using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.DbContextFactory;

/// <summary>
/// AccountContext factory and pooling.
/// </summary>
public class DbContextScopedFactory<TDbContext> : IDbContextFactory<TDbContext> where TDbContext : DbContextScopedBase
{
    private readonly int _tenantId;
    private readonly IDbContextFactory<TDbContext> _pooledFactory;

    public DbContextScopedFactory(IDbContextFactory<TDbContext> pooledFactory, ITenant tenant)
    {
        _pooledFactory = pooledFactory;
        _tenantId = tenant?.TenantId ?? -1;
    }

    /// <summary>
    /// Create AccountContext instance.
    /// </summary>
    /// <returns>A new context instance.</returns>
    public TDbContext CreateDbContext()
    {
        var context = _pooledFactory.CreateDbContext();
        context.TenantId = _tenantId;
        return context;
    }
}
