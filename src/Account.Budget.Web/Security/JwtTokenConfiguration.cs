using System.Security.Claims;

namespace Account.Budget.Web.Security;

public record JwtTokenConfiguration(string? UserName, string? SigningKey, string? Issuer, string? Audience, TimeSpan Expiration, Claim[]? AdditionalClaims = null)
{
    public bool IsValid =>
        !string.IsNullOrEmpty(UserName) &&
        !string.IsNullOrEmpty(SigningKey) &&
        !string.IsNullOrEmpty(Issuer) &&
        !string.IsNullOrEmpty(Audience);
}
