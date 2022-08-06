namespace Account.Budget.Web.Security;

public record JwtToken(string Token, DateTime Expires, string DisplayName);
