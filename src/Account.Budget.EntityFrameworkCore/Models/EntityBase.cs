using System.ComponentModel.DataAnnotations;

namespace Account.Budget.EntityFrameworkCore.Models;

public abstract record EntityBase([Required] long Id);
