namespace Account.Budget.Identity.Tokens.Jwt;

/// <summary>
/// Jwt token record.
/// </summary>
/// <param name="Token">JwtToken string.</param>
/// <param name="Expires">Expiration date/time.</param>
/// <param name="DisplayName">Jwt token display name.</param>
/// <returns></returns>
public record JwtToken(string Token, DateTime Expires, string DisplayName);
