using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Account.Budget.Web.Exceptions;

public class HttpResponseExceptionFilter : IActionFilter, IOrderedFilter
{
    private readonly ILogger<HttpResponseExceptionFilter> _logger;
    public int Order => int.MaxValue - 10;

    public HttpResponseExceptionFilter(ILogger<HttpResponseExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context) { }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Exception is HttpResponseException httpResponseException)
        {
            context.Result = new ObjectResult(httpResponseException.Value)
            {
                StatusCode = httpResponseException.StatusCode
            };

            context.ExceptionHandled = true;

            _logger.LogError(httpResponseException, "Error occured");
        }
    }
}
