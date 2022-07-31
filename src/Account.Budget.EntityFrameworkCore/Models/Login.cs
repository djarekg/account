using System.ComponentModel.DataAnnotations;

namespace Account.Budget.EntityFrameworkCore.Models;

public record Login(
    [Required, MaxLength(20)] string UserName,
    [Required, MaxLength(20)] string Password);
