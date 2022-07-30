namespace Account.Budget.EntityFrameworkCore.DbContextFactory;

public interface ITenant
{
    int TenantId { get; init; }
}
