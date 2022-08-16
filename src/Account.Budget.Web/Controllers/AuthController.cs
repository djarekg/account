using Account.Budget.Identity.Services;
using Account.Budget.Identity.Tokens.Jwt;
using Account.Budget.Web.Exceptions;
using Account.Budget.Web.Models;
using Account.Budget.Web.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Account.Budget.Web.Controllers;

/// <summary>
/// The authentication controller.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[TypeFilter(typeof(HttpResponseExceptionFilter))]
public class AuthController : ControllerBase
{
    private readonly IIdentityService _identityService;

    public AuthController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    /// <summary>
    /// Is current user authenticated.
    /// </summary>
    /// <returns>True if current user is authenticated, otherwise false.</returns>
    /// <response code="200">Returns true if current user is authenticated, otherwise false.</response>
    [AllowAnonymous]
    [HttpGet(Name = "Authenticated")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(bool))]
    public ActionResult<bool> Get() => Ok(User?.Identity?.IsAuthenticated);

    /// <summary>
    /// Sign in user.
    /// </summary>
    /// <param name="login">The <see cref="Login"/> object.</param>
    /// <returns>The <see cref="JwtToken"/> for authenticated user.</returns>
    /// <response code="200">Returns <see cref="JwtToken"/> for authenticated user.</response>
    /// <response code="400">If credentials are invalid.</response>
    /// <response code="401">If credentials are unauthorized.</response>
    [AllowAnonymous]
    [HttpPut(Name = "Login")]
    [ValidateModel]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(JwtToken))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<JwtToken>> Put(Login login)
    {
        var token = await _identityService.SignInAsync(login.UserName, login.Password);

        if (token is not null)
        {
            return Ok(token);
        }

        return Unauthorized();
    }

    /// <summary>
    /// Sign out user.
    /// </summary>
    /// <response code="200">If user was signed out.</response>
    [HttpDelete(Name = "Logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete()
    {
        await _identityService.SignOutAsync();
        return Ok();
    }
}
