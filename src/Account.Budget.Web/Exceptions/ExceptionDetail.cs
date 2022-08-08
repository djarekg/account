using System.Text.Json;

namespace Account.Budget.Web.Exceptions;

public record ExceptionDetail(int StatusCode, string Message)
{
    public override string ToString()
    {
        return JsonSerializer.Serialize(this);
    }
}
