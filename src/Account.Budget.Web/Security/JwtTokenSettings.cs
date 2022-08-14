namespace Account.Budget.Web.Security;

/// <summary>
/// Jwt token settings record.
/// </summary>
/// <param name="SecretKey">Jwt token security key.</param>
/// <param name="Issuer">Jwt token issuer.</param>
/// <param name="Audience">Jwt token audience.</param>
/// <param name="TokenExpiry">Jwt token expiration in minutes.</param>
/// <returns></returns>
public record JwtTokenSettings(
    string SecretKey,
    string Issuer,
    string Audience,
    int TokenExpiry);
