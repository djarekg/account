using System;
using System.Threading.Tasks;
using Account.Budget.EntityFrameworkCore.Models;
using Microsoft.AspNetCore.Mvc;

namespace Account.Budget.Web.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{

    private readonly ILogger<AuthController> _logger;

    public AuthController(ILogger<AuthController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "IsAuthenticated")]
    public IActionResult Get() => Ok(new { IsAuthenticated = User.Identity.IsAuthenticated });

    [HttpPost(Name = "Login")]
    public async Task<IActionResult> Post(Login login)
    {
        if (login.UserName == "admin" && login.Password == "admin")
        {
            return Ok(new { token = "12345" });
        }
        else
        {
            return Unauthorized();
        }
    }

    //     [HttpDelete(Name = "Logout")]
    //     public async Task<IActionResult> Delete()
    //     {
    //         return User.Identity.lo
    //     }
}
