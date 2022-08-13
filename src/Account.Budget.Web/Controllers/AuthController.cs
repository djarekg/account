using Account.Budget.EntityFrameworkCore.Models;
using Account.Budget.Web.Exceptions;
using Account.Budget.Web.Models;
using Account.Budget.Web.Security;
using Account.Budget.Web.Services;
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
    /// Signin user.
    /// </summary>
    /// <param name="login">The Login object.</param>
    /// <returns>The JwtToken for authenticated user.</returns>
    /// <response code="201">Returns JwtToken for authenticated user.</response>
    /// <response code="400">If credentials is invalid.</response>
    /// <response code="401">If credentials is unauthorized.</response>
    [AllowAnonymous]
    [HttpPut]
    [ValidateModel]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(JwtToken))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<JwtToken>> Put(Login login)
    {
        var token = await _identityService.ValidateCredentialsAndSignInAsync(login.UserName, login.Password);

        if (token is not null)
        {
            return CreatedAtAction(nameof(token), new { id = token.DisplayName }, token);
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
