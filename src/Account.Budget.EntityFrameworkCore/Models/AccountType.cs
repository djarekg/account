using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Account.Budget.EntityFrameworkCore.Models;

/// <summary>
/// Account type entity type.
/// </summary>
public record AccountType() : EntityBase()
{
    #region entity fields
    [Required, Column(TypeName = "int")]
    public AccountTypes Type { get; private init; }
    #endregion

    #region navigation properties
    [InverseProperty(nameof(AccountAccountType.AccountTypeId))]
    public IEnumerable<AccountAccountType>? AccountAccountTypes { get; private init; }
    #endregion

    public AccountType(AccountTypes type) : this()
    {
        Type = type;
    }
}

/// <summary>
/// Account type enum.
/// </summary>
public enum AccountTypes : int
{
    CarInsurance = 1,
    CarPayment = 2,
    CellProvider = 3,
    HealthInsurance = 4,
    HomeInsurance = 5,
    Internet = 6,
    LifeInsurance = 7,
    Utilities = 8,
}
