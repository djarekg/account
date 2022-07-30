using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Account.Budget.EntityFrameworkCore.Models;

[Index("UserName", IsUnique = true)]
public record User(
    long Id,
    [Required, MaxLength(20)] string UserName,
    [Required, MaxLength(20)] string FirstName,
    [Required, MaxLength(20)] string LastName,
    [Required, MaxLength(50), EmailAddress] string Email) : EntityBase(Id);
