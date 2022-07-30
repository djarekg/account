using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.DbContextFactory;

public abstract class DbContextScopedBase : DbContext
{
    public int TenantId { get; set; }

    protected DbContextScopedBase(DbContextOptions options) : base(options)
    {
    }
}
