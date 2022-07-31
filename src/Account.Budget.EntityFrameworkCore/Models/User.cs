using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Account.Budget.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.Models;

[Index("UserName", IsUnique = true)]
public record User : EntityBase
{
#pragma warning disable IDE0052
    [Required, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime DateCreated { get; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime? DateModified { get; }

    [Required, MaxLength(50), EmailAddress]
    public string Email { get; }

    [Required, MaxLength(20)]
    public string FirstName { get; }

    [Required, MaxLength(20)]
    public string LastName { get; }

    [Required, MaxLength(20)]
    public string Password { get; } = string.Empty;

    [Required, MaxLength(20)]
    public string UserName { get; }
#pragma warning restore IDE0052

    public User(long id, string userName, string password, string firstName, string lastName, string email) : base(id)
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
