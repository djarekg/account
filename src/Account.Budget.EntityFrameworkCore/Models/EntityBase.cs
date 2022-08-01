using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Account.Budget.EntityFrameworkCore.Models;

public abstract record EntityBase
{
    [Required, Key, Column(Order = 1)]
    public long? Id { get; private init; }

    public EntityBase(long? id)
    {
        Id = id;
    }
}
