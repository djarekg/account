using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace Account.Budget.Web.Exceptions;

public class ExceptionHandlerMiddleware
{
    public async Task InvokeAsync([FromServices] RequestDelegate next, [FromServices] ILogger<ExceptionHandlerMiddleware> logger, HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occured");
            await HandleExceptionAsync(context, ex);
        }
    }

#pragma warning disable CA1822
    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        ExceptionDetail exceptionDetail = new(context.Response.StatusCode, ex.Message);

        await context.Response.WriteAsync(exceptionDetail.ToString());
    }
#pragma warning restore CA1822
}
