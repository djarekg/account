using Account.Budget.EntityFrameworkCore.Models;
using Account.Budget.Web.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Account.Budget.Web.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{

    private readonly ILogger<AuthController> _logger;
    private readonly IIdentityService _identityService;

    public AuthController(ILogger<AuthController> logger, IIdentityService identityService)
    {
        _logger = logger;
        _identityService = identityService;
    }

    [AllowAnonymous]
    [HttpGet(Name = "IsAuthenticated")]
    public IActionResult Get() => Ok(User?.Identity?.IsAuthenticated);

    [AllowAnonymous]
    [HttpPost(Name = "Login")]
    public async Task<IActionResult> Post(Login login)
    {
        if (!TryValidateModel(login))
        {
            return BadRequest(ModelState);
        }

        var token = await _identityService.ValidateCredentialsAndSignInAsync(login);

        if (token is not null)
        {
            return Ok(token);
        }

        return Unauthorized();
    }

    //     [HttpDelete(Name = "Logout")]
    //     public async Task<IActionResult> Delete()
    //     {
    //         return User.Identity.lo
    //     }
}
