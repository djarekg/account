using Account.Budget.Web.Controllers;
using Account.Budget.Web.Models;
using Account.Budget.Web.Services;
using Account.Budget.Web.Token;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Account.Budget.Web.Tests;

public class AuthControllerTest
{
    [Fact]
    public async Task Login_ReturnsOkActionResult_WithAJwtToken()
    {
        // Arrange
        const string USERNAME = "user";
        const string PASSWORD = "test";
        var loginStub = new Login(USERNAME, PASSWORD);

        Mock<IIdentityService> identityServiceMock = new();
        identityServiceMock
            .Setup(us => us.ValidateCredentialsAndSignInAsync(USERNAME, PASSWORD))
            .ReturnsAsync(new JwtToken(string.Empty, default, string.Empty));
        AuthController controller = new(identityServiceMock.Object);

        // Act
        var actionResult = await controller.Put(loginStub);
        var result = actionResult.Result as OkObjectResult;

        // Assert
        Assert.IsType<ActionResult<JwtToken>>(actionResult);
        Assert.Equal(StatusCodes.Status201Created, result?.StatusCode);
    }
}
