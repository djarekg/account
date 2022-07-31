namespace Account.Budget.EntityFrameworkCore.DbContextFactory;

public class Tenant : ITenant
{
    public int TenantId { get; init; }

    public Tenant(int tenantId)
    {
        TenantId = tenantId;
    }
}
