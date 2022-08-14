using System.Security.Claims;

namespace Account.Budget.Web.Security;

/// <summary>
/// Jwt token configuration record.
/// </summary>
/// <value></value>
public record JwtTokenConfiguration
{
    public string UserName { get; init; }
    public string SigningKey { get; init; }
    public string Issuer { get; init; }
    public string Audience { get; init; }
    public TimeSpan Expiration { get; init; }
    public Claim[]? AdditionalClaims { get; init; }

    public JwtTokenConfiguration(string userName, string? signingKey = null, string? issuer = null, string? audience = null, int? tokenExpiry = 0, Claim[]? additionalClaims = null)
    {
        if (string.IsNullOrEmpty(userName) ||
            string.IsNullOrEmpty(signingKey) ||
            string.IsNullOrEmpty(issuer) ||
            string.IsNullOrEmpty(audience) ||
            tokenExpiry <= 0)
        {
            throw new ArgumentException("Invalid JwtTokenConfiguration");
        }

        UserName = userName;
        SigningKey = signingKey!;
        Issuer = issuer!;
        Audience = audience!;
        Expiration = TimeSpan.FromMinutes(int.Parse(tokenExpiry!.Value.ToString()));
        AdditionalClaims = additionalClaims;
    }
}
