using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Account.Budget.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.Models;

[Index("UserName", IsUnique = true)]
public record User(long? Id = null) : EntityBase(Id)
{
#pragma warning disable IDE0052
    [Required, MaxLength(20), Column(Order = 7)]
    public string UserName { get; } = string.Empty;

    [Required, MaxLength(20), Column(Order = 6)]
    public string Password { get; } = string.Empty;

    [Required, MaxLength(50), EmailAddress, Column(Order = 3)]
    public string Email { get; } = string.Empty;

    [Required, MaxLength(20), Column(Order = 4)]
    public string FirstName { get; } = string.Empty;

    [Required, MaxLength(20), Column(Order = 5)]
    public string LastName { get; } = string.Empty;

    [Required, DatabaseGenerated(DatabaseGeneratedOption.Identity), Column(Order = 1)]
    public DateTime? DateCreated { get; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed), Column(Order = 2)]
    public DateTime? DateModified { get; }

#pragma warning restore IDE0052
    public User(long? id, string userName, string password, string firstName, string lastName, string email) : this(id)
    {
        UserName = userName;
#pragma warning disable CS8601
        Password = this.HashPassword(password);
#pragma warning restore CS8601
        FirstName = firstName;
        LastName = lastName;
        Email = email;
    }
}
