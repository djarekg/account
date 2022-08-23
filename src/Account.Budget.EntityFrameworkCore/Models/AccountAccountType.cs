using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.Models;

/// <summary>
/// Account account type entity type.
/// </summary>
[Index(nameof(AccountId), nameof(AccountTypeId), IsUnique = true)]
public record AccountAccountType() : EntityBase()
{
    #region entity fields
    [Required, ForeignKey(nameof(AccountId))]
    public long AccountId { get; private init; }

    [Required, ForeignKey(nameof(AccountTypeId))]
    public AccountTypes AccountTypeId { get; private init; }
    #endregion

    #region navigation properties
    public Account? Account { get; private init; }
    public AccountType? AccountType { get; private init; }
    #endregion

    public AccountAccountType(long accountId, AccountTypes accountTypeId) : this()
    {
        AccountId = accountId;
        AccountTypeId = accountTypeId;
    }
}
