using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Account.Budget.EntityFrameworkCore.Models;

/// <summary>
/// Entity type base.
/// </summary>
public abstract record EntityBase
{
    [Required, Key, DatabaseGenerated(DatabaseGeneratedOption.Identity), Column(Order = 1)]
#if DEBUG || DEVELOPMENT || PRODUCTION
    public long? Id { get; set; } = null;
#else
    public long? Id { get; private init; } = null;
#endif
}
