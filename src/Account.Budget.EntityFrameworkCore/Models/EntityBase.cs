using System.ComponentModel.DataAnnotations;

namespace Account.Budget.EntityFrameworkCore.Models;

public abstract record EntityBase
{
    [Key]
    [Required]
    public long? Id { get; init; }

    public EntityBase(long? id)
    {
        Id = id;
    }
}