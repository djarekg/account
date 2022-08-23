using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Account.Budget.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.Models;

/// <summary>
/// User entity type.
/// </summary>
/// <returns></returns>
[Index(nameof(UserName), IsUnique = true)]
public record User() : EntityBase()
{
    #region  entity fields
    [Required]
    public DateTime DateCreated { get; private init; } = DateTime.Now;

    public DateTime? DateModified { get; private init; }

    [Required, MaxLength(50), StringLength(50), EmailAddress]
    public string Email { get; private init; } = string.Empty;

    [Required, MaxLength(20), StringLength(20)]
    public string FirstName { get; private init; } = string.Empty;

    [NotMapped]
    public string FullName => $"{FirstName} {LastName}";

    [Required, MaxLength(20), StringLength(20)]
    public string LastName { get; private init; } = string.Empty;

    [Required, MaxLength(100), StringLength(100)]
    public string Password { get; private init; } = string.Empty;

    [Required, MaxLength(20), StringLength(20)]
    public string UserName { get; private init; } = string.Empty;
    #endregion

    #region navigation properties
    [InverseProperty(nameof(UserAccount.User))]
    public IEnumerable<UserAccount>? UserAccounts { get; private init; }
    #endregion

    public User(string userName, string password, string firstName, string lastName, string email) : this()
    {
        UserName = userName;
        Password = this.HashPassword(password) ?? string.Empty;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
    }
}
