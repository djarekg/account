using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.Models;

/// <summary>
///  User account entity type.
/// </summary>
[Index(nameof(UserId), nameof(AccountId), IsUnique = true)]
public record UserAccount() : EntityBase()
{
    #region entity fields
    [Required, ForeignKey(nameof(UserId))]
    public long UserId { get; private init; }

    [Required, ForeignKey(nameof(AccountId))]
    public long AccountId { get; private init; }
    #endregion

    #region navigation properties
    public User? User { get; private init; }
    public Account? Account { get; private init; }
    #endregion

    public UserAccount(long userId, long accountId) : this()
    {
        UserId = userId;
        AccountId = accountId;
    }
}
