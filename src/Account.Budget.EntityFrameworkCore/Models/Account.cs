using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.Models;

/// <summary>
/// Account entity type.
/// </summary>
[Index(nameof(Name), IsUnique = true)]
public record Account() : EntityBase()
{
    #region  entity fields
    [Required, ForeignKey(nameof(AccountAddressId))]
    public long AccountAddressId { get; private init; }

    [Required, MaxLength(100), StringLength(100)]
    public string Name { get; private init; } = string.Empty;

    [Required, MaxLength(15), StringLength(15)]
    public string PhoneNumber { get; private init; } = string.Empty;
    #endregion

    #region navigation properties
    public AccountAddress? AccountAddress { get; private init; }

    [InverseProperty(nameof(AccountAccountType.Account))]
    public IEnumerable<AccountAccountType>? AccountAccountTypes { get; private init; }

    [InverseProperty(nameof(Models.UserAccount.Account))]
    public UserAccount? UserAccount { get; private init; }
    #endregion

    public Account(long accountAddressId, string name, string phoneNumber) : this()
    {
        AccountAddressId = accountAddressId;
        Name = name;
        PhoneNumber = phoneNumber;
    }
}
