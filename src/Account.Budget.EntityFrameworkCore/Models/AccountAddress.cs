using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Account.Budget.EntityFrameworkCore.Models;

/// <summary>
/// Account address entity type.
/// </summary>
public record AccountAddress() : EntityBase()
{
    #region entity fields
    [Required, MinLength(1), MaxLength(50), StringLength(50)]
    public string City { get; private init; } = string.Empty;

    [Required, MinLength(2), MaxLength(2), StringLength(2), Column(TypeName = "char(2")]
    public string State { get; private init; } = string.Empty;

    [Required, MinLength(4), MaxLength(100), StringLength(100)]
    public string Street1 { get; private init; } = string.Empty;

    [MaxLength(100), StringLength(100)]
    public string? Street2 { get; private init; } = null;

    [Required, MaxLength(5), StringLength(5), DataType(DataType.PostalCode), Column(TypeName = "char(5)")]
    public string Zip { get; private init; } = string.Empty;
    #endregion

    #region navigation properties
    [InverseProperty(nameof(Account.AccountAddress))]
    public IEnumerable<Account>? Accounts { get; private init; }
    #endregion

    public AccountAddress(string city, string state, string street1, string? street2, string zip) : this()
    {
        City = city;
        State = state;
        Street1 = street1;
        Street2 = street2;
        Zip = zip;
    }
}
