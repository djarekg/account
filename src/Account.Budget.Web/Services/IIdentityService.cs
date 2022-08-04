using Account.Budget.EntityFrameworkCore.Models;

namespace Account.Budget.Web.Services;

public interface IIdentityService
{
    Task<object> SignInAsync(string userName);
    Task<object> ValidateCredentialsAndSignInAsync(Login login);
    Task<bool> ValidateCredentialsAsync(Login login);
}
